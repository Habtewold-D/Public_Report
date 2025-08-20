import { useMemo, useState } from "react";
import Header from "@/components/Header";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, Filter, Eye } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface IssueItem {
  id: number;
  description: string;
  status: 'submitted' | 'inprogress' | 'solved' | string;
  sector?: { id: number; name: string } | null;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  images?: Array<{ id: number }>;
}

interface PaginatedIssues {
  data: IssueItem[];
  current_page: number;
  last_page: number;
  total: number;
}

const BrowseIssues = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [page] = useState(1);

  // Fetch issues: authenticated -> /issues; public -> /issues/public
  const { data: paged, isLoading, isError } = useQuery({
    queryKey: ["browse-issues", role, page, selectedSector, selectedStatus, searchTerm],
    queryFn: async (): Promise<PaginatedIssues> => {
      const path = role ? "/issues" : "/issues/public";
      const res = await axios.get(path, {
        params: {
          page,
          sector: selectedSector !== "all" ? selectedSector : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          q: searchTerm || undefined,
        },
      });
      return res.data.data as PaginatedIssues;
    },
    keepPreviousData: true,
  });

  const issues: IssueItem[] = paged?.data ?? [];

  // Fetch sector options (public endpoint)
  const { data: sectorOptions } = useQuery({
    queryKey: ["sectors-options"],
    queryFn: async () => {
      const res = await axios.get("/sectors/options");
      return (res.data?.data ?? []) as Array<{ id: number; name: string }>;
    },
  });
  const sectors = useMemo(() => (sectorOptions?.map(s => s.name) ?? []), [sectorOptions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'open':
        return 'bg-status-open text-accent-foreground';
      case 'inprogress':
      case 'progress':
        return 'bg-status-progress text-primary-foreground';
      case 'solved':
      case 'resolved':
        return 'bg-status-resolved text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'open':
        return 'Open';
      case 'inprogress':
      case 'progress':
        return 'In Progress';
      case 'solved':
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = (issue.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const sectorName = issue.sector?.name || "";
    const matchesSector = selectedSector === 'all' || sectorName === selectedSector;
    const normalized = issue.status === 'submitted' ? 'open' : issue.status === 'inprogress' ? 'progress' : issue.status === 'solved' ? 'resolved' : issue.status;
    const matchesStatus = selectedStatus === 'all' || normalized === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  const mapMarkers = filteredIssues.map(issue => ({
    id: String(issue.id),
    lat: issue.latitude ?? 0,
    lng: issue.longitude ?? 0,
    title: issue.description?.slice(0, 60) || `Issue #${issue.id}`,
    status: issue.status,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Browse Community Issues</h1>
            <p className="text-lg text-muted-foreground">
              Explore reported issues in your community and track their resolution progress.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-primary" />
                Filter Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="z-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" side="bottom" align="start">
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="z-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" side="bottom" align="start">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">View</label>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'map' | 'list')}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="map">Map</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            {isLoading ? (
              <p className="text-muted-foreground">Loading issues...</p>
            ) : isError ? (
              <p className="text-red-600">Failed to load issues.</p>
            ) : (
              <p className="text-muted-foreground">Showing {filteredIssues.length} of {paged?.total ?? filteredIssues.length} issues</p>
            )}
          </div>

          {/* Content Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'map' | 'list')}>
            <TabsContent value="map" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-0">
                      <MapComponent
                        markers={mapMarkers}
                        className="w-full h-96 rounded-lg z-0"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Issue List Sidebar */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="cursor-pointer hover:shadow-civic transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{issue.description?.slice(0, 60) || `Issue #${issue.id}`}</h3>
                          <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                        {/* Removed duplicate body snippet to avoid repetition with title */}
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{issue.sector?.name || 'Unassigned'}</span>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '-'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <Card key={issue.id} className="cursor-pointer hover:shadow-civic transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{issue.description?.slice(0, 80) || `Issue #${issue.id}`}</CardTitle>
                        <Badge className={`${getStatusColor(issue.status)}`}>
                          {getStatusLabel(issue.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm font-medium text-primary">
                        {issue.sector?.name || 'Unassigned'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Removed duplicate body snippet to avoid repetition with title */}
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{(issue.latitude ?? 0).toFixed(4)}, {(issue.longitude ?? 0).toFixed(4)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{(issue.images?.length ?? 0)} photo{(issue.images?.length ?? 0) !== 1 ? 's' : ''}</span>
                        <Link to={`/issues/${issue.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {(!isLoading && !isError && filteredIssues.length === 0) && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No issues match your current filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSector("all");
                    setSelectedStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseIssues;
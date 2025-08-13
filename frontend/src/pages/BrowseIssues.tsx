import { useState } from "react";
import Header from "@/components/Header";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar, Filter, Eye } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  sector: string;
  status: 'open' | 'progress' | 'resolved';
  lat: number;
  lng: number;
  createdAt: string;
  imageCount: number;
}

const BrowseIssues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Mock data - would come from API
  const issues: Issue[] = [
    {
      id: "1",
      title: "Broken Street Light",
      description: "Street light has been out for over a week, making the area unsafe at night.",
      sector: "Street Lighting",
      status: "open",
      lat: 9.0192,
      lng: 38.7525,
      createdAt: "2024-01-15",
      imageCount: 2
    },
    {
      id: "2", 
      title: "Pothole on Main Road",
      description: "Large pothole causing damage to vehicles and creating traffic hazards.",
      sector: "Roads & Infrastructure",
      status: "progress",
      lat: 9.0225,
      lng: 38.7580,
      createdAt: "2024-01-10",
      imageCount: 3
    },
    {
      id: "3",
      title: "Garbage Collection Issue",
      description: "Waste has not been collected for two weeks in this area.",
      sector: "Waste Management", 
      status: "resolved",
      lat: 9.0156,
      lng: 38.7490,
      createdAt: "2024-01-05",
      imageCount: 1
    }
  ];

  const sectors = [
    "Street Lighting",
    "Roads & Infrastructure", 
    "Waste Management",
    "Water & Sanitation",
    "Public Transportation",
    "Parks & Recreation",
    "Public Safety",
    "Building & Construction"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-status-open text-accent-foreground';
      case 'progress': return 'bg-status-progress text-primary-foreground';
      case 'resolved': return 'bg-status-resolved text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || issue.sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const mapMarkers = filteredIssues.map(issue => ({
    id: issue.id,
    lat: issue.lat,
    lng: issue.lng,
    title: issue.title,
    status: issue.status
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
            <p className="text-muted-foreground">
              Showing {filteredIssues.length} of {issues.length} issues
            </p>
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
                        className="w-full h-96 rounded-lg"
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
                          <h3 className="font-semibold text-sm">{issue.title}</h3>
                          <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {issue.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{issue.sector}</span>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
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
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        <Badge className={`${getStatusColor(issue.status)}`}>
                          {getStatusLabel(issue.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm font-medium text-primary">
                        {issue.sector}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {issue.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {issue.imageCount} photo{issue.imageCount !== 1 ? 's' : ''}
                        </span>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredIssues.length === 0 && (
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
import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, AlertTriangle, CheckCircle, Search, Filter, MessageSquare, Calendar, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface IssueItem {
  id: number;
  description: string;
  status: 'submitted' | 'inprogress' | 'solved' | string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  reporter?: { id: number; name: string; email: string } | null;
}

const SectorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Authenticated sector user
  const { user } = useAuth();
  const displayName = user?.name || user?.first_name || "Sector";

  // Load issues assigned to this sector (backend enforces scope)
  const { data: paged, isLoading, isError } = useQuery({
    queryKey: ["sector-issues"],
    queryFn: async () => {
      const res = await axios.get("/issues");
      return res.data.data as { data: IssueItem[] };
    },
  });
  const sectorIssues: IssueItem[] = paged?.data ?? [];

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
      default: return 'bg-muted text-muted-foreground';
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
      default: return status;
    }
  };

  const filteredIssues = sectorIssues.filter(issue => {
    const title = issue.description || "";
    const reporter = issue.reporter?.name || "";
    const location = `${issue.latitude ?? ''},${issue.longitude ?? ''}`;
    const matchesSearch = (title + reporter + location).toLowerCase().includes(searchTerm.toLowerCase());
    const normalized = issue.status === 'submitted' ? 'open' : issue.status === 'inprogress' ? 'progress' : issue.status === 'solved' ? 'resolved' : issue.status;
    const matchesStatus = statusFilter === 'all' || normalized === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openIssues = sectorIssues.filter(issue => issue.status === 'submitted').length;
  const inProgressIssues = sectorIssues.filter(issue => issue.status === 'inprogress').length;
  const resolvedIssues = sectorIssues.filter(issue => issue.status === 'solved').length;
  const highPriorityIssues = 0; // no priority in backend

  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: async ({ id, next }: { id: number; next: 'inprogress' | 'solved' }) => {
      const res = await axios.patch(`/issues/${id}/status`, { status: next });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sector-issues"] });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {displayName}'s Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome, {displayName} • Manage your sector's issues and respond to citizens
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Open Issues"
              value={openIssues.toString()}
              icon={AlertTriangle}
              trend={highPriorityIssues > 0 ? `${highPriorityIssues} high priority` : "All under control"}
              trendUp={highPriorityIssues === 0}
            />
            <StatsCard
              title="In Progress"
              value={inProgressIssues.toString()}
              icon={Clock}
            />
            <StatsCard
              title="Resolved Today"
              value={resolvedIssues.toString()}
              icon={CheckCircle}
              trend="Great work!"
              trendUp={true}
            />
            <StatsCard
              title="Total Issues"
              value={(openIssues + inProgressIssues + resolvedIssues).toString()}
              icon={MessageSquare}
              trend="Current assigned"
              trendUp={true}
            />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="queue">Work Queue</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="space-y-6">
              <div className="space-y-4">
                {isLoading && (
                  <Card><CardContent className="p-6">Loading issues...</CardContent></Card>
                )}
                {isError && (
                  <Card><CardContent className="p-6 text-red-600">Failed to load issues.</CardContent></Card>
                )}
                {!isLoading && !isError && filteredIssues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            {issue.description?.slice(0, 80) || `Issue #${issue.id}`}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Reported by {issue.reporter?.name || 'Citizen'} • {(issue.latitude ?? 0).toFixed(4)}, {(issue.longitude ?? 0).toFixed(4)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(issue.status)}`}>
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{issue.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Created {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '-'}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>Sector Team</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Updated {issue.updated_at ? new Date(issue.updated_at).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {(issue.status === 'submitted') && (
                            <Button variant="civic" size="sm" onClick={() => updateStatus.mutate({ id: issue.id, next: 'inprogress' })} disabled={updateStatus.isPending}>
                              {updateStatus.isPending ? 'Updating...' : 'Start Working'}
                            </Button>
                          )}
                          {(issue.status === 'inprogress') && (
                            <Button variant="success" size="sm" onClick={() => updateStatus.mutate({ id: issue.id, next: 'solved' })} disabled={updateStatus.isPending}>
                              {updateStatus.isPending ? 'Updating...' : 'Mark Resolved'}
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Reply to Citizen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!isLoading && !isError && filteredIssues.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No issues match your filters</p>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or check back later for new reports.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance Reports</CardTitle>
                  <CardDescription>
                    Generate and download reports for your sector's performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <span className="font-medium">Weekly Summary</span>
                      <span className="text-sm text-muted-foreground">Issues resolved, response times, citizen feedback</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <span className="font-medium">Monthly Analytics</span>
                      <span className="text-sm text-muted-foreground">Trends, patterns, and improvement areas</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <span className="font-medium">Territory Breakdown</span>
                      <span className="text-sm text-muted-foreground">Issue distribution by area and priority</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <span className="font-medium">Custom Report</span>
                      <span className="text-sm text-muted-foreground">Create a report with specific date ranges and filters</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SectorDashboard;
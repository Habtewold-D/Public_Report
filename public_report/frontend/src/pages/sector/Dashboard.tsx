import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, AlertTriangle, CheckCircle, Search, Filter, MessageSquare, Calendar, User } from "lucide-react";

interface SectorIssue {
  id: string;
  title: string;
  citizenName: string;
  status: 'open' | 'progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
  description: string;
  location: string;
  hasInternalNotes: boolean;
  assignedTo?: string;
}

const SectorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock sector manager data - replace with actual data from your backend
  const sectorManager = {
    name: "Sarah Johnson",
    sector: "Street Lighting",
    email: "sarah.johnson@city.gov",
    territories: ["Downtown", "East District", "West District"]
  };

  // Mock sector issues - replace with actual data from your backend
  const sectorIssues: SectorIssue[] = [
    {
      id: "1",
      title: "Broken Street Light on Oak Avenue",
      citizenName: "John D.",
      status: "open",
      priority: "high",
      createdAt: "2024-01-20",
      lastUpdate: "2024-01-20",
      description: "Street light has been out for over a week, making the area unsafe at night.",
      location: "Oak Avenue & 5th Street",
      hasInternalNotes: false,
      assignedTo: undefined
    },
    {
      id: "2",
      title: "Multiple Street Lights Out",
      citizenName: "Maria S.",
      status: "progress",
      priority: "high",
      createdAt: "2024-01-18",
      lastUpdate: "2024-01-22",
      description: "Entire block has no street lighting for three days.",
      location: "Pine Street Block 200-300",
      hasInternalNotes: true,
      assignedTo: "Mike Rodriguez"
    },
    {
      id: "3",
      title: "Flickering Street Light",
      citizenName: "Robert K.",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-01-15",
      lastUpdate: "2024-01-19",
      description: "Street light flickers intermittently, needs maintenance.",
      location: "Elm Street & 2nd Avenue",
      hasInternalNotes: false,
      assignedTo: "Sarah Johnson"
    },
    {
      id: "4",
      title: "Damaged Light Pole",
      citizenName: "Lisa M.",
      status: "open",
      priority: "medium",
      createdAt: "2024-01-19",
      lastUpdate: "2024-01-19",
      description: "Light pole leaning after recent storm, potential safety hazard.",
      location: "Maple Drive & Park Avenue",
      hasInternalNotes: false,
      assignedTo: undefined
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-status-open text-accent-foreground';
      case 'progress': return 'bg-status-progress text-primary-foreground';
      case 'resolved': return 'bg-status-resolved text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-status-open text-accent-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
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

  const filteredIssues = sectorIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openIssues = sectorIssues.filter(issue => issue.status === 'open').length;
  const inProgressIssues = sectorIssues.filter(issue => issue.status === 'progress').length;
  const resolvedIssues = sectorIssues.filter(issue => issue.status === 'resolved').length;
  const highPriorityIssues = sectorIssues.filter(issue => issue.priority === 'high' && issue.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {sectorManager.sector} Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome, {sectorManager.name} • Manage your sector's issues and respond to citizens
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
              title="Response Time"
              value="2.4 hrs"
              icon={MessageSquare}
              trend="Within target"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Territory</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Territories</SelectItem>
                      {sectorManager.territories.map((territory) => (
                        <SelectItem key={territory} value={territory.toLowerCase()}>
                          {territory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="queue">Work Queue</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="space-y-6">
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            {issue.title}
                            {issue.hasInternalNotes && (
                              <MessageSquare className="w-4 h-4 ml-2 text-primary" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Reported by {issue.citizenName} • {issue.location}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>
                            {issue.priority.toUpperCase()}
                          </Badge>
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
                            <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                          {issue.assignedTo && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>Assigned to {issue.assignedTo}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Updated {new Date(issue.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {issue.status === 'open' && (
                            <Button variant="civic" size="sm">
                              Start Working
                            </Button>
                          )}
                          {issue.status === 'progress' && (
                            <Button variant="success" size="sm">
                              Mark Resolved
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

              {filteredIssues.length === 0 && (
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

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Team Management</CardTitle>
                  <CardDescription>
                    Manage your team members and assign issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Sarah Johnson</p>
                          <p className="text-sm text-muted-foreground">Team Lead • sarah.johnson@city.gov</p>
                        </div>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Mike Rodriguez</p>
                          <p className="text-sm text-muted-foreground">Field Technician • mike.rodriguez@city.gov</p>
                        </div>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Jessica Chen</p>
                          <p className="text-sm text-muted-foreground">Assistant • jessica.chen@city.gov</p>
                        </div>
                      </div>
                      <Badge variant="outline">On Leave</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Manage Team Members
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
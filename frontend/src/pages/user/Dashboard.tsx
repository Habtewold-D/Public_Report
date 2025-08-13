import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Clock, CheckCircle, AlertCircle, Calendar, Eye, MessageSquare } from "lucide-react";

interface UserIssue {
  id: string;
  title: string;
  sector: string;
  status: 'open' | 'progress' | 'resolved';
  createdAt: string;
  lastUpdate: string;
  description: string;
  hasUpdates: boolean;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - replace with actual user data from your backend
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    joinedDate: "2024-01-15",
    weeklyLimit: 5,
    weeklySubmitted: 2
  };

  // Mock user issues - replace with actual data from your backend
  const userIssues: UserIssue[] = [
    {
      id: "1",
      title: "Broken Street Light on Oak Avenue",
      sector: "Street Lighting",
      status: "progress",
      createdAt: "2024-01-20",
      lastUpdate: "2024-01-22",
      description: "Street light has been out for over a week, making the area unsafe at night.",
      hasUpdates: true
    },
    {
      id: "2",
      title: "Pothole on Main Street",
      sector: "Roads & Infrastructure",
      status: "open",
      createdAt: "2024-01-18",
      lastUpdate: "2024-01-18",
      description: "Large pothole causing damage to vehicles.",
      hasUpdates: false
    },
    {
      id: "3",
      title: "Garbage Collection Missed",
      sector: "Waste Management",
      status: "resolved",
      createdAt: "2024-01-15",
      lastUpdate: "2024-01-19",
      description: "Waste collection was missed for two consecutive weeks.",
      hasUpdates: false
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const openIssues = userIssues.filter(issue => issue.status === 'open').length;
  const inProgressIssues = userIssues.filter(issue => issue.status === 'progress').length;
  const resolvedIssues = userIssues.filter(issue => issue.status === 'resolved').length;
  const issuesWithUpdates = userIssues.filter(issue => issue.hasUpdates).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your reported issues and continue making your community better.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Reports"
              value={userIssues.length.toString()}
              icon={MapPin}
              trend={`${user.weeklySubmitted}/${user.weeklyLimit} this week`}
              trendUp={true}
            />
            <StatsCard
              title="Open Issues"
              value={openIssues.toString()}
              icon={AlertCircle}
            />
            <StatsCard
              title="In Progress"
              value={inProgressIssues.toString()}
              icon={Clock}
            />
            <StatsCard
              title="Resolved"
              value={resolvedIssues.toString()}
              icon={CheckCircle}
              trend="Great progress!"
              trendUp={true}
            />
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help improve your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/report" className="flex-1">
                  <Button variant="hero" size="lg" className="w-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Report New Issue
                  </Button>
                </a>
                <a href="/issues" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    <Eye className="w-5 h-5 mr-2" />
                    Browse Community Issues
                  </Button>
                </a>
              </div>
              <div className="mt-4 p-4 bg-primary-muted rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Weekly Limit:</strong> You can submit {user.weeklyLimit - user.weeklySubmitted} more reports this week.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">My Issues</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userIssues.slice(0, 3).map((issue) => (
                      <div key={issue.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          issue.status === 'resolved' ? 'bg-secondary' :
                          issue.status === 'progress' ? 'bg-primary' : 'bg-status-open'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{issue.title}</p>
                          <p className="text-sm text-muted-foreground">{issue.sector}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated {new Date(issue.lastUpdate).toLocaleDateString()}
                          </p>
                        </div>
                        {issue.hasUpdates && (
                          <Badge variant="secondary" className="text-xs">
                            New Update
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                      Updates & Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {issuesWithUpdates > 0 ? (
                      <div className="p-4 bg-secondary-muted rounded-lg">
                        <p className="font-medium text-secondary">
                          You have {issuesWithUpdates} issue{issuesWithUpdates > 1 ? 's' : ''} with new updates!
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Check your issues to see the latest progress from sector managers.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-muted-foreground">No new notifications</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You'll be notified when there are updates on your reported issues.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="mt-6">
              <div className="space-y-6">
                {userIssues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{issue.title}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {issue.sector}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {issue.hasUpdates && (
                            <Badge variant="secondary" className="text-xs">
                              New Update
                            </Badge>
                          )}
                          <Badge className={`${getStatusColor(issue.status)}`}>
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{issue.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Created {new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Updated {new Date(issue.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
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

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">First Name</label>
                        <p className="text-muted-foreground">{user.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Last Name</label>
                        <p className="text-muted-foreground">{user.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Member Since</label>
                        <p className="text-muted-foreground">{new Date(user.joinedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Weekly Report Limit</label>
                        <p className="text-muted-foreground">{user.weeklyLimit} reports per week</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Account Status</label>
                        <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex space-x-4">
                      <Button variant="outline">Edit Profile</Button>
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Notification Settings</Button>
                    </div>
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

export default UserDashboard;
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  MapPin,
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Eye,
  UserPlus,
  Building,
  BarChart3
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface SystemMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'user' | 'sector' | 'issue' | 'system';
}

interface IssueItem {
  id: number;
  description: string;
  status: 'submitted' | 'inprogress' | 'solved' | string;
  created_at?: string;
}

interface SimpleUser {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: 'citizen' | 'sector' | 'admin';
  created_at?: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Queries
  const usersQ = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data.data as SimpleUser[];
    }
  });

  const sectorsQ = useQuery({
    queryKey: ["admin-sectors"],
    queryFn: async () => {
      const res = await axios.get("/sectors");
      return res.data.data as SimpleUser[]; // sectors are users with role='sector'
    }
  });

  const issuesQ = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const res = await axios.get("/issues");
      // paginator object: res.data.data
      const paged = res.data.data as { data: IssueItem[] };
      return paged.data;
    }
  });

  // Metrics derived from queries
  const { systemMetrics, recentActivity } = useMemo(() => {
    const users = usersQ.data ?? [];
    const issues = issuesQ.data ?? [];
    const sectors = sectorsQ.data ?? [];

    const totalUsers = users.length;
    const totalIssues = issues.length;
    const activeIssues = issues.filter(i => i.status === 'submitted' || i.status === 'inprogress').length;
    const resolved = issues.filter(i => i.status === 'solved').length;
    const resolutionRate = totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0;

    const metrics: SystemMetric[] = [
      {
        id: 'users',
        title: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: '',
        trend: 'stable',
        icon: Users,
      },
      {
        id: 'issues',
        title: 'Active Issues',
        value: activeIssues.toString(),
        change: '',
        trend: 'stable',
        icon: MapPin,
      },
      {
        id: 'resolution',
        title: 'Resolution Rate',
        value: `${resolutionRate}%`,
        change: '',
        trend: 'stable',
        icon: CheckCircle,
      },
      {
        id: 'sectors',
        title: 'Total Sectors',
        value: sectors.length.toString(),
        change: '',
        trend: 'stable',
        icon: Building,
      },
    ];

    // Recent activity from latest issues and newly created users
    const issueActivities: RecentActivity[] = issues
      .slice(0, 10)
      .map((i) => ({
        id: `issue-${i.id}`,
        action: i.description?.slice(0, 80) || `Issue #${i.id}`,
        user: `Status: ${i.status}`,
        timestamp: i.created_at || new Date().toISOString(),
        type: 'issue',
      }));

    const userActivities: RecentActivity[] = users
      .slice(0, 10)
      .map((u) => ({
        id: `user-${u.id}`,
        action: `New ${u.role} registered`,
        user: `${u.name} • ${u.email}`,
        timestamp: u.created_at || new Date().toISOString(),
        type: 'user',
      }));

    const combined = [...issueActivities, ...userActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return { systemMetrics: metrics, recentActivity: combined };
  }, [usersQ.data, issuesQ.data]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'sector': return Building;
      case 'issue': return AlertTriangle;
      case 'system': return Settings;
      default: return Shield;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-primary';
      case 'sector': return 'text-secondary';
      case 'issue': return 'text-status-open';
      case 'system': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              System Administration
            </h1>
            <p className="text-lg text-muted-foreground">
              Overview • Oversee platform operations and manage system settings
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(usersQ.isLoading || issuesQ.isLoading) && (
              <Card><CardContent className="p-6">Loading metrics...</CardContent></Card>
            )}
            {(usersQ.isError || issuesQ.isError) && (
              <Card><CardContent className="p-6 text-red-600">Failed to load metrics.</CardContent></Card>
            )}
            {!usersQ.isLoading && !issuesQ.isLoading && !usersQ.isError && !issuesQ.isError && systemMetrics.map((metric) => (
              <StatsCard
                key={metric.id}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                trend={metric.change}
                trendUp={metric.trend === 'up'}
              />
            ))}
          </div>

          {/* Quick Actions removed by request */}

          {/* Detailed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="sectors">Sectors</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest platform activities and system events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(usersQ.isLoading || issuesQ.isLoading) && (
                      <div className="p-3 text-sm text-muted-foreground">Loading activity...</div>
                    )}
                    {(usersQ.isError || issuesQ.isError) && (
                      <div className="p-3 text-sm text-red-600">Failed to load activity.</div>
                    )}
                    {!usersQ.isLoading && !issuesQ.isLoading && !usersQ.isError && !issuesQ.isError && recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                          <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{activity.action}</p>
                            <p className="text-sm text-muted-foreground truncate">{activity.user}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* System Status removed by request */}
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage citizen accounts, sector managers, and admin users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border border-border rounded-lg">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">1,156</p>
                      <p className="text-sm text-muted-foreground">Citizens</p>
                    </div>
                    <div className="text-center p-6 border border-border rounded-lg">
                      <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">24</p>
                      <p className="text-sm text-muted-foreground">Sector Managers</p>
                    </div>
                    <div className="text-center p-6 border border-border rounded-lg">
                      <Settings className="w-8 h-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">3</p>
                      <p className="text-sm text-muted-foreground">Administrators</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="hero">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create New User
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Existing Users
                    </Button>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Role Assignments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Management</CardTitle>
                  <CardDescription>
                    Create, manage, and configure service sectors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      "Street Lighting", 
                      "Roads & Infrastructure", 
                      "Waste Management", 
                      "Water & Sanitation",
                      "Public Transportation",
                      "Parks & Recreation", 
                      "Public Safety", 
                      "Building & Construction"
                    ].map((sector, index) => (
                      <div key={sector} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Building className="w-5 h-5 text-primary" />
                          <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{sector}</h3>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 50) + 10} active issues
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="hero">
                      <Building className="w-4 h-4 mr-2" />
                      Create New Sector
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Sectors
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Managers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data & Analytics</CardTitle>
                  <CardDescription>
                    Export data, generate reports, and view platform analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Data Export</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="w-4 h-4 mr-2" />
                          Export All Issues (CSV)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Export User Data (CSV)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Export Analytics Report (PDF)
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">System Reports</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Platform Usage Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolution Performance
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Issue Trend Analysis
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Button variant="hero">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Custom Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure platform settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Platform Configuration</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Weekly submission limit</span>
                          <Badge variant="outline">5 reports</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Default map view</span>
                          <Badge variant="outline">Addis Ababa</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Privacy level</span>
                          <Badge variant="outline">Approximate location</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Language & Localization</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Default language</span>
                          <Badge variant="outline">English</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Secondary language</span>
                          <Badge variant="outline">Amharic</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <span className="text-sm">Date format</span>
                          <Badge variant="outline">MM/DD/YYYY</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex space-x-4">
                      <Button variant="hero">
                        <Settings className="w-4 h-4 mr-2" />
                        Update Settings
                      </Button>
                      <Button variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Backup System
                      </Button>
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

export default AdminDashboard;
import { useState } from "react";
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock admin data - replace with actual data from your backend
  const admin = {
    name: "Administrator",
    email: "admin@civicreport.gov",
    role: "Super Admin",
    lastLogin: "2024-01-23T10:30:00Z"
  };

  // Mock system metrics - replace with actual data from your backend
  const systemMetrics: SystemMetric[] = [
    {
      id: "1",
      title: "Total Users",
      value: "1,256",
      change: "+12% this month",
      trend: "up",
      icon: Users
    },
    {
      id: "2",
      title: "Active Issues",
      value: "847",
      change: "-5% from last week",
      trend: "down",
      icon: MapPin
    },
    {
      id: "3",
      title: "Resolution Rate",
      value: "68%",
      change: "+3% improvement",
      trend: "up",
      icon: CheckCircle
    },
    {
      id: "4",
      title: "System Uptime",
      value: "99.9%",
      change: "All systems operational",
      trend: "stable",
      icon: Shield
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      action: "New sector manager registered",
      user: "Sarah Johnson (Street Lighting)",
      timestamp: "2024-01-23T09:15:00Z",
      type: "user"
    },
    {
      id: "2",
      action: "Sector updated",
      user: "Water & Sanitation - Coverage area expanded",
      timestamp: "2024-01-23T08:45:00Z",
      type: "sector"
    },
    {
      id: "3",
      action: "High priority issue flagged",
      user: "Multiple street lights out - Downtown area",
      timestamp: "2024-01-23T08:30:00Z",
      type: "issue"
    },
    {
      id: "4",
      action: "System maintenance completed",
      user: "Database optimization - 15% performance improvement",
      timestamp: "2024-01-23T07:00:00Z",
      type: "system"
    },
    {
      id: "5",
      action: "New citizen user registered",
      user: "John Doe - East District",
      timestamp: "2024-01-23T06:30:00Z",
      type: "user"
    }
  ];

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
              Welcome, {admin.name} • Oversee platform operations and manage system settings
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemMetrics.map((metric) => (
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

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <UserPlus className="w-6 h-6 text-primary" />
                  <span className="font-medium">Add User</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Building className="w-6 h-6 text-secondary" />
                  <span className="font-medium">Manage Sectors</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <BarChart3 className="w-6 h-6 text-accent" />
                  <span className="font-medium">View Reports</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Settings className="w-6 h-6 text-muted-foreground" />
                  <span className="font-medium">System Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {recentActivity.map((activity) => {
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

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary" />
                      System Status
                    </CardTitle>
                    <CardDescription>
                      Current platform health and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="font-medium">Database</span>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">Healthy</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="font-medium">API Services</span>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">Operational</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="font-medium">File Storage</span>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">Online</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-status-open/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-status-open rounded-full"></div>
                        <span className="font-medium">Email Service</span>
                      </div>
                      <Badge className="bg-status-open text-accent-foreground">Maintenance</Badge>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Detailed Metrics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
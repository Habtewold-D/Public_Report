import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Clock, CheckCircle, AlertCircle, Calendar, Eye, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface IssueItem {
  id: number;
  description: string;
  status: 'submitted' | 'inprogress' | 'solved' | string;
  sector?: { id: number; name: string; email?: string } | null;
  reporter?: { id: number; name: string; email?: string } | null;
  images?: Array<{ id: number; url: string }>;
  created_at?: string;
  updated_at?: string;
}

interface PaginatedIssues {
  data: IssueItem[];
  current_page: number;
  last_page: number;
  total: number;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user: authUser, quota, refreshUser } = useAuth();
  const [page, setPage] = useState(1);

  const userFirstName = useMemo(() => authUser?.first_name || authUser?.name?.split(" ")[0] || "User", [authUser]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["issues", page],
    queryFn: async (): Promise<PaginatedIssues> => {
      const res = await axios.get(`/issues`, { params: { page } });
      // Laravel pagination wrapper: { data: { data: [], current_page, last_page, ... } }
      return res.data.data as PaginatedIssues;
    },
    keepPreviousData: true,
  });

  useEffect(() => { refetch(); }, [page, refetch]);
  // Refresh user/quota on mount
  useEffect(() => { void refreshUser(); }, [refreshUser]);

  const issues: IssueItem[] = data?.data || [];

  const mapStatus = (s: string) => {
    switch (s) {
      case 'submitted': return { label: 'Open', color: 'bg-status-open text-accent-foreground' };
      case 'inprogress': return { label: 'In Progress', color: 'bg-status-progress text-primary-foreground' };
      case 'solved': return { label: 'Resolved', color: 'bg-status-resolved text-secondary-foreground' };
      default: return { label: s, color: 'bg-muted text-muted-foreground' };
    }
  };

  const openIssues = issues.filter(i => i.status === 'submitted').length;
  const inProgressIssues = issues.filter(i => i.status === 'inprogress').length;
  const resolvedIssues = issues.filter(i => i.status === 'solved').length;
  // Placeholder: backend does not provide hasUpdates; consider adding later
  const issuesWithUpdates = 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {userFirstName}!</h1>
            <p className="text-lg text-muted-foreground">
              Track your reported issues and continue making your community better.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Reports" value={(data?.total ?? issues.length).toString()} icon={MapPin} />
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

          {/* Weekly Submission Quota (citizen only) */}
          {quota && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Weekly Submissions</CardTitle>
                <CardDescription>Your submission quota resets every 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    Remaining this week:
                    {" "}
                    <span className={`font-medium ${quota.remaining <= 0 ? 'text-destructive' : 'text-foreground'}`}>
                      {quota.remaining}
                    </span>
                    /{quota.weekly_limit}
                  </div>
                  <div className="text-xs text-muted-foreground">Used: {quota.used} of {quota.weekly_limit}</div>
                </div>
              </CardContent>
            </Card>
          )}

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
                <Link to="/report" className="flex-1">
                  <Button variant="hero" size="lg" className="w-full"><Plus className="w-5 h-5 mr-2" />Report New Issue</Button>
                </Link>
                <Link to="/issues" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full"><Eye className="w-5 h-5 mr-2" />Browse Community Issues</Button>
                </Link>
              </div>
              {/* Removed weekly limit mock info */}
            </CardContent>
          </Card>

          {/* Detailed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">My Issues</TabsTrigger>
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
                    {issues.slice(0, 3).map((issue) => {
                      const m = mapStatus(issue.status);
                      return (
                        <div key={issue.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            issue.status === 'solved' ? 'bg-secondary' : issue.status === 'inprogress' ? 'bg-primary' : 'bg-status-open'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{issue.description?.slice(0, 80) || `Issue #${issue.id}`}</p>
                            <p className="text-sm text-muted-foreground">{issue.sector?.name || 'Unassigned'}</p>
                            <p className="text-xs text-muted-foreground mt-1">Updated {issue.updated_at ? new Date(issue.updated_at).toLocaleDateString() : '-'}</p>
                          </div>
                          <Badge className={`text-xs ${m.color}`}>{m.label}</Badge>
                        </div>
                      );
                    })}
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
                {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
                {isError && <div className="text-sm text-red-600">Failed to load issues.</div>}
                {!isLoading && issues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{issue.description?.slice(0, 100) || `Issue #${issue.id}`}</CardTitle>
                          <CardDescription className="text-primary font-medium">{issue.sector?.name || 'Unassigned'}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${mapStatus(issue.status).color}`}>
                            {mapStatus(issue.status).label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{issue.description}</p>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Created {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Updated {issue.updated_at ? new Date(issue.updated_at).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">Issue ID: {issue.id}</div>
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
                {!isLoading && issues.length === 0 && (
                  <div className="text-sm text-muted-foreground">No issues yet. Report your first one to get started.</div>
                )}

                {/* Pagination */}
                {data && data.last_page > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                    <div className="text-sm text-muted-foreground">Page {data.current_page} of {data.last_page}</div>
                    <Button variant="outline" size="sm" disabled={page >= data.last_page} onClick={() => setPage((p) => p + 1)}>Next</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
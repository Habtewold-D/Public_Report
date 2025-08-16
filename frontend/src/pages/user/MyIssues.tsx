import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const MyIssues = () => {
  const { user, isAuthLoading } = useAuth();
  type Issue = {
    id: number;
    description: string;
    status: "submitted" | "inprogress" | "solved";
    latitude: number;
    longitude: number;
    created_at: string;
    sector?: { id: number; name: string } | null;
  };

  const { data: issues = [], isLoading, isError } = useQuery<Issue[]>({
    queryKey: ["my-issues"],
    enabled: !!user && !isAuthLoading,
    queryFn: async () => {
      const res = await axios.get("/issues");
      // Laravel paginator: { data: { data: Issue[], ...pagination } }
      const paginated = res.data?.data;
      const items = Array.isArray(paginated?.data) ? paginated.data : [];
      return items as Issue[];
    },
  });

  const getStatus = (s: Issue["status"]) =>
    s === "solved"
      ? { label: "Resolved", cls: "bg-status-resolved text-secondary-foreground" }
      : s === "inprogress"
      ? { label: "In Progress", cls: "bg-status-progress text-primary-foreground" }
      : { label: "Open", cls: "bg-status-open text-accent-foreground" };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Issues</h1>
            <p className="text-muted-foreground">Track all issues you have reported.</p>
          </div>

          {isAuthLoading && (
            <div className="text-sm text-muted-foreground">Checking authentication...</div>
          )}

          {!isAuthLoading && !user && (
            <div className="text-sm text-muted-foreground">
              Please sign in to view your issues.
              <a href="/auth/signin" className="ml-2 underline">Sign In</a>
            </div>
          )}

          {!isAuthLoading && user && isLoading && (
            <div className="text-sm text-muted-foreground">Loading your issues...</div>
          )}

          {!isAuthLoading && user && isError && (
            <div className="text-sm text-destructive">Failed to load issues. Please try again.</div>
          )}

          {!isAuthLoading && user && !isLoading && !isError && issues.length === 0 && (
            <div className="text-sm text-muted-foreground">
              You haven't reported any issues yet.
              <a href="/report" className="ml-2 underline">Report an issue</a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">{issue.description}</CardTitle>
                    <Badge className={getStatus(issue.status).cls}>{getStatus(issue.status).label}</Badge>
                  </div>
                  <div className="text-sm text-primary font-medium">{issue.sector?.name ?? "—"}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</div>
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(issue.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex justify-end">
                    <a href={`/issues/${issue.id}`}>
                      <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" /> View</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyIssues;

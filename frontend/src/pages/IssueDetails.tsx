import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import { Calendar, MapPin, ImageIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthLoading } = useAuth();

  type Issue = {
    id: number;
    description: string;
    status: "submitted" | "inprogress" | "solved";
    latitude: number;
    longitude: number;
    created_at: string;
    sector?: { id: number; name: string } | null;
    images: { id: number; url: string }[];
  };

  const { data: issue, isLoading, isError } = useQuery<Issue | null>({
    queryKey: ["issue", id],
    enabled: !!id && !!user && !isAuthLoading,
    queryFn: async () => {
      const res = await axios.get(`/issues/${id}`);
      const item = res.data?.data as Issue | undefined;
      return item ?? null;
    },
  });

  const statusColor = (s: Issue["status"]) =>
    s === "solved"
      ? "bg-status-resolved text-secondary-foreground"
      : s === "inprogress"
      ? "bg-status-progress text-primary-foreground"
      : "bg-status-open text-accent-foreground";

  // Ensure images loaded from backend origin when URL is relative (e.g., /storage/...)
  const apiBase = axios.defaults.baseURL ?? "";
  const backendOrigin = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  const toImageSrc = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    let u = url;
    if (!u.startsWith("/")) u = "/" + u;
    // Convert raw storage path (e.g., /issues/1/abc.jpg) to /storage/issues/...
    if (u.startsWith("/issues/")) u = "/storage" + u;
    return `${backendOrigin}${u}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map and meta */}
          <div className="lg:col-span-2 space-y-6">
            {isAuthLoading && (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">Checking authentication...</CardContent>
              </Card>
            )}

            {!isAuthLoading && !user && (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Please sign in to view this issue.
                  <a href="/auth/signin" className="ml-2 underline">Sign In</a>
                </CardContent>
              </Card>
            )}

            {!isAuthLoading && user && isLoading && (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">Loading issue...</CardContent>
              </Card>
            )}

            {!isAuthLoading && user && isError && (
              <Card>
                <CardContent className="py-6 text-sm text-destructive">Failed to load issue.</CardContent>
              </Card>
            )}

            {!isAuthLoading && user && !isLoading && !isError && issue && (
            <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="line-clamp-2">{issue.description}</span>
                  <Badge className={statusColor(issue.status)}>
                    {issue.status === "submitted" ? "Open" : issue.status === "inprogress" ? "In Progress" : "Resolved"}
                  </Badge>
                </CardTitle>
                <CardDescription>{issue.sector?.name ?? "—"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MapComponent
                  center={[issue.latitude, issue.longitude]}
                  markers={[{ id: String(issue.id), lat: issue.latitude, lng: issue.longitude, title: issue.description, status: issue.status }]}
                  className="w-full h-72 rounded-lg"
                />
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(issue.created_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-7">{issue.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-primary" /> Photos</CardTitle>
              </CardHeader>
              <CardContent>
                {issue.images.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No photos attached.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {issue.images.map((img) => (
                      <img key={img.id} src={toImageSrc(img.url)} alt={`Issue photo ${img.id}`} className="w-full h-36 object-cover rounded" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </>
            )}
          </div>

          {/* Right: Timeline and actions (read-only for public) */}
          <div className="space-y-6">
            {!isAuthLoading && user && issue && (
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium">Reported</div>
                        <div>{new Date(issue.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-muted" />
                      <div>
                        <div className="font-medium">Current status</div>
                        <div>{issue.status === "submitted" ? "Open" : issue.status === "inprogress" ? "In Progress" : "Resolved"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isAuthLoading && !user && (
              <Card>
                <CardHeader>
                  <CardTitle>Stay Updated</CardTitle>
                  <CardDescription>Sign in to get notifications on status updates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="hero" className="w-full">Sign In</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;

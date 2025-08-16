import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import { Calendar, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type IssueStatus = "submitted" | "inprogress" | "solved";

type Issue = {
  id: number;
  description: string;
  sector: { id: number; name?: string; email: string } | null;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  created_at: string;
  images: { id: number; url: string }[];
};

const statusLabel = (s: IssueStatus) => (s === "submitted" ? "Submitted" : s === "inprogress" ? "In Progress" : "Solved");

const statusBadgeClass = (s: IssueStatus) =>
  s === "solved"
    ? "bg-status-resolved text-secondary-foreground"
    : s === "inprogress"
    ? "bg-status-progress text-primary-foreground"
    : "bg-muted text-foreground"; // submitted

const SectorIssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = React.useState<Issue | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updating, setUpdating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchIssue = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/issues/${id}`);
      setIssue(res.data?.data as Issue);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load issue");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  const transition = async (next: IssueStatus) => {
    if (!id) return;
    setUpdating(true);
    setError(null);
    try {
      await axios.patch(`/issues/${id}/status`, { status: next });
      await fetchIssue();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>Issue #{issue?.id}</span>
                  {issue && <Badge className={statusBadgeClass(issue.status)}>{statusLabel(issue.status)}</Badge>}
                </CardTitle>
                <CardDescription>{issue?.sector?.name || issue?.sector?.email || "Assigned sector"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
                {error && <div className="text-sm text-destructive">{error}</div>}
                {issue && (
                  <>
                    <MapComponent
                      center={[issue.latitude, issue.longitude]}
                      markers={[
                        { id: String(issue.id), lat: issue.latitude, lng: issue.longitude, title: `Issue ${issue.id}`, status: issue.status },
                      ]}
                      className="w-full h-72 rounded-lg"
                    />
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</div>
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(issue.created_at).toLocaleDateString()}</div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{issue.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {issue.images?.map((img) => (
                        <img key={img.id} src={img.url} alt={`Issue photo ${img.id}`} className="w-full h-36 object-cover rounded" />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {/* submitted -> inprogress */}
                <Button
                  variant="outline"
                  disabled={!issue || issue.status !== "submitted" || updating}
                  onClick={() => transition("inprogress")}
                >
                  <Loader2 className="w-4 h-4 mr-2" /> Mark In Progress
                </Button>
                {/* inprogress -> solved */}
                <Button
                  variant="hero"
                  disabled={!issue || issue.status !== "inprogress" || updating}
                  onClick={() => transition("solved")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Solved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorIssueDetails;

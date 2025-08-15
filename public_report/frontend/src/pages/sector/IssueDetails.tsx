import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import { Calendar, MapPin, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const SectorIssueDetails = () => {
  const issue = {
    id: "1",
    title: "Broken Street Light",
    description: "Street light out near intersection.",
    sector: "Street Lighting",
    status: "open" as const,
    lat: 9.0192,
    lng: 38.7525,
    createdAt: "2024-01-15",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=60",
    ],
  };

  const statusColor = issue.status === "resolved" ? "bg-status-resolved text-secondary-foreground" : issue.status === "progress" ? "bg-status-progress text-primary-foreground" : "bg-status-open text-accent-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{issue.title}</span>
                  <Badge className={statusColor}>{issue.status === "open" ? "Open" : issue.status === "progress" ? "In Progress" : "Resolved"}</Badge>
                </CardTitle>
                <CardDescription>{issue.sector}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MapComponent
                  center={[issue.lat, issue.lng]}
                  markers={[{ id: issue.id, lat: issue.lat, lng: issue.lng, title: issue.title, status: issue.status }]}
                  className="w-full h-72 rounded-lg"
                />
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(issue.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {issue.images.map((src, i) => (
                    <img key={i} src={src} alt={`Issue photo ${i + 1}`} className="w-full h-36 object-cover rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Public Reply</CardTitle>
                <CardDescription>Ask for more details or share progress updates visible to the citizen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Write a message to the reporter..." rows={3} />
                <div className="flex gap-2">
                  <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Send Reply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline"><Loader2 className="w-4 h-4 mr-2" /> Mark In Progress</Button>
                <Button variant="hero"><CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorIssueDetails;

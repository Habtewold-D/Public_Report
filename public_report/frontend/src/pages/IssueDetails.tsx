import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import { Calendar, MapPin, ImageIcon } from "lucide-react";

const IssueDetails = () => {
  // Mock issue detail for UI
  const issue = {
    id: "1",
    title: "Broken Street Light",
    description:
      "Street light has been out for over a week, making the area unsafe at night. Please repair the pole and replace the bulb.",
    sector: "Street Lighting",
    status: "open" as const,
    lat: 9.0192,
    lng: 38.7525,
    createdAt: "2024-01-15",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=60",
    ],
    timeline: [
      { label: "Reported", date: "2024-01-15" },
    ],
  };

  const statusColor = issue.status === "resolved" ? "bg-status-resolved text-secondary-foreground" : issue.status === "progress" ? "bg-status-progress text-primary-foreground" : "bg-status-open text-accent-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map and meta */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{issue.title}</span>
                  <Badge className={statusColor}>
                    {issue.status === "open" ? "Open" : issue.status === "progress" ? "In Progress" : "Resolved"}
                  </Badge>
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
                    {issue.images.map((src, i) => (
                      <img key={i} src={src} alt={`Issue photo ${i + 1}`} className="w-full h-36 object-cover rounded" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Timeline and actions (read-only for public) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issue.timeline.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium">{t.label}</div>
                        <div className="text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>Sign in to get notifications on status updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="hero" className="w-full">Sign In</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyIssues = () => {
  const myIssues = [
    { id: "1", title: "Broken Street Light", sector: "Street Lighting", status: "open" as const, lat: 9.0192, lng: 38.7525, createdAt: "2024-01-15" },
    { id: "2", title: "Pothole on Main Road", sector: "Roads & Infrastructure", status: "progress" as const, lat: 9.0225, lng: 38.7580, createdAt: "2024-01-10" },
  ];

  const getStatus = (s: string) => s === "resolved" ? { label: "Resolved", cls: "bg-status-resolved text-secondary-foreground" } : s === "progress" ? { label: "In Progress", cls: "bg-status-progress text-primary-foreground" } : { label: "Open", cls: "bg-status-open text-accent-foreground" };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Issues</h1>
            <p className="text-muted-foreground">Track all issues you have reported.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-civic transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <Badge className={getStatus(issue.status).cls}>{getStatus(issue.status).label}</Badge>
                  </div>
                  <div className="text-sm text-primary font-medium">{issue.sector}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</div>
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(issue.createdAt).toLocaleDateString()}</div>
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

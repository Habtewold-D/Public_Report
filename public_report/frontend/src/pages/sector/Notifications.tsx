import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SectorNotifications = () => {
  const items = [
    { id: 1, title: "New issue reported in your sector", date: "2024-01-20" },
    { id: 2, title: "Issue #123 overdue", date: "2024-01-18" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Sector Notifications</h1>
            <p className="text-muted-foreground">Updates for your sector team.</p>
          </div>

          <div className="space-y-4">
            {items.map((n) => (
              <Card key={n.id}>
                <CardHeader className="pb-2"><CardTitle className="text-base">{n.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">{new Date(n.date).toLocaleString()}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorNotifications;

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DataPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Data & Transparency</h1>
            <p className="text-muted-foreground">Export datasets and view basic analytics.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Exports</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline">Download Issues CSV</Button>
              <Button variant="outline">Download Sectors CSV</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">
              <p>High-level charts and KPIs can be shown here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataPage;

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Sectors = () => {
  const sectors = ["Street Lighting", "Roads & Infrastructure", "Waste Management"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Sectors</h1>
            <p className="text-muted-foreground">Add, edit, and order sectors.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Add Sector</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input placeholder="Sector name" />
              <Button variant="hero">Add</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Existing Sectors</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {sectors.map((s) => (
                <div key={s} className="flex justify-between items-center border rounded px-3 py-2">
                  <span>{s}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sectors;

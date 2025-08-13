import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Sector Reports</h1>
            <p className="text-muted-foreground">Export summaries for your sector.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Date From</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Date To</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button variant="hero">Download CSV</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Summary charts and KPIs can be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;

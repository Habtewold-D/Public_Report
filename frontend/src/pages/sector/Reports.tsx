import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface IssueItem {
  id: number;
  description: string;
  status: 'submitted' | 'inprogress' | 'solved' | string;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
  reporter?: { id: number; name: string; email: string } | null;
}

const Reports = () => {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [status, setStatus] = useState<string>("all");

  const { data: paged, isLoading, isError } = useQuery({
    queryKey: ["sector-issues"],
    queryFn: async () => {
      const res = await axios.get("/issues");
      return res.data.data as { data: IssueItem[] };
    },
  });
  const issues: IssueItem[] = paged?.data ?? [];

  const normalize = (s: string) => (s === 'submitted' ? 'open' : s === 'inprogress' ? 'progress' : s === 'solved' ? 'resolved' : s);

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    return issues.filter(i => {
      const created = i.created_at ? new Date(i.created_at) : null;
      if (from && created && created < new Date(from.setHours(0,0,0,0))) return false;
      if (to && created && created > new Date(to.setHours(23,59,59,999))) return false;
      const st = normalize(i.status);
      if (status !== 'all' && st !== status) return false;
      return true;
    });
  }, [issues, dateFrom, dateTo, status]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { open: 0, progress: 0, resolved: 0 };
    filtered.forEach(i => { counts[normalize(i.status)] = (counts[normalize(i.status)] ?? 0) + 1; });
    return [
      { name: 'Open', value: counts.open },
      { name: 'In Progress', value: counts.progress },
      { name: 'Resolved', value: counts.resolved },
    ];
  }, [filtered]);

  const trendData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(i => {
      if (!i.created_at) return;
      const key = new Date(i.created_at).toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
  }, [filtered]);

  const COLORS = ["#EF4444", "#F59E0B", "#10B981"]; // red, amber, green

  const exportCSV = () => {
    const rows = [
      ["id", "description", "status", "created_at", "updated_at", "latitude", "longitude", "reporter_name"],
      ...filtered.map(i => [
        i.id,
        (i.description ?? '').replace(/\n|\r/g, ' ').slice(0, 1000),
        normalize(i.status),
        i.created_at ?? '',
        i.updated_at ?? '',
        i.latitude ?? '',
        i.longitude ?? '',
        i.reporter?.name ?? '',
      ])
    ];
    const csv = rows.map(r => r.map((v) => {
      const s = String(v);
      if (s.includes(',') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector_reports_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Date From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Date To</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1 flex items-end justify-end">
                <Button variant="hero" onClick={exportCSV}>Download CSV</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
              {isError && <div className="text-sm text-red-600">Failed to load data.</div>}
              {!isLoading && !isError && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Status Breakdown</p>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">New Issues per Day</p>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-15} height={40} />
                          <YAxis allowDecimals={false} />
                          <ReTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="count" name="New Issues" stroke="#3B82F6" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;

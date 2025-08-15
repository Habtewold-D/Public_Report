import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type AppUser = {
  id: number;
  name: string;
  email: string;
  role: "citizen" | "sector" | "admin";
};

const Users = () => {
  const { role } = useAuth();
  const [items, setItems] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = useMemo(() => role === "admin", [role]);
  const [filterRole, setFilterRole] = useState<"all" | "citizen" | "sector">("all");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/users");
      setItems(res.data?.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  // Visible list excludes admins and applies role filter
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter((u) => u.role !== "admin")
      .filter((u) => (filterRole === "all" ? true : u.role === filterRole))
      .filter((u) =>
        query
          ? u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
          : true
      );
  }, [items, filterRole, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Users</h1>
            <p className="text-muted-foreground">View platform users and filter by role.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="space-y-2 md:col-span-1">
                  <div className="text-sm font-medium">Role</div>
                  <Select value={filterRole} onValueChange={(val) => setFilterRole(val as typeof filterRole)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All (no admins)</SelectItem>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="sector">Sector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">Search</div>
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="text-red-600 text-sm border border-red-600 rounded p-2">{error}</div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Users
                <span className="ml-2 text-sm text-muted-foreground">({visibleUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && visibleUsers.length === 0 && (
                <div className="text-sm text-muted-foreground">Loading...</div>
              )}
              {!loading && visibleUsers.length === 0 && (
                <div className="text-sm text-muted-foreground">No users found.</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleUsers.map((u) => (
                  <div key={u.id} className="border rounded-lg p-4 flex items-center gap-3 hover:shadow-civic transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center text-primary font-semibold">
                      {u.name?.slice(0,1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <Badge className="capitalize">{u.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;

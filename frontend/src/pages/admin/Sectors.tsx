import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type Sector = {
  id: number;
  name: string;
  email: string;
  role: "sector";
};

const Sectors = () => {
  const { role } = useAuth();
  const [items, setItems] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const isAdmin = useMemo(() => role === "admin", [role]);

  const fetchSectors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/sectors");
      setItems(res.data?.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load sectors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchSectors();
  }, [isAdmin]);

  const onAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/sectors", { name: newName.trim() });
      const created: Sector = res.data.data;
      setItems((prev) => [created, ...prev]);
      setNewName("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add sector");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (id: number, updates: Partial<Pick<Sector, "name" | "email">>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/sectors/${id}`, updates);
      const updated: Sector = res.data.data;
      setItems((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to update sector");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/sectors/${id}`);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete sector");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Sectors</h1>
            <p className="text-muted-foreground">Add, edit, and manage sector accounts.</p>
          </div>

          {error && (
            <div className="text-red-600 text-sm border border-red-600 rounded p-2">{error}</div>
          )}

          <Card>
            <CardHeader><CardTitle>Add Sector</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder="Sector name (e.g., Waste Management)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
              />
              <Button variant="hero" onClick={onAdd} disabled={loading}>Add</Button>
            </CardContent>
            <div className="px-6 pb-4 text-xs text-muted-foreground">
              Email will be generated as name@report.com with default password "password". Role is sector.
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Existing Sectors</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {loading && items.length === 0 && (
                <div className="text-sm text-muted-foreground">Loading...</div>
              )}
              {!loading && items.length === 0 && (
                <div className="text-sm text-muted-foreground">No sectors found.</div>
              )}
              {items.map((s) => (
                <EditableSectorRow key={s.id} sector={s} onUpdate={onUpdate} onDelete={onDelete} />)
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function EditableSectorRow({
  sector,
  onUpdate,
  onDelete,
}: {
  sector: Sector;
  onUpdate: (id: number, updates: Partial<Pick<Sector, "name" | "email">>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [name, setName] = useState(sector.name);
  const [email, setEmail] = useState(sector.email);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onUpdate(sector.id, { name, email });
    setSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded px-3 py-2">
      <div className="flex-1 grid md:grid-cols-2 gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={save} disabled={saving}>Save</Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(sector.id)} disabled={saving}>Remove</Button>
      </div>
    </div>
  );
}

export default Sectors;

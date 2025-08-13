import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Users = () => {
  const users = [
    { id: 1, name: "Abebe", email: "abebe@example.com", role: "sector_manager", sector: "Street Lighting" },
    { id: 2, name: "Almaz", email: "almaz@example.com", role: "admin", sector: "-" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Users</h1>
            <p className="text-muted-foreground">Create and assign roles to platform users.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Users</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-1 md:grid-cols-5 items-center gap-3 border rounded px-3 py-2">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-muted-foreground">{u.email}</div>
                  <div className="md:col-span-2">
                    <Select defaultValue={u.role}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="sector_manager">Sector Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end"><Button variant="outline" size="sm">Save</Button></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;

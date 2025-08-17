import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Removed language select since users cannot choose language
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const Account = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // Password change handled in a separate section
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingPass, setSavingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const canSave = useMemo(() => {
    return firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && !saving;
  }, [firstName, lastName, email, saving]);

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      };
      const res = await axios.put("/user", payload);
      if (res.data?.user) {
        setMessage("Profile updated successfully.");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const canSavePassword = useMemo(() => {
    return newPassword.trim().length > 0 && newPassword === confirmPassword && !savingPass;
  }, [newPassword, confirmPassword, savingPass]);

  const onSavePassword = async () => {
    setSavingPass(true);
    setPassMessage(null);
    setPassError(null);
    try {
      if (newPassword !== confirmPassword) {
        setPassError("Passwords do not match.");
        return;
      }
      const res = await axios.put("/user", { password: newPassword.trim() });
      if (res.data?.user) {
        setPassMessage("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update password.";
      setPassError(msg);
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold text-foreground mb-2">Account</h1>
            <p className="text-muted-foreground">Manage your profile and preferences.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {message && <div className="text-green-600 text-sm">{message}</div>}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input id="first_name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <Input id="last_name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <Button variant="hero" onClick={onSave} disabled={!canSave}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {passMessage && <div className="text-green-600 text-sm">{passMessage}</div>}
              {passError && <div className="text-red-600 text-sm">{passError}</div>}
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button variant="secondary" onClick={onSavePassword} disabled={!canSavePassword}>
                {savingPass ? "Saving..." : "Save Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;

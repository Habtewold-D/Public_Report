import { Button } from "@/components/ui/button";
import { MapPin, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role, logout, isAuthLoading } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CivicReport</h1>
              <p className="text-sm text-muted-foreground">Community Engagement Platform</p>
            </div>
          </div>

          {/* Desktop Navigation (role-based) */}
          <nav className="hidden md:flex items-center space-x-6">
            {!role && (
              <>
                <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
                <a href="/issues" className="text-foreground hover:text-primary transition-colors">Browse Issues</a>
                <a href="/report" className="text-foreground hover:text-primary transition-colors">Report Issue</a>
              </>
            )}
            {role === "citizen" && (
              <>
                <a href="/user/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
                <a href="/user/my-issues" className="text-foreground hover:text-primary transition-colors">My Issues</a>
                <a href="/user/notifications" className="text-foreground hover:text-primary transition-colors">Notifications</a>
                <a href="/user/account" className="text-foreground hover:text-primary transition-colors">Account</a>
                <a href="/report" className="text-foreground hover:text-primary transition-colors">Report Issue</a>
              </>
            )}
            {role === "sector" && (
              <>
                <a href="/sector/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
                <a href="/sector/reports" className="text-foreground hover:text-primary transition-colors">Reports</a>
                <a href="/sector/notifications" className="text-foreground hover:text-primary transition-colors">Notifications</a>
              </>
            )}
            {role === "admin" && (
              <>
                <a href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
                <a href="/admin/users" className="text-foreground hover:text-primary transition-colors">Users</a>
                <a href="/admin/sectors" className="text-foreground hover:text-primary transition-colors">Sectors</a>
                <a href="/admin/settings" className="text-foreground hover:text-primary transition-colors">Settings</a>
                <a href="/admin/data" className="text-foreground hover:text-primary transition-colors">Data</a>
              </>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!role ? (
              <>
                <a href="/auth/signin">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </a>
                <a href="/report">
                  <Button variant="hero" size="sm">Report Issue</Button>
                </a>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isAuthLoading}
                  onClick={async () => { await logout(); window.location.href = "/"; }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              {!role && (
                <>
                  <a href="/" className="text-foreground hover:text-primary transition-colors py-2">Home</a>
                  <a href="/issues" className="text-foreground hover:text-primary transition-colors py-2">Browse Issues</a>
                  <a href="/report" className="text-foreground hover:text-primary transition-colors py-2">Report Issue</a>
                </>
              )}
              {role === "citizen" && (
                <>
                  <a href="/user/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</a>
                  <a href="/user/my-issues" className="text-foreground hover:text-primary transition-colors py-2">My Issues</a>
                  <a href="/user/notifications" className="text-foreground hover:text-primary transition-colors py-2">Notifications</a>
                  <a href="/user/account" className="text-foreground hover:text-primary transition-colors py-2">Account</a>
                  <a href="/report" className="text-foreground hover:text-primary transition-colors py-2">Report Issue</a>
                </>
              )}
              {role === "sector" && (
                <>
                  <a href="/sector/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</a>
                  <a href="/sector/reports" className="text-foreground hover:text-primary transition-colors py-2">Reports</a>
                  <a href="/sector/notifications" className="text-foreground hover:text-primary transition-colors py-2">Notifications</a>
                </>
              )}
              {role === "admin" && (
                <>
                  <a href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</a>
                  <a href="/admin/users" className="text-foreground hover:text-primary transition-colors py-2">Users</a>
                  <a href="/admin/sectors" className="text-foreground hover:text-primary transition-colors py-2">Sectors</a>
                  <a href="/admin/settings" className="text-foreground hover:text-primary transition-colors py-2">Settings</a>
                  <a href="/admin/data" className="text-foreground hover:text-primary transition-colors py-2">Data</a>
                </>
              )}

              <div className="flex flex-col space-y-2 pt-2">
                {!role ? (
                  <>
                    <a href="/auth/signin">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </a>
                    <a href="/report">
                      <Button variant="hero" size="sm" className="w-full">Report Issue</Button>
                    </a>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isAuthLoading}
                    onClick={async () => { await logout(); window.location.href = "/"; }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
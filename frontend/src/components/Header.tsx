import { Button } from "@/components/ui/button";
import { MapPin, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

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
                <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
                <Link to="/issues" className="text-foreground hover:text-primary transition-colors">Browse Issues</Link>
                <Link to="/report" className="text-foreground hover:text-primary transition-colors">Report Issue</Link>
              </>
            )}
            {role === "citizen" && (
              <>
                <Link to="/user/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/report" className="text-foreground hover:text-primary transition-colors">Report Issue</Link>
                <Link to="/user/my-issues" className="text-foreground hover:text-primary transition-colors">My Issues</Link>
                <Link to="/user/notifications" className="text-foreground hover:text-primary transition-colors">Notifications</Link>
                <Link to="/user/account" className="text-foreground hover:text-primary transition-colors">Account</Link>
              </>
            )}
            {role === "sector" && (
              <>
                <Link to="/sector/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/sector/reports" className="text-foreground hover:text-primary transition-colors">Reports</Link>
                <Link to="/sector/notifications" className="text-foreground hover:text-primary transition-colors">Notifications</Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/admin/users" className="text-foreground hover:text-primary transition-colors">Users</Link>
                <Link to="/admin/sectors" className="text-foreground hover:text-primary transition-colors">Sectors</Link>
                <Link to="/admin/settings" className="text-foreground hover:text-primary transition-colors">Settings</Link>
                <Link to="/admin/data" className="text-foreground hover:text-primary transition-colors">Data</Link>
              </>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!role ? (
              <>
                <Link to="/auth/signin">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="hero" size="sm">Report Issue</Button>
                </Link>
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
                  <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">Home</Link>
                  <Link to="/issues" className="text-foreground hover:text-primary transition-colors py-2">Browse Issues</Link>
                  <Link to="/report" className="text-foreground hover:text-primary transition-colors py-2">Report Issue</Link>
                </>
              )}
              {role === "citizen" && (
                <>
                  <Link to="/user/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</Link>
                  <Link to="/report" className="text-foreground hover:text-primary transition-colors py-2">Report Issue</Link>
                  <Link to="/user/my-issues" className="text-foreground hover:text-primary transition-colors py-2">My Issues</Link>
                  <Link to="/user/notifications" className="text-foreground hover:text-primary transition-colors py-2">Notifications</Link>
                  <Link to="/user/account" className="text-foreground hover:text-primary transition-colors py-2">Account</Link>
                </>
              )}
              {role === "sector" && (
                <>
                  <Link to="/sector/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</Link>
                  <Link to="/sector/reports" className="text-foreground hover:text-primary transition-colors py-2">Reports</Link>
                  <Link to="/sector/notifications" className="text-foreground hover:text-primary transition-colors py-2">Notifications</Link>
                </>
              )}
              {role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="text-foreground hover:text-primary transition-colors py-2">Dashboard</Link>
                  <Link to="/admin/users" className="text-foreground hover:text-primary transition-colors py-2">Users</Link>
                  <Link to="/admin/sectors" className="text-foreground hover:text-primary transition-colors py-2">Sectors</Link>
                  <Link to="/admin/settings" className="text-foreground hover:text-primary transition-colors py-2">Settings</Link>
                  <Link to="/admin/data" className="text-foreground hover:text-primary transition-colors py-2">Data</Link>
                </>
              )}

              <div className="flex flex-col space-y-2 pt-2">
                {!role ? (
                  <>
                    <Link to="/auth/signin">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/report">
                      <Button variant="hero" size="sm" className="w-full">Report Issue</Button>
                    </Link>
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
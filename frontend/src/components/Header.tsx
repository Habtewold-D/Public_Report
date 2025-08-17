import { Button } from "@/components/ui/button";
import { MapPin, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, NavLink } from "react-router-dom";

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
                <NavLink to="/" end className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Home</NavLink>
                <NavLink to="/issues" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Browse Issues</NavLink>
                <NavLink to="/report" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Report Issue</NavLink>
              </>
            )}
            {role === "citizen" && (
              <>
                <NavLink to="/user/dashboard" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                <NavLink to="/report" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Report Issue</NavLink>
                <NavLink to="/user/my-issues" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>My Issues</NavLink>
                <NavLink to="/user/notifications" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Notifications</NavLink>
                <NavLink to="/user/account" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Account</NavLink>
              </>
            )}
            {role === "sector" && (
              <>
                <NavLink to="/sector/dashboard" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                <NavLink to="/sector/reports" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Reports</NavLink>
                <NavLink to="/sector/notifications" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Notifications</NavLink>
              </>
            )}
            {role === "admin" && (
              <>
                <NavLink to="/admin/dashboard" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                <NavLink to="/admin/users" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Users</NavLink>
                <NavLink to="/admin/sectors" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Sectors</NavLink>
                <NavLink to="/admin/settings" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Settings</NavLink>
                <NavLink to="/admin/data" className={({isActive}) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Data</NavLink>
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
                  <NavLink to="/" end className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Home</NavLink>
                  <NavLink to="/issues" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Browse Issues</NavLink>
                  <NavLink to="/report" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Report Issue</NavLink>
                </>
              )}
              {role === "citizen" && (
                <>
                  <NavLink to="/user/dashboard" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                  <NavLink to="/report" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Report Issue</NavLink>
                  <NavLink to="/user/my-issues" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>My Issues</NavLink>
                  <NavLink to="/user/notifications" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Notifications</NavLink>
                  <NavLink to="/user/account" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Account</NavLink>
                </>
              )}
              {role === "sector" && (
                <>
                  <NavLink to="/sector/dashboard" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                  <NavLink to="/sector/reports" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Reports</NavLink>
                  <NavLink to="/sector/notifications" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Notifications</NavLink>
                </>
              )}
              {role === "admin" && (
                <>
                  <NavLink to="/admin/dashboard" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Dashboard</NavLink>
                  <NavLink to="/admin/users" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Users</NavLink>
                  <NavLink to="/admin/sectors" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Sectors</NavLink>
                  <NavLink to="/admin/settings" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Settings</NavLink>
                  <NavLink to="/admin/data" className={({isActive}) => `py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>Data</NavLink>
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
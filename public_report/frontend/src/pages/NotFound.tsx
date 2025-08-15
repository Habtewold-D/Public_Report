import { Button } from "@/components/ui/button";
import { MapPin, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to making your community better!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/">
            <Button variant="hero" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </a>
          <a href="/report">
            <Button variant="outline" size="lg">
              <MapPin className="w-5 h-5 mr-2" />
              Report an Issue
            </Button>
          </a>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{" "}
            <a href="/help" className="text-primary hover:underline">
              help center
            </a>{" "}
            or{" "}
            <a href="/issues" className="text-primary hover:underline">
              browse community issues
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

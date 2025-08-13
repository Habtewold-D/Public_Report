import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, CheckCircle, Clock, ArrowRight, Shield, Eye, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Make Your Community Better
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Report public service issues, track progress, and engage with local authorities to improve your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/report">
                <Button variant="secondary" size="lg" className="shadow-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Report an Issue
                </Button>
              </a>
              <a href="/issues">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                  <Eye className="w-5 h-5 mr-2" />
                  Browse Issues
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Community Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Together, we're making a difference in our communities through transparency and civic engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Reports"
              value="2,847"
              icon={MapPin}
              trend="+12% this month"
              trendUp={true}
            />
            <StatsCard
              title="Issues Resolved"
              value="1,923"
              icon={CheckCircle}
              trend="68% resolution rate"
              trendUp={true}
            />
            <StatsCard
              title="Active Citizens"
              value="1,256"
              icon={Users}
              trend="+8% new users"
              trendUp={true}
            />
            <StatsCard
              title="Avg Response Time"
              value="3.2 days"
              icon={Clock}
              trend="-15% faster"
              trendUp={true}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and effective civic engagement in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center shadow-card hover:shadow-civic transition-shadow">
              <div className="w-16 h-16 bg-primary-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Report Issues</h3>
              <p className="text-muted-foreground mb-6">
                Pin the exact location on the map, select the sector, and describe the issue with photos.
              </p>
              <ArrowRight className="w-6 h-6 text-primary mx-auto" />
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-civic transition-shadow">
              <div className="w-16 h-16 bg-secondary-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Track Progress</h3>
              <p className="text-muted-foreground mb-6">
                Receive updates as sector managers review and work on your reported issues.
              </p>
              <ArrowRight className="w-6 h-6 text-primary mx-auto" />
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-civic transition-shadow">
              <div className="w-16 h-16 bg-accent-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Stay Informed</h3>
              <p className="text-muted-foreground mb-6">
                Browse all community issues and see how local authorities are addressing them.
              </p>
              <CheckCircle className="w-6 h-6 text-secondary mx-auto" />
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of citizens working together to improve our communities through transparent civic engagement.
            </p>
            <a href="/report">
              <Button variant="hero" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                Start Reporting Issues
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CivicReport</span>
            </div>
            <div className="flex space-x-6">
              <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help</a>
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 CivicReport. Building stronger communities through civic engagement.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

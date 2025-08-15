import { useState } from "react";
import Header from "@/components/Header";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Upload, Camera, Locate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportIssue = () => {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    sector: "",
    title: "",
    description: "",
    images: [] as File[]
  });
  const { toast } = useToast();

  const sectors = [
    "Street Lighting",
    "Roads & Infrastructure", 
    "Waste Management",
    "Water & Sanitation",
    "Public Transportation",
    "Parks & Recreation",
    "Public Safety",
    "Building & Construction"
  ];

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    toast({
      title: "Location Selected",
      description: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 5) // Max 5 images
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.sector || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically submit to your backend
    toast({
      title: "Issue Reported Successfully!",
      description: "Your report has been submitted and will be reviewed by the relevant sector team.",
    });

    // Reset form
    setFormData({ sector: "", title: "", description: "", images: [] });
    setSelectedLocation(null);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          toast({
            title: "Current Location Found",
            description: "Map centered on your current location.",
          });
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please select a location manually on the map.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Report an Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help improve your community by reporting public service issues. 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Select Location
                </CardTitle>
                <CardDescription>
                  Click on the map to pinpoint the exact location of the issue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={getCurrentLocation}
                  >
                    <Locate className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                  {selectedLocation && (
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </div>
                  )}
                </div>
                <MapComponent
                  center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : undefined}
                  onLocationSelect={handleLocationSelect}
                  className="w-full h-80 rounded-lg border"
                />
              </CardContent>
            </Card>

            {/* Issue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
                <CardDescription>
                  Provide clear information about the issue you're reporting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Select value={formData.sector} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, sector: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the relevant sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. Include when you first noticed it and how it affects the community."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Up to 5 photos, max 10MB each
                    </p>
                    {formData.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="text-center">
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                className="px-12"
              >
                <Upload className="w-5 h-5 mr-2" />
                Submit Report
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                You'll be asked to create an account or sign in after submitting.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
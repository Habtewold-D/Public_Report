import Header from "@/components/Header";

const Help = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-4">Help</h1>
      <p className="text-muted-foreground">What you can report: street lighting, roads, waste, water & sanitation, and more. Please avoid emergencies—call your local emergency number.</p>
    </div>
  </div>
);

export default Help;

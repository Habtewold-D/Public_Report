import Header from "@/components/Header";

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-4">About</h1>
      <p className="text-muted-foreground">This project promotes civic engagement by enabling citizens to report public issues and track resolution transparently.</p>
    </div>
  </div>
);

export default About;

import Header from "@/components/Header";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-4">Privacy</h1>
      <p className="text-muted-foreground">We display issue details without personal contact information on public pages. Location shown may be approximate to protect privacy.</p>
    </div>
  </div>
);

export default Privacy;

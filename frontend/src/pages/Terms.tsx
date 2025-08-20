import Header from "@/components/Header";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>
          By using CivicReport, you agree to submit accurate reports and to refrain from posting
          harmful, illegal, or abusive content. Reports may be shared with relevant municipal
          departments to enable resolution.
        </p>
        <p>
          You retain ownership of content you submit, but you grant us a license to display and
          share it for the purpose of operating the service. We may remove content that violates
          these terms or applicable laws.
        </p>
        <p>
          The service is provided "as is" without warranties. We are not liable for delays,
          inaccuracies, or outcomes of issue resolution efforts by third parties.
        </p>
        <p>
          These terms may be updated from time to time. Continued use of the service constitutes
          acceptance of the updated terms.
        </p>
        <p>
          If you have questions about these terms, please contact support.
        </p>
      </div>
    </div>
  </div>
);

export default Terms;

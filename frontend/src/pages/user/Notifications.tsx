import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";

const Notifications = () => {
  const { notifications, isLoading, markAllAsRead } = useNotifications();

  // Auto-mark all as read when viewing the page
  useEffect(() => {
    void markAllAsRead();
  }, [markAllAsRead]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">Updates on your reported issues.</p>
          </div>

          {/* Auto-marked as read on open; no manual buttons */}

          <div className="space-y-4">
            {isLoading && (
              <Card><CardContent className="p-6 text-center text-muted-foreground">Loading...</CardContent></Card>
            )}
            {!isLoading && notifications.map((n) => (
              <Card key={n.id} className={n.is_read ? "opacity-80" : ""}>
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-base mr-4">{n.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div className="mb-1">{n.message}</div>
                  <div>{new Date(n.created_at).toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
            {!isLoading && notifications.length === 0 && (
              <Card><CardContent className="p-6 text-center text-muted-foreground">No notifications yet.</CardContent></Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

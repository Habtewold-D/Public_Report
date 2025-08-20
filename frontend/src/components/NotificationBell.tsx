import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { unreadCount } = useNotifications();

  const goToNotifications = () => {
    if (role === "sector") navigate("/sector/notifications");
    else navigate("/user/notifications");
  };

  return (
    <button
      type="button"
      onClick={goToNotifications}
      className="relative inline-flex items-center justify-center p-2 rounded-md hover:bg-accent focus:outline-none"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;

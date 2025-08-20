import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Index from "./pages/Index";
import ReportIssue from "./pages/ReportIssue";
import BrowseIssues from "./pages/BrowseIssues";
import IssueDetails from "./pages/IssueDetails";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import UserDashboard from "./pages/user/Dashboard";
import MyIssues from "./pages/user/MyIssues";
import UserNotifications from "./pages/user/Notifications";
import Account from "./pages/user/Account";
import SectorDashboard from "./pages/sector/Dashboard";
import SectorIssueDetails from "./pages/sector/IssueDetails";
import SectorReports from "./pages/sector/Reports";
import SectorNotifications from "./pages/sector/Notifications";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSectors from "./pages/admin/Sectors";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminData from "./pages/admin/Data";
import About from "./pages/About";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple role guard for admin-only routes
const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { role } = useAuth();
  if (role !== "admin") return <NotFound />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/issues" element={<BrowseIssues />} />
          <Route path="/issues/:id" element={<IssueDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Authentication Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          
          {/* User Role Dashboards */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/my-issues" element={<MyIssues />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/account" element={<Account />} />
          <Route path="/sector/dashboard" element={<SectorDashboard />} />
          <Route path="/sector/issues/:id" element={<SectorIssueDetails />} />
          <Route path="/sector/reports" element={<SectorReports />} />
          <Route path="/sector/notifications" element={<SectorNotifications />} />
          <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/sectors" element={<RequireAdmin><AdminSectors /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
          <Route path="/admin/data" element={<RequireAdmin><AdminData /></RequireAdmin>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

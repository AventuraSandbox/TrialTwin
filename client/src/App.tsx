import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ClinicalOperations from "@/pages/clinical-operations";
import PatientRecruiter from "@/pages/patient-recruiter";
import PatientPortal from "@/pages/patient-portal";
import SiteCoordinator from "@/pages/site-coordinator";
import TrialManagement from "@/pages/trial-management";
import PatientList from "@/pages/patient-list";
import PatientProfile from "@/pages/patient-profile";
import UserProfile from "@/pages/user-profile";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/clinical-operations" component={ClinicalOperations} />
      <ProtectedRoute path="/patient-recruiter" component={PatientRecruiter} />
      <ProtectedRoute path="/patient-portal" component={PatientPortal} />
      <ProtectedRoute path="/site-coordinator" component={SiteCoordinator} />
      <ProtectedRoute path="/trial-management" component={TrialManagement} />
      <ProtectedRoute path="/patient-list" component={PatientList} />
      <ProtectedRoute path="/patient-profile/:id" component={PatientProfile} />
      <ProtectedRoute path="/user-profile" component={UserProfile} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

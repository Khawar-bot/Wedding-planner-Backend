import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Guests from "@/pages/guests";
import Timeline from "@/pages/timeline";
import Budget from "@/pages/budget";
import Vendors from "@/pages/vendors";
import Seating from "@/pages/seating";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/guests" component={Guests} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/budget" component={Budget} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/seating" component={Seating} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-cream-white">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

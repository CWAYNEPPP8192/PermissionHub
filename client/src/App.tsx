import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Streams from "@/pages/streams";
import Sessions from "@/pages/sessions";
import Settings from "@/pages/settings";
import AppLayout from "@/components/layout/app-layout";
import { WalletProvider } from "@/hooks/use-wallet";
import { WizardProvider } from "./hooks/use-wizard";
import { GamificationProvider } from "./hooks/use-gamification";
import PermissionWizard from "./components/onboarding/permission-wizard";
import { useToast } from "@/hooks/use-toast";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/streams" component={Streams} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

// Wizard wrapper to access the toast hook
function WizardWithToast() {
  const { toast } = useToast();
  
  const handleComplete = () => {
    toast({
      title: "Tutorial Completed",
      description: "You've completed the PermissionHub tutorial. You can access it again from Settings.",
    });
  };
  
  const handleSkip = () => {
    toast({
      title: "Tutorial Skipped",
      description: "You can access the tutorial anytime from the Settings menu.",
    });
  };
  
  return (
    <PermissionWizard 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <GamificationProvider>
          <WizardProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <WizardWithToast />
            </TooltipProvider>
          </WizardProvider>
        </GamificationProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;

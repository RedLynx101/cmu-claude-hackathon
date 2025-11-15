import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import Clubs from "@/pages/clubs";
import ClubDetail from "@/pages/club-detail";
import ClubForm from "@/pages/club-form";
import Matches from "@/pages/matches";
import NotFound from "@/pages/not-found";
import logoIcon from "@assets/generated_images/CollabCMU_header_logo_icon_ff8d28a4.png";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/clubs" component={Clubs} />
      <Route path="/clubs/new" component={ClubForm} />
      <Route path="/clubs/:id" component={ClubDetail} />
      <Route path="/clubs/:id/edit" component={ClubForm} />
      <Route path="/matches" component={Matches} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between gap-4 p-3 border-b">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <img src={logoIcon} alt="CollabCMU" className="h-8 w-8" />
                    <h1 className="text-xl font-bold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      CollabCMU
                    </h1>
                  </div>
                </div>
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

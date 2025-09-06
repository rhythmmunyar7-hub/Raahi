import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Editor from "@/pages/editor";
import TopNavigation from "@/components/top-navigation";

function Router() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopNavigation searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Switch>
        <Route path="/" component={() => <Home searchQuery={searchQuery} />} />
        <Route path="/editor/:id?" component={Editor} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <div className="font-inter bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

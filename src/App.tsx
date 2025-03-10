
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import StructuralCalculators from "./pages/StructuralCalculators";
import MaterialConverters from "./pages/MaterialConverters";
import DesignCodeChecks from "./pages/DesignCodeChecks";
import OnSiteTools from "./pages/OnSiteTools";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/structural-calculators" element={<StructuralCalculators />} />
          <Route path="/material-converters" element={<MaterialConverters />} />
          <Route path="/design-code-checks" element={<DesignCodeChecks />} />
          <Route path="/on-site-tools" element={<OnSiteTools />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
// Context removed - using localStorage instead
import Home from "./pages/Home";
import DesignPreview from "./pages/DesignPreview";
import Calculator from "./pages/Calculator";
import ComparisonPage from "./pages/ComparisonPage";
import SizingGuidePage from "./pages/SizingGuidePage";
import Navigation from "./components/Navigation";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Calculator} />
      <Route path={"/preview"} component={DesignPreview} />
      <Route path={"/home"} component={Home} />
      <Route path={"/comparison"} component={ComparisonPage} />
      <Route path={"/sizing"} component={SizingGuidePage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
// Force redeploy - Mon Dec  1 13:33:27 EST 2025

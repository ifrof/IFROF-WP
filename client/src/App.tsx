import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import GA4 from "./components/Analytics/GA4";
import GTM from "./components/Analytics/GTM";
import AIChat from "./components/AIChat";

// Pages
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPostDetail from "@/pages/BlogPostDetail";
import AISearch from "@/pages/AISearch";
import ImportRequest from "@/pages/ImportRequest";
import Marketplace from "@/pages/Marketplace";
import ProductSearch from "@/pages/ProductSearch";
import ProductDetail from "@/pages/ProductDetail";
import FactoryDashboard from "@/pages/FactoryDashboard";
import BuyerDashboard from "@/pages/BuyerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

function AppContent() {
  const { dir, language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.dir = dir || 'ltr';
    document.documentElement.lang = language || 'en';
  }, [dir, language]);

  return (
    <TooltipProvider>
      <GA4 />
      <GTM />
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPostDetail} />
        <Route path="/find-factory" component={AISearch} />
        <Route path="/import-request" component={ImportRequest} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/products" component={ProductSearch} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/my-factory" component={FactoryDashboard} />
        <Route path="/buyer" component={BuyerDashboard} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <AIChat />
    </TooltipProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" switchable={true}>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

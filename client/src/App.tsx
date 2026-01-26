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
import { lazy, Suspense } from "react";
const AIChat = lazy(() => import("./components/AIChat"));

// Pages
const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPostDetail = lazy(() => import("@/pages/BlogPostDetail"));
const AISearch = lazy(() => import("@/pages/AISearch"));
const ImportRequest = lazy(() => import("@/pages/ImportRequest"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const ProductSearch = lazy(() => import("@/pages/ProductSearch"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const FactoryDashboard = lazy(() => import("@/pages/FactoryDashboard"));
const BuyerDashboard = lazy(() => import("@/pages/BuyerDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Profile = lazy(() => import("@/pages/Profile"));
const About = lazy(() => import("@/pages/About"));
const Terms = lazy(() => import("@/pages/Terms"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const PublicFactoryListings = lazy(() => import("@/pages/PublicFactoryListings"));
const FactoryPublicProfile = lazy(() => import("@/pages/FactoryPublicProfile"));
const VerifyFactory = lazy(() => import("@/pages/VerifyFactory"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Cart = lazy(() => import("@/pages/Cart"));
const Chatbot = lazy(() => import("@/pages/Chatbot"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPostDetail} />
          <Route path="/find-factory" component={AISearch} />
          <Route path="/factory-investigator" component={AISearch} />
          <Route path="/import-request" component={ImportRequest} />
          <Route path="/factory" component={Marketplace} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/products" component={ProductSearch} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/:rest*" component={AdminDashboard} />
          <Route path="/my-factory" component={FactoryDashboard} />
          <Route path="/buyer" component={BuyerDashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/about" component={About} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/factories" component={PublicFactoryListings} />
          <Route path="/factories/:id" component={FactoryPublicProfile} />
          <Route path="/verify-factory" component={VerifyFactory} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/cart" component={Cart} />
          <Route path="/chat" component={Chatbot} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Suspense fallback={null}>
        <AIChat />
      </Suspense>
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

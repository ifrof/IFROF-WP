import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

// Lazy-loaded components
const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPostDetail = lazy(() => import("@/pages/BlogPostDetail"));
const BlogEditor = lazy(() => import("@/pages/BlogEditor"));
const AISearch = lazy(() => import("@/pages/AISearch"));
const ImportRequest = lazy(() => import("@/pages/ImportRequest"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Services = lazy(() => import("@/pages/Services"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Orders = lazy(() => import("@/pages/Orders"));
const FactoryDashboard = lazy(() => import("@/pages/FactoryDashboard"));
const BuyerDashboard = lazy(() => import("@/pages/BuyerDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Support = lazy(() => import("@/pages/Support"));
const Maps = lazy(() => import("@/pages/Maps"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const About = lazy(() => import("@/pages/About"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AIChat = lazy(() => import("./components/AIChat"));

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPostDetail} />
        <Route path="/blog-editor" component={BlogEditor} />
        <Route path="/ai-search" component={AISearch} />
        <Route path="/import-request" component={ImportRequest} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/services" component={Services} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/dashboard/factory" component={FactoryDashboard} />
        <Route path="/dashboard/buyer" component={BuyerDashboard} />
        <Route path="/dashboard/admin" component={AdminDashboard} />
        <Route path="/support" component={Support} />
        <Route path="/maps" component={Maps} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const { dir, language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = dir || "ltr";
    document.documentElement.lang = language || "en";
  }, [dir, language]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Suspense fallback={null}>
              <AIChat />
            </Suspense>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

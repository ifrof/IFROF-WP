import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPostDetail from "@/pages/BlogPostDetail";
import BlogEditor from "@/pages/BlogEditor";
import AISearch from "@/pages/AISearch";
import ImportRequest from "@/pages/ImportRequest";
import Marketplace from "@/pages/Marketplace";
import ProductSearch from "@/pages/ProductSearch";
import ProductDetail from "@/pages/ProductDetail";
import Services from "@/pages/Services";
import Cart from "@/pages/Cart";
import CheckoutImproved from "@/pages/CheckoutImproved";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import FactoryDashboard from "@/pages/FactoryDashboard";
import BuyerDashboard from "@/pages/BuyerDashboard";
import BuyerRequests from "@/pages/BuyerRequests";
import BuyerRequestDetail from "@/pages/BuyerRequestDetail";
import BuyerOrders from "@/pages/BuyerOrders";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminFactories from "@/pages/AdminFactories";
import AdminRequests from "@/pages/AdminRequests";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminFactoryVerification from "@/pages/AdminFactoryVerification";
import FactoryListings from "@/pages/FactoryListings";
import FactoryOrders from "@/pages/FactoryOrders";
import FactoryRequestDetail from "@/pages/FactoryRequestDetail";
import FactoryVerification from "@/pages/FactoryVerification";
import PublicFactoryListings from "./pages/PublicFactoryListings";
import FactoryPublicProfile from "./pages/FactoryPublicProfile";
import Support from "@/pages/Support";
import Maps from "@/pages/Maps";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyFactory from "@/pages/VerifyFactory";
import Shipping from "@/pages/Shipping";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import GA4 from "./components/Analytics/GA4";
import GTM from "./components/Analytics/GTM";
import FAQ from "./pages/FAQ";
import AIChat from "./components/AIChat";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useEffect } from "react";

function AppContent() {
  const { dir, language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <TooltipProvider>
      <GA4 />
      <GTM />
      <Toaster />
      <Router />
      <AIChat />
    </TooltipProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPostDetail} />
      <Route path={"/blog-editor"} component={BlogEditor} />
      <Route path={"/find-factory"} component={AISearch} />
      <Route path={"/import-request"} component={ImportRequest} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/products"} component={ProductSearch} />
      <Route path={"/factories"} component={PublicFactoryListings} />
      <Route path={"/factories/:id"} component={FactoryPublicProfile} />
      <Route path={"/products/:id"} component={ProductDetail} />
      <Route path={"/services"} component={Services} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={CheckoutImproved} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/orders/:orderId"} component={OrderDetail} />
      <Route path={"/my-factory"} component={FactoryDashboard} />
      <Route path={"/factory/listings"} component={FactoryListings} />
      <Route path={"/factory/orders"} component={FactoryOrders} />
      <Route path={"/factory/requests/:id"} component={FactoryRequestDetail} />
      <Route path={"/factory/verification"} component={FactoryVerification} />
      <Route path={"/factory/profile"} component={Profile} />
      <Route path={"/dashboard/buyer"} component={BuyerDashboard} />
      <Route path={"/buyer"} component={BuyerDashboard} />
      <Route path={"/buyer/requests"} component={BuyerRequests} />
      <Route path={"/buyer/requests/:id"} component={BuyerRequestDetail} />
      <Route path={"/buyer/orders"} component={BuyerOrders} />
      <Route path={"/buyer/profile"} component={Profile} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/admin/factories"} component={AdminFactories} />
      <Route path={"/admin/requests"} component={AdminRequests} />
      <Route path={"/admin/users-manage"} component={AdminUserManagement} />
      <Route path={"/admin/factory-verification"} component={AdminFactoryVerification} />
      <Route path={"/support"} component={Support} />
      <Route path={"/maps"} component={Maps} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/about"} component={About} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/verify-factory"} component={VerifyFactory} />
      <Route path={"/shipping"} component={Shipping} />
      <Route path={"/verify-email/:token"} component={VerifyEmail} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password/:token"} component={ResetPassword} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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

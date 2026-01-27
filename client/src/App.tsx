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
import ProductDetail from "@/pages/ProductDetail";
import Services from "@/pages/Services";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import FactoryDashboard from "@/pages/FactoryDashboard";
import BuyerDashboard from "@/pages/BuyerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Support from "@/pages/Support";
import Maps from "@/pages/Maps";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import GA4 from "./components/Analytics/GA4";
import GTM from "./components/Analytics/GTM";
import { lazy, Suspense } from "react";
const AIChat = lazy(() => import("./components/AIChat"));

// Pages
const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPostDetail = lazy(() => import("@/pages/BlogPostDetail"));
const FactoryInvestigator = lazy(() => import("@/pages/FactoryInvestigator"));
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
const PublicFactoryListings = lazy(
  () => import("@/pages/PublicFactoryListings")
);
const FactoryPublicProfile = lazy(() => import("@/pages/FactoryPublicProfile"));
const VerifyFactory = lazy(() => import("@/pages/VerifyFactory"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Cart = lazy(() => import("@/pages/Cart"));
const Chatbot = lazy(() => import("@/pages/Chatbot"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function AppContent() {
  const { dir, language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = dir || "ltr";
    document.documentElement.lang = language || "en";
  }, [dir, language]);

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPostDetail} />
      <Route path={"/blog-editor"} component={BlogEditor} />
      <Route path={"/ai-search"} component={AISearch} />
      <Route path={"/import-request"} component={ImportRequest} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/products/:id"} component={ProductDetail} />
      <Route path={"/services"} component={Services} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/dashboard/factory"} component={FactoryDashboard} />
      <Route path={"/dashboard/buyer"} component={BuyerDashboard} />
      <Route path={"/dashboard/admin"} component={AdminDashboard} />
      <Route path={"/support"} component={Support} />
      <Route path={"/maps"} component={Maps} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/about"} component={About} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/login"} component={Login} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <AIChat />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

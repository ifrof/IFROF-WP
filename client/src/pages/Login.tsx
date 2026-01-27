import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Login() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"buyer" | "factory">("buyer");
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: data => {
      if (data.user.role === "buyer") {
        setLocation("/dashboard/buyer");
      } else if (user.role === "factory") {
        setLocation("/dashboard/factory");
      } else {
        setLocation("/");
      }
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: (user) => {
      if (user.role === "buyer") {
        setLocation("/dashboard/buyer");
      } else if (user.role === "factory") {
        setLocation("/dashboard/factory");
      } else {
        setLocation("/");
      }
    },
    onError: err => {
      setError(err.message);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // EMERGENCY DIRECT LOGIN FOR ADMIN
    if (email === "ifrof4@gmail.com") {
      try {
        const response = await fetch("/api/login-direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          setLocation("/admin");
          window.location.reload();
          return;
        } else {
          setError(data.message || "Login failed");
          return;
        }
      } catch (err) {
        console.error("Direct login error:", err);
        // Fallback to normal mutation if direct fails
      }
    }

    loginMutation.mutate({ email, password, rememberMe });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signUpMutation.mutate({ email, password, name, role: userType });
  };

  const isLoading = loginMutation.isPending || signUpMutation.isPending;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-[#1e3a5f] transition-colors font-medium"
        >
          <Home className={`h-5 w-5 ${language === "ar" ? "ml-2" : "mr-2"}`} />
          {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">IF</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#1e3a5f]">
            {language === "ar" ? "تسجيل الدخول" : "Login to IFROF"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {language === "ar"
              ? "أدخل بياناتك للوصول إلى حسابك"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </TabsTrigger>
              <TabsTrigger value="register">
                {language === "ar" ? "إنشاء حساب" : "Register"}
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {language === "ar" ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <Link
                  to="/forgot-password"
                  title="Forgot Password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={checked => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {language === "ar" ? "تذكرني" : "Remember me"}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#1e3a5f] hover:bg-[#152944] text-white font-bold transition-all shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "ar" ? "جاري الدخول..." : "Logging in..."}
                </>
              ) : (
                <>
                  {language === "ar" ? "دخول" : "Login"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 pt-6">
          <div className="text-sm text-center text-gray-500">
            {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link
              to="/register"
              title="Register"
              className="text-blue-600 hover:underline font-bold"
            >
              {language === "ar" ? "سجل الآن" : "Register now"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

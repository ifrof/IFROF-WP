import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Login() {
  const { language, t } = useLanguage();
  // Ensure t is defined even if context fails for some reason
  const safeT = t || ((key: string) => key);
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"buyer" | "factory">("buyer");
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (user) => {
      if (user.role === "buyer") {
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
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password, role: userType });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signUpMutation.mutate({ email, password, name, role: userType });
  };

  const isLoading = loginMutation.isPending || signUpMutation.isPending;

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">IFROF</CardTitle>
          <CardDescription>
            {language === "ar" ? "منصة الاستيراد المباشر من المصانع الصينية" : "Direct Import from Chinese Manufacturers"}
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

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <Input
                    type="email"
                    placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <Input
                    type="password"
                    placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "نوع الحساب" : "Account Type"}
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "buyer" | "factory")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buyer">
                      {language === "ar" ? "مشتري" : "Buyer"}
                    </option>
                    <option value="factory">
                      {language === "ar" ? "مصنع" : "Factory"}
                    </option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (language === "ar" ? "جاري التحميل..." : "Loading...") : (language === "ar" ? "دخول" : "Login")}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {language === "ar" ? "أو" : "OR"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    // Bypass login for demo purposes
                    loginMutation.mutate({ email: "demo@ifrof.com", password: "password123", role: userType });
                  }}
                >
                  {language === "ar" ? "دخول تجريبي سريع" : "Quick Demo Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <Input
                    type="text"
                    placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <Input
                    type="email"
                    placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <Input
                    type="password"
                    placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "نوع الحساب" : "Account Type"}
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "buyer" | "factory")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buyer">
                      {language === "ar" ? "مشتري" : "Buyer"}
                    </option>
                    <option value="factory">
                      {language === "ar" ? "مصنع" : "Factory"}
                    </option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (language === "ar" ? "جاري التحميل..." : "Loading...") : (language === "ar" ? "إنشاء حساب" : "Create Account")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-600">
            {language === "ar" ? "بالتسجيل، فإنك توافق على شروطنا وسياستنا" : "By registering, you agree to our terms and privacy policy"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

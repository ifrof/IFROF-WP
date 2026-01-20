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
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">IF</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#1e3a5f]">IFROF</CardTitle>
          <CardDescription className="text-gray-500">
            {language === "ar" ? "منصة الاستيراد المباشر من المصانع الصينية" : "Direct Import from Chinese Manufacturers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {language === "ar" ? "إنشاء حساب" : "Register"}
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "نوع الحساب" : "Account Type"}
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "buyer" | "factory")}
                    className="w-full h-11 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                  >
                    <option value="buyer">{language === "ar" ? "مشتري" : "Buyer"}</option>
                    <option value="factory">{language === "ar" ? "مصنع" : "Factory"}</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#1e3a5f] hover:bg-[#152944] text-white font-bold transition-all shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (language === "ar" ? "جاري التحميل..." : "Loading...") : (language === "ar" ? "دخول" : "Login")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <Input
                    type="text"
                    placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-gray-300 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {language === "ar" ? "نوع الحساب" : "Account Type"}
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "buyer" | "factory")}
                    className="w-full h-11 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all"
                  >
                    <option value="buyer">{language === "ar" ? "مشتري" : "Buyer"}</option>
                    <option value="factory">{language === "ar" ? "مصنع" : "Factory"}</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#ff8c42] hover:bg-[#e67a35] text-white font-bold transition-all shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (language === "ar" ? "جاري التحميل..." : "Loading...") : (language === "ar" ? "إنشاء حساب" : "Create Account")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-xs text-gray-400">
            {language === "ar" ? "بالتسجيل، فإنك توافق على شروطنا وسياستنا" : "By registering, you agree to our terms and privacy policy"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

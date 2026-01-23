import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Package, ShoppingBag, DollarSign, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Use query with proper conditional to avoid hook issues
  const statsQuery = trpc.admin.getStats.useQuery(undefined, { 
    enabled: !!user && user.role === "admin" 
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading || statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1e3a5f]" />
          <p className="text-slate-500 font-medium">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const stats = statsQuery.data?.stats;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {language === "ar" ? "لوحة تحكم المسؤول" : "Admin Dashboard"}
            </h1>
            <p className="text-slate-500 mt-1">
              {language === "ar" ? "إدارة النظام والبيانات الحية" : "Manage system and live data"}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-blue-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Package className="w-4 h-4 text-blue-500" />
                {language === "ar" ? "المنتجات" : "Products"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stats?.products || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-green-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4 text-green-500" />
                {language === "ar" ? "الطلبات" : "Orders"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stats?.orders || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-purple-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-purple-500" />
                {language === "ar" ? "المستخدمين" : "Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stats?.users || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-orange-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-orange-500" />
                {language === "ar" ? "الإيرادات" : "Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">${(stats?.revenue || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

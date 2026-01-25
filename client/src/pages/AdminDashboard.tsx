import { trpc } from "@/lib/trpc";
import { Loader2, Users, Package, ShoppingBag, DollarSign, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  // 1. All Hooks must be at the top level
  const { language } = useLanguage();
  const auth = useAuth();
  const [, setLocation] = useLocation();
  const statsQuery = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!auth.user && auth.user.role === "admin",
  });

  // 2. Navigation effect
  useEffect(() => {
    if (!auth.loading && (!auth.user || auth.user.role !== "admin")) {
      setLocation("/login");
    }
  }, [auth.user, auth.loading, setLocation]);

  // 3. Render logic
  if (auth.loading || statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  if (!auth.user || auth.user.role !== "admin") {
    return null;
  }

  const stats = statsQuery.data?.stats;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-3xl font-bold">{language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}</h1>
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
            <Home className="w-4 h-4" /> {language === "ar" ? "الرئيسية" : "Home"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Package/>} label={language === 'ar' ? "المنتجات" : "Products"} value={stats?.products || 0} color="blue" />
          <StatCard icon={<ShoppingBag/>} label={language === 'ar' ? "الطلبات" : "Orders"} value={stats?.orders || 0} color="green" />
          <StatCard icon={<Users/>} label={language === 'ar' ? "المستخدمين" : "Users"} value={stats?.users || 0} color="purple" />
          <StatCard icon={<DollarSign/>} label={language === 'ar' ? "الإيرادات" : "Revenue"} value={`$${(stats?.revenue || 0).toLocaleString()}`} color="orange" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = { blue: 'text-blue-500', green: 'text-green-500', purple: 'text-purple-500', orange: 'text-orange-500' };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-2 uppercase">
        <span className={colors[color]}>{icon}</span> {label}
      </div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}

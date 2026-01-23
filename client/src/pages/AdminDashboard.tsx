import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data, isLoading } = trpc.admin.getStats.useQuery(undefined, { 
    enabled: !!user && user.role === "admin" 
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const stats = data?.stats;

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar" ? "لوحة تحكم المسؤول" : "Admin Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" ? "إدارة النظام والبيانات" : "System and Data Management"}
          </p>
        </div>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              {language === "ar" ? "المنتجات" : "Products"}
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.products || 0}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {language === "ar" ? "الطلبات" : "Orders"}
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.orders || 0}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              {language === "ar" ? "المستخدمين" : "Users"}
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.users || 0}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {language === "ar" ? "الإيرادات" : "Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">${(stats?.revenue || 0).toLocaleString()}</div></CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple Button component to avoid import issues
function Button({ children, onClick, variant }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        variant === 'outline' 
        ? 'border border-gray-300 hover:bg-gray-100' 
        : 'bg-[#1e3a5f] text-white hover:bg-[#152944]'
      }`}
    >
      {children}
    </button>
  );
}

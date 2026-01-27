import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

export default function AdminAnalytics() {
  const { language } = useLanguage();

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "تحليلات وإحصائيات المنصة"
              : "Platform analytics and statistics"}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {language === "ar" ? "معدل النمو" : "Growth Rate"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">+12.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "ar" ? "مقارنة بالشهر الماضي" : "vs last month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === "ar" ? "المستخدمون النشطون" : "Active Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "ar" ? "آخر 30 يوم" : "Last 30 days"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {language === "ar" ? "متوسط قيمة الطلب" : "Avg Order Value"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "ar" ? "متوسط الطلب" : "Per order"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {language === "ar" ? "إحصائيات المبيعات" : "Sales Statistics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    {language === "ar"
                      ? "الرسم البياني قيد التطوير"
                      : "Chart under development"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {language === "ar" ? "أداء المنتجات" : "Product Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    {language === "ar"
                      ? "الرسم البياني قيد التطوير"
                      : "Chart under development"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {language === "ar" ? "نمو المستخدمين" : "User Growth"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    {language === "ar"
                      ? "الرسم البياني قيد التطوير"
                      : "Chart under development"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {language === "ar" ? "معدل التحويل" : "Conversion Rate"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    {language === "ar"
                      ? "الرسم البياني قيد التطوير"
                      : "Chart under development"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

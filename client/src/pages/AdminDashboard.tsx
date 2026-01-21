import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Building2, Package, ShoppingBag, DollarSign, CheckCircle, ArrowRight, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboard() {
  const { language, dir } = useLanguage();
  const { user } = useAuth();
  
  const { data, isLoading } = trpc.admin.getStats.useQuery(undefined, { 
    enabled: !!user && user.role === "admin" 
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-semibold mb-4">
              {language === "ar" ? "ممنوع الوصول" : "Access Denied"}
            </p>
            <p className="text-gray-600 mb-6">
              {language === "ar"
                ? "أنت لا تملك صلاحيات الوصول إلى لوحة التحكم"
                : "You do not have permission to access this dashboard"}
            </p>
            <Link href="/">
              <Button>{language === "ar" ? "العودة للرئيسية" : "Go Home"}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a528a] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "لوحة تحكم المسؤول" : "Admin Dashboard"}
            </h1>
            <p className="text-blue-100 mt-2">
              {language === "ar" ? "إدارة المنتجات والطلبات والمستخدمين" : "Manage products, orders, and users"}
            </p>
          </div>
          <Link href="/admin/products">
            <Button className="bg-white text-[#1e3a5f] hover:bg-blue-50">
              <Plus className="mr-2 h-4 w-4" />
              {language === "ar" ? "إضافة منتج" : "Add Product"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                {language === "ar" ? "إجمالي المنتجات" : "Total Products"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.products}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {language === "ar" ? "إجمالي الطلبات" : "Total Orders"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.orders}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === "ar" ? "إجمالي المستخدمين" : "Total Users"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.users}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats?.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/factories">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Building2 className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                <h3 className="font-medium text-sm">{language === "ar" ? "إدارة المصانع" : "Manage Factories"}</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Package className="w-10 h-10 mx-auto text-green-600 mb-2" />
                <h3 className="font-medium text-sm">{language === "ar" ? "إدارة المنتجات" : "Manage Products"}</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <ShoppingBag className="w-10 h-10 mx-auto text-purple-600 mb-2" />
                <h3 className="font-medium text-sm">{language === "ar" ? "إدارة الطلبات" : "Manage Orders"}</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 mx-auto text-orange-600 mb-2" />
                <h3 className="font-medium text-sm">{language === "ar" ? "إدارة المستخدمين" : "Manage Users"}</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{language === "ar" ? "أحدث الطلبات" : "Recent Orders"}</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                {language === "ar" ? "عرض الكل" : "View All"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "ar" ? "رقم الطلب" : "Order #"}</TableHead>
                  <TableHead>{language === "ar" ? "التاريخ" : "Date"}</TableHead>
                  <TableHead>{language === "ar" ? "المبلغ" : "Amount"}</TableHead>
                  <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-right">{language === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${(order.totalAmount / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          {language === "ar" ? "تفاصيل" : "Details"}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {language === "ar" ? "لا توجد طلبات حديثة" : "No recent orders found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

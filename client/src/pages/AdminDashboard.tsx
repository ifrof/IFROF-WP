import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Package, ShoppingBag, DollarSign, ArrowRight, Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const { data, isLoading } = trpc.admin.getStats.useQuery(undefined, { 
    enabled: !!user && user.role === "admin" 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];
  const recentInquiries = (data as any)?.recentInquiries || [];

  const getShippingLabel = (method: string) => {
    const labels: Record<string, string> = {
      air: language === 'ar' ? 'شحن جوي' : 'Air Freight',
      sea: language === 'ar' ? 'شحن بحري' : 'Sea Freight',
      land: language === 'ar' ? 'شحن بري' : 'Land Transport',
      rail: language === 'ar' ? 'شحن بالسكة الحديد' : 'Rail Freight',
      multimodal: language === 'ar' ? 'شحن مشترك' : 'Combined',
      other: language === 'ar' ? 'أخرى' : 'Other',
    };
    return labels[method] || method;
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar" ? "لوحة تحكم المسؤول" : "Admin Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" ? "إدارة المنتجات والطلبات والمستخدمين" : "Manage products, orders, and users"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <TableHead>{language === "ar" ? "المبلغ" : "Amount"}</TableHead>
                    <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>${(order.totalAmount / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        {language === "ar" ? "لا توجد طلبات حديثة" : "No recent orders found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Inquiries Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "ar" ? "أحدث طلبات الاستيراد" : "Recent Import Requests"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "الموضوع" : "Subject"}</TableHead>
                    <TableHead>{language === "ar" ? "الشحن" : "Shipping"}</TableHead>
                    <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.map((inquiry: any) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium line-clamp-1">{inquiry.subject}</TableCell>
                      <TableCell>
                        {inquiry.shippingMethod ? (
                          <Badge variant="outline" className="text-[10px]">
                            <Truck className="w-3 h-3 mr-1" />
                            {getShippingLabel(inquiry.shippingMethod)}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{inquiry.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentInquiries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        {language === "ar" ? "لا توجد طلبات استيراد" : "No import requests found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

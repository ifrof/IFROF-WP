import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Package,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function BuyerDashboard() {
  const { t } = useLanguage();
  const { data: user } = trpc.auth.me.useQuery();

  // Using available methods from dashboard router or other routers
  const { data: orders, isLoading: ordersLoading } =
    trpc.dashboard.getRecentOrders.useQuery(undefined, { enabled: !!user });

  const { data: inquiries, isLoading: inquiriesLoading } =
    trpc.inquiries.getByBuyer.useQuery(
      { buyerId: user?.id || 0 },
      { enabled: !!user }
    );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      pending: {
        variant: "secondary",
        label: t("importRequest.status.pending"),
      },
      confirmed: {
        variant: "default",
        label: t("importRequest.status.approved"),
      },
      processing: {
        variant: "default",
        label: t("importRequest.status.inProgress"),
      },
      shipped: { variant: "default", label: t("importRequest.status.shipped") },
      delivered: {
        variant: "default",
        label: t("importRequest.status.completed"),
      },
      cancelled: {
        variant: "destructive",
        label: t("importRequest.status.cancelled"),
      },
    };

    const config = statusMap[status] || statusMap.pending;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.buyer.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("dashboard.buyer.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.buyer.totalOrders")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(orders as any[])?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.buyer.activeOrders")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(orders as any[])?.filter(
                  (o: any) =>
                    o.status !== "delivered" && o.status !== "cancelled"
                ).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.buyer.totalInquiries")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(inquiries as any[])?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.buyer.kycStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm">
                {t("dashboard.buyer.notVerified")}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/import-request">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <h3 className="font-medium">
                  {t("dashboard.buyer.newImportRequest")}
                </h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Package className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <h3 className="font-medium">
                  {t("dashboard.buyer.browseProducts")}
                </h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai-search">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                <h3 className="font-medium">
                  {t("dashboard.buyer.smartAssistant")}
                </h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">
              {t("dashboard.buyer.orders")}
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              {t("dashboard.buyer.inquiries")}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.buyer.myOrders")}</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : orders && (orders as any[]).length > 0 ? (
                  <div className="space-y-4">
                    {(orders as any[]).map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Order Items */}
                        <div className="my-3 text-sm text-muted-foreground">
                          {order.items ? JSON.parse(order.items).length : 0}{" "}
                          {t("cart.items")}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-blue-600">
                            ${(order.totalAmount / 100).toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            <Link href={`/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                {t("common.viewDetails")}
                              </Button>
                            </Link>
                            {order.status === "shipped" && (
                              <Button size="sm">
                                {t("dashboard.buyer.trackShipment")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {t("dashboard.buyer.noOrders")}
                    </p>
                    <Link href="/factory">
                      <Button>{t("dashboard.buyer.startShopping")}</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.buyer.myInquiries")}</CardTitle>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : inquiries && (inquiries as any[]).length > 0 ? (
                  <div className="space-y-4">
                    {(inquiries as any[]).map((inquiry: any) => (
                      <div key={inquiry.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{inquiry.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge>{inquiry.status}</Badge>
                            {inquiry.shippingMethod && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                {t(
                                  `importRequest.form.shippingMethodOptions.${inquiry.shippingMethod}`
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {inquiry.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {inquiry.description}
                          </p>
                        )}
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t("dashboard.buyer.viewMessages")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {t("dashboard.buyer.noInquiries")}
                    </p>
                    <Link href="/import-request">
                      <Button>{t("dashboard.buyer.createInquiry")}</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* KYC Verification Notice */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900 mb-1">
                  {t("dashboard.buyer.kycRequired")}
                </h3>
                <p className="text-sm text-yellow-800 mb-3">
                  {t("dashboard.buyer.kycDescription")}
                </p>
                <Button variant="outline" size="sm">
                  {t("dashboard.buyer.startVerification")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

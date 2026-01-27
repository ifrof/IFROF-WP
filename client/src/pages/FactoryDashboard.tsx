import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Package,
  ShoppingBag,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function FactoryDashboard() {
  const { t } = useLanguage();

  // Mock factory ID - in production, this would come from user's factory association
  const factoryId = 1;

  const { data: orders, isLoading: ordersLoading } = trpc.dashboard.getRecentOrders.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: inquiries, isLoading: inquiriesLoading } = trpc.inquiries.getByFactory.useQuery(
    { factoryId },
    { enabled: !!user }
  );

  const { data: products } = trpc.products.getByFactory.useQuery({ factoryId });
  const { data: services } = trpc.services.list.useQuery();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      confirmed: { variant: "default", icon: CheckCircle },
      processing: { variant: "default", icon: Package },
      shipped: { variant: "default", icon: ShoppingBag },
      delivered: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (!user || user.role !== "factory") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("dashboard.accessDenied")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FactoryDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.factory.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("dashboard.factory.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.factory.totalProducts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(products as any[])?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.factory.totalServices")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(services as any[])?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.factory.activeOrders")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(orders as any[])?.filter((o: any) => o.status !== "delivered" && o.status !== "cancelled").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.factory.pendingInquiries")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(inquiries as any[])?.filter((i: any) => i.status === "pending").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">
              {t("dashboard.factory.orders")}
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              {t("dashboard.factory.inquiries")}
            </TabsTrigger>
            <TabsTrigger value="products">
              {t("dashboard.factory.products")}
            </TabsTrigger>
            <TabsTrigger value="services">
              {t("dashboard.factory.services")}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.factory.recentOrders")}</CardTitle>
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
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-blue-600">
                            ${(order.totalAmount / 100).toFixed(2)}
                          </span>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              {t("common.viewDetails")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.factory.noOrders")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.factory.recentInquiries")}</CardTitle>
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
                        <div className="flex justify-between items-center mt-4">
                          {inquiry.shippingCostEstimate ? (
                            <div className="text-sm font-semibold text-green-600 flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {t("importRequest.form.shippingCostEstimate")}: $
                              {(inquiry.shippingCostEstimate / 100).toFixed(2)}
                            </div>
                          ) : (
                            <div></div>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t("dashboard.factory.respond")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.factory.noInquiries")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t("dashboard.factory.myProducts")}</CardTitle>
                  <Link href="/admin/products">
                    <Button>{t("dashboard.factory.addProduct")}</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {products && (products as any[]).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(products as any[]).map((product: any) => {
                      const images = product.imageUrls ? JSON.parse(product.imageUrls) : [];
                      return (
                        <div
                          key={product.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="w-full h-32 bg-gray-100">
                            {images.length > 0 && (
                              <img
                                src={images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-blue-600 mt-2">
                              ${(product.basePrice / 100).toFixed(2)}
                            </p>
                            <Badge
                              variant={product.active ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {product.active
                                ? t("common.active")
                                : t("common.inactive")}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.factory.noProducts")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t("dashboard.factory.myServices")}</CardTitle>
                  <Button>{t("dashboard.factory.addService")}</Button>
                </div>
              </CardHeader>
              <CardContent>
                {services && (services as any[]).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(services as any[]).map((service: any) => {
                      const images = service.imageUrls ? JSON.parse(service.imageUrls) : [];
                      return (
                        <div
                          key={service.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="w-full h-32 bg-gray-100">
                            {images.length > 0 && (
                              <img
                                src={images[0]}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium line-clamp-1">
                              {service.name}
                            </h3>
                            <p className="text-lg font-bold text-purple-600 mt-2">
                              ${(service.basePrice / 100).toFixed(2)}
                            </p>
                            <Badge
                              variant={service.active ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {service.active
                                ? t("common.active")
                                : t("common.inactive")}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.factory.noServices")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

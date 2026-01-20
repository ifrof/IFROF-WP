import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Building2, Package, ShoppingBag, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminDashboard() {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  
  const { data: factories, isLoading: factoriesLoading } = trpc.factories.list.useQuery();
  const { data: products } = trpc.products.getByFactory.useQuery({ factoryId: 0 });
  const { data: systemStats } = trpc.dashboard.getSystemStats.useQuery(undefined, { enabled: !!user && user.role === "admin" });
  const { data: allUsers } = trpc.dashboard.getAllUsers.useQuery(undefined, { enabled: !!user && user.role === "admin" });

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

  const verifiedFactories = (factories as any[])?.filter((f: any) => f.verificationStatus === "verified").length || 0;
  const pendingFactories = (factories as any[])?.filter((f: any) => f.verificationStatus === "pending").length || 0;

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">{t("dashboard.admin.title")}</h1>
          <p className="text-purple-100 mt-2">{t("dashboard.admin.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {t("dashboard.admin.totalFactories")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats?.factories || (factories as any[])?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {verifiedFactories} {t("dashboard.admin.verified")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t("dashboard.admin.totalProducts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats?.products || (products as any[])?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("dashboard.admin.pendingVerifications")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingFactories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t("dashboard.admin.totalUsers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats?.users || (allUsers as any[])?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/factories">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Building2 className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                <h3 className="font-medium text-sm">{t("dashboard.admin.manageFactories")}</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Package className="w-10 h-10 mx-auto text-green-600 mb-2" />
                <h3 className="font-medium text-sm">{t("dashboard.admin.manageProducts")}</h3>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto text-purple-600 mb-2" />
              <h3 className="font-medium text-sm">{t("dashboard.admin.manageServices")}</h3>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Users className="w-10 h-10 mx-auto text-orange-600 mb-2" />
              <h3 className="font-medium text-sm">{t("dashboard.admin.manageUsers")}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="factories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="factories">{t("dashboard.admin.factories")}</TabsTrigger>
            <TabsTrigger value="verifications">{t("dashboard.admin.verifications")}</TabsTrigger>
            <TabsTrigger value="disputes">{t("dashboard.admin.disputes")}</TabsTrigger>
          </TabsList>

          {/* Factories Tab */}
          <TabsContent value="factories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t("dashboard.admin.allFactories")}</CardTitle>
                  <Link href="/admin/factories">
                    <Button>{t("dashboard.admin.addFactory")}</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {factoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : factories && (factories as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(factories as any[]).slice(0, 10).map((factory: any) => (
                      <div key={factory.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {factory.logoUrl && (
                            <img
                              src={factory.logoUrl}
                              alt={factory.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{factory.name}</h3>
                            <p className="text-sm text-muted-foreground">{factory.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {factory.verificationStatus === "verified" ? (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t("manufacturer.verified")}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              {t("manufacturer.notVerified")}
                            </Badge>
                          )}
                          <Link href={`/admin/factories?id=${factory.id}`}>
                            <Button variant="outline" size="sm">
                              {t("common.edit")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.admin.noFactories")}
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

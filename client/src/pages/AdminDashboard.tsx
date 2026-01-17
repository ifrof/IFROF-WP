import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Building2, Package, ShoppingBag, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Eye, Download, FileText, BarChart3, LogOut, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { t, language, setLanguage, dir } = useLanguage();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: factories, isLoading: factoriesLoading } = trpc.factories.list.useQuery();
  const { data: products } = trpc.products.getByFactory.useQuery({ factoryId: 0 });

  // بيانات وهمية للرسوم البيانية
  const supplierData = [
    { name: "Jan", factories: 45, trading: 12, mixed: 8 },
    { name: "Feb", factories: 52, trading: 15, mixed: 10 },
    { name: "Mar", factories: 48, trading: 14, mixed: 9 },
    { name: "Apr", factories: 61, trading: 18, mixed: 12 },
    { name: "May", factories: 55, trading: 16, mixed: 11 },
    { name: "Jun", factories: 67, trading: 20, mixed: 14 },
  ];

  const riskDistribution = [
    { name: language === "ar" ? "مخاطر منخفضة" : "Low Risk", value: 45, color: "#10b981" },
    { name: language === "ar" ? "مخاطر متوسطة" : "Medium Risk", value: 30, color: "#f59e0b" },
    { name: language === "ar" ? "مخاطر عالية" : "High Risk", value: 20, color: "#ef4444" },
    { name: language === "ar" ? "حرج" : "Critical", value: 5, color: "#7c2d12" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How to Identify Real Factories in China",
      titleAr: "كيفية تحديد المصانع الحقيقية في الصين",
      author: "Admin",
      date: "2026-01-15",
      views: 1250,
      status: "published",
    },
    {
      id: 2,
      title: "Top 10 Supplier Verification Tips",
      titleAr: "أفضل 10 نصائح للتحقق من المورّدين",
      author: "Admin",
      date: "2026-01-10",
      views: 890,
      status: "published",
    },
    {
      id: 3,
      title: "Understanding Supply Chain Risks",
      titleAr: "فهم مخاطر سلسلة التوريد",
      author: "Admin",
      date: "2026-01-05",
      views: 450,
      status: "draft",
    },
  ];

  const menuItems = [
    { id: "overview", label: language === "ar" ? "نظرة عامة" : "Overview", icon: BarChart3 },
    { id: "factories", label: language === "ar" ? "المصانع" : "Factories", icon: Building2 },
    { id: "blog", label: language === "ar" ? "المدونة" : "Blog", icon: FileText },
    { id: "users", label: language === "ar" ? "المستخدمون" : "Users", icon: Users },
  ];

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

  const verifiedFactories = factories?.filter((f: any) => f.verificationStatus === "verified").length || 0;
  const pendingFactories = factories?.filter((f: any) => f.verificationStatus === "pending").length || 0;

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
              <div className="text-3xl font-bold">{factories?.length || 0}</div>
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
              <div className="text-3xl font-bold">{products?.length || 0}</div>
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
              <div className="text-3xl font-bold">-</div>
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
                ) : factories && factories.length > 0 ? (
                  <div className="space-y-3">
                    {factories.slice(0, 10).map((factory: any) => (
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

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.admin.pendingVerifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingFactories > 0 ? (
                  <div className="space-y-3">
                    {factories
                      ?.filter((f: any) => f.verificationStatus === "pending")
                      .map((factory: any) => (
                        <div key={factory.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">{factory.name}</h3>
                              <p className="text-sm text-muted-foreground">{factory.location}</p>
                            </div>
                            <Badge variant="secondary">{t("manufacturer.notVerified")}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t("dashboard.admin.approve")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("dashboard.admin.review")}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("dashboard.admin.noPendingVerifications")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.admin.activeDisputes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  {t("dashboard.admin.noDisputes")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

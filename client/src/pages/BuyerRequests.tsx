import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Plus, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import BuyerDashboardLayout from "@/components/BuyerDashboardLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import MetaTags from "../components/SEO/MetaTags";
import { staticPagesSEO } from "../../../server/config/seo-config";

export default function BuyerRequests() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { data: requests, isLoading } = trpc.inquiries.getByBuyer.useQuery(
    { buyerId: user?.id || 0 },
    { enabled: !!user }
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      pending: "outline",
      quoted: "secondary",
      accepted: "default",
      paid: "default",
      shipped: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <BuyerDashboardLayout>
      <MetaTags seo={staticPagesSEO["/buyer/requests"]} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {language === "ar" ? "طلبات الاستيراد" : "Import Requests"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "إدارة طلبات الاستيراد والاستفسارات الخاصة بك."
                : "Manage your import requests and inquiries to factories."}
            </p>
          </div>
          <Link href="/import-request">
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4" />
              {language === "ar" ? "طلب جديد" : "New Request"}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : requests && requests.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "ar" ? "المنتج" : "Product"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "الكمية" : "Quantity"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "التاريخ" : "Date"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className="text-right">
                      {language === "ar" ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        {req.productName || "N/A"}
                      </TableCell>
                      <TableCell>{req.quantity}</TableCell>
                      <TableCell>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/buyer/requests/${req.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">
                {language === "ar" ? "لا توجد طلبات" : "No requests found"}
              </CardTitle>
              <p className="text-muted-foreground max-w-xs mx-auto mb-6">
                {language === "ar"
                  ? "لم تقم بإنشاء أي طلبات استيراد بعد. ابدأ بإنشاء طلبك الأول."
                  : "You haven't created any import requests yet. Start by creating your first request."}
              </p>
              <Link href="/import-request">
                <Button variant="outline">
                  {language === "ar" ? "إنشاء طلب" : "Create Request"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </BuyerDashboardLayout>
  );
}

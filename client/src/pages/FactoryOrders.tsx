import FactoryDashboardLayout from "@/components/FactoryDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Loader2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FactoryOrders() {
  const { language } = useLanguage();
  // In a real app, we'd get the factoryId from the user's profile
  // For now, let's assume factoryId 1 for demo purposes if not found
  const factoryId = 1;
  const { data: requests, isLoading } = trpc.inquiries.getByFactory.useQuery({
    factoryId,
  });

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
    <FactoryDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "ar"
              ? "طلبات الاستيراد الواردة"
              : "Incoming Import Requests"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "تتبع وإدارة الطلبات الواردة من المشترين العالميين."
              : "Track and manage incoming requests from global buyers."}
          </p>
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
                        <Link href={`/factory/requests/${req.id}`}>
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
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mb-2">
                {language === "ar" ? "لا توجد طلبات بعد" : "No requests yet"}
              </CardTitle>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {language === "ar"
                  ? "لم تتلق أي طلبات من المشترين بعد."
                  : "You haven't received any requests from buyers yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </FactoryDashboardLayout>
  );
}

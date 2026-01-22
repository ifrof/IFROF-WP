import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import BuyerDashboardLayout from "@/components/BuyerDashboardLayout";

export default function BuyerRequests() {
  const { t } = useLanguage();

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.buyer.inquiries")}</h1>
            <p className="text-muted-foreground">
              Manage your import requests and inquiries to factories.
            </p>
          </div>
          <Link href="/import-request">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("dashboard.buyer.newImportRequest")}
            </Button>
          </Link>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mb-2">No requests found</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              You haven't created any import requests yet. Start by creating your first request to connect with factories.
            </p>
            <Link href="/import-request">
              <Button variant="outline">{t("dashboard.buyer.createInquiry")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  );
}

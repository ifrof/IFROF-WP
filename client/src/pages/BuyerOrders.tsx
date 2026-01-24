import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import BuyerDashboardLayout from "@/components/BuyerDashboardLayout";

export default function BuyerOrders() {
  const { t } = useLanguage();

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.buyer.orders")}</h1>
            <p className="text-muted-foreground">
              Track and manage your orders from Chinese manufacturers.
            </p>
          </div>
          <Link href="/factory">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              {t("dashboard.buyer.browseProducts")}
            </Button>
          </Link>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mb-2">No orders yet</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              Your order history is empty. Browse the marketplace to find products and start your first order.
            </p>
            <Link href="/factory">
              <Button variant="outline">{t("dashboard.buyer.startShopping")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  );
}

import FactoryDashboardLayout from "@/components/FactoryDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function FactoryOrders() {
  return (
    <FactoryDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factory Orders</h1>
          <p className="text-muted-foreground">Track and manage orders from global buyers.</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mb-2">No orders yet</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto">
              You haven't received any orders from buyers yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </FactoryDashboardLayout>
  );
}

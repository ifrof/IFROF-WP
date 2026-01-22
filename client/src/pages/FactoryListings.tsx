import FactoryDashboardLayout from "@/components/FactoryDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

export default function FactoryListings() {
  return (
    <FactoryDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Listings</h1>
            <p className="text-muted-foreground">Manage your factory products and marketplace listings.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <List className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mb-2">No products found</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              You haven't added any products to your factory profile yet.
            </p>
            <Button variant="outline">Create Your First Listing</Button>
          </CardContent>
        </Card>
      </div>
    </FactoryDashboardLayout>
  );
}

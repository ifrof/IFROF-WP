import FactoryDashboardLayout from "@/components/FactoryDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FactoryVerification() {
  return (
    <FactoryDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Factory Verification
          </h1>
          <p className="text-muted-foreground">
            Verify your factory to gain trust and access more features.
          </p>
        </div>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="mb-2">Verification Pending</CardTitle>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Your factory is currently not verified. Verified factories get a
              "Verified" badge and appear higher in search results.
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Start Verification Process
            </Button>
          </CardContent>
        </Card>
      </div>
    </FactoryDashboardLayout>
  );
}

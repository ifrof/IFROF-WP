import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminRequests() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Requests</h1>
          <p className="text-muted-foreground">Monitor and manage all import requests across the platform.</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mb-2">No requests found</CardTitle>
            <p className="text-muted-foreground max-w-xs mx-auto">
              There are no active import requests to display at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

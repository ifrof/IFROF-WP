import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";

export default function AdminFactories() {
  const { language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: factories,
    isLoading: factoriesLoading,
    refetch,
  } = trpc.admin.getFactories.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const updateStatusMutation = trpc.admin.updateFactoryStatus.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ar" ? "تم تحديث حالة المصنع" : "Factory status updated"
      );
      refetch();
    },
  });

  const handleEdit = (factory: any) => {
    setFormData({
      name: factory.name,
      description: factory.description || "",
      location: factory.location || "",
      latitude: factory.latitude || "",
      longitude: factory.longitude || "",
      contactEmail: factory.contactEmail || "",
      contactPhone: factory.contactPhone || "",
      certifications: factory.certifications || "",
      productCategories: factory.productCategories || "",
      productionCapacity: factory.productionCapacity || "",
      minimumOrderQuantity: factory.minimumOrderQuantity?.toString() || "",
      logoUrl: factory.logoUrl || "",
      bannerUrl: factory.bannerUrl || "",
    });
    setEditingId(factory.id);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        contactEmail: "",
        contactPhone: "",
        certifications: "",
        productCategories: "",
        productionCapacity: "",
        minimumOrderQuantity: "",
        logoUrl: "",
        bannerUrl: "",
      });
    }
    setIsOpen(open);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {language === "ar" ? "إدارة المصانع" : "Factory Management"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "مراجعة واعتماد طلبات انضمام المصانع"
                : "Review and approve factory applications"}
            </p>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "ar" ? "الكل" : "All Status"}
              </SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {factoriesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "ar" ? "المصنع" : "Factory"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "الموقع" : "Location"}
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
                  {factories?.map((factory: any) => (
                    <TableRow key={factory.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">{factory.name}</div>
                            <div className="text-xs text-gray-500">
                              {factory.contactEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{factory.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            factory.verificationStatus === "verified"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {factory.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {factory.verificationStatus !== "verified" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              handleStatusChange(factory.id, "verified")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {language === "ar" ? "اعتماد" : "Approve"}
                          </Button>
                        )}
                        {factory.verificationStatus !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(factory.id, "rejected")
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {language === "ar" ? "رفض" : "Reject"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {factories?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No factories found matching the filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

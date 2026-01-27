import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2, CheckCircle, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FactoryFormData {
  name: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  contactEmail: string;
  contactPhone: string;
  certifications: string;
  productCategories: string;
  productionCapacity: string;
  minimumOrderQuantity: string;
  logoUrl: string;
  bannerUrl: string;
}

export default function AdminFactories() {
  const { language, dir } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState<FactoryFormData>({
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

  const { data: factories, isLoading: factoriesLoading, refetch } = trpc.admin.getFactories.useQuery({ 
    status: statusFilter === "all" ? undefined : statusFilter 
  });

  const createMutation = trpc.factories.create.useMutation();
  const updateMutation = trpc.factories.update.useMutation();
  const updateStatusMutation = trpc.admin.updateFactoryStatus.useMutation({
    onSuccess: () => {
      toast.success(language === "ar" ? "تم تحديث حالة المصنع" : "Factory status updated");
      refetch();
    }
  });

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{language === "ar" ? "ممنوع الوصول" : "Access Denied"}</CardTitle>
            <CardDescription>{language === "ar" ? "يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة" : "You must be an admin to access this page."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          minimumOrderQuantity: formData.minimumOrderQuantity ? parseInt(formData.minimumOrderQuantity) : undefined,
        });
        toast.success(language === "ar" ? "تم تحديث المصنع بنجاح" : "Factory updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          minimumOrderQuantity: formData.minimumOrderQuantity ? parseInt(formData.minimumOrderQuantity) : undefined,
        });
        toast.success(language === "ar" ? "تم إنشاء المصنع بنجاح" : "Factory created successfully");
      }
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error(language === "ar" ? "فشل في حفظ المصنع" : "Failed to save factory");
    }
  });

  const handleStatusChange = (id: number, status: any) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir={dir}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">
              {language === "ar" ? "إدارة المصانع" : "Factory Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "ar" ? "مراجعة واعتماد طلبات انضمام المصانع" : "Review and approve factory applications"}
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "الكل" : "All"}</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#1e3a5f] hover:bg-[#152944]">
                  <Plus className="w-4 h-4" />
                  {language === "ar" ? "إضافة مصنع" : "Add Factory"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Factory" : "Add New Factory"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Factory Name *</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input type="email" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Save Factory</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
                    <TableHead>{language === "ar" ? "المصنع" : "Factory"}</TableHead>
                    <TableHead>{language === "ar" ? "الموقع" : "Location"}</TableHead>
                    <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "إجراءات" : "Actions"}</TableHead>
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
                            <div className="text-xs text-gray-500">{factory.contactEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{factory.location}</TableCell>
                      <TableCell>
                        <Badge variant={factory.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                          {factory.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {factory.verificationStatus !== 'verified' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusChange(factory.id, 'verified')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {language === "ar" ? "اعتماد" : "Approve"}
                          </Button>
                        )}
                        {factory.verificationStatus !== 'rejected' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(factory.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {language === "ar" ? "رفض" : "Reject"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

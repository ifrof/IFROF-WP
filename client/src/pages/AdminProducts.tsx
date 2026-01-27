import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface ProductFormData {
  factoryId: number;
  name: string;
  description: string;
  category: string;
  tags: string;
  specifications: string;
  basePrice: string;
  pricingTiers: string;
  minimumOrderQuantity: string;
  imageUrls: string;
}

export default function AdminProducts() {
  const { user, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    factoryId: 0,
    name: "",
    description: "",
    category: "",
    tags: "",
    specifications: "",
    basePrice: "",
    pricingTiers: "",
    minimumOrderQuantity: "1",
    imageUrls: "",
  });

  const { data: factories } = trpc.factories.list.useQuery();
  const {
    data: products,
    isLoading: productsLoading,
    refetch,
  } = trpc.admin.getProducts.useQuery({ search });

  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "ممنوع الوصول" : "Access Denied"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة"
                : "You must be an admin to access this page."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.factoryId) {
      toast.error(
        language === "ar" ? "يرجى اختيار مصنع" : "Please select a factory"
      );
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        });
        toast.success(
          language === "ar"
            ? "تم تحديث المنتج بنجاح"
            : "Product updated successfully"
        );
      } else {
        await createMutation.mutateAsync({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        });
        toast.success(
          language === "ar"
            ? "تم إنشاء المنتج بنجاح"
            : "Product created successfully"
        );
      }

      setFormData({
        factoryId: selectedFactory || 0,
        name: "",
        description: "",
        category: "",
        tags: "",
        specifications: "",
        basePrice: "",
        pricingTiers: "",
        minimumOrderQuantity: "1",
        imageUrls: "",
      });
      setEditingId(null);
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error(
        language === "ar" ? "فشل في حفظ المنتج" : "Failed to save product"
      );
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      factoryId: product.factoryId,
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      tags: product.tags || "",
      specifications: product.specifications || "",
      basePrice: (product.basePrice / 100).toString(),
      pricingTiers: product.pricingTiers || "",
      minimumOrderQuantity: product.minimumOrderQuantity?.toString() || "1",
      imageUrls: product.imageUrls || "",
    });
    setEditingId(product.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذا المنتج؟"
          : "Are you sure you want to delete this product?"
      )
    ) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success(language === "ar" ? "تم حذف المنتج" : "Product deleted");
        refetch();
      } catch (error) {
        toast.error(
          language === "ar" ? "فشل في حذف المنتج" : "Failed to delete product"
        );
      }
    }
    setIsOpen(open);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">
              {language === "ar" ? "إدارة المنتجات" : "Product Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "ar"
                ? "إضافة وتعديل وحذف المنتجات للمصانع"
                : "Add and manage products for factories"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              {language === "ar" ? "استيراد CSV" : "Import CSV"}
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#1e3a5f] hover:bg-[#152944]">
                  <Plus className="w-4 h-4" />
                  {language === "ar" ? "إضافة منتج" : "Add Product"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId
                      ? language === "ar"
                        ? "تعديل المنتج"
                        : "Edit Product"
                      : language === "ar"
                        ? "إضافة منتج جديد"
                        : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>
                      {language === "ar" ? "المصنع *" : "Factory *"}
                    </Label>
                    <Select
                      value={formData.factoryId.toString()}
                      onValueChange={v =>
                        setFormData({ ...formData, factoryId: parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            language === "ar"
                              ? "اختر مصنعاً"
                              : "Select a factory"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {factories?.map((f: any) => (
                          <SelectItem key={f.id} value={f.id.toString()}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar" ? "اسم المنتج *" : "Product Name *"}
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الوصف" : "Description"}</Label>
                    <Textarea
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{language === "ar" ? "الفئة" : "Category"}</Label>
                      <Input
                        value={formData.category}
                        onChange={e =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        {language === "ar"
                          ? "السعر الأساسي ($) *"
                          : "Base Price ($) *"}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            basePrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      {language === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      {(createMutation.isPending ||
                        updateMutation.isPending) && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {language === "ar" ? "حفظ" : "Save Product"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={
                  language === "ar" ? "بحث عن منتج..." : "Search products..."
                }
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {factoriesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading factories...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {language === "ar" ? "المنتج" : "Product"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "الفئة" : "Category"}
                    </TableHead>
                    <TableHead>
                      {language === "ar" ? "السعر" : "Price"}
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
                  {products?.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        ${(product.basePrice / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.active ? "default" : "secondary"}
                        >
                          {product.active
                            ? language === "ar"
                              ? "نشط"
                              : "Active"
                            : language === "ar"
                              ? "غير نشط"
                              : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedFactory && (
          <div className="grid gap-4">
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : products && products.length > 0 ? (
              products.map((product: any) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Price:</span> ${(product.basePrice / 100).toFixed(2)}
                      </div>
                      <div>
                        <span className="font-semibold">MOQ:</span> {product.minimumOrderQuantity}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Description:</span> {product.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No products for this factory. Create one to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

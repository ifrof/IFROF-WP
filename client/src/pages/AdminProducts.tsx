import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  const { data: factories, isLoading: factoriesLoading } = trpc.factories.list.useQuery();
  const { data: products, isLoading: productsLoading, refetch } = trpc.products.getByFactory.useQuery(
    { factoryId: selectedFactory || 0 },
    { enabled: !!selectedFactory }
  );

  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be an admin to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.factoryId) {
      toast.error("Please select a factory");
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
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        });
        toast.success("Product created successfully");
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
      toast.error("Failed to save product");
      console.error(error);
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingId(null);
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
    }
    setIsOpen(open);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-2">Add and manage products for factories</p>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={!selectedFactory}>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update product information" : "Add a new product to the factory catalog"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
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
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specifications">Specifications (JSON format)</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    rows={2}
                    placeholder='{"material": "steel", "color": "black"}'
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="basePrice">Base Price ($) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
                    <Input
                      id="minimumOrderQuantity"
                      type="number"
                      value={formData.minimumOrderQuantity}
                      onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pricingTiers">Pricing Tiers (JSON format)</Label>
                  <Textarea
                    id="pricingTiers"
                    value={formData.pricingTiers}
                    onChange={(e) => setFormData({ ...formData, pricingTiers: e.target.value })}
                    rows={2}
                    placeholder='[{"quantity": 100, "price": 9.99}, {"quantity": 500, "price": 8.99}]'
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrls">Image URLs (comma-separated)</Label>
                  <Input
                    id="imageUrls"
                    value={formData.imageUrls}
                    onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Factory</CardTitle>
            <CardDescription>Choose a factory to view and manage its products</CardDescription>
          </CardHeader>
          <CardContent>
            {factoriesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading factories...
              </div>
            ) : (
              <Select value={selectedFactory?.toString() || ""} onValueChange={(value) => setSelectedFactory(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a factory" />
                </SelectTrigger>
                <SelectContent>
                  {factories?.map((factory: any) => (
                    <SelectItem key={factory.id} value={factory.id.toString()}>
                      {factory.name}
                    </SelectItem>
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

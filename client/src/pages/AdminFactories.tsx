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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const { user, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const { data: factories, isLoading: factoriesLoading, refetch } = trpc.factories.list.useQuery();
  const createMutation = trpc.factories.create.useMutation();
  const updateMutation = trpc.factories.update.useMutation();

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

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          minimumOrderQuantity: formData.minimumOrderQuantity ? parseInt(formData.minimumOrderQuantity) : undefined,
        });
        toast.success("Factory updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          minimumOrderQuantity: formData.minimumOrderQuantity ? parseInt(formData.minimumOrderQuantity) : undefined,
        });
        toast.success("Factory created successfully");
      }

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
      setEditingId(null);
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save factory");
      console.error(error);
    }
  };

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
            <h1 className="text-3xl font-bold">Factory Management</h1>
            <p className="text-muted-foreground mt-2">Register and manage factories in the marketplace</p>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Factory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Factory" : "Add New Factory"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update factory information" : "Register a new factory in the marketplace"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Factory Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
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
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productCategories">Product Categories (comma-separated)</Label>
                    <Input
                      id="productCategories"
                      value={formData.productCategories}
                      onChange={(e) => setFormData({ ...formData, productCategories: e.target.value })}
                      placeholder="Electronics, Textiles, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                    <Input
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      placeholder="ISO 9001, CE, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productionCapacity">Production Capacity</Label>
                    <Input
                      id="productionCapacity"
                      value={formData.productionCapacity}
                      onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                      placeholder="e.g., 10000 units/month"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bannerUrl">Banner URL</Label>
                    <Input
                      id="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    />
                  </div>
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
                      "Save Factory"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {factoriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : factories && factories.length > 0 ? (
            factories.map((factory: any) => (
              <Card key={factory.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{factory.name}</CardTitle>
                      <CardDescription>{factory.location}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(factory)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Email:</span> {factory.contactEmail}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {factory.contactPhone}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> {factory.verificationStatus}
                    </div>
                    <div>
                      <span className="font-semibold">MOQ:</span> {factory.minimumOrderQuantity}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No factories registered yet. Create one to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

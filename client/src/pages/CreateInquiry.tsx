import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRoute, useLocation } from "wouter";

export default function CreateInquiry() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/inquiry/create/:productId");
  const productId = params?.productId ? parseInt(params.productId) : null;

  const [formData, setFormData] = useState({
    factoryId: "",
    productId: productId?.toString() || "",
    subject: "",
    description: "",
    specifications: "",
    quantityRequired: "",
  });

  const { data: factories, isLoading: factoriesLoading } = trpc.factories.list.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.products.getByFactory.useQuery(
    { factoryId: formData.factoryId ? parseInt(formData.factoryId) : 0 },
    { enabled: !!formData.factoryId }
  );

  const createInquiryMutation = trpc.inquiries.create.useMutation();

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>You must be logged in to create an inquiry.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.factoryId || !formData.subject) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createInquiryMutation.mutateAsync({
        buyerId: user.id,
        factoryId: parseInt(formData.factoryId),
        productId: formData.productId ? parseInt(formData.productId) : undefined,
        subject: formData.subject,
        description: formData.description,
        specifications: formData.specifications,
        quantityRequired: formData.quantityRequired ? parseInt(formData.quantityRequired) : undefined,
      });

      toast.success("Inquiry created successfully!");
      navigate("/buyer/inquiries");
    } catch (error) {
      toast.error("Failed to create inquiry");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Inquiry</CardTitle>
            <CardDescription>Send a direct inquiry to a factory about their products or services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="factory">Select Factory *</Label>
                <Select value={formData.factoryId} onValueChange={(value) => setFormData({ ...formData, factoryId: value, productId: "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a factory" />
                  </SelectTrigger>
                  <SelectContent>
                    {factoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading factories...
                      </SelectItem>
                    ) : factories && factories.length > 0 ? (
                      factories.map((factory: any) => (
                        <SelectItem key={factory.id} value={factory.id.toString()}>
                          {factory.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No factories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {formData.factoryId && (
                <div>
                  <Label htmlFor="product">Product (Optional)</Label>
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- No specific product --</SelectItem>
                      {productsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading products...
                        </SelectItem>
                      ) : products && products.length > 0 ? (
                        products.map((product: any) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No products available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Bulk order inquiry for electronic components"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide details about your inquiry..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Technical specifications or requirements..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity Required</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantityRequired}
                  onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })}
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/marketplace")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createInquiryMutation.isPending}>
                  {createInquiryMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Send Inquiry"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, ShoppingCart, MapPin, Star, Package, Truck, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useLanguage();

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  
  // We need to fetch factory separately if it's not included in product
  const { data: factory } = trpc.factories.getById.useQuery(
    { id: product?.factoryId || 0 },
    { enabled: !!product?.factoryId }
  );

  const { data: reviews } = trpc.reviews.getByProduct.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );
  const { data: factoryStats } = trpc.reviews.getAverageRating.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success(t("cart.added"));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t("product.notFound")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = product.imageUrls ? JSON.parse(product.imageUrls) : [];
  const specifications = product.specifications ? JSON.parse(product.specifications) : {};
  const pricingTiers = product.pricingTiers ? JSON.parse(product.pricingTiers) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              {t("nav.home")}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">
              {t("nav.manufacturers")}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`cursor-pointer border-2 rounded overflow-hidden ${
                      selectedImage === idx ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Factory Info */}
            {factory && (
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <Link href={`/factories/${factory.id}`} className="hover:underline">
                      {factory.name}
                    </Link>
                    {factory.verificationStatus === "verified" && (
                      <Badge variant="default" className="bg-green-600">
                        {t("manufacturer.verified")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {factory.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{factory.location}</span>
                    </div>
                  )}
                  {factoryStats && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>
                        {(factoryStats as any).rating.toFixed(1)} ({(factoryStats as any).count} {t("reviews.title")})
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${(product.basePrice / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">{t("product.perUnit")}</span>
                </div>

                {pricingTiers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">{t("product.bulkPricing")}:</p>
                    <div className="space-y-1">
                      {pricingTiers.map((tier: any, idx: number) => (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>
                            {tier.minQty}+ {t("product.units")}
                          </span>
                          <span className="font-medium">${(tier.price / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("product.moq")}: {product.minimumOrderQuantity} {t("product.units")}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium">{t("product.quantity")}:</label>
                  <Input
                    type="number"
                    min={product.minimumOrderQuantity || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-24"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    {t("product.addToCart")}
                  </Button>
                  <Link href={`/inquiries/create?factoryId=${factory?.id || 0}&productId=${product.id}`}>
                    <Button variant="outline" className="w-full" size="lg">
                      {t("product.sendInquiry")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-xs">{t("product.securePayment")}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-xs">{t("product.fastShipping")}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                <span className="text-xs">{t("product.qualityGuarantee")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="specifications">
            <TabsList>
              <TabsTrigger value="specifications">{t("product.specifications")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("reviews.title")}</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications">
              <Card>
                <CardContent className="pt-6">
                  {Object.keys(specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t("product.noSpecifications")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="pt-6">
                  {!reviews || (reviews as any[]).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t("reviews.noReviews")}</p>
                  ) : (
                    <div className="space-y-6">
                      {(reviews as any[]).map((review: any) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{review.user?.name || t("common.anonymous")}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

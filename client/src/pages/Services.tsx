import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, ShoppingCart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: services, isLoading } = trpc.services.list.useQuery();

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.count.invalidate();
      toast.success(t("cart.added"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredServices = services?.filter((item: any) =>
    item.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.service.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.factory?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAddToCart = (serviceId: number, factoryId: number) => {
    addToCartMutation.mutate({
      serviceId,
      factoryId,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t("services.title")}</h1>
          <p className="text-xl text-purple-100 mb-8">{t("services.subtitle")}</p>
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder={t("services.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-black"
            />
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((item: any) => {
              const service = item.service;
              const factory = item.factory;
              const images = service.imageUrls ? JSON.parse(service.imageUrls) : [];

              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  {/* Service Image */}
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                        <span className="text-4xl">🛠️</span>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{service.name}</CardTitle>
                        {service.category && (
                          <Badge variant="secondary" className="mt-2">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {service.description && (
                      <CardDescription className="line-clamp-2 mt-2">
                        {service.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Factory Info */}
                    {factory && (
                      <div className="text-sm">
                        <Link href={`/factories/${factory.id}`} className="text-blue-600 hover:underline">
                          {factory.name}
                        </Link>
                        {factory.location && (
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{factory.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("services.startingAt")}</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ${(service.basePrice / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/services/${service.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          {t("common.viewDetails")}
                        </Button>
                      </Link>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleAddToCart(service.id, factory.id)}
                        disabled={addToCartMutation.isPending}
                      >
                        {addToCartMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{t("services.noResults")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface CartItemData {
  cartItem: {
    id: number;
    quantity: number;
  };
  product?: {
    id: number;
    name: string;
    basePrice: number;
    imageUrls?: string;
    category?: string;
  };
  service?: {
    id: number;
    name: string;
    basePrice: number;
    imageUrls?: string;
    category?: string;
  };
  factory?: {
    id: number;
    name: string;
  };
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: cartItems, isLoading } = trpc.cart.getItems.useQuery();

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success(t("cart.removed"));
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success(t("cart.cleared"));
    },
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ productId: itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate({ productId: itemId });
  };

  const handleClearCart = () => {
    if (confirm(t("cart.confirmClear"))) {
      clearCartMutation.mutate();
    }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return (cartItems as CartItemData[]).reduce(
      (total: number, item: CartItemData) => {
        const price = item.product?.basePrice || item.service?.basePrice || 0;
        return total + price * item.cartItem.quantity;
      },
      0
    );
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error(t("cart.empty"));
      return;
    }
    setLocation("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            {t("cart.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!cartItems || cartItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">{t("cart.empty")}</p>
              <p className="text-muted-foreground mb-4">
                {t("cart.emptyDescription")}
              </p>
              <Link href="/factory">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  {t("cart.continueShopping")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {t("cart.items")} ({cartItems.length})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={clearCartMutation.isPending}
                >
                  {t("cart.clearAll")}
                </Button>
              </div>

              <div className="space-y-4">
                {(cartItems as CartItemData[]).map(item => {
                  const itemData = item.product || item.service;
                  const images = itemData?.imageUrls
                    ? JSON.parse(itemData.imageUrls)
                    : [];
                  const price = itemData?.basePrice || 0;

                  return (
                    <Card key={item.cartItem.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {images.length > 0 ? (
                              <img
                                src={images[0]}
                                alt={itemData?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-lg">
                                  {itemData?.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {t("cart.from")}: {item.factory?.name}
                                </p>
                                {itemData?.category && (
                                  <p className="text-sm text-muted-foreground">
                                    {itemData.category}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product?.id || item.service?.id || 0
                                  )
                                }
                                disabled={removeItemMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product?.id || item.service?.id || 0,
                                      item.cartItem.quantity - 1
                                    )
                                  }
                                  disabled={item.cartItem.quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  value={item.cartItem.quantity}
                                  onChange={e =>
                                    handleQuantityChange(
                                      item.product?.id || item.service?.id || 0,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-16 text-center"
                                  min={1}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product?.id || item.service?.id || 0,
                                      item.cartItem.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  ${(price / 100).toFixed(2)} ×{" "}
                                  {item.cartItem.quantity}
                                </p>
                                <p className="text-xl font-bold text-blue-600">
                                  $
                                  {(
                                    (price * item.cartItem.quantity) /
                                    100
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t("cart.orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("cart.subtotal")}:
                      </span>
                      <span className="font-medium">
                        ${(calculateTotal() / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("cart.shipping")}:
                      </span>
                      <span className="font-medium">
                        {t("cart.calculatedAtCheckout")}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">{t("cart.total")}:</span>
                        <span className="font-bold text-blue-600">
                          ${(calculateTotal() / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    {t("cart.proceedToCheckout")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full">
                      {t("cart.continueShopping")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, CreditCard, MapPin, Package } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartItems, isLoading } = trpc.cart.list.useQuery();
  const createCheckoutMutation = trpc.payments.createCheckout.useMutation();
  const clearCartMutation = trpc.cart.clear.useMutation();

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      const price = item.product?.basePrice || item.service?.basePrice || 0;
      return total + price * item.cartItem.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    // Validate shipping address
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      toast.error(t("checkout.fillAllFields"));
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error(t("cart.empty"));
      return;
    }

    setIsProcessing(true);

    try {
      // Group items by factory
      const factoryGroups = cartItems.reduce((groups: Record<number, any[]>, item) => {
        const factoryId = item.factory?.id;
        if (factoryId) {
          if (!groups[factoryId]) {
            groups[factoryId] = [];
          }
          groups[factoryId].push(item);
        }
        return groups;
      }, {});

      // Create orders for each factory
      for (const [factoryId, items] of Object.entries(factoryGroups)) {
        const orderItems = (items as any[]).map((item) => ({
          productId: item.product?.id || item.service?.id || 0,
          quantity: item.cartItem.quantity,
          price: (item.product?.basePrice || item.service?.basePrice || 0) / 100,
        }));

        // Create checkout session
        const checkoutResult = await createCheckoutMutation.mutateAsync({
          factoryId: parseInt(factoryId),
          items: orderItems,
        });

        if (checkoutResult.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = checkoutResult.checkoutUrl;
          return;
        }
      }

      // Clear cart after successful checkout
      await clearCartMutation.mutateAsync();
      
      toast.success(t("checkout.success"));
      setLocation("/orders");
    } catch (error: any) {
      toast.error(error.message || t("checkout.error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">{t("cart.empty")}</p>
            <Button onClick={() => setLocation("/marketplace")} className="mt-4">
              {t("cart.continueShopping")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            {t("checkout.title")}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t("checkout.shippingAddress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t("checkout.fullName")} *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">{t("checkout.address")} *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t("checkout.city")} *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">{t("checkout.state")}</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">{t("checkout.zipCode")}</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">{t("checkout.country")} *</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, country: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">{t("checkout.phone")} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.orderNotes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t("checkout.orderNotesPlaceholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const itemData = item.product || item.service;
                    const price = itemData?.basePrice || 0;
                    return (
                      <div key={item.cartItem.id} className="flex justify-between text-sm">
                        <span>
                          {itemData?.name} × {item.cartItem.quantity}
                        </span>
                        <span className="font-medium">
                          ${((price * item.cartItem.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.subtotal")}:</span>
                    <span className="font-medium">${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.shipping")}:</span>
                    <span className="font-medium">{t("checkout.calculatedLater")}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">{t("checkout.total")}:</span>
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
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t("checkout.processing")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t("checkout.placeOrder")}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("checkout.securePayment")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

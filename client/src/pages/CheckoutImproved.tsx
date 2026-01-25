import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, CreditCard, MapPin, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "shipping" | "method" | "payment";

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

export default function CheckoutImproved() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: checkoutSummary, isLoading } = trpc.checkout.getSummary.useQuery();
  const createCheckoutSessionMutation = trpc.checkout.createCheckoutSession.useMutation();

  const validateShippingAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!shippingAddress.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) {
      newErrors.phone = "Valid phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === "shipping") {
      if (validateShippingAddress()) {
        setCurrentStep("method");
      }
    } else if (currentStep === "method") {
      setCurrentStep("payment");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "method") {
      setCurrentStep("shipping");
    } else if (currentStep === "payment") {
      setCurrentStep("method");
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingAddress()) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckoutSessionMutation.mutateAsync({
        shippingAddress,
        shippingMethod,
        notes,
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process order");
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

  if (!checkoutSummary || checkoutSummary.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">Cart is Empty</p>
            <Button onClick={() => setLocation("/factory")} className="mt-4">
              Continue Shopping
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
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === "shipping" || currentStep === "method" || currentStep === "payment"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep === "shipping" || currentStep === "method" || currentStep === "payment" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span className="font-medium">Shipping</span>
                </div>

                <div className="flex-1 h-1 mx-4 bg-gray-200"></div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === "payment"
                        ? "bg-blue-600 text-white"
                        : currentStep === "method"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep === "payment" ? (
                      "2"
                    ) : currentStep === "method" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span className="font-medium">Method</span>
                </div>

                <div className="flex-1 h-1 mx-4 bg-gray-200"></div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === "payment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Step */}
            {currentStep === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                      }
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                      }
                      className={errors.address ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
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
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={handleNextStep}
                    >
                      Continue to Shipping Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Method Step */}
            {currentStep === "method" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={(e) => setShippingMethod(e.target.value as "standard" | "express")}
                        className="w-4 h-4"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">Standard Shipping (5-7 business days)</p>
                        <p className="text-sm text-muted-foreground">
                          Free shipping on orders over $100
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        ${(checkoutSummary.shipping / 100).toFixed(2)}
                      </p>
                    </label>

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={(e) => setShippingMethod(e.target.value as "standard" | "express")}
                        className="w-4 h-4"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">Express Shipping (2-3 business days)</p>
                        <p className="text-sm text-muted-foreground">
                          Fast delivery for urgent orders
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        ${(Math.round(checkoutSummary.shipping * 1.5) / 100).toFixed(2)}
                      </p>
                    </label>
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any special instructions or notes for your order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handlePreviousStep}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={handleNextStep}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">Secure Payment</p>
                      <p className="text-sm text-blue-800">
                        You will be redirected to Stripe to complete your payment securely.
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-muted-foreground mb-2">
                      We accept all major credit cards and digital payment methods through Stripe.
                    </p>
                    <div className="flex gap-2">
                      <div className="w-12 h-8 bg-white border rounded flex items-center justify-center text-xs font-bold">
                        VISA
                      </div>
                      <div className="w-12 h-8 bg-white border rounded flex items-center justify-center text-xs font-bold">
                        MC
                      </div>
                      <div className="w-12 h-8 bg-white border rounded flex items-center justify-center text-xs font-bold">
                        AMEX
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handlePreviousStep}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {checkoutSummary.items.map((item: any) => {
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
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      ${(checkoutSummary.subtotal / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">
                      ${(checkoutSummary.shipping / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">
                      ${(checkoutSummary.tax / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-blue-600">
                        ${(checkoutSummary.total / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-center text-muted-foreground pt-2">
                  <p>🔒 Secure payment powered by Stripe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

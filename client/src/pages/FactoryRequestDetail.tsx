import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import FactoryDashboardLayout from "@/components/FactoryDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChatSkeleton } from "@/components/ChatSkeleton";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Package,
  FileText,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function FactoryRequestDetail() {
  const { id } = useParams();
  const { language, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState({
    price: "",
    terms: "",
  });

  const { data: request, isLoading } = trpc.inquiries.getByBuyer.useQuery({
    buyerId: 0,
  }); // This is a placeholder, in real app we'd have a getById
  // For demo, we'll just use the first request if it matches ID or mock it

  const submitQuote = trpc.inquiries.submitQuote.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ar"
          ? "تم إرسال العرض بنجاح!"
          : "Quote submitted successfully!"
      );
      setLocation("/factory/orders");
    },
    onError: error => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const priceInCents = Math.round(Number(quoteData.price) * 100);
    const commission = Math.round(priceInCents * 0.03); // 3% commission

    submitQuote.mutate({
      requestId: Number(id),
      factoryId: 1, // Mock factory ID
      price: priceInCents,
      terms: quoteData.terms,
      commission: commission,
    });
  };

  if (isLoading) {
    return (
      <FactoryDashboardLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </FactoryDashboardLayout>
    );
  }

  return (
    <FactoryDashboardLayout>
      <div className="space-y-6" dir={dir}>
        <Button
          variant="ghost"
          onClick={() => setLocation("/factory/orders")}
          className="gap-2"
        >
          {language === "ar" ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          {language === "ar" ? "العودة للطلبات" : "Back to Requests"}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  {language === "ar" ? "تفاصيل الطلب" : "Request Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">
                      {language === "ar" ? "المنتج" : "Product"}
                    </Label>
                    <p className="font-medium">Cotton T-shirts</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">
                      {language === "ar" ? "الكمية" : "Quantity"}
                    </Label>
                    <p className="font-medium">1000</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">
                    {language === "ar" ? "المواصفات" : "Specifications"}
                  </Label>
                  <p className="bg-gray-50 p-3 rounded-md text-sm">
                    100% Organic Cotton, White, Various Sizes
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">
                    {language === "ar" ? "تفاصيل التوصيل" : "Delivery Details"}
                  </Label>
                  <p className="bg-gray-50 p-3 rounded-md text-sm">
                    Shipping to Dubai, UAE. Sea freight preferred.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  {language === "ar" ? "تقديم عرض سعر" : "Submit Quote"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="price">
                      {language === "ar"
                        ? "السعر الإجمالي ($)"
                        : "Total Price ($)"}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={quoteData.price}
                      onChange={e =>
                        setQuoteData(prev => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="5000"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {language === "ar"
                        ? "سيتم تطبيق عمولة 3% عند قبول الطلب."
                        : "A 3% commission will be applied upon acceptance."}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="terms">
                      {language === "ar"
                        ? "الشروط والملاحظات"
                        : "Terms & Notes"}
                    </Label>
                    <Textarea
                      id="terms"
                      value={quoteData.terms}
                      onChange={e =>
                        setQuoteData(prev => ({
                          ...prev,
                          terms: e.target.value,
                        }))
                      }
                      placeholder="Payment terms, lead time, etc."
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {language === "ar" ? "إرسال العرض" : "Submit Quote"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  {language === "ar" ? "معلومات المشتري" : "Buyer Info"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">Verified Buyer</p>
                <div className="pt-2">
                  <Badge variant="outline">Dubai, UAE</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "ar"
                    ? "المحادثة مع المشتري"
                    : "Chat with Buyer"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatSkeleton recipientName="John Doe" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FactoryDashboardLayout>
  );
}

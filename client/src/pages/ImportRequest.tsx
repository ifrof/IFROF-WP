import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle,
  Loader2,
  Factory,
  Truck,
  User,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function ImportRequest() {
  const { language, t, dir } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: undefined as number | undefined,
    productName: "",
    category: "",
    quantity: "",
    specifications: "",
    deliveryDetails: "",
  });

  // Get productId from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("productId");
    if (pid) {
      setFormData(prev => ({ ...prev, productId: Number(pid) }));
    }
  }, []);

  const createRequest = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ar"
          ? "تم إرسال طلبك بنجاح!"
          : "Request submitted successfully!"
      );
      setStep(4);
    },
    onError: error => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول" : "Please login");
      return;
    }

    if (!formData.productName || !formData.quantity || !formData.destination) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    if (formData.attachments.length === 0 && formData.attachmentUrls.length === 0) {
      toast.error(language === 'ar' ? 'يرجى إضافة صور أو ملفات' : 'Please add images or files');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(language === 'ar' ? 'تم إرسال طلب الاستيراد بنجاح!' : 'Import request submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {language === "ar" ? "تم الإرسال!" : "Submitted!"}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === "ar"
              ? "سنتواصل معك قريباً بعروض الأسعار."
              : "We will contact you soon with quotes."}
          </p>
          <Button
            onClick={() => setLocation("/buyer/requests")}
            className="w-full"
          >
            {language === "ar" ? "عرض طلباتي" : "View My Requests"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir={dir}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold transition-colors ${
                step >= i
                  ? "bg-blue-600 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 &&
                (language === "ar" ? "اختيار المنتج" : "Product Selection")}
              {step === 2 &&
                (language === "ar" ? "التفاصيل والكمية" : "Details & Quantity")}
              {step === 3 &&
                (language === "ar" ? "معلومات التواصل" : "Contact Information")}
            </CardTitle>
            <CardDescription>
              {step === 1 &&
                (language === "ar"
                  ? "ما الذي ترغب في استيراده؟"
                  : "What would you like to import?")}
              {step === 2 &&
                (language === "ar"
                  ? "حدد الكمية والمواصفات المطلوبة"
                  : "Specify quantity and requirements")}
              {step === 3 &&
                (language === "ar"
                  ? "تأكيد بياناتك لإرسال الطلب"
                  : "Confirm your details to submit")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>
                    {language === "ar" ? "اسم المنتج" : "Product Name"}
                  </Label>
                  <Input
                    value={formData.productName}
                    onChange={e =>
                      setFormData(f => ({ ...f, productName: e.target.value }))
                    }
                    placeholder="e.g. Cotton T-shirts"
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "التصنيف" : "Category"}</Label>
                  <Input
                    value={formData.category}
                    onChange={e =>
                      setFormData(f => ({ ...f, category: e.target.value }))
                    }
                    placeholder="e.g. Apparel"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>{language === "ar" ? "الكمية" : "Quantity"}</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={e =>
                      setFormData(f => ({ ...f, quantity: e.target.value }))
                    }
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label>
                    {language === "ar" ? "المواصفات" : "Specifications"}
                  </Label>
                  <Textarea
                    value={formData.specifications}
                    onChange={e =>
                      setFormData(f => ({
                        ...f,
                        specifications: e.target.value,
                      }))
                    }
                    placeholder="Size, color, material..."
                  />
                </div>
                <div>
                  <Label>
                    {language === "ar" ? "تفاصيل التوصيل" : "Delivery Details"}
                  </Label>
                  <Textarea
                    value={formData.deliveryDetails}
                    onChange={e =>
                      setFormData(f => ({
                        ...f,
                        deliveryDetails: e.target.value,
                      }))
                    }
                    placeholder="Shipping address, preferred method..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-blue-800">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="text-sm text-blue-600">{user?.email}</div>
                </div>
                <p className="text-sm text-gray-500">
                  {language === "ar"
                    ? "سيتم إرسال هذا الطلب إلى المصانع المناسبة وسيتواصلون معك عبر المنصة."
                    : "This request will be sent to relevant factories who will contact you via the platform."}
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  {language === "ar" ? "السابق" : "Previous"}
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={step === 1 && !formData.productName}
                >
                  {language === "ar" ? "التالي" : "Next"}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {language === "ar" ? "إرسال الطلب" : "Submit Request"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

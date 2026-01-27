import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
import {
  Plane,
  Ship,
  Truck,
  Train,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Globe,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Shipping() {
  const { language, dir, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    origin: "China",
    destination: "",
    weight: "",
    volume: "",
    productType: "",
    notes: "",
  });

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  const shippingMethods = [
    {
      id: "sea",
      icon: Ship,
      title: language === "ar" ? "شحن بحري" : "Sea Freight",
      description:
        language === "ar"
          ? "الخيار الأكثر اقتصادية للكميات الكبيرة"
          : "Most economical for large volumes",
      time: language === "ar" ? "25-45 يوم" : "25-45 days",
      color: "bg-blue-500",
    },
    {
      id: "air",
      icon: Plane,
      title: language === "ar" ? "شحن جوي" : "Air Freight",
      description:
        language === "ar"
          ? "سريع وموثوق للشحنات العاجلة"
          : "Fast and reliable for urgent shipments",
      time: language === "ar" ? "5-10 أيام" : "5-10 days",
      color: "bg-sky-500",
    },
    {
      id: "rail",
      icon: Train,
      title: language === "ar" ? "شحن عبر السكك الحديدية" : "Rail Freight",
      description:
        language === "ar"
          ? "توازن مثالي بين التكلفة والسرعة"
          : "Perfect balance between cost and speed",
      time: language === "ar" ? "15-22 يوم" : "15-22 days",
      color: "bg-indigo-500",
    },
    {
      id: "land",
      icon: Truck,
      title: language === "ar" ? "شحن بري" : "Land Freight",
      description:
        language === "ar"
          ? "توصيل من الباب إلى الباب للدول المجاورة"
          : "Door-to-door delivery for neighboring countries",
      time: language === "ar" ? "7-15 يوم" : "7-15 days",
      color: "bg-orange-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار طريقة الشحن"
          : "Please select a shipping method"
      );
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(
      language === "ar"
        ? "تم إرسال طلب عرض السعر بنجاح"
        : "Quote request submitted successfully"
    );
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        dir={dir}
      >
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar" ? "شكراً لطلبك!" : "Thank You!"}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === "ar"
              ? "لقد استلمنا طلب عرض سعر الشحن الخاص بك. سيقوم خبير اللوجستيات لدينا بالتواصل معك خلال ساعتين."
              : "We've received your shipping quote request. Our logistics expert will contact you within 2 hours."}
          </p>
          <Button asChild className="w-full bg-[#1e3a5f]">
            <Link href="/">
              {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Hero Section */}
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === "ar"
              ? "خدمات الشحن الدولي من الصين"
              : "International Shipping Services from China"}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {language === "ar"
              ? "حلول لوجستية متكاملة تشمل الشحن الجوي، البحري، البري، والسكك الحديدية مع التخليص الجمركي والتوصيل للباب."
              : "Integrated logistics solutions including Air, Sea, Land, and Rail freight with customs clearance and door-to-door delivery."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>{language === "ar" ? "تأمين كامل" : "Full Insurance"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-orange-400" />
              <span>
                {language === "ar" ? "تتبع لحظي" : "Real-time Tracking"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>
                {language === "ar" ? "تغطية عالمية" : "Global Coverage"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Shipping Methods Selection */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === "ar"
                ? "1. اختر طريقة الشحن"
                : "1. Select Shipping Method"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {shippingMethods.map(method => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all border-2 ${selectedMethod === method.id ? "border-[#ff8c42] bg-orange-50" : "hover:border-gray-300"}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 ${method.color} text-white rounded-lg flex items-center justify-center mb-4`}
                    >
                      <method.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {method.description}
                    </p>
                    <div className="flex items-center text-xs font-medium text-gray-500">
                      <Clock className="w-3 h-3 me-1" />
                      {method.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === "ar" ? "2. تفاصيل الشحنة" : "2. Shipment Details"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>
                      {language === "ar" ? "من (المنشأ)" : "From (Origin)"}
                    </Label>
                    <Input
                      value={formData.origin}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {language === "ar" ? "إلى (الوجهة)" : "To (Destination)"}
                    </Label>
                    <Input
                      placeholder={
                        language === "ar"
                          ? "مثال: الرياض، السعودية"
                          : "e.g. Riyadh, Saudi Arabia"
                      }
                      value={formData.destination}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {language === "ar"
                        ? "الوزن التقديري (كجم)"
                        : "Estimated Weight (kg)"}
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.weight}
                      onChange={e =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {language === "ar"
                        ? "الحجم التقديري (CBM)"
                        : "Estimated Volume (CBM)"}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={formData.volume}
                      onChange={e =>
                        setFormData({ ...formData, volume: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === "ar" ? "نوع المنتج" : "Product Type"}
                  </Label>
                  <Input
                    placeholder={
                      language === "ar"
                        ? "مثال: أثاث، إلكترونيات، ملابس"
                        : "e.g. Furniture, Electronics, Clothing"
                    }
                    value={formData.productType}
                    onChange={e =>
                      setFormData({ ...formData, productType: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                  </Label>
                  <Textarea
                    placeholder={
                      language === "ar"
                        ? "أي متطلبات خاصة مثل التغليف أو التخليص الجمركي..."
                        : "Any special requirements like packaging or customs clearance..."
                    }
                    value={formData.notes}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#ff8c42] hover:bg-[#e67a35] text-white py-6 text-lg font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {language === "ar"
                        ? "احصل على عرض سعر الآن"
                        : "Get a Quote Now"}
                      <Arrow className="ms-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  {language === "ar" ? "ضمان IFROF" : "IFROF Guarantee"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-4">
                <p>
                  {language === "ar"
                    ? "نحن نضمن لك أفضل أسعار الشحن من الصين مباشرة من خلال شبكة شركائنا الموثوقين."
                    : "We guarantee the best shipping rates from China directly through our network of trusted partners."}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {language === "ar"
                        ? "تخليص جمركي احترافي"
                        : "Professional customs clearance"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {language === "ar"
                        ? "تفتيش قبل الشحن"
                        : "Pre-shipment inspection"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {language === "ar"
                        ? "تخزين مجاني لمدة 7 أيام"
                        : "Free warehousing for 7 days"}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "ar" ? "أسئلة شائعة" : "FAQ"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm mb-1">
                    {language === "ar"
                      ? "كيف يتم حساب التكلفة؟"
                      : "How is cost calculated?"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {language === "ar"
                      ? "تعتمد التكلفة على الوزن الفعلي أو الحجمي (أيهما أكبر) والوجهة وطريقة الشحن المختارة."
                      : "Cost depends on actual or volumetric weight (whichever is greater), destination, and chosen method."}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">
                    {language === "ar"
                      ? "هل توفرون خدمة التوصيل للباب؟"
                      : "Do you provide door-to-door?"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {language === "ar"
                      ? "نعم، نوفر خدمة DDP (شاملة الضرائب والجمارك) والتوصيل حتى مستودعك."
                      : "Yes, we provide DDP (including taxes and duties) and delivery to your warehouse."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  MapPin,
  Search,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LazyImage } from "@/components/LazyImage";
import { Badge } from "@/components/ui/badge";

export default function PublicFactoryListings() {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: factories, isLoading } = trpc.factories.list.useQuery();

  const filteredFactories =
    factories?.filter(
      (factory: any) =>
        factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.productCategories
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-900"
                >
                  <BackArrow className="w-4 h-4" />
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>
            </div>
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IF</span>
                </div>
                <span className="font-bold text-lg text-[#1e3a5f]">IFROF</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/factory">
                <Button variant="outline" size="sm">
                  {language === "ar" ? "سوق المنتجات" : "Product Marketplace"}
                </Button>
              </Link>
              <Link href="/import-request">
                <Button size="sm" className="bg-[#ff8c42] hover:bg-[#e67a35]">
                  {language === "ar" ? "طلب استيراد" : "Import Request"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">
              {language === "ar"
                ? "مصانع صينية موثقة"
                : "Verified Chinese Factories"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === "ar"
              ? "دليل المصانع المعتمدة"
              : "Certified Factory Directory"}
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            {language === "ar"
              ? "تصفح قائمة المصانع الصينية التي تم التحقق من هويتها وشهادات الجودة الخاصة بها لضمان تجربة استيراد آمنة."
              : "Browse our curated list of Chinese manufacturers verified for identity and quality certifications to ensure a secure importing experience."}
          </p>

          <div className="flex gap-2 max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder={
                  language === "ar"
                    ? "ابحث عن المصانع بالاسم، الموقع، أو نوع المنتج..."
                    : "Search by name, location, or product type..."
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-black pl-10 focus-visible:ring-0 text-lg h-12"
              />
            </div>
            <Button className="bg-[#ff8c42] hover:bg-[#e67a35] h-12 px-8 text-lg">
              {language === "ar" ? "بحث" : "Search"}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-muted-foreground">
              {language === "ar"
                ? "جاري تحميل المصانع..."
                : "Loading factories..."}
            </p>
          </div>
        ) : filteredFactories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFactories.map((factory: any) => (
              <Card
                key={factory.id}
                className="overflow-hidden hover:shadow-xl transition-all border-none shadow-md group"
              >
                <div className="relative h-48 bg-gray-200">
                  {factory.bannerUrl ? (
                    <LazyImage
                      src={factory.bannerUrl}
                      alt={factory.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Award className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {factory.verificationStatus === "verified" && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-3 py-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {language === "ar" ? "موثق" : "Verified"}
                      </Badge>
                    </div>
                  )}
                  {factory.logoUrl && (
                    <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-lg shadow-md p-1 overflow-hidden border">
                      <img
                        src={factory.logoUrl}
                        alt={factory.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <CardHeader className="pt-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1 group-hover:text-blue-700 transition-colors">
                        {factory.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {factory.location ||
                          (language === "ar" ? "الصين" : "China")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {factory.productCategories
                      ?.split(",")
                      .map((cat: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none"
                        >
                          {cat.trim()}
                        </Badge>
                      ))}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                    {factory.description ||
                      (language === "ar"
                        ? "لا يوجد وصف متاح لهذا المصنع حالياً."
                        : "No description available for this factory yet.")}
                  </p>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < (factory.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">(12+)</span>
                    </div>
                    <Link href={`/factories/${factory.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 gap-1"
                      >
                        {language === "ar"
                          ? "عرض الملف الشخصي"
                          : "View Profile"}
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {language === "ar"
                ? "لم يتم العثور على نتائج"
                : "No results found"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {language === "ar"
                ? "لم نتمكن من العثور على أي مصانع تطابق بحثك. جرب استخدام كلمات مفتاحية مختلفة."
                : "We couldn't find any factories matching your search. Try using different keywords."}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setSearchQuery("")}
            >
              {language === "ar" ? "إعادة تعيين البحث" : "Reset Search"}
            </Button>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            {language === "ar"
              ? "لماذا تختار المصانع الموثقة؟"
              : "Why Choose Verified Factories?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "أمان مالي" : "Financial Security"}
              </h3>
              <p className="text-gray-600">
                {language === "ar"
                  ? "نضمن أن المصنع كيان قانوني مسجل وقائم."
                  : "We ensure the factory is a registered and existing legal entity."}
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "جودة مضمونة" : "Guaranteed Quality"}
              </h3>
              <p className="text-gray-600">
                {language === "ar"
                  ? "يتم فحص شهادات الجودة (ISO, CE, الخ) والتأكد من صحتها."
                  : "Quality certifications (ISO, CE, etc.) are checked and verified."}
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "زيارات ميدانية" : "On-site Visits"}
              </h3>
              <p className="text-gray-600">
                {language === "ar"
                  ? "فريقنا في الصين يقوم بزيارات دورية للمصانع المدرجة."
                  : "Our team in China conducts periodic visits to listed factories."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

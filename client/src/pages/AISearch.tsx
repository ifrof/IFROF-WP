import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Factory,
  XCircle,
  TrendingDown,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const pageTranslations = {
  ar: {
    back: "العودة",
    manufacturers: "المصانع",
    importRequest: "طلب استيراد",
    poweredByAI: "Direct Factory Import - تجاوز الوسطاء",
    title: "ابحث عن المصنع الحقيقي (تجاوز الوسطاء)",
    subtitle:
      "لا وسيط يسحب 40% من أرباحك، ولا شركة تجارية تزعم أنها مصنع. نكشف لك الحقيقة في ثوانٍ.",
    productOrFactory: "اسم المنتج أو المصنع",
    productPlaceholder: "مثال: مصنع أثاث مكتبي في فوشان...",
    category: "الفئة الصناعية",
    categoryPlaceholder: "إلكترونيات، ملابس...",
    searching: "جاري كشف الوسطاء والتحقق...",
    startVerification: "بدء البحث عن المصنع الحقيقي الآن",
    analyzingData: "جاري تحليل البيانات الحية",
    analyzingDesc:
      "نقوم الآن بالبحث في السجلات التجارية الصينية لكشف الشركات التجارية الوهمية والوصول للمصنع الأم...",
    resultsTitle: "نتائج التحقق والتحليل المباشر",
    results: "نتائج",
    verifiedSource: "مصدر موثق",
    directFactory: "مصنع مباشر (بدون عمولات)",
    tradingCompany: "شركة تجارية (وسيط - احذر العمولات)",
    confidence: "نسبة اليقين",
    aiAnalysis: "تحليل البيانات العميق",
    expertRecommendations: "توصيات الخبراء لتوفير المال",
    noResults: "لا توجد نتائج مطابقة",
    noResultsDesc:
      "حاول تغيير كلمات البحث للوصول إلى قاعدة بيانات المصانع الحقيقية.",
    comprehensiveSearch: "لا للوسطاء",
    comprehensiveSearchDesc:
      "نحن نقتل الوساطة لنضمن لك السعر الأصلي من خط الإنتاج.",
    accurateVerification: "كشف الخداع",
    accurateVerificationDesc:
      "نكشف الشركات التي تدعي أنها مصانع وهي مجرد مكاتب تجارية تسحب أرباحك.",
    directFactories: "وفّر 40%",
    directFactoriesDesc:
      "الوصول للمصنع الحقيقي يعني توفير مبالغ ضخمة كانت تذهب كعمولات مخفية.",
    searchError: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.",
  },
  en: {
    back: "Back",
    manufacturers: "Manufacturers",
    importRequest: "Import Request",
    poweredByAI: "Direct Factory Import - No More Commissions",
    title: "Find Real Factory (Direct Factory Import)",
    subtitle:
      "No 40% middleman cuts. No trading companies pretending to be factories. We reveal the truth in seconds.",
    productOrFactory: "Product or Factory Name",
    productPlaceholder: "Example: Office furniture factory in Foshan...",
    category: "Industrial Category",
    categoryPlaceholder: "Electronics, Apparel...",
    searching: "Exposing Middlemen & Verifying...",
    startVerification: "Find Real Factory Now",
    analyzingData: "Analyzing Live Data",
    analyzingDesc:
      "Searching Chinese business records to expose fake trading companies and reach the parent factory...",
    resultsTitle: "Direct Verification Results",
    results: "Results",
    verifiedSource: "Verified Source",
    directFactory: "Direct Factory (Zero Commission)",
    tradingCompany: "Trading Company (Middleman - Watch Out)",
    confidence: "Certainty Rate",
    aiAnalysis: "Deep Data Analysis",
    expertRecommendations: "Expert Money-Saving Tips",
    noResults: "No Matching Results",
    noResultsDesc:
      "Try different keywords to access our real factory database.",
    comprehensiveSearch: "Direct Factory Import",
    comprehensiveSearchDesc:
      "We eliminate intermediaries to guarantee original production prices.",
    accurateVerification: "Expose Deception",
    accurateVerificationDesc:
      "We detect companies claiming to be factories when they are just trading offices.",
    directFactories: "Save 40%+",
    directFactoriesDesc:
      "Reaching the real factory means saving massive amounts lost in hidden commissions.",
    searchError: "An error occurred during search. Please try again.",
  },
};

export default function AISearch() {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t =
    pageTranslations[language as keyof typeof pageTranslations] ||
    pageTranslations.en;

  const searchMutation = trpc.aiAgent.searchFactories.useMutation({
    onSuccess: data => {
      setSearchResults(data.results || []);
      setRecommendations(data.recommendations || []);
      setIsSearching(false);
      setError(null);
    },
    onError: error => {
      console.error("Search API Error:", error);
      setIsSearching(false);
      setError(t.searchError);
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setError(null);

    searchMutation.mutate({
      query: searchQuery,
      language: language as "ar" | "en" | "zh",
      category: category || undefined,
    });
  };

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#1e3a5f]"
                >
                  <BackArrow className="w-4 h-4" />
                  {t.back}
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
                  {t.manufacturers}
                </Button>
              </Link>
              <Link href="/import-request">
                <Button size="sm" className="bg-[#ff8c42] hover:bg-[#e67a35]">
                  {t.importRequest}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-[#1e3a5f] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff8c42] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-4 bg-red-600 hover:bg-red-700 text-white border-none px-4 py-1 animate-pulse">
            {t.poweredByAI}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.title}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <Card className="shadow-2xl border-none overflow-hidden">
          <CardContent className="p-8 md:p-10 bg-white">
            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#ff8c42]" />
                    {t.productOrFactory}
                  </label>
                  <Input
                    placeholder={t.productPlaceholder}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-14 border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-lg rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#ff8c42]" />
                    {t.category}
                  </label>
                  <Input
                    placeholder={t.categoryPlaceholder}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="h-14 border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-lg rounded-xl"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-xl shadow-xl transition-all rounded-xl flex items-center justify-center gap-3"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t.searching}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6" />
                    {t.startVerification}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t.comprehensiveSearch}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.comprehensiveSearchDesc}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 mb-6">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t.accurateVerification}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.accurateVerificationDesc}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-6">
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.directFactories}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.directFactoriesDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

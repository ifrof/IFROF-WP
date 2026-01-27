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
    back: 'العودة',
    manufacturers: 'المصانع',
    importRequest: 'طلب استيراد',
    poweredByAI: 'Direct Factory Import - تجاوز الوسطاء',
    title: 'ابحث عن المصنع الحقيقي (تجاوز الوسطاء)',
    subtitle: 'لا وسيط يسحب 40% من أرباحك، ولا شركة تجارية تزعم أنها مصنع. نكشف لك الحقيقة في ثوانٍ.',
    productOrFactory: 'اسم المنتج أو المصنع',
    productPlaceholder: 'مثال: مصنع أثاث مكتبي في فوشان...',
    category: 'الفئة الصناعية',
    categoryPlaceholder: 'إلكترونيات، ملابس...',
    searching: 'جاري كشف الوسطاء والتحقق...',
    startVerification: 'بدء البحث عن المصنع الحقيقي الآن',
    analyzingData: 'جاري تحليل البيانات الحية',
    analyzingDesc: 'نقوم الآن بالبحث في السجلات التجارية الصينية لكشف الشركات التجارية الوهمية والوصول للمصنع الأم...',
    resultsTitle: 'نتائج التحقق والتحليل المباشر',
    results: 'نتائج',
    verifiedSource: 'مصدر موثق',
    directFactory: 'مصنع مباشر (بدون عمولات)',
    tradingCompany: 'شركة تجارية (وسيط - احذر العمولات)',
    confidence: 'نسبة اليقين',
    aiAnalysis: 'تحليل البيانات العميق',
    expertRecommendations: 'توصيات الخبراء لتوفير المال',
    noResults: 'لا توجد نتائج مطابقة',
    noResultsDesc: 'حاول تغيير كلمات البحث للوصول إلى قاعدة بيانات المصانع الحقيقية.',
    comprehensiveSearch: 'لا للوسطاء',
    comprehensiveSearchDesc: 'نحن نقتل الوساطة لنضمن لك السعر الأصلي من خط الإنتاج.',
    accurateVerification: 'كشف الخداع',
    accurateVerificationDesc: 'نكشف الشركات التي تدعي أنها مصانع وهي مجرد مكاتب تجارية تسحب أرباحك.',
    directFactories: 'وفّر 40%',
    directFactoriesDesc: 'الوصول للمصنع الحقيقي يعني توفير مبالغ ضخمة كانت تذهب كعمولات مخفية.',
    searchError: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.',
  },
  en: {
    back: 'Back',
    manufacturers: 'Manufacturers',
    importRequest: 'Import Request',
    poweredByAI: 'Direct Factory Import - No More Commissions',
    title: 'Find Real Factory (Direct Factory Import)',
    subtitle: 'No 40% middleman cuts. No trading companies pretending to be factories. We reveal the truth in seconds.',
    productOrFactory: 'Product or Factory Name',
    productPlaceholder: 'Example: Office furniture factory in Foshan...',
    category: 'Industrial Category',
    categoryPlaceholder: 'Electronics, Apparel...',
    searching: 'Exposing Middlemen & Verifying...',
    startVerification: 'Find Real Factory Now',
    analyzingData: 'Analyzing Live Data',
    analyzingDesc: 'Searching Chinese business records to expose fake trading companies and reach the parent factory...',
    resultsTitle: 'Direct Verification Results',
    results: 'Results',
    verifiedSource: 'Verified Source',
    directFactory: 'Direct Factory (Zero Commission)',
    tradingCompany: 'Trading Company (Middleman - Watch Out)',
    confidence: 'Certainty Rate',
    aiAnalysis: 'Deep Data Analysis',
    expertRecommendations: 'Expert Money-Saving Tips',
    noResults: 'No Matching Results',
    noResultsDesc: 'Try different keywords to access our real factory database.',
    comprehensiveSearch: 'Direct Factory Import',
    comprehensiveSearchDesc: 'We eliminate intermediaries to guarantee original production prices.',
    accurateVerification: 'Expose Deception',
    accurateVerificationDesc: 'We detect companies claiming to be factories when they are just trading offices.',
    directFactories: 'Save 40%+',
    directFactoriesDesc: 'Reaching the real factory means saving massive amounts lost in hidden commissions.',
    searchError: 'An error occurred during search. Please try again.',
  }
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
    },
    onError: error => {
      console.error("Search API Error:", error);
      setIsSearching(false);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
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

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'ابحث عن المصانع' : 'Search for Factories'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'ماذا تبحث عن؟' : 'What are you looking for?'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'مثال: مصنع نسيج' : 'Example: Textile factory'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-14 border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-lg rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="h-14 border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-lg rounded-xl"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {t('aiAgent.searching')}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t('common.search')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">{t('aiAgent.results')}</h2>
              <div className="grid gap-6">
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    className={`border-2 ${
                      result.isDirectFactory
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {result.isDirectFactory ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            )}
                            <CardTitle className="text-lg">{result.name}</CardTitle>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                result.isDirectFactory
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-red-200 text-red-800'
                              }`}
                            >
                              {result.isDirectFactory
                                ? t('verification.directFactory')
                                : t('verification.notDirect')}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800">
                              {language === 'ar'
                                ? `ثقة: ${result.confidence}%`
                                : `Confidence: ${result.confidence}%`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{result.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
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

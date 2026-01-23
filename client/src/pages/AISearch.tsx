import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Search, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Globe, Factory } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

// Translations for this page
const pageTranslations = {
  ar: {
    back: 'العودة',
    manufacturers: 'المصانع',
    importRequest: 'طلب استيراد',
    poweredByAI: 'مدعوم بالذكاء الاصطناعي',
    title: 'ابحث عن المصنع الحقيقي (تجاوز الوسطاء)',
    subtitle: 'توقف عن دفع العمولات للوسطاء. نستخدم الذكاء الاصطناعي للوصول إلى المصنع الصيني الحقيقي مباشرة.',
    productOrFactory: 'اسم المنتج أو المصنع',
    productPlaceholder: 'مثال: مصنع أثاث مكتبي في فوشان...',
    category: 'الفئة الصناعية',
    categoryPlaceholder: 'إلكترونيات، ملابس...',
    searching: 'جاري البحث والتحقق...',
    startVerification: 'بدء التحقق الذكي الآن',
    analyzingData: 'جاري تحليل البيانات الحية',
    analyzingDesc: 'نقوم الآن بالبحث في السجلات التجارية، ملفات علي بابا، وشهادات الجودة للتحقق من المصنع...',
    resultsTitle: 'نتائج التحقق والتحليل',
    results: 'نتائج',
    verifiedSource: 'مصدر موثق',
    directFactory: 'مصنع مباشر',
    tradingCompany: 'شركة تجارية/وسيط',
    confidence: 'نسبة الثقة',
    aiAnalysis: 'تحليل الذكاء الاصطناعي',
    expertRecommendations: 'توصيات الخبراء للاستيراد الآمن',
    noResults: 'لا توجد نتائج مطابقة',
    noResultsDesc: 'حاول تغيير كلمات البحث أو الفئة للحصول على نتائج أفضل من نظام التحقق.',
    comprehensiveSearch: 'بحث شامل',
    comprehensiveSearchDesc: 'نبحث في آلاف السجلات التجارية الصينية لحظياً.',
    accurateVerification: 'تحقق دقيق',
    accurateVerificationDesc: 'نستخدم الذكاء الاصطناعي لكشف الوسطاء والشركات الوهمية.',
    directFactories: 'مصانع مباشرة',
    directFactoriesDesc: 'نساعدك في الوصول للمصنع الحقيقي لضمان أفضل سعر.',
    searchError: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.',
  },
  en: {
    back: 'Back',
    manufacturers: 'Manufacturers',
    importRequest: 'Import Request',
    poweredByAI: 'Powered by AI',
    title: 'Find Real Factory (Kill the Middleman)',
    subtitle: 'Stop paying middleman commissions. We use AI to reach the real Chinese factory directly.',
    productOrFactory: 'Product or Factory Name',
    productPlaceholder: 'Example: Office furniture factory in Foshan...',
    category: 'Industrial Category',
    categoryPlaceholder: 'Electronics, Apparel...',
    searching: 'Searching & Verifying...',
    startVerification: 'Start AI Verification Now',
    analyzingData: 'Analyzing Live Data',
    analyzingDesc: 'We are currently searching business records, Alibaba profiles, and quality certificates to verify the factory...',
    resultsTitle: 'Verification & Analysis Results',
    results: 'Results',
    verifiedSource: 'Verified Source',
    directFactory: 'Direct Factory',
    tradingCompany: 'Trading Company/Agent',
    confidence: 'Confidence',
    aiAnalysis: 'AI Analysis',
    expertRecommendations: 'Expert Recommendations for Safe Import',
    noResults: 'No Matching Results',
    noResultsDesc: 'Try changing your search terms or category to get better results from the verification system.',
    comprehensiveSearch: 'Comprehensive Search',
    comprehensiveSearchDesc: 'We search thousands of Chinese business records in real-time.',
    accurateVerification: 'Accurate Verification',
    accurateVerificationDesc: 'We use AI to detect intermediaries and shell companies.',
    directFactories: 'Direct Factories',
    directFactoriesDesc: 'We help you reach the real factory to ensure the best price.',
    searchError: 'An error occurred during search. Please try again.',
  },
  zh: {
    back: '返回',
    manufacturers: '制造商',
    importRequest: '进口申请',
    poweredByAI: 'AI驱动',
    title: 'AI工厂验证系统',
    subtitle: '搜索中国供应商并在几秒钟内验证其真实身份（直接工厂或贸易公司）。',
    productOrFactory: '产品或工厂名称',
    productPlaceholder: '例如：佛山办公家具厂...',
    category: '工业类别',
    categoryPlaceholder: '电子、服装...',
    searching: '搜索和验证中...',
    startVerification: '立即开始AI验证',
    analyzingData: '正在分析实时数据',
    analyzingDesc: '我们正在搜索商业记录、阿里巴巴档案和质量证书以验证工厂...',
    resultsTitle: '验证和分析结果',
    results: '结果',
    verifiedSource: '已验证来源',
    directFactory: '直接工厂',
    tradingCompany: '贸易公司/代理',
    confidence: '置信度',
    aiAnalysis: 'AI分析',
    expertRecommendations: '安全进口专家建议',
    noResults: '没有匹配结果',
    noResultsDesc: '尝试更改搜索词或类别以从验证系统获得更好的结果。',
    comprehensiveSearch: '全面搜索',
    comprehensiveSearchDesc: '我们实时搜索数千条中国商业记录。',
    accurateVerification: '准确验证',
    accurateVerificationDesc: '我们使用AI检测中间商和空壳公司。',
    directFactories: '直接工厂',
    directFactoriesDesc: '我们帮助您联系真正的工厂以确保最佳价格。',
    searchError: '搜索时发生错误。请重试。',
  },
};

export default function AISearch() {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = pageTranslations[language] || pageTranslations.en;

  const searchMutation = trpc.aiAgent.searchFactories.useMutation({
    onSuccess: (data) => {
      setSearchResults(data.results || []);
      setRecommendations(data.recommendations || []);
      setIsSearching(false);
      setError(null);
    },
    onError: (error) => {
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
      language: language as 'ar' | 'en' | 'zh',
      category: category || undefined,
    });
  };

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-[#1e3a5f]">
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
              <Link href="/marketplace">
                <Button variant="outline" size="sm">
                  {t.manufacturers}
                </Button>
              </Link>
              <Link href="/find-factory">
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'ابحث عن المصنع الحقيقي' : 'Find Real Factory'}
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

      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff8c42] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-4 bg-[#ff8c42] hover:bg-[#ff8c42] text-white border-none px-4 py-1">
            {t.poweredByAI}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Search Section */}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-14 border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-lg rounded-xl"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full h-14 bg-[#1e3a5f] hover:bg-[#152944] text-white font-bold text-xl shadow-xl transition-all rounded-xl flex items-center justify-center gap-3"
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

        {/* Results Section */}
        <div className="mt-16 pb-24">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {isSearching ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#1e3a5f] rounded-full border-t-transparent animate-spin"></div>
                <Search className="absolute inset-0 m-auto w-8 h-8 text-[#1e3a5f]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {t.analyzingData}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {t.analyzingDesc}
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <h2 className="text-3xl font-bold text-[#1e3a5f]">
                  {t.resultsTitle}
                </h2>
                <Badge variant="outline" className="text-gray-500">
                  {searchResults.length} {t.results}
                </Badge>
              </div>
              
              <div className="grid gap-8">
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden border-none shadow-lg transition-transform hover:scale-[1.01] ${
                      result.isDirectFactory ? 'bg-white' : 'bg-white'
                    }`}
                  >
                    <div className={`h-2 w-full ${result.isDirectFactory ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${result.isDirectFactory ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {result.isDirectFactory ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-[#1e3a5f] mb-1">{result.name}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Globe className="w-4 h-4" />
                              {result.source || t.verifiedSource}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`px-4 py-1.5 text-sm font-bold rounded-lg ${
                            result.isDirectFactory ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
                          }`}>
                            {result.isDirectFactory ? t.directFactory : t.tradingCompany}
                          </Badge>
                          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg font-bold text-sm border border-blue-100">
                            {t.confidence}: {result.confidence}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                          {t.aiAnalysis}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {result.reasoning}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {recommendations.length > 0 && (
                <Card className="bg-[#1e3a5f] text-white border-none shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-[#ff8c42]" />
                      {t.expertRecommendations}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                          <div className="w-8 h-8 bg-[#ff8c42] rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                            {i + 1}
                          </div>
                          <p className="text-blue-50 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {t.noResults}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {t.noResultsDesc}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-3">{t.comprehensiveSearch}</h4>
                <p className="text-gray-500 text-sm">{t.comprehensiveSearchDesc}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-3">{t.accurateVerification}</h4>
                <p className="text-gray-500 text-sm">{t.accurateVerificationDesc}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Factory className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-3">{t.directFactories}</h4>
                <p className="text-gray-500 text-sm">{t.directFactoriesDesc}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

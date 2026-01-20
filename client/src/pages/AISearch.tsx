import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Search, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

export default function AISearch() {
  const { t, language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const searchMutation = trpc.aiAgent.searchFactories.useMutation({
    onSuccess: (data) => {
      setSearchResults(data.results || []);
      setRecommendations(data.recommendations || []);
      setIsSearching(false);
    },
    onError: (error) => {
      console.error("Search API Error:", error);
      setIsSearching(false);
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    
    searchMutation.mutate({
      query: searchQuery,
      language: language as 'ar' | 'en',
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
                  {language === 'ar' ? 'العودة' : 'Back'}
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
                  {language === 'ar' ? 'المصانع' : 'Manufacturers'}
                </Button>
              </Link>
              <Link href="/import-request">
                <Button size="sm" className="bg-[#ff8c42] hover:bg-[#e67a35]">
                  {language === 'ar' ? 'طلب استيراد' : 'Import Request'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'المحقق الذكي للمصانع' : 'AI Factory Investigator'}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'ابحث عن أي مصنع في الصين وسنقوم بالتحقق منه باستخدام الذكاء الاصطناعي' 
              : 'Search for any factory in China and we will verify it using AI'}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="shadow-xl border-none">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'ar' ? 'ماذا تبحث عن؟' : 'What are you looking for?'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'مثال: مصنع ملابس في قوانغتشو...' : 'Example: Clothing factory in Guangzhou...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-gray-300 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئة (اختياري)' : 'Category (Optional)'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'إلكترونيات، منسوجات...' : 'Electronics, Textiles...'}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 border-gray-300 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full h-12 bg-[#1e3a5f] hover:bg-[#152944] text-white font-bold text-lg shadow-lg transition-all"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin me-3" />
                    {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 me-3" />
                    {language === 'ar' ? 'بدء التحقيق الذكي' : 'Start AI Investigation'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mt-12 pb-20">
          {isSearching ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#1e3a5f] mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                {language === 'ar' ? 'نقوم الآن بتحليل بيانات المصانع والتحقق من التراخيص...' : 'Analyzing factory data and verifying licenses...'}
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-[#1e3a5f] border-b pb-4">
                {language === 'ar' ? 'نتائج التحقيق' : 'Investigation Results'}
              </h2>
              <div className="grid gap-6">
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 shadow-md ${
                      result.isDirectFactory ? 'border-l-green-500' : 'border-l-amber-500'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {result.isDirectFactory ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                          )}
                          <CardTitle className="text-xl text-[#1e3a5f]">{result.name}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            result.isDirectFactory ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {result.isDirectFactory 
                              ? (language === 'ar' ? 'مصنع مباشر' : 'Direct Factory') 
                              : (language === 'ar' ? 'مورد/وسيط' : 'Supplier/Agent')}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            {language === 'ar' ? `ثقة: ${result.confidence}%` : `Confidence: ${result.confidence}%`}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {result.reasoning}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {recommendations.length > 0 && (
                <Card className="bg-blue-50 border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {language === 'ar' ? 'توصيات الخبير الذكي' : 'AI Expert Recommendations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-blue-800">
                      {recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'ar' ? 'لم نجد نتائج مطابقة لبحثك في قاعدة البيانات الحالية' : 'No matching results found in our current database'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Search, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

export default function AISearch() {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchMutation = trpc.aiAgent.searchFactories.useMutation({
    onSuccess: data => {
      setSearchResults(data.results || []);
      setIsSearching(false);
    },
    onError: error => {
      console.error("Search API Error:", error);
      setError("Failed to fetch results");
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

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-blue-900">
                  <BackArrow className="w-4 h-4" />
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
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
                  {language === 'ar' ? 'السوق' : 'Marketplace'}
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
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'محقق IFROF الذكي للمصانع' : 'IFROF AI Factory Investigator'}
          </h1>
          <p className="text-lg text-blue-100">
            {language === 'ar' 
              ? 'ابحث عن أي مصنع في الصين وسنتحقق منه بالذكاء الاصطناعي'
              : 'Search for any factory in China and we will verify it with AI'}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'ماذا تبحث عن؟' : 'What are you looking for?'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'مثال: مصنع نسيج في قوانغتشو' : 'Example: Textile factory in Guangzhou'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-14 border-gray-200"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="w-full h-14 bg-blue-900 hover:bg-blue-950 text-white"
                  >
                    {isSearching ? (
                      <><Loader2 className="w-4 h-4 animate-spin me-2" />{language === 'ar' ? 'جاري البحث...' : 'Searching...'}</>
                    ) : (
                      <><Search className="w-4 h-4 me-2" />{language === 'ar' ? 'بحث' : 'Search'}</>
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
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
            </h2>
            <div className="grid gap-6">
              {searchResults.map((result, index) => (
                <Card key={index} className={`border-2 ${result.isDirectFactory ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {result.isDirectFactory ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{result.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && searchQuery && (
          <div className="mt-12 text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
            </p>
          </div>
        )}

        {/* Initial State */}
        {!isSearching && searchResults.length === 0 && !searchQuery && (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                title: language === 'ar' ? 'ابحث بسهولة' : 'Search Easily',
                desc: language === 'ar' ? 'أدخل ما تبحث عنه والذكاء الاصطناعي سيجد أفضل المصانع المباشرة' : 'Enter what you are looking for and AI will find the best direct factories',
                icon: Search,
              },
              {
                title: language === 'ar' ? 'تحقق موثوق' : 'Verified Verification',
                desc: language === 'ar' ? 'نتأكد من أن المصنع مباشر وليس وسيط أو شركة تجارية' : 'We ensure the factory is direct, not an intermediary or trading company',
                icon: CheckCircle,
              },
              {
                title: language === 'ar' ? 'دعم متكامل' : 'Full Support',
                desc: language === 'ar' ? 'نحن نساعدك في التواصل مع المصانع الصينية' : 'We help you communicate with Chinese factories',
                icon: ArrowRight,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-8 h-8 text-blue-900 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

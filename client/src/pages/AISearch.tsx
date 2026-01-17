import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Search, Loader2, ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AISearch() {
  const { t, language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const searchMutation = trpc.aiAgent.searchFactories.useMutation({
    onSuccess: (data) => {
      setSearchResults(data.results);
      setRecommendations(data.recommendations);
      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false);
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    searchMutation.mutate({
      query: searchQuery,
      language: language as 'ar' | 'en',
      category: category || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('aiAgent.title')}</h1>
          <p className="text-lg text-blue-100">{t('aiAgent.subtitle')}</p>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </label>
                  <Input
                    placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full"
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
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  {language === 'ar' ? 'نصائح مهمة' : 'Important Tips'}
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-3 text-gray-700">
                      <span className="text-blue-900 font-bold">{index + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && searchQuery && (
          <div className="mt-12 text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">{t('aiAgent.noResults')}</p>
          </div>
        )}

        {/* Initial State */}
        {!isSearching && searchResults.length === 0 && !searchQuery && (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                title: language === 'ar' ? 'ابحث بسهولة' : 'Search Easily',
                desc: language === 'ar'
                  ? 'أدخل ما تبحث عنه والذكاء الاصطناعي سيجد أفضل المصانع المباشرة'
                  : 'Enter what you are looking for and AI will find the best direct factories',
                icon: Search,
              },
              {
                title: language === 'ar' ? 'تحقق موثوق' : 'Verified Verification',
                desc: language === 'ar'
                  ? 'نتأكد من أن المصنع مباشر وليس وسيط أو شركة تجارية'
                  : 'We ensure the factory is direct, not an intermediary or trading company',
                icon: CheckCircle,
              },
              {
                title: language === 'ar' ? 'احصل على نصائح' : 'Get Tips',
                desc: language === 'ar'
                  ? 'احصل على نصائح قيمة للعثور على أفضل المصانع'
                  : 'Get valuable tips for finding the best factories',
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

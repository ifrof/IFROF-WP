import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, Filter, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LazyImage } from "@/components/LazyImage";
import { Link } from "wouter";
import MetaTags from "../components/SEO/MetaTags";
import { staticPagesSEO } from "../../../server/config/seo-config";

export default function ProductSearch() {
  const { language, dir } = useLanguage();
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    moq: "",
    location: "",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: products, isLoading } = trpc.products.search.useQuery({
    query: filters.query || undefined,
    category: filters.category === "all" ? undefined : filters.category,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    moq: filters.moq ? Number(filters.moq) : undefined,
    location: filters.location || undefined,
  });

  const categories = ["Electronics", "Clothing", "Home", "Industrial", "Food"];

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <MetaTags seo={staticPagesSEO['/search']} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {language === 'ar' ? 'تصفية النتائج' : 'Filters'}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {language === 'ar' ? 'تصفية النتائج' : 'Filters'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <Select 
                    value={filters.category} 
                    onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'السعر الأدنى ($)' : 'Min Price ($)'}
                  </label>
                  <Input 
                    type="number" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'السعر الأعلى ($)' : 'Max Price ($)'}
                  </label>
                  <Input 
                    type="number" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'الحد الأدنى للطلب' : 'MOQ'}
                  </label>
                  <Input 
                    type="number" 
                    value={filters.moq}
                    onChange={(e) => setFilters(f => ({ ...f, moq: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'ar' ? 'الموقع' : 'Location'}
                  </label>
                  <Input 
                    value={filters.location}
                    onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Guangzhou"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  className="pl-10"
                  placeholder={language === 'ar' ? 'ابحث عن منتجات...' : 'Search products...'}
                  value={filters.query}
                  onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      {product.imageUrls && (
                        <LazyImage 
                          src={typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls)[0] : product.imageUrls[0]} 
                          alt={product.nameEn}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">
                        {language === 'ar' ? product.nameAr : product.nameEn}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-400">{language === 'ar' ? 'يبدأ من' : 'Starts from'}</p>
                          <p className="text-xl font-bold text-blue-600">${(product.minPrice / 100).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">{language === 'ar' ? 'أقل كمية' : 'MOQ'}</p>
                          <p className="font-medium">{product.minimumOrderQuantity}</p>
                        </div>
                      </div>
                      <Link href={`/import-request?productId=${product.id}`}>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                          {language === 'ar' ? 'طلب استيراد' : 'Import Request'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <p className="text-gray-500">
                  {language === 'ar' ? 'لا توجد نتائج تطابق بحثك' : 'No products found matching your criteria'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

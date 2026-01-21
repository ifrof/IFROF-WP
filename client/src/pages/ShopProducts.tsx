import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Search,
  ShoppingCart,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LazyImage } from "@/components/LazyImage";

const PRODUCTS_PER_PAGE = 20;

// Loading skeleton component
function ProductSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </CardContent>
    </Card>
  );
}

export default function ShopProducts() {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFactory, setSelectedFactory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Fetch all products
  const { data: allProducts = [], isLoading: productsLoading } = trpc.products.getAll.useQuery();

  // Fetch factories for filter
  const { data: factories = [] } = trpc.factories.list.useQuery();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p: any) => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [allProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product: any) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      const matchesFactory = !selectedFactory || product.factoryId === parseInt(selectedFactory);

      const matchesPrice =
        product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesFactory && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a: any, b: any) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a: any, b: any) => b.basePrice - a.basePrice);
        break;
      case "newest":
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "popular":
        filtered.sort((a: any, b: any) => (b.featured || 0) - (a.featured || 0));
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, selectedFactory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedFactory("");
    setPriceRange([0, 50000]);
    setSortBy("newest");
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IF</span>
                </div>
                <span className="font-bold text-lg text-[#1e3a5f]">IFROF</span>
              </div>
            </Link>
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={language === "ar" ? "ابحث عن المنتجات..." : "Search products..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            {language === "ar" ? "متجر المنتجات" : "Shop Products"}
          </h1>
          <p className="text-blue-100">
            {language === "ar"
              ? "اكتشف آلاف المنتجات من أفضل المصنعين"
              : "Discover thousands of products from top manufacturers"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {language === "ar" ? "الفلاتر" : "Filters"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs"
                >
                  {language === "ar" ? "إعادة تعيين" : "Reset"}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {language === "ar" ? "الفئة" : "Category"}
                  </label>
                  <Select value={selectedCategory} onValueChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "ar" ? "اختر فئة" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {language === "ar" ? "جميع الفئات" : "All Categories"}
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Factory Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {language === "ar" ? "المصنع" : "Manufacturer"}
                  </label>
                  <Select value={selectedFactory} onValueChange={(value) => {
                    setSelectedFactory(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "ar" ? "اختر مصنع" : "Select manufacturer"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {language === "ar" ? "جميع المصانع" : "All Manufacturers"}
                      </SelectItem>
                      {(factories || []).map((factory: any) => (
                        <SelectItem key={factory.id?.toString()} value={factory.id?.toString() || ""}>
                          {factory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-4">
                    {language === "ar" ? "نطاق السعر" : "Price Range"}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value as [number, number]);
                      setCurrentPage(1);
                    }}
                    min={0}
                    max={50000}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>¥{priceRange[0].toLocaleString()}</span>
                    <span>¥{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {language === "ar" ? "ترتيب حسب" : "Sort By"}
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        {language === "ar" ? "الأحدث" : "Newest"}
                      </SelectItem>
                      <SelectItem value="price-low">
                        {language === "ar" ? "السعر: الأقل أولاً" : "Price: Low to High"}
                      </SelectItem>
                      <SelectItem value="price-high">
                        {language === "ar" ? "السعر: الأعلى أولاً" : "Price: High to Low"}
                      </SelectItem>
                      <SelectItem value="popular">
                        {language === "ar" ? "الأكثر شهرة" : "Most Popular"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {language === "ar" ? "المنتجات" : "Products"}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredProducts.length === 0
                    ? language === "ar"
                      ? "لم يتم العثور على منتجات"
                      : "No products found"
                    : `${filteredProducts.length} ${language === "ar" ? "منتج" : "products"}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                {language === "ar" ? "الفلاتر" : "Filters"}
              </Button>
            </div>

            {/* Empty State */}
            {!productsLoading && filteredProducts.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="pt-12 text-center pb-12">
                  <div className="text-gray-400 mb-4">
                    <ShoppingCart className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {language === "ar" ? "لم يتم العثور على منتجات" : "No products found"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === "ar"
                      ? "حاول تغيير معايير البحث أو الفلاتر"
                      : "Try adjusting your search or filters"}
                  </p>
                  <Button onClick={handleResetFilters}>
                    {language === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsLoading
                ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                : paginatedProducts.map((product: any) => {
                    const factory = factories.find((f: any) => f.id === product.factoryId);
                    const images = product.imageUrls
                      ? JSON.parse(product.imageUrls)
                      : [];
                    const mainImage = images[0] || "https://via.placeholder.com/400";

                    return (
                      <Link key={product.id} href={`/products/${product.id}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            <LazyImage
                              src={mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <CardContent className="p-4">
                            {/* Category Badge */}
                            {product.category && (
                              <Badge variant="outline" className="mb-2">
                                {product.category}
                              </Badge>
                            )}

                            {/* Product Name */}
                            <h3 className="font-semibold line-clamp-2 mb-2">
                              {product.name}
                            </h3>

                            {/* Factory Info */}
                            {factory && (
                              <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">{factory.name}</span>
                              </div>
                            )}

                            {/* Rating */}
                            {factory?.rating && (
                              <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < (factory.rating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-600">
                                  ({factory.rating})
                                </span>
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-lg font-bold text-blue-600">
                                ¥{product.basePrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {language === "ar" ? "الحد الأدنى" : "min"}: {product.minimumOrderQuantity}
                              </span>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                // Will be handled in Phase 3
                                toast.info(language === "ar" ? "انتقل إلى صفحة المنتج" : "Go to product page");
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {language === "ar" ? "أضف للسلة" : "Add to Cart"}
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center text-sm text-gray-600 mt-4">
                {language === "ar"
                  ? `الصفحة ${currentPage} من ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

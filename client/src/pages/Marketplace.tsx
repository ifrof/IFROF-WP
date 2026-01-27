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
import { Loader2, MapPin, Phone, Mail, Search, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Marketplace() {
  const { language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);

  const { data: factories, isLoading: factoriesLoading } =
    trpc.factories.list.useQuery();
  const { data: products, isLoading: productsLoading } =
    trpc.products.getByFactory.useQuery(
      { factoryId: selectedFactory || 0 },
      { enabled: !!selectedFactory }
    );

  const filteredFactories =
    factories?.filter(
      (factory: any) =>
        factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.location?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft;

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
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
              <Link href="/ai-search">
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'محقق المصانع' : 'Factory Investigator'}
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'سوق المصانع' : 'Factory Marketplace'}
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            {language === 'ar' 
              ? 'تواصل مباشرة مع المصنعين والموردين حول العالم'
              : 'Connect directly with manufacturers and suppliers worldwide'}
          </p>
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder={language === 'ar' 
                ? 'ابحث عن المصانع بالاسم أو الموقع...'
                : 'Search factories by name or location...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white text-black"
            />
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Factories List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'المصانع' : 'Factories'}
            </h2>
            
            {factoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFactories.length > 0 ? (
              <div className="space-y-3">
                {filteredFactories.map((factory: any) => (
                  <Card
                    key={factory.id}
                    className={`cursor-pointer transition-all ${
                      selectedFactory === factory.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedFactory(factory.id)}
                  >
                    <CardHeader className="pb-3">
                      {factory.logoUrl && (
                        <img
                          src={factory.logoUrl}
                          alt={factory.name}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                      )}
                      <CardTitle className="text-lg">{factory.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {factory.location || (language === 'ar' ? 'الموقع غير محدد' : 'Location not specified')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      {factory.contactEmail && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">
                            {factory.contactEmail}
                          </span>
                        </div>
                      )}
                      {factory.contactPhone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {factory.contactPhone}
                        </div>
                      )}
                      {factory.verificationStatus === "verified" && (
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded w-fit">
                          ✓ {language === 'ar' ? 'موثق' : 'Verified'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {language === 'ar' ? 'لم يتم العثور على مصانع' : 'No factories found'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Products Display */}
          <div className="lg:col-span-2">
            {selectedFactory ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'المنتجات' : 'Products'}
                </h2>
                
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product: any) => (
                      <Card
                        key={product.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        {product.imageUrls && (
                          <div className="w-full h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                            {typeof product.imageUrls === "string" &&
                            product.imageUrls.startsWith("[") ? (
                              <LazyImage
                                src={JSON.parse(product.imageUrls)[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <span className="text-gray-400">
                                  {language === 'ar' ? 'لا توجد صورة' : 'No image'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {product.name}
                          </CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {language === 'ar' ? 'السعر' : 'Price'}
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                ${(product.basePrice / 100).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {language === 'ar' ? 'الحد الأدنى' : 'MOQ'}
                              </p>
                              <p className="text-xl font-semibold">{product.minimumOrderQuantity}</p>
                            </div>
                          </div>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            {language === 'ar' ? 'إرسال استفسار' : 'Send Inquiry'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        {language === 'ar' 
                          ? 'لا توجد منتجات متاحة لهذا المصنع'
                          : 'No products available for this factory'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {language === 'ar' 
                      ? 'اختر مصنعاً لعرض منتجاته'
                      : 'Select a factory to view its products'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

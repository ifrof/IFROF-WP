
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, ShieldCheck, Award, Package, Star, Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { Link } from "wouter";

export default function FactoryPublicProfile() {
  const { id } = useParams();
  const { language, dir } = useLanguage();
  
  // In a real app, we'd have a getById query for factories
  const { data: factories, isLoading } = trpc.factories.list.useQuery();
  const factory = factories?.find((f: any) => f.id === Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!factory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{language === 'ar' ? 'المصنع غير موجود' : 'Factory Not Found'}</h1>
        <Link href="/factories">
          <Button>{language === 'ar' ? 'العودة للقائمة' : 'Back to Listings'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12" dir={dir}>
      {/* Banner */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        {factory.bannerUrl ? (
          <img src={factory.bannerUrl} alt={factory.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-700" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="p-6 text-center bg-white">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-md p-2 mx-auto -mt-20 mb-4 border overflow-hidden">
                  {factory.logoUrl ? (
                    <img src={factory.logoUrl} alt={factory.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Award className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{factory.name}</h1>
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{factory.location || (language === 'ar' ? 'الصين' : 'China')}</span>
                </div>
                
                {factory.verificationStatus === 'verified' && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-4 py-1.5 mb-6">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    {language === 'ar' ? 'مصنع موثق' : 'Verified Factory'}
                  </Badge>
                )}

                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'التقييم' : 'Rating'}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{factory.rating || 4.8}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'الاستجابة' : 'Response'}</p>
                    <span className="font-bold">{factory.responseTime || '< 24h'}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 bg-gray-50 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{factory.contactEmail || 'contact@factory.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{factory.contactPhone || '+86 123 4567 890'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">www.factory-website.com</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                  {language === 'ar' ? 'تواصل مع المصنع' : 'Contact Factory'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'الشهادات' : 'Certifications'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['ISO 9001', 'CE Certified', 'SGS Verified'].map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    {cert}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'عن المصنع' : 'About Factory'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {factory.description || (language === 'ar' 
                    ? 'هذا المصنع متخصص في إنتاج وتوريد المنتجات عالية الجودة للأسواق العالمية. نلتزم بأعلى معايير التصنيع والجودة.' 
                    : 'This factory specializes in the production and supply of high-quality products for global markets. We are committed to the highest standards of manufacturing and quality.')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium mb-1">{language === 'ar' ? 'القدرة الإنتاجية' : 'Production Capacity'}</p>
                    <p className="font-bold">{factory.productionCapacity || '50,000 units/month'}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium mb-1">{language === 'ar' ? 'أقل كمية طلب' : 'Minimum Order (MOQ)'}</p>
                    <p className="font-bold">{factory.minimumOrderQuantity || 500} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'منتجات المصنع' : 'Factory Products'}
                </h2>
                <Link href={`/marketplace?factory=${factory.id}`}>
                  <Button variant="link" className="text-blue-600">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Mock products for the skeleton */}
                {[1, 2].map((p) => (
                  <Card key={p} className="overflow-hidden hover:shadow-md transition-shadow border-none shadow-sm">
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Package className="w-12 h-12" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2">Sample Product {p}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">$10.00 - $15.00</span>
                        <Badge variant="outline">MOQ: 100</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

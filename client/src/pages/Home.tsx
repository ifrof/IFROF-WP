import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Zap, 
  CheckCircle, 
  Factory, 
  Globe, 
  TrendingUp,
  Users,
  Package,
  Star,
  BadgeCheck,
  Truck,
  DollarSign,
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import MetaTags from "../components/SEO/MetaTags";
import OrganizationSchema from "../components/SEO/OrganizationSchema";
import BreadcrumbSchema from "../components/SEO/BreadcrumbSchema";
import { staticPagesSEO } from "../../../server/config/seo-config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { language, t, dir } = useLanguage();
  const safeT = t || ((key: string) => key);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const features = [
    {
      icon: Shield,
      title: language === "ar" ? "مصانع موثوقة" : "Verified Factories",
      desc: language === "ar" ? "نتحقق من كل مصنع لضمان الجودة والموثوقية." : "We verify every factory to ensure quality and reliability.",
    },
    {
      icon: Zap,
      title: language === "ar" ? "استيراد سريع" : "Fast Import",
      desc: language === "ar" ? "عملية استيراد مبسطة توفر وقتك وجهدك." : "Simplified import process that saves your time and effort.",
    },
    {
      icon: DollarSign,
      title: language === "ar" ? "أفضل الأسعار" : "Best Prices",
      desc: language === "ar" ? "احصل على أسعار المصنع مباشرة بدون وسطاء." : "Get factory prices directly without intermediaries.",
    },
    {
      icon: Truck,
      title: language === "ar" ? "شحن آمن" : "Secure Shipping",
      desc: language === "ar" ? "حلول شحن متكاملة تضمن وصول بضائعك بسلام." : "Integrated shipping solutions ensuring your goods arrive safely.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <MetaTags seo={staticPagesSEO['/']} />
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://ifrof.com' }]} />
      
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow ${scrolled ? 'shadow-lg' : 'shadow-sm'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IF</span>
              </div>
              <div>
                <span className="font-bold text-xl text-primary">IFROF</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'السوق' : 'Marketplace'}
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'المدونة' : 'Blog'}
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'اتصل بنا' : 'Contact'}
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              
              {!isAuthenticated ? (
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex">
                    {safeT('nav.login')}
                  </Button>
                </Link>
              ) : (
                <Link href={user?.role === 'factory' ? '/dashboard/factory' : '/dashboard/buyer'}>
                  <Button variant="ghost" className="hidden sm:flex">
                    {safeT('nav.dashboard')}
                  </Button>
                </Link>
              )}

              <Link href="/import-request">
                <Button className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-semibold shadow-lg shadow-orange-200/20">
                  {safeT('nav.startImport')}
                </Button>
              </Link>

              <button 
                className="md:hidden p-2 text-muted-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2a4a6f] to-[#1e3a5f] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <BadgeCheck className="w-5 h-5 text-[#ff8c42]" />
              <span className="text-sm font-medium">{safeT('hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {safeT('hero.title')}
              <span className="block text-[#ff8c42] mt-2">{safeT('hero.titleHighlight')}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {safeT('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/import-request">
                <Button size="lg" className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-bold px-8 py-6 text-lg shadow-xl shadow-orange-500/30 w-full sm:w-auto">
                  {safeT('hero.cta')}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto bg-transparent">
                  {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff8c42] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "لماذا تختار IFROF؟" : "Why Choose IFROF?"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "ar" 
                ? "نحن نوفر لك كل ما تحتاجه لنجاح عملية الاستيراد من الصين بكل أمان وسهولة." 
                : "We provide everything you need for a safe and easy import process from China."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
                <CardContent className="pt-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "ماذا يقول عملاؤنا" : "What Our Clients Say"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-background border-dashed border-2">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Star className="w-8 h-8 mx-auto mb-4 opacity-20" />
                  <p>{language === "ar" ? "سيتم إضافة التقييمات قريباً" : "Testimonials coming soon"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IF</span>
            </div>
            <span className="font-bold text-lg">IFROF</span>
          </div>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            {language === "ar" 
              ? "المنصة الرائدة لربط المشترين العالميين بالمصانع الصينية الموثوقة." 
              : "The leading platform connecting global buyers with verified Chinese manufacturers."}
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium mb-8">
            <Link href="/about" className="hover:text-primary">{language === "ar" ? "عن المنصة" : "About"}</Link>
            <Link href="/terms" className="hover:text-primary">{language === "ar" ? "الشروط" : "Terms"}</Link>
            <Link href="/privacy" className="hover:text-primary">{language === "ar" ? "الخصوصية" : "Privacy"}</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IFROF. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

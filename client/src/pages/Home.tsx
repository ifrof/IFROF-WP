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
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <nav className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow ${scrolled ? 'shadow-lg' : 'shadow-sm'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IF</span>
              </div>
              <span className="font-bold text-xl text-primary">IFROF</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'السوق' : 'Marketplace'}
              </Link>
              <Link href="/find-factory" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'ابحث عن المصنع الحقيقي' : 'Find Real Factory'}
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'المدونة' : 'Blog'}
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                {language === 'ar' ? 'اتصل بنا' : 'Contact'}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              
              {!isAuthenticated ? (
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex">
                    {language === 'ar' ? 'دخول' : 'Login'}
                  </Button>
                </Link>
              ) : (
                <Link href={user?.role === 'admin' ? '/admin' : (user?.role === 'factory' ? '/my-factory' : '/buyer')}>
                  <Button variant="ghost" className="hidden sm:flex">
                    {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </Button>
                </Link>
              )}

              <Link href="/import-request">
                <Button className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-semibold">
                  {language === 'ar' ? 'ابدأ الاستيراد' : 'Start Import'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-[#1e3a5f] text-white py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'ar' ? 'تجاوز الوسطاء تماماً' : 'Kill the Middleman'}
            <span className="block text-[#ff8c42] mt-2">
              {language === 'ar' ? 'استورد من المصنع الحقيقي مباشرة' : 'Direct from Real Factories'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            {language === 'ar' 
              ? 'لا وسيط يسحب 40% من أرباحك. نربطك مباشرة بالمصانع الصينية الحقيقية لضمان أقل سعر وأعلى جودة.'
              : 'No 40% middleman cuts. We connect you directly with real Chinese factories for the lowest prices and highest quality.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-factory">
              <Button size="lg" className="bg-[#ff8c42] hover:bg-[#e67a35] text-white px-8 py-6 text-lg">
                {language === 'ar' ? 'ابحث عن المصنع الحقيقي الآن' : 'Find Real Factory Now'}
                <Arrow className="w-5 h-5 ms-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

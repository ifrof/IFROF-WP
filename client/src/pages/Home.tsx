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
  Mail,
  Phone,
  MapPin,
  Star,
  BadgeCheck,
  Bot,
  Lock,
  Truck,
  DollarSign,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

/**
 * IFROF Landing Page
 * B2B Direct Import from Verified Chinese Manufacturers
 * Design: Modern Industrial Elegance
 * Colors: Navy Blue (#1e3a5f) + Warm Orange (#ff8c42)
 */

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const homeSEO = {
    title: "IFROF - Verified Chinese Manufacturers & Suppliers",
    titleAr: "IFROF - مصانع وموردين صينيين موثقين",
    description:
      "Connect with verified Chinese manufacturers and suppliers. Find factories, products, and services with confidence.",
    descriptionAr:
      "تواصل مع مصانع وموردين صينيين موثقين. ابحث عن المصانع والمنتجات والخدمات بكل ثقة.",
    keywords: [
      "Chinese manufacturers",
      "verified suppliers",
      "factory verification",
      "B2B marketplace",
    ],
    keywordsAr: [
      "مصانع صينية",
      "موردين موثقين",
      "التحقق من المصانع",
      "سوق B2B",
    ],
    ogImage: "https://ifrof.com/og-image.png",
    canonical: "https://ifrof.com/",
    structuredData: generateStructuredData("Organization", {}),
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <MetaTags seo={homeSEO} />
      <nav
        className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"} border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg"
                role="img"
                aria-label="IFROF Logo"
              >
                <span className="text-white font-bold text-lg">IF</span>
              </div>
              <div>
                <span className="font-bold text-xl text-[#1e3a5f]">IFROF</span>
                <p className="text-xs text-gray-500 -mt-1">{t('platform.tagline')}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/factory-investigator"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {language === "ar"
                  ? "Factory Investigator"
                  : "Factory Investigator"}
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {language === "ar" ? "المدونة" : "Blog"}
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {language === "ar" ? "اتصل بنا" : "Contact"}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />

              {!isAuthenticated ? (
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex">
                    {language === "ar" ? "دخول" : "Login"}
                  </Button>
                </Link>
              ) : (
                <Link
                  href={
                    user?.role === "admin"
                      ? "/admin"
                      : user?.role === "factory"
                        ? "/my-factory"
                        : "/buyer"
                  }
                >
                  <Button variant="ghost" className="hidden sm:flex">
                    {language === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Button>
                </Link>
              )}

              {/* CTA Button */}
              <Link href="/import-request">
                <Button className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-semibold">
                  {language === "ar" ? "ابدأ الاستيراد" : "Start Import"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-[#1e3a5f] text-white py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'ar' ? 'استورد مباشرة من المصنع' : 'Import Directly from Factories'}
            <span className="block text-[#ff8c42] mt-2">
              {language === 'ar' ? 'بدون وسطاء - أفضل الأسعار والجودة' : 'No Middlemen - Best Prices & Quality'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            {language === "ar"
              ? "لا وسيط يسحب 40% من أرباحك. نربطك مباشرة بالمصانع الصينية الحقيقية لضمان أقل سعر وأعلى جودة."
              : "No 40% middleman cuts. We connect you directly with real Chinese factories for the lowest prices and highest quality."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-search">
              <Button
                size="lg"
                className="bg-[#ff8c42] hover:bg-[#e67a35] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                {language === "ar"
                  ? "ابحث عن المصنع الحقيقي"
                  : "Find Real Factory"}
                <Arrow className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 py-6 text-lg font-bold rounded-xl backdrop-blur-sm transition-all"
              >
                {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Verification System */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
                {t('verification.howWeVerify')}
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                {language === 'ar'
                  ? 'نستخدم الذكاء الاصطناعي والتحقق اليدوي لضمان أن كل مصنع على منصتنا هو مصنع مباشر وليس وسيط.'
                  : 'We use AI and manual verification to ensure every manufacturer on our platform is a direct factory, not an intermediary.'
                }
              </p>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: t('verification.steps.documents') },
                  { icon: Factory, text: t('verification.steps.factory') },
                  { icon: Bot, text: t('verification.steps.ai') },
                  { icon: Star, text: t('verification.steps.history') },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BadgeCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                  {t('manufacturer.badge')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar'
                    ? 'هذا المصنع تم التحقق منه بواسطة فريق IFROF'
                    : 'This manufacturer has been verified by the IFROF team'
                  }
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#1e3a5f]">95%</div>
                    <div className="text-xs text-gray-500">{t('verification.confidence')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-xs text-gray-500">{t('manufacturer.direct')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ff8c42]">4.8</div>
                    <div className="text-xs text-gray-500">{t('manufacturer.rating')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-gray-600 text-lg">{t('pricing.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: t('pricing.free'),
                price: language === 'ar' ? 'مجاني' : 'Free',
                desc: t('pricing.freeDesc'),
                icon: Users,
                highlight: false,
              },
              {
                title: t('pricing.commission'),
                price: t('pricing.commissionRate'),
                desc: t('pricing.commissionDesc'),
                icon: DollarSign,
                highlight: true,
              },
              {
                title: t('pricing.verification'),
                price: t('pricing.verificationFee'),
                desc: t('pricing.verificationDesc'),
                icon: BadgeCheck,
                highlight: false,
              },
              {
                title: t('pricing.premium'),
                price: t('pricing.premiumFee'),
                desc: t('pricing.premiumDesc'),
                icon: Star,
                highlight: false,
              },
            ].map((item, index) => (
              <Card key={index} className={`text-center p-6 ${item.highlight ? 'shadow-xl' : ''}`}>
                <CardContent className="pt-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${item.highlight ? 'bg-[#ff8c42]' : 'bg-gray-100'}`}>
                    <item.icon className={`w-7 h-7 ${item.highlight ? 'text-white' : 'text-[#1e3a5f]'}`} />
                  </div>
                  <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{item.title}</h3>
                  <div className={`text-3xl font-bold mb-2 ${item.highlight ? 'text-[#ff8c42]' : 'text-[#1e3a5f]'}`}>
                    {item.price}
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              {t('support.title')}
            </h2>
            <p className="text-gray-600 text-lg">{t('support.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('support.general.title'),
                email: 'support@ifrof.com',
                desc: t('support.general.desc'),
                icon: Mail,
                color: 'blue',
              },
              {
                title: t('support.complaints.title'),
                email: 'complain@ifrof.com',
                desc: t('support.complaints.desc'),
                icon: MessageCircle,
                color: 'orange',
              },
              {
                title: t('support.disputes.title'),
                email: 'dispute@ifrof.com',
                desc: t('support.disputes.desc'),
                icon: Shield,
                color: 'red',
              },
            ].map((item, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    item.color === 'blue' ? 'bg-blue-100' :
                    item.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <item.icon className={`w-8 h-8 ${
                      item.color === 'blue' ? 'text-blue-600' :
                      item.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{item.title}</h3>
                  <a href={`mailto:${item.email}`} className="text-[#ff8c42] font-semibold hover:underline block mb-2">
                    {item.email}
                  </a>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500">{t('support.responseTime')}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'ar' 
              ? 'جاهز للاستيراد المباشر من الصين؟'
              : 'Ready to Import Directly from China?'
            }
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            {language === 'ar'
              ? 'ابدأ طلب الاستيراد الآن وتواصل مباشرة مع المصانع الصينية الموثقة'
              : 'Start your import request now and connect directly with verified Chinese manufacturers'
            }
          </p>
          <Link href="/import-request">
            <Button size="lg" className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-bold px-10 py-6 text-lg shadow-xl">
              {t('hero.cta')}
              <Arrow className="w-5 h-5 ms-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-[#1e3a5f] font-bold text-lg">IF</span>
                </div>
                <span className="font-bold text-xl">IFROF</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                {t('footer.description')}
              </p>
              <p className="text-sm text-gray-500">{t('footer.madeWith')}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">{t('nav.support')}</a></li>
                <li><Link href="/ai-search" className="hover:text-white transition-colors">{t('nav.smartAssistant')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@ifrof.com" className="hover:text-white transition-colors">support@ifrof.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:complain@ifrof.com" className="hover:text-white transition-colors">complain@ifrof.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:dispute@ifrof.com" className="hover:text-white transition-colors">dispute@ifrof.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.refund')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

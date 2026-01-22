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
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import MetaTags from "../components/SEO/MetaTags";
import OrganizationSchema from "../components/SEO/OrganizationSchema";
import BreadcrumbSchema from "../components/SEO/BreadcrumbSchema";
import { staticPagesSEO } from "../../../server/config/seo-config";

/**
 * IFROF Landing Page
 * B2B Direct Import from Verified Chinese Manufacturers
 * Design: Modern Industrial Elegance
 * Colors: Navy Blue (#1e3a5f) + Warm Orange (#ff8c42)
 */

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  // Ensure t is defined even if context fails for some reason
  const safeT = t || ((key: string) => key);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <MetaTags seo={staticPagesSEO['/']} />
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://ifrof.com' }]} />
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow ${scrolled ? 'shadow-lg' : 'shadow-sm'} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IF</span>
              </div>
              <div>
                <span className="font-bold text-xl text-[#1e3a5f]">IFROF</span>
                <p className="text-xs text-gray-500 -mt-1">{safeT('platform.tagline')}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1e3a5f] transition-colors text-sm font-medium">
                {safeT('nav.howItWorks')}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-[#1e3a5f] transition-colors text-sm font-medium">
                {safeT('nav.pricing')}
              </a>
              <Link href="/blog" className="text-gray-600 hover:text-[#1e3a5f] transition-colors text-sm font-medium">
                {language === 'ar' ? 'المدونة' : 'Blog'}
              </Link>
              <a href="#support" className="text-gray-600 hover:text-[#1e3a5f] transition-colors text-sm font-medium">
                {safeT('nav.support')}
              </a>
              <Link href="/factory-investigator" className="text-gray-600 hover:text-[#1e3a5f] transition-colors text-sm font-medium">
                {language === 'ar' ? 'المحقق الذكي' : 'AI Investigator'}
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'ar' ? 'عربي' : language === 'zh' ? '中文' : 'EN'}
                </button>
                <div className="absolute top-full mt-1 end-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`w-full px-4 py-2 text-start text-sm hover:bg-gray-100 ${language === 'ar' ? 'text-[#ff8c42] font-semibold' : 'text-gray-700'}`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full px-4 py-2 text-start text-sm hover:bg-gray-100 ${language === 'en' ? 'text-[#ff8c42] font-semibold' : 'text-gray-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('zh')}
                    className={`w-full px-4 py-2 text-start text-sm hover:bg-gray-100 ${language === 'zh' ? 'text-[#ff8c42] font-semibold' : 'text-gray-700'}`}
                  >
                    中文
                  </button>
                </div>
              </div>

              {/* Login Button */}
              {!isAuthenticated ? (
                <Link href="/login">
                  <Button variant="ghost" className="text-[#1e3a5f] font-medium">
                    {safeT('nav.login')}
                  </Button>
                </Link>
              ) : (
                <Link href={user?.role === 'factory' ? '/dashboard/factory' : '/dashboard/buyer'}>
                  <Button variant="ghost" className="text-[#1e3a5f] font-medium">
                    {safeT('nav.dashboard')}
                  </Button>
                </Link>
              )}

              {/* CTA Button */}
              <Link href="/import-request">
                <Button className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-semibold px-6 shadow-lg shadow-orange-200">
                  {safeT('nav.startImport')}
                  <Arrow className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2a4a6f] to-[#1e3a5f] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <BadgeCheck className="w-5 h-5 text-[#ff8c42]" />
              <span className="text-sm font-medium">{safeT('hero.badge')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {safeT('hero.title')}
              <span className="block text-[#ff8c42] mt-2">{safeT('hero.titleHighlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {safeT('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/import-request">
                <Button size="lg" className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-bold px-8 py-6 text-lg shadow-xl shadow-orange-500/30 w-full sm:w-auto">
                  {safeT('hero.cta')}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto bg-transparent">
                  {safeT('hero.ctaSecondary')}
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: '500+', label: t('hero.stats.manufacturers'), icon: Factory },
                { value: '2,000+', label: t('hero.stats.buyers'), icon: Users },
                { value: '10,000+', label: t('hero.stats.orders'), icon: Package },
                { value: '30%', label: t('hero.stats.savings'), icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-[#ff8c42] mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clean Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { icon: Shield, label: t('trust.noMiddlemen') },
              { icon: BadgeCheck, label: t('trust.verified') },
              { icon: Bot, label: t('trust.aiPowered') },
              { icon: Lock, label: t('trust.secure') },
              { icon: MessageCircle, label: t('trust.support247') },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <item.icon className="w-5 h-5 text-[#1e3a5f]" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Banner - No Middlemen */}
      <section className="py-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">
              {language === 'ar' 
                ? '⚠️ نحن نقضي على الوسطاء! نتحقق من كل مصنع بالذكاء الاصطناعي لضمان أنه مصنع مباشر وليس تاجر أو شركة تجارية.'
                : '⚠️ We eliminate middlemen! We verify every factory with AI to ensure it\'s a direct manufacturer, not a trader or trading company.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              {safeT('howItWorks.title')}
            </h2>
            <p className="text-gray-600 text-lg">{safeT('howItWorks.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: Package, ...t('howItWorks.steps.step1') as any },
              { step: '2', icon: Bot, ...t('howItWorks.steps.step2') as any },
              { step: '3', icon: MessageCircle, ...t('howItWorks.steps.step3') as any },
              { step: '4', icon: Truck, ...t('howItWorks.steps.step4') as any },
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#ff8c42] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg text-[#1e3a5f] mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <Arrow className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/import-request">
              <Button size="lg" className="bg-[#ff8c42] hover:bg-[#e67a35] text-white font-bold px-8 shadow-lg">
                {safeT('hero.cta')}
                <Arrow className="w-5 h-5 ms-2" />
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
                {safeT('verification.howWeVerify')}
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
                  {safeT('manufacturer.badge')}
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
                    <div className="text-xs text-gray-500">{safeT('verification.confidence')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <div className="text-xs text-gray-500">{safeT('manufacturer.direct')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ff8c42]">4.8</div>
                    <div className="text-xs text-gray-500">{safeT('manufacturer.rating')}</div>
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
              {safeT('pricing.title')}
            </h2>
            <p className="text-gray-600 text-lg">{safeT('pricing.subtitle')}</p>
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
              {safeT('support.title')}
            </h2>
            <p className="text-gray-600 text-lg">{safeT('support.subtitle')}</p>
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
            <p className="text-gray-500">{safeT('support.responseTime')}</p>
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
              {safeT('hero.cta')}
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
                {safeT('footer.description')}
              </p>
              <p className="text-sm text-gray-500">{safeT('footer.madeWith')}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">{safeT('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{safeT('nav.howItWorks')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{safeT('nav.pricing')}</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">{safeT('nav.support')}</a></li>
                <li><Link href="/ai-search" className="hover:text-white transition-colors">{safeT('nav.smartAssistant')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">{safeT('footer.contact')}</h4>
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
            <p className="text-gray-500 text-sm">{safeT('footer.copyright')}</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">{safeT('footer.terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{safeT('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{safeT('footer.refund')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

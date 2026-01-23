import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Mail, ShieldCheck, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { language, dir } = useLanguage();

  return (
    <footer className="bg-card border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IF</span>
              </div>
              <span className="font-bold text-2xl text-primary">IFROF</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === "ar" 
                ? "المنصة الرائدة لربط المشترين العالميين بالمصانع الصينية الموثوقة، نضمن لك الجودة والأمان في كل خطوة." 
                : "The leading platform connecting global buyers with verified Chinese manufacturers, ensuring quality and security at every step."}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "عن المنصة" : "About Us"}</Link></li>
              <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "سوق المنتجات" : "Marketplace"}</Link></li>
              <li><Link href="/factories" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "المصانع" : "Factories"}</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "المدونة" : "Blog"}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6">{language === "ar" ? "الدعم" : "Support"}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "اتصل بنا" : "Contact Us"}</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "الشروط والأحكام" : "Terms of Service"}</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6">{language === "ar" ? "النشرة الإخبارية" : "Newsletter"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "ar" ? "اشترك للحصول على آخر التحديثات والعروض." : "Subscribe to get the latest updates and offers."}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder={language === "ar" ? "البريد الإلكتروني" : "Email address"} 
                className="bg-background"
              />
              <Button size="icon" className="shrink-0" aria-label="Subscribe">
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-b py-8 mb-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Verified Supplier</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Quality Assured</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Global Logistics</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} IFROF. {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}

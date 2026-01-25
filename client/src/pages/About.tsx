import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Users, Zap, Shield, Target } from "lucide-react";
import { Link } from "wouter";
import { BackButton } from "@/components/BackButton";

export default function About() {
  const { t, language, dir } = useLanguage();

  const values = [
    {
      icon: Globe,
      title: language === "ar" ? "النزاهة" : "Integrity",
      desc: language === "ar" ? "نحن نؤمن بالشفافية والصدق في جميع تعاملاتنا." : "We believe in transparency and honesty in all our dealings.",
    },
    {
      icon: Target,
      title: language === "ar" ? "الدقة" : "Precision",
      desc: language === "ar" ? "نحرص على تقديم معلومات دقيقة وموثوقة عن المصانع." : "We ensure providing accurate and reliable information about factories.",
    },
    {
      icon: Users,
      title: language === "ar" ? "التعاون" : "Collaboration",
      desc: language === "ar" ? "نبني جسور التواصل بين الشرق والغرب." : "We build bridges of communication between East and West.",
    },
    {
      icon: Shield,
      title: language === "ar" ? "العالمية" : "Global Reach",
      desc: language === "ar" ? "نخدم العملاء في جميع أنحاء العالم للوصول للصين." : "We serve clients worldwide to reach China.",
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <BackButton />
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === "ar" ? "عن IFROF" : "About IFROF"}
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            {language === "ar" 
              ? "IFROF هي منصة رائدة تهدف إلى تبسيط عملية الاستيراد من الصين من خلال ربط المشترين العالميين بمصانع موثوقة ومتحقق منها." 
              : "IFROF is a leading platform aimed at simplifying the import process from China by connecting global buyers with reliable and verified factories."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{language === "ar" ? "مهمتنا" : "Our Mission"}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "مهمتنا هي تمكين الشركات الصغيرة والمتوسطة من الوصول إلى قدرات التصنيع الصينية بكل سهولة وأمان، مع ضمان أعلى معايير الجودة والشفافية."
                : "Our mission is to empower small and medium enterprises to access Chinese manufacturing capabilities with ease and security, ensuring the highest standards of quality and transparency."}
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{language === "ar" ? "رؤيتنا" : "Our Vision"}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "أن نكون المنصة الأولى عالمياً في تسهيل التجارة الدولية المباشرة مع المصانع، وإزالة كافة العوائق الجغرافية واللغوية."
                : "To be the world's leading platform in facilitating direct international trade with factories, removing all geographical and linguistic barriers."}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">{language === "ar" ? "قيمنا" : "Our Values"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-none shadow-sm bg-muted/50">
                  <CardContent className="pt-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted/30 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">{language === "ar" ? "أرقامنا" : "Our Stats"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">{language === "ar" ? "مصنع موثوق" : "Verified Factories"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <p className="text-muted-foreground">{language === "ar" ? "طلب ناجح" : "Successful Orders"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">{language === "ar" ? "دولة مخدومة" : "Countries Served"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">{language === "ar" ? "دعم فني" : "Support"}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">{language === "ar" ? "ابدأ رحلتك معنا اليوم" : "Start Your Journey Today"}</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            {language === "ar" 
              ? "انضم إلى آلاف المستوردين الذين يثقون في IFROF للوصول إلى أفضل المصانع الصينية." 
              : "Join thousands of importers who trust IFROF to reach the best Chinese factories."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/factory">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50">{language === "ar" ? "تصفح السوق" : "Explore Marketplace"}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                {language === "ar" ? "اتصل بنا" : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

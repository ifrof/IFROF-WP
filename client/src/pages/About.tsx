import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Users, Zap, Shield } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Globe,
      titleKey: "about.value1.title",
      descKey: "about.value1.desc",
    },
    {
      icon: Users,
      titleKey: "about.value2.title",
      descKey: "about.value2.desc",
    },
    {
      icon: Zap,
      titleKey: "about.value3.title",
      descKey: "about.value3.desc",
    },
    {
      icon: Shield,
      titleKey: "about.value4.title",
      descKey: "about.value4.desc",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-blue-100">{t("about.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">{t("about.mission.title")}</h2>
          <p className="text-lg text-muted-foreground mb-4">{t("about.mission.desc1")}</p>
          <p className="text-lg text-muted-foreground">{t("about.mission.desc2")}</p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.values")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{t(value.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.stats")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-muted-foreground">{t("about.stat1")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-muted-foreground">{t("about.stat2")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-muted-foreground">{t("about.stat3")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-muted-foreground">{t("about.stat4")}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t("about.cta")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("about.ctaDesc")}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg">{t("about.explorePlatform")}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                {t("common.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

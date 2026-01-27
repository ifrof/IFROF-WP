import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MessageSquare, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      titleKey: "howItWorks.step1.title",
      descKey: "howItWorks.step1.desc",
    },
    {
      icon: MessageSquare,
      titleKey: "howItWorks.step2.title",
      descKey: "howItWorks.step2.desc",
    },
    {
      icon: CreditCard,
      titleKey: "howItWorks.step3.title",
      descKey: "howItWorks.step3.desc",
    },
    {
      icon: Truck,
      titleKey: "howItWorks.step4.title",
      descKey: "howItWorks.step4.desc",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t("howItWorks.title")}</h1>
          <p className="text-xl text-blue-100">{t("howItWorks.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardContent className="pt-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute -top-4 left-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{t(step.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200" />
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("howItWorks.benefits")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{t("howItWorks.benefit1.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.benefit1.desc")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{t("howItWorks.benefit2.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.benefit2.desc")}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{t("howItWorks.benefit3.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.benefit3.desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t("howItWorks.cta")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("howItWorks.ctaDesc")}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg">{t("howItWorks.startBrowsing")}</Button>
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

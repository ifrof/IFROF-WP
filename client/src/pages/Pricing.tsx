import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: "buyers",
      price: "FREE",
      description: t("pricing.free") || "Free for Buyers",
      features: [
        { key: "browseProducts", included: true },
        { key: "createInquiries", included: true },
        { key: "messaging", included: true },
        { key: "basicSupport", included: true },
        { key: "advancedAnalytics", included: false },
        { key: "prioritySupport", included: false },
      ],
      cta: "getStarted",
      highlighted: false,
    },
    {
      name: "factories",
      price: "$100",
      period: "one-time",
      description: t("pricing.verification") || "Manufacturer Verification",
      features: [
        { key: "listProducts", included: true },
        { key: "messaging", included: true },
        { key: "basicAnalytics", included: true },
        { key: "verificationBadge", included: true },
        { key: "advancedAnalytics", included: false },
        { key: "prioritySupport", included: false },
      ],
      cta: "verify",
      highlighted: false,
    },
    {
      name: "premium",
      price: "$200",
      period: "month",
      description: t("pricing.premium") || "Premium Package",
      features: [
        { key: "listProducts", included: true },
        { key: "messaging", included: true },
        { key: "basicAnalytics", included: true },
        { key: "verificationBadge", included: true },
        { key: "advancedAnalytics", included: true },
        { key: "prioritySupport", included: true },
      ],
      cta: "upgrade",
      highlighted: true,
    },
  ];

  const featureLabels: Record<string, string> = {
    browseProducts: t("pricing.browseProducts") || "Browse Products",
    createInquiries: t("pricing.createInquiries") || "Create Inquiries",
    messaging: t("pricing.messaging") || "Messaging",
    basicSupport: t("pricing.basicSupport") || "Basic Support",
    listProducts: t("pricing.listProducts") || "List Products",
    basicAnalytics: t("pricing.basicAnalytics") || "Basic Analytics",
    verificationBadge: t("pricing.verificationBadge") || "Verification Badge",
    advancedAnalytics: t("pricing.advancedAnalytics") || "Advanced Analytics",
    prioritySupport: t("pricing.prioritySupport") || "Priority Support",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t("pricing.title")}</h1>
          <p className="text-xl text-blue-100">{t("pricing.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`relative ${plan.highlighted ? "ring-2 ring-blue-600 md:scale-105" : ""}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                  {t("pricing.mostPopular") || "Most Popular"}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t(`pricing.${plan.name}`)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold">{plan.price}</div>
                  {plan.period && (
                    <div className="text-sm text-muted-foreground">
                      {t(`pricing.${plan.period}`) || plan.period}
                    </div>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check
                        className={`w-5 h-5 ${
                          feature.included ? "text-green-600" : "text-gray-300"
                        }`}
                      />
                      <span
                        className={
                          feature.included
                            ? ""
                            : "text-muted-foreground line-through"
                        }
                      >
                        {featureLabels[feature.key] || feature.key}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {t(`pricing.${plan.cta}`) || plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("pricing.faq")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">{t("pricing.faq1.q")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("pricing.faq1.a")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("pricing.faq2.q")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("pricing.faq2.a")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("pricing.faq3.q")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("pricing.faq3.a")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("pricing.faq4.q")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("pricing.faq4.a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

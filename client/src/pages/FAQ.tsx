import { useState } from "react";
import MetaTags from "../components/SEO/MetaTags";
import BreadcrumbSchema from "../components/SEO/BreadcrumbSchema";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);

  const faqs = [
    {
      question: language === "ar" ? "ما هو IFROF؟" : "What is IFROF?",
      answer:
        language === "ar"
          ? "IFROF هي منصة B2B تربط المشترين العالميين بالمصانع الصينية الموثوقة."
          : "IFROF is a B2B platform connecting global buyers with verified Chinese manufacturers.",
    },
    {
      question:
        language === "ar"
          ? "كيف يتم التحقق من المصانع؟"
          : "How are factories verified?",
      answer:
        language === "ar"
          ? "نقوم بعمليات فحص دقيقة تشمل التراخيص التجارية، شهادات الجودة، والزيارات الميدانية."
          : "We conduct rigorous checks including business licenses, quality certifications, and on-site visits.",
    },
    {
      question:
        language === "ar"
          ? "ما هي طرق الدفع المتاحة؟"
          : "What payment methods are available?",
      answer:
        language === "ar"
          ? "نحن ندعم الدفع عبر Stripe، والتحويلات البنكية، والعديد من العملات (USD, SAR, CNY)."
          : "We support payments via Stripe, bank transfers, and multiple currencies (USD, SAR, CNY).",
    },
  ];

  const seo = {
    title:
      language === "ar"
        ? "الأسئلة الشائعة | IFROF"
        : "FAQ - Frequently Asked Questions | IFROF",
    description:
      language === "ar"
        ? "اعثر على إجابات للأسئلة الشائعة حول الاستيراد من الصين والطلب والشحن والمدفوعات."
        : "Find answers to common questions about importing from China, ordering, shipping, and payments.",
    keywords: ["faq", "import help", "shipping questions"],
    ogImage: "https://ifrof.com/images/og-default.jpg",
    canonical: "https://ifrof.com/faq",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton />
      <MetaTags seo={seo} />
      <BreadcrumbSchema
        items={[
          {
            name: language === "ar" ? "الرئيسية" : "Home",
            url: "https://ifrof.com",
          },
          {
            name: language === "ar" ? "الأسئلة الشائعة" : "FAQ",
            url: "https://ifrof.com/faq",
          },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <h1 className="text-4xl font-bold mb-8 text-center">
        {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
      </h1>

      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-medium text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

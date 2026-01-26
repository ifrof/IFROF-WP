import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

const languages = ["ar", "en", "zh"] as const;

const contentSchema = z.object({
  language: z.enum(languages),
  page: z.string(),
});

const contentData: Record<string, Record<string, any>> = {
  ar: {
    home: {
      title: "مصانع صينية مباشرة",
      description: "اتصل مباشرة بالمصانع الصينية الموثوقة",
      cta: "ابدأ البحث",
    },
    about: {
      title: "عن IFROF",
      description: "منصة للتواصل المباشر مع المصانع الصينية",
    },
    pricing: {
      title: "الأسعار",
      plans: [
        {
          name: "الخطة الأساسية",
          price: "$99",
          features: ["البحث عن المصانع", "10 استفسارات شهرية"],
        },
        {
          name: "الخطة الاحترافية",
          price: "$299",
          features: ["بحث غير محدود", "دعم مخصص", "التحقق من المصانع بالذكاء الاصطناعي"],
        },
      ],
    },
  },
  en: {
    home: {
      title: "Direct Chinese Factories",
      description: "Connect directly with verified Chinese manufacturers",
      cta: "Start Searching",
    },
    about: {
      title: "About IFROF",
      description: "Platform for direct connection with Chinese factories",
    },
    pricing: {
      title: "Pricing",
      plans: [
        {
          name: "Basic Plan",
          price: "$99",
          features: ["Factory Search", "10 inquiries/month"],
        },
        {
          name: "Professional Plan",
          price: "$299",
          features: ["Unlimited Search", "Dedicated Support", "AI Factory Verification"],
        },
      ],
    },
  },
  zh: {
    home: {
      title: "直接中国工厂",
      description: "直接与经过验证的中国制造商联系",
      cta: "开始搜索",
    },
    about: {
      title: "关于IFROF",
      description: "与中国工厂直接连接的平台",
    },
    pricing: {
      title: "定价",
      plans: [
        {
          name: "基础计划",
          price: "$99",
          features: ["工厂搜索", "每月10次询问"],
        },
        {
          name: "专业计划",
          price: "$299",
          features: ["无限搜索", "专属支持", "人工智能工厂验证"],
        },
      ],
    },
  },
};

export const contentRouter = router({
  getContent: publicProcedure
    .input(contentSchema)
    .query(({ input }) => {
      const content = contentData[input.language]?.[input.page];
      if (!content) {
        return contentData["en"][input.page] || null;
      }
      return content;
    }),

  getAllContent: publicProcedure
    .input(z.object({ language: z.enum(languages) }))
    .query(({ input }) => {
      return contentData[input.language] || contentData["en"];
    }),
});

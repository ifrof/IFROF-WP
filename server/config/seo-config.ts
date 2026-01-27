export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  titleAr?: string;
  descriptionAr?: string;
  keywordsAr?: string[];
}

const BASE_URL = "https://ifrof.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-default.jpg`;

export const staticPagesSEO: Record<string, PageSEO> = {
  "/": {
    title:
      "IFROF - Direct Import from Chinese Manufacturers | Wholesale B2B Platform",
    description:
      "Connect directly with verified Chinese manufacturers. Import quality products at factory prices. No middlemen, transparent pricing, secure transactions.",
    keywords: [
      "chinese manufacturers",
      "import from china",
      "wholesale",
      "b2b marketplace",
      "factory direct",
    ],
    ogImage: `${BASE_URL}/images/og-homepage.jpg`,
    canonical: BASE_URL,
    titleAr: "إيفروف - استيراد مباشر من المصانع الصينية | منصة B2B للجملة",
    descriptionAr:
      "تواصل مباشرة مع المصانع الصينية الموثقة. استورد منتجات عالية الجودة بأسعار المصنع. بدون وسطاء، تسعير شفاف، ومعاملات آمنة.",
    keywordsAr: [
      "مصانع صينية",
      "استيراد من الصين",
      "جملة",
      "منصة B2B",
      "سعر المصنع",
    ],
  },
  "/marketplace": {
    title: "Manufacturer Marketplace - Find Verified Chinese Suppliers | IFROF",
    description:
      "Browse our marketplace of verified Chinese manufacturers across all industries. Direct factory connections and competitive pricing.",
    keywords: [
      "manufacturer marketplace",
      "chinese suppliers",
      "factory directory",
      "verified manufacturers",
    ],
    ogImage: `${BASE_URL}/images/og-marketplace.jpg`,
    canonical: `${BASE_URL}/marketplace`,
    titleAr: "سوق المصنعين - ابحث عن موردين صينيين موثقين | إيفروف",
    descriptionAr:
      "تصفح سوقنا للمصنعين الصينيين الموثقين في جميع الصناعات. اتصالات مباشرة بالمصانع وأسعار تنافسية.",
    keywordsAr: [
      "سوق المصنعين",
      "موردين صينيين",
      "دليل المصانع",
      "مصانع موثقة",
    ],
  },
  "/search": {
    title: "Search Products - Find Factory Direct Items | IFROF",
    description:
      "Search for products directly from Chinese factories. Filter by category, price, and MOQ.",
    keywords: [
      "product search",
      "factory direct products",
      "china wholesale search",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/search`,
    titleAr: "بحث عن منتجات - ابحث عن سلع مباشرة من المصنع | إيفروف",
    descriptionAr:
      "ابحث عن منتجات مباشرة من المصانع الصينية. تصفية حسب الفئة والسعر والحد الأدنى للطلب.",
    keywordsAr: ["بحث منتجات", "منتجات مصنع مباشرة", "بحث جملة الصين"],
  },
  "/buyer/requests": {
    title: "My Import Requests - Buyer Dashboard | IFROF",
    description:
      "Manage your import requests and view quotes from Chinese manufacturers.",
    keywords: ["import requests", "buyer dashboard", "manage quotes"],
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/buyer/requests`,
    titleAr: "طلبات الاستيراد الخاصة بي - لوحة تحكم المشتري | إيفروف",
    descriptionAr:
      "إدارة طلبات الاستيراد الخاصة بك وعرض عروض الأسعار من المصانع الصينية.",
    keywordsAr: ["طلبات استيراد", "لوحة تحكم المشتري", "إدارة العروض"],
  },
  "/faq": {
    title: "FAQ - Frequently Asked Questions About Importing | IFROF",
    description:
      "Find answers to common questions about ordering, shipping, payments, and returns when importing from China.",
    keywords: [
      "import faq",
      "china import help",
      "shipping faq",
      "payment faq",
    ],
    ogImage: DEFAULT_OG_IMAGE,
    canonical: `${BASE_URL}/faq`,
  },
};

export const defaultSEO: PageSEO = {
  title: "IFROF - Direct Import from Chinese Manufacturers",
  description:
    "Connect directly with verified Chinese manufacturers. Import quality products at factory prices.",
  keywords: [
    "import from china",
    "chinese manufacturers",
    "wholesale",
    "factory direct",
  ],
  ogImage: DEFAULT_OG_IMAGE,
  canonical: BASE_URL,
};

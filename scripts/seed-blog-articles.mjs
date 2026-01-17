import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const articles = [
  {
    title: "How to Identify Real Factories vs Trading Companies in China",
    titleAr: "كيفية تحديد المصانع الحقيقية مقابل شركات التجارة في الصين",
    slug: "how-to-identify-real-factories",
    excerpt: "Learn the key differences between real factories and trading companies. Discover red flags and green flags that will help you make the right decision.",
    excerptAr: "تعرف على الفروقات الرئيسية بين المصانع الحقيقية وشركات التجارة. اكتشف العلامات التحذيرية والإيجابية التي ستساعدك على اتخاذ القرار الصحيح.",
    category: "Supplier Verification",
    categoryAr: "التحقق من المورّدين",
    tags: JSON.stringify(["factories", "trading", "verification", "china"]),
    tagsAr: JSON.stringify(["مصانع", "تجارة", "تحقق", "الصين"]),
    featured: 1,
    readTime: 8,
  },
  {
    title: "Top 10 Supplier Verification Tips That Save Money",
    titleAr: "أفضل 10 نصائح للتحقق من المورّدين توفر المال",
    slug: "top-10-supplier-verification-tips",
    excerpt: "Discover the most effective strategies used by professional sourcing agents to verify suppliers and avoid costly mistakes.",
    excerptAr: "اكتشف أكثر الاستراتيجيات فعالية التي يستخدمها وكلاء التوريد المحترفون للتحقق من المورّدين وتجنب الأخطاء المكلفة.",
    category: "Tips & Tricks",
    categoryAr: "نصائح وحيل",
    tags: JSON.stringify(["verification", "tips", "suppliers", "sourcing"]),
    tagsAr: JSON.stringify(["تحقق", "نصائح", "موردين", "توريد"]),
    featured: 1,
    readTime: 6,
  },
  {
    title: "Red Flags That Indicate a Scam Supplier - Protect Your Investment",
    titleAr: "العلامات التحذيرية التي تشير إلى مورّد احتيالي - حماية استثمارك",
    slug: "red-flags-scam-supplier",
    excerpt: "Learn how to identify warning signs of fraudulent suppliers before losing money. This comprehensive guide covers common scams and how to avoid them.",
    excerptAr: "تعرف على كيفية تحديد علامات التحذير من الموردين الاحتياليين قبل خسارة الأموال. يغطي هذا الدليل الشامل الحيل الشائعة وكيفية تجنبها.",
    category: "Supplier Verification",
    categoryAr: "التحقق من المورّدين",
    tags: JSON.stringify(["fraud", "scams", "protection", "verification"]),
    tagsAr: JSON.stringify(["احتيال", "حيل", "حماية", "تحقق"]),
    featured: 0,
    readTime: 7,
  },
  {
    title: "Secure Payment Methods for Importing from China - Protect Your Money",
    titleAr: "طرق الدفع الآمنة للاستيراد من الصين - حماية أموالك",
    slug: "secure-payment-methods-china",
    excerpt: "Discover the safest payment methods when buying from Chinese suppliers. Learn about escrow, trade assurance, and payment protection strategies.",
    excerptAr: "اكتشف أكثر الطرق أماناً عند الشراء من الموردين الصينيين. تعرف على الضمان والتأمين التجاري واستراتيجيات حماية الدفع.",
    category: "Payment & Finance",
    categoryAr: "الدفع والمالية",
    tags: JSON.stringify(["payment", "security", "escrow", "finance"]),
    tagsAr: JSON.stringify(["دفع", "أمان", "ضمان", "مالية"]),
    featured: 1,
    readTime: 9,
  },
  {
    title: "Complete Guide to Shipping from China - Methods, Costs, and Timeline",
    titleAr: "دليل شامل للشحن من الصين - الطرق والتكاليف والجدول الزمني",
    slug: "complete-guide-shipping-china",
    excerpt: "Master the shipping process from Chinese factories. Learn about different shipping methods, costs, timelines, and how to track your shipment.",
    excerptAr: "أتقن عملية الشحن من المصانع الصينية. تعرف على طرق الشحن المختلفة والتكاليف والجداول الزمنية وكيفية تتبع شحنتك.",
    category: "Shipping & Logistics",
    categoryAr: "الشحن واللوجستيات",
    tags: JSON.stringify(["shipping", "logistics", "costs", "tracking"]),
    tagsAr: JSON.stringify(["شحن", "لوجستيات", "تكاليف", "تتبع"]),
    featured: 1,
    readTime: 10,
  },
  {
    title: "Quality Control Checklist for Factory Inspections",
    titleAr: "قائمة فحص الجودة لفحوصات المصانع",
    slug: "quality-control-checklist",
    excerpt: "A comprehensive checklist for inspecting factories and ensuring product quality. Learn what to look for and how to evaluate manufacturing standards.",
    excerptAr: "قائمة تحقق شاملة لفحص المصانع وضمان جودة المنتجات. تعرف على ما يجب البحث عنه وكيفية تقييم معايير التصنيع.",
    category: "Quality Assurance",
    categoryAr: "ضمان الجودة",
    tags: JSON.stringify(["quality", "inspection", "checklist", "standards"]),
    tagsAr: JSON.stringify(["جودة", "فحص", "قائمة تحقق", "معايير"]),
    featured: 0,
    readTime: 8,
  },
  {
    title: "How to Negotiate Better Prices with Chinese Suppliers",
    titleAr: "كيفية التفاوض على أسعار أفضل مع الموردين الصينيين",
    slug: "negotiate-better-prices",
    excerpt: "Master the art of negotiation with Chinese suppliers. Learn strategies to get better prices without compromising on quality.",
    excerptAr: "أتقن فن التفاوض مع الموردين الصينيين. تعرف على استراتيجيات الحصول على أسعار أفضل دون المساس بالجودة.",
    category: "Tips & Tricks",
    categoryAr: "نصائح وحيل",
    tags: JSON.stringify(["negotiation", "pricing", "strategy", "suppliers"]),
    tagsAr: JSON.stringify(["تفاوض", "تسعير", "استراتيجية", "موردين"]),
    featured: 0,
    readTime: 7,
  },
  {
    title: "Building Long-Term Relationships with Suppliers",
    titleAr: "بناء علاقات طويلة الأمد مع الموردين",
    slug: "building-supplier-relationships",
    excerpt: "Learn how to establish trust and build long-term partnerships with your suppliers for mutual growth and success.",
    excerptAr: "تعرف على كيفية بناء الثقة وإقامة شراكات طويلة الأمد مع موردينك للنمو والنجاح المشترك.",
    category: "Business Strategy",
    categoryAr: "استراتيجية الأعمال",
    tags: JSON.stringify(["relationships", "partnership", "trust", "business"]),
    tagsAr: JSON.stringify(["علاقات", "شراكة", "ثقة", "أعمال"]),
    featured: 0,
    readTime: 6,
  },
];

async function seedBlogArticles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ifrof',
  });

  try {
    console.log('🌱 Starting to seed blog articles...');

    for (const article of articles) {
      const query = `
        INSERT INTO blog_posts (
          title, slug, excerpt, category, tags, featured, read_time, published, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
          excerpt = VALUES(excerpt),
          category = VALUES(category),
          tags = VALUES(tags),
          featured = VALUES(featured),
          read_time = VALUES(read_time),
          updated_at = NOW()
      `;

      await connection.execute(query, [
        article.title,
        article.slug,
        article.excerpt,
        article.category,
        article.tags,
        article.featured,
        article.readTime,
      ]);

      console.log(`✅ Added: ${article.title}`);
    }

    console.log('✨ All blog articles have been successfully added!');
  } catch (error) {
    console.error('❌ Error seeding blog articles:', error);
  } finally {
    await connection.end();
  }
}

seedBlogArticles();

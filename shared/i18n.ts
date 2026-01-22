/**
 * i18n Configuration for IFROF Platform
 * B2B Direct Import from Verified Chinese Manufacturers
 * Supports Arabic (ar) and English (en)
 */

export type Language = 'ar' | 'en';

export const LANGUAGES = {
  ar: { name: 'العربية', dir: 'rtl' },
  en: { name: 'English', dir: 'ltr' },
} as const;

export const DEFAULT_LANGUAGE: Language = 'ar';

export const translations = {
  ar: {
    // Platform Name
    platform: {
      name: 'IFROF',
      tagline: 'استورد مباشرة من المصنع',
      fullName: 'منصة IFROF للاستيراد المباشر',
    },

    // Navigation
    nav: {
      home: 'الرئيسية',
      manufacturers: 'المصانع الموثقة',
      howItWorks: 'كيف يعمل',
      pricing: 'الأسعار',
      blog: 'المدونة',
      support: 'الدعم',
      smartAssistant: 'المحقق الذكي للمصانع',
      startImport: 'ابدأ طلب استيراد',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      myRequests: 'طلباتي',
      dashboard: 'لوحة التحكم',
      quickDemo: 'دخول تجريبي سريع',
    },

    // Hero Section - NEW POWERFUL VERSION
    hero: {
      badge: 'منصة B2B موثوقة',
      title: 'استورد مباشرة من المصنع الصيني',
      titleHighlight: 'بدون وسطاء',
      subtitle: 'نربطك مباشرة بالمصانع الصينية الموثقة. نتحقق من كل مصنع بالذكاء الاصطناعي لضمان أنه مصنع مباشر وليس وسيط.',
      cta: 'ابدأ طلب استيراد',
      ctaSecondary: 'شاهد كيف يعمل',
      stats: {
        manufacturers: 'مصنع صيني موثق',
        buyers: 'مشتري نشط',
        orders: 'طلب استيراد ناجح',
        savings: 'توفير في التكاليف',
      },
      trust: {
        title: 'لماذا IFROF؟',
        noMiddlemen: 'بدون وسطاء',
        verified: 'مصانع موثقة',
        aiPowered: 'ذكاء اصطناعي',
        secure: 'دفع آمن',
      },
    },

    // Smart Naming - Factory → Verified Chinese Manufacturer
    manufacturer: {
      title: 'مصنع صيني موثق',
      titlePlural: 'مصانع صينية موثقة',
      verified: 'موثق ✓',
      notVerified: 'قيد التحقق',
      direct: 'مصنع مباشر',
      notDirect: 'غير مباشر',
      badge: 'مصنع موثق من IFROF',
      certifications: 'الشهادات',
      capacity: 'الطاقة الإنتاجية',
      employees: 'عدد الموظفين',
      established: 'سنة التأسيس',
      location: 'الموقع',
      products: 'المنتجات',
      minOrder: 'الحد الأدنى للطلب',
      responseTime: 'وقت الرد',
      rating: 'التقييم',
    },

    // Smart Naming - Inquiry → Import Request
    importRequest: {
      title: 'طلب استيراد',
      titlePlural: 'طلبات الاستيراد',
      new: 'طلب استيراد جديد',
      submit: 'إرسال طلب الاستيراد',
      status: {
        pending: 'قيد المراجعة',
        approved: 'تمت الموافقة',
        inProgress: 'قيد التنفيذ',
        shipped: 'تم الشحن',
        completed: 'مكتمل',
        cancelled: 'ملغي',
        disputed: 'نزاع',
      },
      form: {
        product: 'المنتج المطلوب',
        quantity: 'الكمية',
        specifications: 'المواصفات',
        budget: 'الميزانية التقديرية',
        deadline: 'الموعد المطلوب',
        notes: 'ملاحظات إضافية',
        destination: 'بلد الوجهة',
        shippingMethod: 'طريقة الشحن',
        shippingMethodOptions: {
          air: 'شحن جوي',
          sea: 'شحن بحري',
          land: 'شحن بري',
          rail: 'شحن بالسكة الحديد',
          multimodal: 'شحن مشترك',
          other: 'أخرى',
        },
        shippingDetails: 'تفاصيل الشحن الإضافية',
        shippingCostEstimate: 'تكلفة الشحن التقديرية',
      },
    },

    // Smart Naming - AI Agent → Smart Sourcing Assistant
    smartAssistant: {
      title: 'محقق IFROF الذكي للمصانع',
      subtitle: 'يساعدك في العثور على المصانع الصينية الموثقة والتحقق من أنها مصانع مباشرة',
      searching: 'جاري البحث عن المصانع المناسبة...',
      verifying: 'جاري التحقق من المصنع...',
      analyzing: 'جاري تحليل البيانات...',
      results: 'النتائج',
      noResults: 'لم نجد مصانع تطابق معاييرك',
      askMe: 'اسألني عن أي شيء',
      placeholder: 'ابحث عن منتج أو مصنع...',
      suggestions: [
        'أبحث عن مصنع ملابس في قوانغتشو',
        'أريد مصنع إلكترونيات موثق',
        'ما هي أفضل المصانع للأثاث؟',
        'كيف أتحقق من المصنع؟',
      ],
    },

    // Verification System
    verification: {
      title: 'نظام التحقق',
      directManufacturer: 'مصنع مباشر',
      trader: 'تاجر/وسيط',
      tradingCompany: 'شركة تجارية',
      confidence: 'نسبة الثقة',
      verified: 'تم التحقق ✓',
      warning: 'تحذير: هذا ليس مصنع مباشر',
      howWeVerify: 'كيف نتحقق؟',
      steps: {
        documents: 'فحص الوثائق الرسمية',
        factory: 'زيارة المصنع (اختياري)',
        ai: 'تحليل بالذكاء الاصطناعي',
        history: 'مراجعة السجل التجاري',
      },
    },

    // How It Works
    howItWorks: {
      title: 'كيف يعمل IFROF؟',
      subtitle: '4 خطوات بسيطة للاستيراد المباشر',
      steps: {
        step1: {
          title: 'أرسل طلب استيراد',
          desc: 'حدد المنتج والكمية والمواصفات المطلوبة',
        },
        step2: {
          title: 'نجد لك المصنع المناسب',
          desc: 'الذكاء الاصطناعي يبحث ويتحقق من المصانع المباشرة',
        },
        step3: {
          title: 'تفاوض مباشرة',
          desc: 'تواصل مع المصنع مباشرة عبر المنصة',
        },
        step4: {
          title: 'استلم بضاعتك',
          desc: 'نتابع الشحن حتى وصول البضاعة',
        },
      },
    },

    // Pricing
    pricing: {
      title: 'الأسعار',
      subtitle: 'شفافية كاملة - لا رسوم خفية',
      commission: 'عمولة على الطلبات',
      commissionRate: '2-3%',
      commissionDesc: 'فقط عند إتمام الصفقة بنجاح',
      verification: 'رسوم التحقق من المصنع',
      verificationFee: '$100',
      verificationDesc: 'مرة واحدة لكل مصنع',
      premium: 'الباقة المميزة للمصانع',
      premiumFee: '$200/شهر',
      premiumDesc: 'ظهور مميز + دعم أولوية',
      free: 'مجاني للمشترين',
      freeDesc: 'التسجيل والبحث مجاني تماماً',
    },

    // Support Emails
    support: {
      title: 'الدعم والمساعدة',
      subtitle: 'فريقنا جاهز لمساعدتك',
      general: {
        title: 'الدعم العام',
        email: 'support@ifrof.com',
        desc: 'للاستفسارات العامة والمساعدة',
      },
      complaints: {
        title: 'الشكاوى',
        email: 'complain@ifrof.com',
        desc: 'لتقديم شكوى رسمية',
      },
      disputes: {
        title: 'النزاعات',
        email: 'dispute@ifrof.com',
        desc: 'لحل النزاعات بين المشترين والمصانع',
      },
      responseTime: 'نرد خلال 24 ساعة',
    },

    // Footer
    footer: {
      description: 'منصة IFROF تربط المشترين مباشرة بالمصانع الصينية الموثقة. نقضي على الوسطاء ونضمن لك أفضل الأسعار.',
      quickLinks: 'روابط سريعة',
      legal: 'قانوني',
      contact: 'تواصل معنا',
      terms: 'الشروط والأحكام',
      privacy: 'سياسة الخصوصية',
      refund: 'سياسة الاسترداد',
      copyright: '© 2026 IFROF. جميع الحقوق محفوظة.',
      madeWith: 'صنع بـ ❤️ للتجارة العالمية',
    },

    // Trust Badges
    trust: {
      noMiddlemen: 'بدون وسطاء',
      directFactory: 'مصنع مباشر',
      verified: 'موثق',
      secure: 'آمن',
      aiPowered: 'ذكاء اصطناعي',
      support247: 'دعم 24/7',
    },

    // Common
    common: {
      search: 'بحث',
      filter: 'فلترة',
      sort: 'ترتيب',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      contact: 'تواصل',
      details: 'التفاصيل',
      submit: 'إرسال',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      all: 'الكل',
      none: 'لا شيء',
      yes: 'نعم',
      no: 'لا',
      or: 'أو',
      and: 'و',
    },

    // Errors
    errors: {
      required: 'هذا الحقل مطلوب',
      invalid: 'قيمة غير صالحة',
      network: 'خطأ في الاتصال',
      server: 'خطأ في الخادم',
      unauthorized: 'غير مصرح',
      notFound: 'غير موجود',
    },
  },

  en: {
    // Platform Name
    platform: {
      name: 'IFROF',
      tagline: 'Import Directly from the Factory',
      fullName: 'IFROF Direct Import Platform',
    },

    // Navigation
    nav: {
      home: 'Home',
      manufacturers: 'Verified Manufacturers',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      blog: 'Blog',
      support: 'Support',
      smartAssistant: 'AI Factory Investigator',
      startImport: 'Start Import Request',
      logout: 'Logout',
      login: 'Login',
      myRequests: 'My Requests',
      dashboard: 'Dashboard',
      quickDemo: 'Quick Demo Login',
    },

    // Hero Section - NEW POWERFUL VERSION
    hero: {
      badge: 'Trusted B2B Platform',
      title: 'Import Directly from Chinese Factories',
      titleHighlight: 'No Middlemen',
      subtitle: 'We connect you directly with verified Chinese manufacturers. We verify every factory with AI to ensure it\'s a direct manufacturer, not an intermediary.',
      cta: 'Start Import Request',
      ctaSecondary: 'See How It Works',
      stats: {
        manufacturers: 'Verified Chinese Manufacturers',
        buyers: 'Active Buyers',
        orders: 'Successful Import Orders',
        savings: 'Cost Savings',
      },
      trust: {
        title: 'Why IFROF?',
        noMiddlemen: 'No Middlemen',
        verified: 'Verified Factories',
        aiPowered: 'AI Powered',
        secure: 'Secure Payment',
      },
    },

    // Smart Naming - Factory → Verified Chinese Manufacturer
    manufacturer: {
      title: 'Verified Chinese Manufacturer',
      titlePlural: 'Verified Chinese Manufacturers',
      verified: 'Verified ✓',
      notVerified: 'Pending Verification',
      direct: 'Direct Manufacturer',
      notDirect: 'Not Direct',
      badge: 'IFROF Verified Manufacturer',
      certifications: 'Certifications',
      capacity: 'Production Capacity',
      employees: 'Number of Employees',
      established: 'Year Established',
      location: 'Location',
      products: 'Products',
      minOrder: 'Minimum Order',
      responseTime: 'Response Time',
      rating: 'Rating',
    },

    // Smart Naming - Inquiry → Import Request
    importRequest: {
      title: 'Import Request',
      titlePlural: 'Import Requests',
      new: 'New Import Request',
      submit: 'Submit Import Request',
      status: {
        pending: 'Under Review',
        approved: 'Approved',
        inProgress: 'In Progress',
        shipped: 'Shipped',
        completed: 'Completed',
        cancelled: 'Cancelled',
        disputed: 'Disputed',
      },
      form: {
        product: 'Required Product',
        quantity: 'Quantity',
        specifications: 'Specifications',
        budget: 'Estimated Budget',
        deadline: 'Required Deadline',
        notes: 'Additional Notes',
        destination: 'Destination Country',
        shippingMethod: 'Shipping Method',
        shippingMethodOptions: {
          air: 'Air Freight',
          sea: 'Sea Freight',
          land: 'Land Transport',
          rail: 'Rail Freight',
          multimodal: 'Combined/Multimodal',
          other: 'Other',
        },
        shippingDetails: 'Additional Shipping Details',
        shippingCostEstimate: 'Shipping Cost Estimate',
      },
    },

    // Smart Naming - AI Agent → Smart Sourcing Assistant
    smartAssistant: {
      title: 'IFROF AI Factory Investigator',
      subtitle: 'Helps you find verified Chinese manufacturers and verify they are direct factories',
      searching: 'Searching for suitable manufacturers...',
      verifying: 'Verifying the manufacturer...',
      analyzing: 'Analyzing data...',
      results: 'Results',
      noResults: 'No manufacturers found matching your criteria',
      askMe: 'Ask me anything',
      placeholder: 'Search for a product or manufacturer...',
      suggestions: [
        'Looking for a clothing factory in Guangzhou',
        'I want a verified electronics manufacturer',
        'What are the best furniture factories?',
        'How do I verify a manufacturer?',
      ],
    },

    // Verification System
    verification: {
      title: 'Verification System',
      directManufacturer: 'Direct Manufacturer',
      trader: 'Trader/Intermediary',
      tradingCompany: 'Trading Company',
      confidence: 'Confidence Score',
      verified: 'Verified ✓',
      warning: 'Warning: This is not a direct manufacturer',
      howWeVerify: 'How We Verify',
      steps: {
        documents: 'Official Document Review',
        factory: 'Factory Visit (Optional)',
        ai: 'AI Analysis',
        history: 'Trade History Review',
      },
    },

    // How It Works
    howItWorks: {
      title: 'How Does IFROF Work?',
      subtitle: '4 Simple Steps to Direct Import',
      steps: {
        step1: {
          title: 'Submit Import Request',
          desc: 'Specify the product, quantity, and required specifications',
        },
        step2: {
          title: 'We Find the Right Manufacturer',
          desc: 'AI searches and verifies direct manufacturers',
        },
        step3: {
          title: 'Negotiate Directly',
          desc: 'Communicate with the manufacturer directly through the platform',
        },
        step4: {
          title: 'Receive Your Goods',
          desc: 'We track shipping until your goods arrive',
        },
      },
    },

    // Pricing
    pricing: {
      title: 'Pricing',
      subtitle: 'Complete Transparency - No Hidden Fees',
      commission: 'Commission on Orders',
      commissionRate: '2-3%',
      commissionDesc: 'Only upon successful deal completion',
      verification: 'Manufacturer Verification Fee',
      verificationFee: '$100',
      verificationDesc: 'One-time per manufacturer',
      premium: 'Premium Package for Manufacturers',
      premiumFee: '$200/month',
      premiumDesc: 'Featured listing + Priority support',
      free: 'Free for Buyers',
      freeDesc: 'Registration and search completely free',
    },

    // Support Emails
    support: {
      title: 'Support & Help',
      subtitle: 'Our team is ready to help you',
      general: {
        title: 'General Support',
        email: 'support@ifrof.com',
        desc: 'For general inquiries and assistance',
      },
      complaints: {
        title: 'Complaints',
        email: 'complain@ifrof.com',
        desc: 'To file an official complaint',
      },
      disputes: {
        title: 'Disputes',
        email: 'dispute@ifrof.com',
        desc: 'To resolve disputes between buyers and manufacturers',
      },
      responseTime: 'We respond within 24 hours',
    },

    // Footer
    footer: {
      description: 'IFROF platform connects buyers directly with verified Chinese manufacturers. We eliminate middlemen and guarantee you the best prices.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      contact: 'Contact Us',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      refund: 'Refund Policy',
      copyright: '© 2026 IFROF. All rights reserved.',
      madeWith: 'Made with ❤️ for Global Trade',
    },

    // Trust Badges
    trust: {
      noMiddlemen: 'No Middlemen',
      directFactory: 'Direct Factory',
      verified: 'Verified',
      secure: 'Secure',
      aiPowered: 'AI Powered',
      support247: '24/7 Support',
    },

    // Common
    common: {
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      contact: 'Contact',
      details: 'Details',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      all: 'All',
      none: 'None',
      yes: 'Yes',
      no: 'No',
      or: 'or',
      and: 'and',
    },

    // Errors
    errors: {
      required: 'This field is required',
      invalid: 'Invalid value',
      network: 'Network error',
      server: 'Server error',
      unauthorized: 'Unauthorized',
      notFound: 'Not found',
    },
  },
  zh: {
    platform: {
      name: 'IFROF',
      tagline: '直接从工厂进口',
      fullName: 'IFROF 直接进口平台',
    },
    nav: {
      home: '首页',
      manufacturers: '认证厂家',
      howItWorks: '运作方式',
      pricing: '价格',
      blog: '博客',
      support: '支持',
      smartAssistant: 'AI 工厂调查员',
      startImport: '开始进口申请',
      logout: '登出',
      login: '登录',
      myRequests: '我的申请',
      dashboard: '控制面板',
    },
    importRequest: {
      title: '进口申请',
      new: '新进口申请',
      submit: '提交进口申请',
      form: {
        product: '所需产品',
        quantity: '数量',
        specifications: '规格',
        budget: '预计预算',
        deadline: '截止日期',
        notes: '备注',
        destination: '目的地国家',
        shippingMethod: '运输方式',
        shippingMethodOptions: {
          air: '空运',
          sea: '海运',
          land: '陆运',
          rail: '铁路运输',
          multimodal: '多式联运',
          other: '其他',
        },
        shippingDetails: '额外运输详情',
        shippingCostEstimate: '预计运输费用',
      },
    },
    common: {
      search: '搜索',
      loading: '加载中...',
      success: '成功',
      error: '错误',
      submit: '提交',
      back: '返回',
    },
  },
} as const;

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

/**
 * i18n Configuration for IFROF Platform
 * B2B Direct Import from Verified Chinese Manufacturers
 * Supports Arabic (ar) and English (en)
 */

export type Language = "ar" | "en" | "zh";

export const LANGUAGES = {
  ar: { name: "العربية", dir: "rtl" as const },
  en: { name: "English", dir: "ltr" as const },
  zh: { name: "中文", dir: "ltr" as const },
} as const;

export const DEFAULT_LANGUAGE: Language = "ar";

export const translations = {
  ar: {
    // Platform Name
    platform: {
      name: "IFROF",
      tagline: "استورد مباشرة من المصنع",
      fullName: "منصة IFROF للاستيراد المباشر",
    },

    // Navigation
    nav: {
      home: 'الرئيسية',
      manufacturers: 'المصانع الموثقة',
      howItWorks: 'كيف يعمل',
      pricing: 'الأسعار',
      blog: 'المدونة',
      support: 'الدعم',
      smartAssistant: 'محقق IFROF الذكي للمصانع',
      startImport: 'ابدأ طلب استيراد',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      myRequests: 'طلباتي',
      dashboard: 'لوحة التحكم',
    },

    // Hero Section - NEW POWERFUL VERSION
    hero: {
      badge: "منصة B2B موثوقة",
      title: "استورد مباشرة من المصنع الصيني",
      titleHighlight: "بدون وسطاء",
      subtitle:
        "نربطك مباشرة بالمصانع الصينية الموثقة. نتحقق من كل مصنع بالذكاء الاصطناعي لضمان أنه مصنع مباشر وليس وسيط.",
      cta: "ابدأ طلب استيراد",
      ctaSecondary: "شاهد كيف يعمل",
      stats: {
        manufacturers: "مصنع صيني موثق",
        buyers: "مشتري نشط",
        orders: "طلب استيراد ناجح",
        savings: "توفير في التكاليف",
      },
      trust: {
        title: "لماذا IFROF؟",
        noMiddlemen: "بدون وسطاء",
        verified: "مصانع موثقة",
        aiPowered: "ذكاء اصطناعي",
        secure: "دفع آمن",
      },
    },

    // Smart Naming - Factory → Verified Chinese Manufacturer
    manufacturer: {
      title: "مصنع صيني موثق",
      titlePlural: "مصانع صينية موثقة",
      verified: "موثق ✓",
      notVerified: "قيد التحقق",
      direct: "مصنع مباشر",
      notDirect: "غير مباشر",
      badge: "مصنع موثق من IFROF",
      certifications: "الشهادات",
      capacity: "الطاقة الإنتاجية",
      employees: "عدد الموظفين",
      established: "سنة التأسيس",
      location: "الموقع",
      products: "المنتجات",
      minOrder: "الحد الأدنى للطلب",
      responseTime: "وقت الرد",
      rating: "التقييم",
      viewProfile: "عرض الملف",
      contactNow: "تواصل الآن",
      sendInquiry: "أرسل استفسار",
    },

    // Smart Naming - Inquiry → Import Request
    importRequest: {
      title: "طلب استيراد",
      titlePlural: "طلبات الاستيراد",
      new: "طلب استيراد جديد",
      submit: "إرسال طلب الاستيراد",
      status: {
        pending: "قيد المراجعة",
        approved: "تمت الموافقة",
        inProgress: "قيد التنفيذ",
        shipped: "تم الشحن",
        completed: "مكتمل",
        cancelled: "ملغي",
        disputed: "نزاع",
        responded: "تم الرد",
        negotiating: "قيد التفاوض",
      },
      form: {
        product: "المنتج المطلوب",
        quantity: "الكمية",
        specifications: "المواصفات",
        budget: "الميزانية التقديرية",
        deadline: "الموعد المطلوب",
        notes: "ملاحظات إضافية",
        destination: "بلد الوجهة",
        shippingMethod: "طريقة الشحن",
        shippingMethodOptions: {
          air: "شحن جوي",
          sea: "شحن بحري",
          land: "شحن بري",
          rail: "شحن بالسكة الحديد",
          multimodal: "شحن مشترك",
          other: "أخرى",
        },
        shippingDetails: "تفاصيل الشحن الإضافية",
        shippingCostEstimate: "تكلفة الشحن التقديرية",
        attachments: "المرفقات",
        addAttachment: "إضافة مرفق",
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
        "أبحث عن مصنع ملابس في قوانغتشو",
        "أريد مصنع إلكترونيات موثق",
        "ما هي أفضل المصانع للأثاث؟",
        "كيف أتحقق من المصنع؟",
      ],
    },

    // Verification System
    verification: {
      title: "نظام التحقق",
      directManufacturer: "مصنع مباشر",
      trader: "تاجر/وسيط",
      tradingCompany: "شركة تجارية",
      confidence: "نسبة الثقة",
      verified: "تم التحقق ✓",
      warning: "تحذير: هذا ليس مصنع مباشر",
      howWeVerify: "كيف نتحقق؟",
      steps: {
        documents: "فحص الوثائق الرسمية",
        factory: "زيارة المصنع (اختياري)",
        ai: "تحليل بالذكاء الاصطناعي",
        history: "مراجعة السجل التجاري",
      },
    },

    // How It Works
    howItWorks: {
      title: "كيف يعمل IFROF؟",
      subtitle: "4 خطوات بسيطة للاستيراد المباشر",
      steps: {
        step1: {
          title: "أرسل طلب استيراد",
          desc: "حدد المنتج والكمية والمواصفات المطلوبة",
        },
        step2: {
          title: "نجد لك المصنع المناسب",
          desc: "الذكاء الاصطناعي يبحث ويتحقق من المصانع المباشرة",
        },
        step3: {
          title: "تفاوض مباشرة",
          desc: "تواصل مع المصنع مباشرة عبر المنصة",
        },
        step4: {
          title: "استلم بضاعتك",
          desc: "نتابع الشحن حتى وصول البضاعة",
        },
      },
    },

    // Pricing
    pricing: {
      title: "الأسعار",
      subtitle: "شفافية كاملة - لا رسوم خفية",
      commission: "عمولة على الطلبات",
      commissionRate: "2-3%",
      commissionDesc: "فقط عند إتمام الصفقة بنجاح",
      verification: "رسوم التحقق من المصنع",
      verificationFee: "$100",
      verificationDesc: "مرة واحدة لكل مصنع",
      premium: "الباقة المميزة للمصانع",
      premiumFee: "$200/شهر",
      premiumDesc: "ظهور مميز + دعم أولوية",
      free: "مجاني للمشترين",
      freeDesc: "التسجيل والبحث مجاني تماماً",
      getStarted: "ابدأ الآن",
      contactSales: "تواصل مع المبيعات",
    },

    // Shipping
    shipping: {
      title: "خدمات الشحن الدولي",
      subtitle: "حلول شحن متكاملة من الصين إلى العالم",
      types: {
        air: {
          title: "الشحن الجوي",
          desc: "أسرع خيار للشحنات العاجلة",
          time: "3-7 أيام",
        },
        sea: {
          title: "الشحن البحري",
          desc: "الأكثر اقتصادية للشحنات الكبيرة",
          time: "20-40 يوم",
        },
        land: {
          title: "الشحن البري",
          desc: "مثالي للدول المجاورة",
          time: "10-20 يوم",
        },
        rail: {
          title: "الشحن بالسكة الحديد",
          desc: "توازن بين السرعة والتكلفة",
          time: "15-25 يوم",
        },
        multimodal: {
          title: "الشحن المشترك",
          desc: "مزيج من وسائل النقل المختلفة",
          time: "حسب المسار",
        },
      },
      getQuote: "احصل على عرض سعر",
      trackShipment: "تتبع الشحنة",
      estimatedTime: "الوقت المتوقع",
      estimatedCost: "التكلفة التقديرية",
    },

    // Support
    support: {
      title: "الدعم والمساعدة",
      subtitle: "فريقنا جاهز لمساعدتك",
      general: {
        title: "الدعم العام",
        email: "support@ifrof.com",
        desc: "للاستفسارات العامة والمساعدة",
      },
      complaints: {
        title: "الشكاوى",
        email: "complain@ifrof.com",
        desc: "لتقديم شكوى رسمية",
      },
      disputes: {
        title: "النزاعات",
        email: "dispute@ifrof.com",
        desc: "لحل النزاعات بين المشترين والمصانع",
      },
      responseTime: "نرد خلال 24 ساعة",
      faq: "الأسئلة الشائعة",
      liveChat: "المحادثة المباشرة",
      helpCenter: "مركز المساعدة",
    },

    // Footer
    footer: {
      description:
        "منصة IFROF تربط المشترين مباشرة بالمصانع الصينية الموثقة. نقضي على الوسطاء ونضمن لك أفضل الأسعار.",
      quickLinks: "روابط سريعة",
      legal: "قانوني",
      contact: "تواصل معنا",
      terms: "الشروط والأحكام",
      privacy: "سياسة الخصوصية",
      refund: "سياسة الاسترداد",
      copyright: "© 2026 IFROF. جميع الحقوق محفوظة.",
      madeWith: "صنع بـ ❤️ للتجارة العالمية",
      followUs: "تابعنا",
      newsletter: "النشرة البريدية",
      subscribeNewsletter: "اشترك في نشرتنا البريدية",
    },

    // Trust Badges
    trust: {
      noMiddlemen: "بدون وسطاء",
      directFactory: "مصنع مباشر",
      verified: "موثق",
      secure: "آمن",
      aiPowered: "ذكاء اصطناعي",
      support247: "دعم 24/7",
    },

    // Dashboard
    dashboard: {
      title: "لوحة التحكم",
      welcome: "مرحباً",
      overview: "نظرة عامة",
      recentActivity: "النشاط الأخير",
      accessDenied: "غير مصرح بالدخول",
      buyer: {
        title: "لوحة تحكم المشتري",
        subtitle: "إدارة طلباتك واستفساراتك",
        totalOrders: "إجمالي الطلبات",
        activeOrders: "الطلبات النشطة",
        totalInquiries: "إجمالي الاستفسارات",
        kycStatus: "حالة التحقق",
        notVerified: "غير موثق",
        newImportRequest: "طلب استيراد جديد",
        browseProducts: "تصفح المنتجات",
        smartAssistant: "المساعد الذكي",
        orders: "الطلبات",
        inquiries: "الاستفسارات",
        myOrders: "طلباتي",
        myInquiries: "استفساراتي",
        noOrders: "لا توجد طلبات",
        noInquiries: "لا توجد استفسارات",
        startShopping: "ابدأ التسوق",
        createInquiry: "إنشاء استفسار",
        trackShipment: "تتبع الشحنة",
        viewMessages: "عرض الرسائل",
        kycRequired: "التحقق من الهوية مطلوب",
        kycDescription: "يرجى إكمال التحقق من الهوية للوصول إلى جميع الميزات",
        startVerification: "بدء التحقق",
      },
      factory: {
        title: "لوحة تحكم المصنع",
        subtitle: "إدارة منتجاتك وطلباتك",
        totalProducts: "إجمالي المنتجات",
        totalServices: "إجمالي الخدمات",
        activeOrders: "الطلبات النشطة",
        pendingInquiries: "الاستفسارات المعلقة",
        orders: "الطلبات",
        inquiries: "الاستفسارات",
        products: "المنتجات",
        services: "الخدمات",
        recentOrders: "أحدث الطلبات",
        recentInquiries: "أحدث الاستفسارات",
        noOrders: "لا توجد طلبات",
        noInquiries: "لا توجد استفسارات",
        myProducts: "منتجاتي",
        myServices: "خدماتي",
        addProduct: "إضافة منتج",
        addService: "إضافة خدمة",
        noProducts: "لا توجد منتجات",
        noServices: "لا توجد خدمات",
        respond: "رد",
      },
      admin: {
        title: "لوحة تحكم المسؤول",
        subtitle: "إدارة المنصة",
        totalUsers: "إجمالي المستخدمين",
        totalFactories: "إجمالي المصانع",
        totalProducts: "إجمالي المنتجات",
        totalOrders: "إجمالي الطلبات",
        totalRevenue: "إجمالي الإيرادات",
        manageFactories: "إدارة المصانع",
        manageProducts: "إدارة المنتجات",
        manageOrders: "إدارة الطلبات",
        manageUsers: "إدارة المستخدمين",
        recentOrders: "أحدث الطلبات",
        recentInquiries: "أحدث طلبات الاستيراد",
        viewAll: "عرض الكل",
      },
    },

    // Cart
    cart: {
      title: "سلة التسوق",
      empty: "سلتك فارغة",
      items: "عناصر",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      total: "الإجمالي",
      checkout: "إتمام الشراء",
      continueShopping: "متابعة التسوق",
      remove: "إزالة",
      quantity: "الكمية",
      updateCart: "تحديث السلة",
    },

    // Checkout
    checkout: {
      title: "إتمام الشراء",
      shippingAddress: "عنوان الشحن",
      billingAddress: "عنوان الفوترة",
      paymentMethod: "طريقة الدفع",
      orderSummary: "ملخص الطلب",
      placeOrder: "تأكيد الطلب",
      processing: "جاري المعالجة...",
      success: "تم الطلب بنجاح!",
      error: "حدث خطأ في الطلب",
    },

    // Auth
    auth: {
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      resetPassword: "إعادة تعيين كلمة المرور",
      name: "الاسم",
      phone: "رقم الهاتف",
      company: "اسم الشركة",
      role: "نوع الحساب",
      buyer: "مشتري",
      factory: "مصنع",
      loginSuccess: "تم تسجيل الدخول بنجاح",
      registerSuccess: "تم إنشاء الحساب بنجاح",
      loginError: "خطأ في تسجيل الدخول",
      registerError: "خطأ في إنشاء الحساب",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      orContinueWith: "أو تابع باستخدام",
    },

    // Products
    products: {
      title: "المنتجات",
      all: "جميع المنتجات",
      featured: "منتجات مميزة",
      new: "منتجات جديدة",
      category: "الفئة",
      price: "السعر",
      minOrder: "الحد الأدنى للطلب",
      addToCart: "أضف للسلة",
      buyNow: "اشتر الآن",
      outOfStock: "غير متوفر",
      inStock: "متوفر",
      description: "الوصف",
      specifications: "المواصفات",
      reviews: "التقييمات",
      relatedProducts: "منتجات ذات صلة",
      noProducts: "لا توجد منتجات",
    },

    // Services
    services: {
      title: "الخدمات",
      all: "جميع الخدمات",
      ourServices: "خدماتنا",
      requestService: "طلب الخدمة",
      noServices: "لا توجد خدمات",
    },

    // Blog
    blog: {
      title: "المدونة",
      readMore: "اقرأ المزيد",
      latestPosts: "أحدث المقالات",
      categories: "الفئات",
      tags: "الوسوم",
      author: "الكاتب",
      publishedOn: "نشر في",
      noPosts: "لا توجد مقالات",
    },

    // Forum
    forum: {
      title: "المنتدى",
      newPost: "موضوع جديد",
      reply: "رد",
      views: "مشاهدات",
      replies: "ردود",
      noPosts: "لا توجد مواضيع",
    },

    // Common
    common: {
      search: "بحث",
      filter: "فلترة",
      sort: "ترتيب",
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      success: "تم بنجاح",
      cancel: "إلغاء",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      viewDetails: "عرض التفاصيل",
      contact: "تواصل",
      details: "التفاصيل",
      submit: "إرسال",
      back: "رجوع",
      next: "التالي",
      previous: "السابق",
      all: "الكل",
      none: "لا شيء",
      yes: "نعم",
      no: "لا",
      or: "أو",
      and: "و",
      close: "إغلاق",
      open: "فتح",
      more: "المزيد",
      less: "أقل",
      active: "نشط",
      inactive: "غير نشط",
      pending: "معلق",
      approved: "موافق عليه",
      rejected: "مرفوض",
      from: "من",
      to: "إلى",
      date: "التاريخ",
      time: "الوقت",
      status: "الحالة",
      actions: "الإجراءات",
      total: "الإجمالي",
      amount: "المبلغ",
      currency: "العملة",
      language: "اللغة",
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      notifications: "الإشعارات",
      messages: "الرسائل",
      help: "مساعدة",
    },

    // Errors
    errors: {
      required: "هذا الحقل مطلوب",
      invalid: "قيمة غير صالحة",
      network: "خطأ في الاتصال",
      server: "خطأ في الخادم",
      unauthorized: "غير مصرح",
      notFound: "غير موجود",
      forbidden: "محظور",
      badRequest: "طلب غير صالح",
      timeout: "انتهت المهلة",
      unknown: "خطأ غير معروف",
      tryAgain: "حاول مرة أخرى",
      goBack: "العودة",
      goHome: "الذهاب للرئيسية",
    },

    // About
    about: {
      title: "عن IFROF",
      mission: "مهمتنا",
      vision: "رؤيتنا",
      team: "فريقنا",
      story: "قصتنا",
    },

    // Legal
    legal: {
      terms: "الشروط والأحكام",
      privacy: "سياسة الخصوصية",
      refund: "سياسة الاسترداد",
      cookies: "سياسة ملفات تعريف الارتباط",
    },
  },

  en: {
    // Platform Name
    platform: {
      name: "IFROF",
      tagline: "Import Directly from the Factory",
      fullName: "IFROF Direct Import Platform",
    },

    // Navigation
    nav: {
      home: 'Home',
      manufacturers: 'Verified Manufacturers',
      howItWorks: 'How It Works',
      pricing: 'Pricing',
      blog: 'Blog',
      support: 'Support',
      smartAssistant: 'IFROF AI Factory Investigator',
      startImport: 'Start Import Request',
      logout: 'Logout',
      login: 'Login',
      myRequests: 'My Requests',
      dashboard: 'Dashboard',
    },

    // Hero Section - NEW POWERFUL VERSION
    hero: {
      badge: "Trusted B2B Platform",
      title: "Import Directly from Chinese Factories",
      titleHighlight: "No Middlemen",
      subtitle:
        "We connect you directly with verified Chinese manufacturers. We verify every factory with AI to ensure it's a direct manufacturer, not an intermediary.",
      cta: "Start Import Request",
      ctaSecondary: "See How It Works",
      stats: {
        manufacturers: "Verified Chinese Manufacturers",
        buyers: "Active Buyers",
        orders: "Successful Import Orders",
        savings: "Cost Savings",
      },
      trust: {
        title: "Why IFROF?",
        noMiddlemen: "No Middlemen",
        verified: "Verified Factories",
        aiPowered: "AI Powered",
        secure: "Secure Payment",
      },
    },

    // Smart Naming - Factory → Verified Chinese Manufacturer
    manufacturer: {
      title: "Verified Chinese Manufacturer",
      titlePlural: "Verified Chinese Manufacturers",
      verified: "Verified ✓",
      notVerified: "Pending Verification",
      direct: "Direct Manufacturer",
      notDirect: "Not Direct",
      badge: "IFROF Verified Manufacturer",
      certifications: "Certifications",
      capacity: "Production Capacity",
      employees: "Number of Employees",
      established: "Year Established",
      location: "Location",
      products: "Products",
      minOrder: "Minimum Order",
      responseTime: "Response Time",
      rating: "Rating",
      viewProfile: "View Profile",
      contactNow: "Contact Now",
      sendInquiry: "Send Inquiry",
    },

    // Smart Naming - Inquiry → Import Request
    importRequest: {
      title: "Import Request",
      titlePlural: "Import Requests",
      new: "New Import Request",
      submit: "Submit Import Request",
      status: {
        pending: "Under Review",
        approved: "Approved",
        inProgress: "In Progress",
        shipped: "Shipped",
        completed: "Completed",
        cancelled: "Cancelled",
        disputed: "Disputed",
        responded: "Responded",
        negotiating: "Negotiating",
      },
      form: {
        product: "Required Product",
        quantity: "Quantity",
        specifications: "Specifications",
        budget: "Estimated Budget",
        deadline: "Required Deadline",
        notes: "Additional Notes",
        destination: "Destination Country",
        shippingMethod: "Shipping Method",
        shippingMethodOptions: {
          air: "Air Freight",
          sea: "Sea Freight",
          land: "Land Transport",
          rail: "Rail Freight",
          multimodal: "Combined/Multimodal",
          other: "Other",
        },
        shippingDetails: "Additional Shipping Details",
        shippingCostEstimate: "Shipping Cost Estimate",
        attachments: "Attachments",
        addAttachment: "Add Attachment",
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
        "Looking for a clothing factory in Guangzhou",
        "I want a verified electronics manufacturer",
        "What are the best furniture factories?",
        "How do I verify a manufacturer?",
      ],
    },

    // Verification System
    verification: {
      title: "Verification System",
      directManufacturer: "Direct Manufacturer",
      trader: "Trader/Intermediary",
      tradingCompany: "Trading Company",
      confidence: "Confidence Score",
      verified: "Verified ✓",
      warning: "Warning: This is not a direct manufacturer",
      howWeVerify: "How We Verify",
      steps: {
        documents: "Official Document Review",
        factory: "Factory Visit (Optional)",
        ai: "AI Analysis",
        history: "Trade History Review",
      },
    },

    // How It Works
    howItWorks: {
      title: "How Does IFROF Work?",
      subtitle: "4 Simple Steps to Direct Import",
      steps: {
        step1: {
          title: "Submit Import Request",
          desc: "Specify the product, quantity, and required specifications",
        },
        step2: {
          title: "We Find the Right Manufacturer",
          desc: "AI searches and verifies direct manufacturers",
        },
        step3: {
          title: "Negotiate Directly",
          desc: "Communicate with the manufacturer directly through the platform",
        },
        step4: {
          title: "Receive Your Goods",
          desc: "We track shipping until your goods arrive",
        },
      },
    },

    // Pricing
    pricing: {
      title: "Pricing",
      subtitle: "Complete Transparency - No Hidden Fees",
      commission: "Commission on Orders",
      commissionRate: "2-3%",
      commissionDesc: "Only upon successful deal completion",
      verification: "Manufacturer Verification Fee",
      verificationFee: "$100",
      verificationDesc: "One-time per manufacturer",
      premium: "Premium Package for Manufacturers",
      premiumFee: "$200/month",
      premiumDesc: "Featured listing + Priority support",
      free: "Free for Buyers",
      freeDesc: "Registration and search completely free",
      getStarted: "Get Started",
      contactSales: "Contact Sales",
    },

    // Shipping
    shipping: {
      title: "International Shipping Services",
      subtitle: "Complete shipping solutions from China to the world",
      types: {
        air: {
          title: "Air Freight",
          desc: "Fastest option for urgent shipments",
          time: "3-7 days",
        },
        sea: {
          title: "Sea Freight",
          desc: "Most economical for large shipments",
          time: "20-40 days",
        },
        land: {
          title: "Land Transport",
          desc: "Ideal for neighboring countries",
          time: "10-20 days",
        },
        rail: {
          title: "Rail Freight",
          desc: "Balance between speed and cost",
          time: "15-25 days",
        },
        multimodal: {
          title: "Multimodal Shipping",
          desc: "Combination of different transport modes",
          time: "Depends on route",
        },
      },
      getQuote: "Get a Quote",
      trackShipment: "Track Shipment",
      estimatedTime: "Estimated Time",
      estimatedCost: "Estimated Cost",
    },

    // Support
    support: {
      title: "Support & Help",
      subtitle: "Our team is ready to help you",
      general: {
        title: "General Support",
        email: "support@ifrof.com",
        desc: "For general inquiries and assistance",
      },
      complaints: {
        title: "Complaints",
        email: "complain@ifrof.com",
        desc: "To file an official complaint",
      },
      disputes: {
        title: "Disputes",
        email: "dispute@ifrof.com",
        desc: "To resolve disputes between buyers and manufacturers",
      },
      responseTime: "We respond within 24 hours",
      faq: "FAQ",
      liveChat: "Live Chat",
      helpCenter: "Help Center",
    },

    // Footer
    footer: {
      description:
        "IFROF platform connects buyers directly with verified Chinese manufacturers. We eliminate middlemen and guarantee you the best prices.",
      quickLinks: "Quick Links",
      legal: "Legal",
      contact: "Contact Us",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
      copyright: "© 2026 IFROF. All rights reserved.",
      madeWith: "Made with ❤️ for Global Trade",
      followUs: "Follow Us",
      newsletter: "Newsletter",
      subscribeNewsletter: "Subscribe to our newsletter",
    },

    // Trust Badges
    trust: {
      noMiddlemen: "No Middlemen",
      directFactory: "Direct Factory",
      verified: "Verified",
      secure: "Secure",
      aiPowered: "AI Powered",
      support247: "24/7 Support",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome",
      overview: "Overview",
      recentActivity: "Recent Activity",
      accessDenied: "Access Denied",
      buyer: {
        title: "Buyer Dashboard",
        subtitle: "Manage your orders and inquiries",
        totalOrders: "Total Orders",
        activeOrders: "Active Orders",
        totalInquiries: "Total Inquiries",
        kycStatus: "KYC Status",
        notVerified: "Not Verified",
        newImportRequest: "New Import Request",
        browseProducts: "Browse Products",
        smartAssistant: "Smart Assistant",
        orders: "Orders",
        inquiries: "Inquiries",
        myOrders: "My Orders",
        myInquiries: "My Inquiries",
        noOrders: "No orders yet",
        noInquiries: "No inquiries yet",
        startShopping: "Start Shopping",
        createInquiry: "Create Inquiry",
        trackShipment: "Track Shipment",
        viewMessages: "View Messages",
        kycRequired: "KYC Verification Required",
        kycDescription:
          "Please complete KYC verification to access all features",
        startVerification: "Start Verification",
      },
      factory: {
        title: "Factory Dashboard",
        subtitle: "Manage your products and orders",
        totalProducts: "Total Products",
        totalServices: "Total Services",
        activeOrders: "Active Orders",
        pendingInquiries: "Pending Inquiries",
        orders: "Orders",
        inquiries: "Inquiries",
        products: "Products",
        services: "Services",
        recentOrders: "Recent Orders",
        recentInquiries: "Recent Inquiries",
        noOrders: "No orders yet",
        noInquiries: "No inquiries yet",
        myProducts: "My Products",
        myServices: "My Services",
        addProduct: "Add Product",
        addService: "Add Service",
        noProducts: "No products yet",
        noServices: "No services yet",
        respond: "Respond",
      },
      admin: {
        title: "Admin Dashboard",
        subtitle: "Platform Management",
        totalUsers: "Total Users",
        totalFactories: "Total Factories",
        totalProducts: "Total Products",
        totalOrders: "Total Orders",
        totalRevenue: "Total Revenue",
        manageFactories: "Manage Factories",
        manageProducts: "Manage Products",
        manageOrders: "Manage Orders",
        manageUsers: "Manage Users",
        recentOrders: "Recent Orders",
        recentInquiries: "Recent Import Requests",
        viewAll: "View All",
      },
    },

    // Cart
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      items: "items",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
      checkout: "Checkout",
      continueShopping: "Continue Shopping",
      remove: "Remove",
      quantity: "Quantity",
      updateCart: "Update Cart",
    },

    // Checkout
    checkout: {
      title: "Checkout",
      shippingAddress: "Shipping Address",
      billingAddress: "Billing Address",
      paymentMethod: "Payment Method",
      orderSummary: "Order Summary",
      placeOrder: "Place Order",
      processing: "Processing...",
      success: "Order placed successfully!",
      error: "Error placing order",
    },

    // Auth
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      name: "Name",
      phone: "Phone Number",
      company: "Company Name",
      role: "Account Type",
      buyer: "Buyer",
      factory: "Factory",
      loginSuccess: "Login successful",
      registerSuccess: "Registration successful",
      loginError: "Login error",
      registerError: "Registration error",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      orContinueWith: "Or continue with",
    },

    // Products
    products: {
      title: "Products",
      all: "All Products",
      featured: "Featured Products",
      new: "New Products",
      category: "Category",
      price: "Price",
      minOrder: "Minimum Order",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      description: "Description",
      specifications: "Specifications",
      reviews: "Reviews",
      relatedProducts: "Related Products",
      noProducts: "No products found",
    },

    // Services
    services: {
      title: "Services",
      all: "All Services",
      ourServices: "Our Services",
      requestService: "Request Service",
      noServices: "No services found",
    },

    // Blog
    blog: {
      title: "Blog",
      readMore: "Read More",
      latestPosts: "Latest Posts",
      categories: "Categories",
      tags: "Tags",
      author: "Author",
      publishedOn: "Published on",
      noPosts: "No posts found",
    },

    // Forum
    forum: {
      title: "Forum",
      newPost: "New Post",
      reply: "Reply",
      views: "Views",
      replies: "Replies",
      noPosts: "No posts found",
    },

    // Common
    common: {
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      viewDetails: "View Details",
      contact: "Contact",
      details: "Details",
      submit: "Submit",
      back: "Back",
      next: "Next",
      previous: "Previous",
      all: "All",
      none: "None",
      yes: "Yes",
      no: "No",
      or: "or",
      and: "and",
      close: "Close",
      open: "Open",
      more: "More",
      less: "Less",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      from: "From",
      to: "To",
      date: "Date",
      time: "Time",
      status: "Status",
      actions: "Actions",
      total: "Total",
      amount: "Amount",
      currency: "Currency",
      language: "Language",
      settings: "Settings",
      profile: "Profile",
      notifications: "Notifications",
      messages: "Messages",
      help: "Help",
    },

    // Errors
    errors: {
      required: "This field is required",
      invalid: "Invalid value",
      network: "Network error",
      server: "Server error",
      unauthorized: "Unauthorized",
      notFound: "Not found",
      forbidden: "Forbidden",
      badRequest: "Bad request",
      timeout: "Request timeout",
      unknown: "Unknown error",
      tryAgain: "Try again",
      goBack: "Go back",
      goHome: "Go home",
    },

    // About
    about: {
      title: "About IFROF",
      mission: "Our Mission",
      vision: "Our Vision",
      team: "Our Team",
      story: "Our Story",
    },

    // Legal
    legal: {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
      cookies: "Cookie Policy",
    },
  },

  zh: {
    // Platform Name
    platform: {
      name: "IFROF",
      tagline: "直接从工厂进口",
      fullName: "IFROF 直接进口平台",
    },

    // Navigation
    nav: {
      home: "首页",
      manufacturers: "认证厂家",
      howItWorks: "运作方式",
      pricing: "价格",
      blog: "博客",
      support: "支持",
      smartAssistant: "AI 工厂调查员",
      startImport: "开始进口申请",
      logout: "登出",
      login: "登录",
      myRequests: "我的申请",
      dashboard: "控制面板",
      quickDemo: "快速演示登录",
      shipping: "物流服务",
      marketplace: "市场",
      cart: "购物车",
      about: "关于我们",
      services: "服务",
      forum: "论坛",
      register: "注册",
    },

    // Hero Section
    hero: {
      badge: "可信赖的B2B平台",
      title: "直接从中国工厂进口",
      titleHighlight: "无中间商",
      subtitle:
        "我们直接连接您与经过验证的中国制造商。我们使用AI验证每家工厂，确保它是直接制造商，而非中间商。",
      cta: "开始进口申请",
      ctaSecondary: "了解运作方式",
      stats: {
        manufacturers: "认证中国制造商",
        buyers: "活跃买家",
        orders: "成功进口订单",
        savings: "成本节省",
      },
      trust: {
        title: "为什么选择IFROF？",
        noMiddlemen: "无中间商",
        verified: "认证工厂",
        aiPowered: "AI驱动",
        secure: "安全支付",
      },
    },

    // Manufacturer
    manufacturer: {
      title: "认证中国制造商",
      titlePlural: "认证中国制造商",
      verified: "已认证 ✓",
      notVerified: "待认证",
      direct: "直接制造商",
      notDirect: "非直接",
      badge: "IFROF认证制造商",
      certifications: "认证",
      capacity: "生产能力",
      employees: "员工人数",
      established: "成立年份",
      location: "位置",
      products: "产品",
      minOrder: "最小订单量",
      responseTime: "响应时间",
      rating: "评分",
      viewProfile: "查看资料",
      contactNow: "立即联系",
      sendInquiry: "发送询盘",
    },

    // Import Request
    importRequest: {
      title: "进口申请",
      titlePlural: "进口申请",
      new: "新进口申请",
      submit: "提交进口申请",
      status: {
        pending: "审核中",
        approved: "已批准",
        inProgress: "进行中",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消",
        disputed: "争议中",
        responded: "已回复",
        negotiating: "谈判中",
      },
      form: {
        product: "所需产品",
        quantity: "数量",
        specifications: "规格",
        budget: "预计预算",
        deadline: "截止日期",
        notes: "备注",
        destination: "目的地国家",
        shippingMethod: "运输方式",
        shippingMethodOptions: {
          air: "空运",
          sea: "海运",
          land: "陆运",
          rail: "铁路运输",
          multimodal: "多式联运",
          other: "其他",
        },
        shippingDetails: "额外运输详情",
        shippingCostEstimate: "预计运输费用",
        attachments: "附件",
        addAttachment: "添加附件",
      },
    },

    // Smart Assistant / AI Search
    smartAssistant: {
      title: "IFROF AI工厂调查员",
      subtitle: "帮助您找到经过验证的中国制造商并确认它们是直接工厂",
      searching: "正在搜索合适的制造商...",
      verifying: "正在验证制造商...",
      analyzing: "正在分析数据...",
      results: "结果",
      noResults: "未找到符合您条件的制造商",
      askMe: "问我任何问题",
      placeholder: "搜索产品或制造商...",
      searchButton: "搜索",
      clearButton: "清除",
      factoryFound: "家工厂找到",
      factoriesFound: "家工厂找到",
      confidence: "置信度",
      source: "来源",
      suggestions: [
        "寻找广州的服装厂",
        "我想要一家认证的电子制造商",
        "最好的家具工厂有哪些？",
        "如何验证制造商？",
      ],
    },

    // Verification System
    verification: {
      title: "验证系统",
      directManufacturer: "直接制造商",
      trader: "贸易商/中间商",
      tradingCompany: "贸易公司",
      confidence: "置信度",
      verified: "已验证 ✓",
      warning: "警告：这不是直接制造商",
      howWeVerify: "我们如何验证",
      steps: {
        documents: "官方文件审查",
        factory: "工厂参观（可选）",
        ai: "AI分析",
        history: "贸易历史审查",
      },
    },

    // How It Works
    howItWorks: {
      title: "IFROF如何运作？",
      subtitle: "直接进口的4个简单步骤",
      steps: {
        step1: {
          title: "提交进口申请",
          desc: "指定产品、数量和所需规格",
        },
        step2: {
          title: "我们为您找到合适的制造商",
          desc: "AI搜索并验证直接制造商",
        },
        step3: {
          title: "直接谈判",
          desc: "通过平台直接与制造商沟通",
        },
        step4: {
          title: "收到您的货物",
          desc: "我们跟踪运输直到货物到达",
        },
      },
    },

    // Pricing
    pricing: {
      title: "价格",
      subtitle: "完全透明 - 无隐藏费用",
      commission: "订单佣金",
      commissionRate: "2-3%",
      commissionDesc: "仅在交易成功完成时收取",
      verification: "制造商验证费",
      verificationFee: "$100",
      verificationDesc: "每个制造商一次性费用",
      premium: "制造商高级套餐",
      premiumFee: "$200/月",
      premiumDesc: "特色展示 + 优先支持",
      free: "买家免费",
      freeDesc: "注册和搜索完全免费",
      getStarted: "开始使用",
      contactSales: "联系销售",
    },

    // Shipping
    shipping: {
      title: "国际物流服务",
      subtitle: "从中国到世界的完整物流解决方案",
      types: {
        air: {
          title: "空运",
          desc: "紧急货物的最快选择",
          time: "3-7天",
        },
        sea: {
          title: "海运",
          desc: "大宗货物最经济的选择",
          time: "20-40天",
        },
        land: {
          title: "陆运",
          desc: "邻国的理想选择",
          time: "10-20天",
        },
        rail: {
          title: "铁路运输",
          desc: "速度与成本的平衡",
          time: "15-25天",
        },
        multimodal: {
          title: "多式联运",
          desc: "不同运输方式的组合",
          time: "取决于路线",
        },
      },
      getQuote: "获取报价",
      trackShipment: "跟踪货物",
      estimatedTime: "预计时间",
      estimatedCost: "预计费用",
    },

    // Support
    support: {
      title: "支持与帮助",
      subtitle: "我们的团队随时为您服务",
      general: {
        title: "一般支持",
        email: "support@ifrof.com",
        desc: "一般咨询和帮助",
      },
      complaints: {
        title: "投诉",
        email: "complain@ifrof.com",
        desc: "提交正式投诉",
      },
      disputes: {
        title: "争议",
        email: "dispute@ifrof.com",
        desc: "解决买家和制造商之间的争议",
      },
      responseTime: "我们在24小时内回复",
      faq: "常见问题",
      liveChat: "在线聊天",
      helpCenter: "帮助中心",
    },

    // Footer
    footer: {
      description:
        "IFROF平台直接连接买家与经过验证的中国制造商。我们消除中间商，为您保证最优价格。",
      quickLinks: "快速链接",
      legal: "法律",
      contact: "联系我们",
      terms: "条款和条件",
      privacy: "隐私政策",
      refund: "退款政策",
      copyright: "© 2026 IFROF. 保留所有权利。",
      madeWith: "为全球贸易用 ❤️ 打造",
      followUs: "关注我们",
      newsletter: "新闻通讯",
      subscribeNewsletter: "订阅我们的新闻通讯",
    },

    // Trust Badges
    trust: {
      noMiddlemen: "无中间商",
      directFactory: "直接工厂",
      verified: "已认证",
      secure: "安全",
      aiPowered: "AI驱动",
      support247: "24/7支持",
    },

    // Dashboard
    dashboard: {
      title: "控制面板",
      welcome: "欢迎",
      overview: "概览",
      recentActivity: "最近活动",
      accessDenied: "访问被拒绝",
      buyer: {
        title: "买家控制面板",
        subtitle: "管理您的订单和询盘",
        totalOrders: "总订单",
        activeOrders: "活跃订单",
        totalInquiries: "总询盘",
        kycStatus: "KYC状态",
        notVerified: "未认证",
        newImportRequest: "新进口申请",
        browseProducts: "浏览产品",
        smartAssistant: "智能助手",
        orders: "订单",
        inquiries: "询盘",
        myOrders: "我的订单",
        myInquiries: "我的询盘",
        noOrders: "暂无订单",
        noInquiries: "暂无询盘",
        startShopping: "开始购物",
        createInquiry: "创建询盘",
        trackShipment: "跟踪货物",
        viewMessages: "查看消息",
        kycRequired: "需要KYC验证",
        kycDescription: "请完成KYC验证以访问所有功能",
        startVerification: "开始验证",
      },
      factory: {
        title: "工厂控制面板",
        subtitle: "管理您的产品和订单",
        totalProducts: "总产品",
        totalServices: "总服务",
        activeOrders: "活跃订单",
        pendingInquiries: "待处理询盘",
        orders: "订单",
        inquiries: "询盘",
        products: "产品",
        services: "服务",
        recentOrders: "最近订单",
        recentInquiries: "最近询盘",
        noOrders: "暂无订单",
        noInquiries: "暂无询盘",
        myProducts: "我的产品",
        myServices: "我的服务",
        addProduct: "添加产品",
        addService: "添加服务",
        noProducts: "暂无产品",
        noServices: "暂无服务",
        respond: "回复",
      },
      admin: {
        title: "管理员控制面板",
        subtitle: "平台管理",
        totalUsers: "总用户",
        totalFactories: "总工厂",
        totalProducts: "总产品",
        totalOrders: "总订单",
        totalRevenue: "总收入",
        manageFactories: "管理工厂",
        manageProducts: "管理产品",
        manageOrders: "管理订单",
        manageUsers: "管理用户",
        recentOrders: "最近订单",
        recentInquiries: "最近进口申请",
        viewAll: "查看全部",
      },
    },

    // Cart
    cart: {
      title: "购物车",
      empty: "您的购物车是空的",
      items: "件商品",
      subtotal: "小计",
      shipping: "运费",
      total: "总计",
      checkout: "结账",
      continueShopping: "继续购物",
      remove: "移除",
      quantity: "数量",
      updateCart: "更新购物车",
    },

    // Checkout
    checkout: {
      title: "结账",
      shippingAddress: "收货地址",
      billingAddress: "账单地址",
      paymentMethod: "支付方式",
      orderSummary: "订单摘要",
      placeOrder: "下单",
      processing: "处理中...",
      success: "订单成功！",
      error: "下单出错",
    },

    // Auth
    auth: {
      login: "登录",
      register: "注册",
      logout: "登出",
      email: "邮箱",
      password: "密码",
      confirmPassword: "确认密码",
      forgotPassword: "忘记密码？",
      resetPassword: "重置密码",
      name: "姓名",
      phone: "电话号码",
      company: "公司名称",
      role: "账户类型",
      buyer: "买家",
      factory: "工厂",
      loginSuccess: "登录成功",
      registerSuccess: "注册成功",
      loginError: "登录错误",
      registerError: "注册错误",
      alreadyHaveAccount: "已有账户？",
      dontHaveAccount: "没有账户？",
      orContinueWith: "或继续使用",
    },

    // Products
    products: {
      title: "产品",
      all: "所有产品",
      featured: "特色产品",
      new: "新产品",
      category: "类别",
      price: "价格",
      minOrder: "最小订单量",
      addToCart: "加入购物车",
      buyNow: "立即购买",
      outOfStock: "缺货",
      inStock: "有货",
      description: "描述",
      specifications: "规格",
      reviews: "评价",
      relatedProducts: "相关产品",
      noProducts: "未找到产品",
    },

    // Services
    services: {
      title: "服务",
      all: "所有服务",
      ourServices: "我们的服务",
      requestService: "请求服务",
      noServices: "未找到服务",
    },

    // Blog
    blog: {
      title: "博客",
      readMore: "阅读更多",
      latestPosts: "最新文章",
      categories: "类别",
      tags: "标签",
      author: "作者",
      publishedOn: "发布于",
      noPosts: "未找到文章",
    },

    // Forum
    forum: {
      title: "论坛",
      newPost: "新帖子",
      reply: "回复",
      views: "浏览",
      replies: "回复",
      noPosts: "未找到帖子",
    },

    // Common
    common: {
      search: "搜索",
      filter: "筛选",
      sort: "排序",
      loading: "加载中...",
      error: "发生错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      delete: "删除",
      edit: "编辑",
      view: "查看",
      viewDetails: "查看详情",
      contact: "联系",
      details: "详情",
      submit: "提交",
      back: "返回",
      next: "下一步",
      previous: "上一步",
      all: "全部",
      none: "无",
      yes: "是",
      no: "否",
      or: "或",
      and: "和",
      close: "关闭",
      open: "打开",
      more: "更多",
      less: "更少",
      active: "活跃",
      inactive: "非活跃",
      pending: "待处理",
      approved: "已批准",
      rejected: "已拒绝",
      from: "从",
      to: "到",
      date: "日期",
      time: "时间",
      status: "状态",
      actions: "操作",
      total: "总计",
      amount: "金额",
      currency: "货币",
      language: "语言",
      settings: "设置",
      profile: "个人资料",
      notifications: "通知",
      messages: "消息",
      help: "帮助",
    },

    // Errors
    errors: {
      required: "此字段必填",
      invalid: "无效值",
      network: "网络错误",
      server: "服务器错误",
      unauthorized: "未授权",
      notFound: "未找到",
      forbidden: "禁止访问",
      badRequest: "错误请求",
      timeout: "请求超时",
      unknown: "未知错误",
      tryAgain: "重试",
      goBack: "返回",
      goHome: "回到首页",
    },

    // About
    about: {
      title: "关于IFROF",
      mission: "我们的使命",
      vision: "我们的愿景",
      team: "我们的团队",
      story: "我们的故事",
    },

    // Legal
    legal: {
      terms: "条款和条件",
      privacy: "隐私政策",
      refund: "退款政策",
      cookies: "Cookie政策",
    },
  },
} as const;

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  // Fallback to English if key not found in current language
  if (value === undefined && lang !== "en") {
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
  }

  return typeof value === "string" ? value : key;
}

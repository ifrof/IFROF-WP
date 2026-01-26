import { useState, useEffect } from "react";
import { translations } from "@/i18n/translations";

export function useLanguage() {
  const [lang, setLang] = useState<"en" | "zh" | "ar">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as "en" | "zh" | "ar") || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [lang]);

  const t = (key: keyof typeof translations.en) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { lang, setLang, t };
}

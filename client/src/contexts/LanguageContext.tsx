import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Language,
  DEFAULT_LANGUAGE,
  LANGUAGES,
  translations,
  getTranslation,
} from "@shared/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Initialize language from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang") as Language | null;

    if (
      langParam &&
      (langParam === "ar" || langParam === "en" || langParam === "zh")
    ) {
      setLanguageState(langParam);
      localStorage.setItem("language", langParam);
    } else {
      const stored = localStorage.getItem("language") as Language | null;
      if (stored && (stored === "ar" || stored === "en" || stored === "zh")) {
        setLanguageState(stored);
      }
    }
    setMounted(true);
  }, []);

  // Update document direction and language
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = LANGUAGES[language].dir;
      localStorage.setItem("language", language);

      // Update body class for RTL/LTR specific styles
      document.body.classList.remove("rtl", "ltr");
      document.body.classList.add(LANGUAGES[language].dir);
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const dir = LANGUAGES[language].dir as "ltr" | "rtl";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">{t("terms.title")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none">
          <h2>{t("terms.section1.title")}</h2>
          <p>{t("terms.section1.content")}</p>

          <h2>{t("terms.section2.title")}</h2>
          <p>{t("terms.section2.content")}</p>

          <h3>{t("terms.section2.subsection1.title")}</h3>
          <p>{t("terms.section2.subsection1.content")}</p>

          <h3>{t("terms.section2.subsection2.title")}</h3>
          <p>{t("terms.section2.subsection2.content")}</p>

          <h2>{t("terms.section3.title")}</h2>
          <p>{t("terms.section3.content")}</p>

          <h2>{t("terms.section4.title")}</h2>
          <p>{t("terms.section4.content")}</p>

          <h2>{t("terms.section5.title")}</h2>
          <p>{t("terms.section5.content")}</p>

          <h2>{t("terms.section6.title")}</h2>
          <p>{t("terms.section6.content")}</p>

          <h2>{t("terms.contact")}</h2>
          <p>
            {t("terms.contactEmail")}: <a href="mailto:legal@ifrof.com">legal@ifrof.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

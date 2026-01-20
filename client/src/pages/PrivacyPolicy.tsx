import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">{t("privacy.title")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none">
          <h2>{t("privacy.section1.title")}</h2>
          <p>{t("privacy.section1.content")}</p>

          <h2>{t("privacy.section2.title")}</h2>
          <p>{t("privacy.section2.content")}</p>

          <h3>{t("privacy.section2.subsection1.title")}</h3>
          <p>{t("privacy.section2.subsection1.content")}</p>

          <h3>{t("privacy.section2.subsection2.title")}</h3>
          <p>{t("privacy.section2.subsection2.content")}</p>

          <h2>{t("privacy.section3.title")}</h2>
          <p>{t("privacy.section3.content")}</p>

          <h2>{t("privacy.section4.title")}</h2>
          <p>{t("privacy.section4.content")}</p>

          <h2>{t("privacy.section5.title")}</h2>
          <p>{t("privacy.section5.content")}</p>

          <h2>{t("privacy.section6.title")}</h2>
          <p>{t("privacy.section6.content")}</p>

          <h2>{t("privacy.contact")}</h2>
          <p>
            {t("privacy.contactEmail")}: <a href="mailto:privacy@ifrof.com">privacy@ifrof.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

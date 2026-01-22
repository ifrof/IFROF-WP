
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  const { language, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={dir}>
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center border-b">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </CardTitle>
            <p className="text-gray-500 mt-2">
              {language === 'ar' ? 'آخر تحديث: 23 يناير 2026' : 'Last Updated: January 23, 2026'}
            </p>
          </CardHeader>
          <CardContent className="p-8 prose prose-orange max-w-none">
            {language === 'ar' ? (
              <div className="space-y-6 text-right">
                <section>
                  <h2 className="text-xl font-bold mb-3">1. قبول الشروط</h2>
                  <p>باستخدامك لمنصة إيفروف، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، فلا يجب عليك استخدام المنصة.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">2. خدمات المنصة</h2>
                  <p>إيفروف هي منصة B2B تربط المشترين بالمصانع الصينية. نحن لا نملك المنتجات ولا نضمن جودتها، ولكننا نوفر أدوات للتحقق والتواصل الآمن.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">3. الرسوم والعمولات</h2>
                  <p>تتقاضى المنصة عمولة قدرها 3% على الطلبات المقبولة. يتم دفع هذه العمولة عند قبول عرض السعر.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">4. حدود المسؤولية</h2>
                  <p>لا تتحمل إيفروف المسؤولية عن أي نزاعات تجارية بين المشتري والمصنع، ولكننا نسعى للمساعدة في حل النزاعات ودياً.</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                  <p>By using the IFROF platform, you agree to be bound by these terms and conditions. If you do not agree with any part of them, you must not use the platform.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">2. Platform Services</h2>
                  <p>IFROF is a B2B platform connecting buyers with Chinese factories. We do not own the products nor guarantee their quality, but we provide tools for verification and secure communication.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">3. Fees and Commissions</h2>
                  <p>The platform charges a 3% commission on accepted orders. This commission is payable upon acceptance of a quote.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-3">4. Limitation of Liability</h2>
                  <p>IFROF is not responsible for any commercial disputes between the buyer and the factory, but we strive to assist in resolving disputes amicably.</p>
                </section>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

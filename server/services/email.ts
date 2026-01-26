import { Resend } from "resend";
import { getSecrets } from "../config/secrets";

const secrets = getSecrets();
const resend = new Resend(secrets.RESEND_API_KEY);

interface EmailTemplate {
  subject: string;
  html: string;
}

const emailTemplates = {
  en: {
    verification: (token: string): EmailTemplate => ({
      subject: "Verify your IFROF account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to IFROF</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${secrets.FRONTEND_URL}/verify-email/${token}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This link expires in 24 hours. If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    }),
    paymentConfirmation: (amount: number, plan: string): EmailTemplate => ({
      subject: "Payment confirmed - IFROF subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Confirmed</h2>
          <p>Thank you for subscribing to IFROF!</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> Active</p>
          </div>
          <p>You can now search for verified Chinese manufacturers directly.</p>
          <a href="${secrets.FRONTEND_URL}/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
      `,
    }),
    factoryResults: (results: any[]): EmailTemplate => ({
      subject: "Your factory search results - IFROF",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Factory Search Results</h2>
          <p>We found ${results.length} verified manufacturers matching your criteria:</p>
          <div style="margin: 20px 0;">
            ${results
              .slice(0, 5)
              .map(
                (r) => `
              <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <h3>${r.companyName}</h3>
                <p><strong>Verification Score:</strong> ${r.verification.overallScore}%</p>
                <p><strong>Confidence:</strong> ${r.verification.confidence}</p>
                <p>${r.description}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <a href="${secrets.FRONTEND_URL}/search-results" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View All Results
          </a>
        </div>
      `,
    }),
  },
  ar: {
    verification: (token: string): EmailTemplate => ({
      subject: "تحقق من حسابك في IFROF",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2>مرحباً بك في IFROF</h2>
          <p>انقر على الرابط أدناه للتحقق من عنوان بريدك الإلكتروني:</p>
          <a href="${secrets.FRONTEND_URL}/verify-email/${token}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            التحقق من البريد
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            ينتهي صلاحية هذا الرابط خلال 24 ساعة. إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.
          </p>
        </div>
      `,
    }),
    paymentConfirmation: (amount: number, plan: string): EmailTemplate => ({
      subject: "تم تأكيد الدفع - اشتراك IFROF",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2>تم تأكيد الدفع</h2>
          <p>شكراً لاشتراكك في IFROF!</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>الخطة:</strong> ${plan}</p>
            <p><strong>المبلغ:</strong> $${(amount / 100).toFixed(2)}</p>
            <p><strong>الحالة:</strong> نشط</p>
          </div>
          <p>يمكنك الآن البحث عن الشركات المصنعة الصينية المتحققة مباشرة.</p>
          <a href="${secrets.FRONTEND_URL}/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            الذهاب إلى لوحة التحكم
          </a>
        </div>
      `,
    }),
    factoryResults: (results: any[]): EmailTemplate => ({
      subject: "نتائج البحث عن المصانع - IFROF",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2>نتائج البحث عن المصانع</h2>
          <p>وجدنا ${results.length} شركة مصنعة موثوقة تطابق معاييرك:</p>
          <div style="margin: 20px 0;">
            ${results
              .slice(0, 5)
              .map(
                (r) => `
              <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <h3>${r.companyName}</h3>
                <p><strong>درجة التحقق:</strong> ${r.verification.overallScore}%</p>
                <p><strong>الثقة:</strong> ${r.verification.confidence}</p>
                <p>${r.description}</p>
              </div>
            `
              )
              .join("")}
          </div>
          <a href="${secrets.FRONTEND_URL}/search-results" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            عرض جميع النتائج
          </a>
        </div>
      `,
    }),
  },
};

export async function sendVerificationEmail(
  email: string,
  token: string,
  language: "en" | "ar" | "zh" = "en"
) {
  const template = emailTemplates[language]?.verification(token) || emailTemplates.en.verification(token);

  return resend.emails.send({
    from: secrets.EMAIL_FROM,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendPaymentConfirmation(
  email: string,
  amount: number,
  plan: string,
  language: "en" | "ar" | "zh" = "en"
) {
  const template =
    emailTemplates[language]?.paymentConfirmation(amount, plan) ||
    emailTemplates.en.paymentConfirmation(amount, plan);

  return resend.emails.send({
    from: secrets.EMAIL_FROM,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendFactoryResults(
  email: string,
  results: any[],
  language: "en" | "ar" | "zh" = "en"
) {
  const template =
    emailTemplates[language]?.factoryResults(results) ||
    emailTemplates.en.factoryResults(results);

  return resend.emails.send({
    from: secrets.EMAIL_FROM,
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

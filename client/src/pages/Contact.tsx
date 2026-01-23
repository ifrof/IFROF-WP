import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton />
      <h1 className="text-4xl font-bold mb-8 text-center">
        {language === "ar" ? "اتصل بنا" : "Contact Us"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{language === "ar" ? "البريد الإلكتروني" : "Email"}</h3>
              <p className="text-muted-foreground">support@ifrof.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{language === "ar" ? "الهاتف" : "Phone"}</h3>
              <p className="text-muted-foreground">{language === "ar" ? "متاح عبر البريد الإلكتروني" : "Available via email"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{language === "ar" ? "العنوان" : "Address"}</h3>
              <p className="text-muted-foreground">
                {language === "ar" 
                  ? "قوانغتشو، الصين" 
                  : "Guangzhou, China"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === "ar" ? "الاسم" : "Name"}</label>
              <Input placeholder={language === "ar" ? "اسمك الكامل" : "Your full name"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === "ar" ? "البريد الإلكتروني" : "Email"}</label>
              <Input type="email" placeholder="name@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "ar" ? "الموضوع" : "Subject"}</label>
            <Input placeholder={language === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help?"} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "ar" ? "الرسالة" : "Message"}</label>
            <Textarea 
              placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."} 
              rows={5}
            />
          </div>
          <Button className="w-full">
            {language === "ar" ? "إرسال الرسالة" : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

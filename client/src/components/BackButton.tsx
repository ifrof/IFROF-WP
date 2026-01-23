import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export function BackButton() {
  const { language, dir } = useLanguage();
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // If there's history, go back, otherwise go to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
    >
      {dir === "rtl" ? (
        <ArrowRight className="h-4 w-4" />
      ) : (
        <ArrowLeft className="h-4 w-4" />
      )}
      <span>{language === "ar" ? "رجوع" : "Back"}</span>
    </Button>
  );
}

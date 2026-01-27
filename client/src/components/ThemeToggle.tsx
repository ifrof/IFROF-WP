import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 rounded-full"
      onClick={toggleTheme}
      aria-label={
        language === "ar"
          ? "تبديل الوضع الليلي"
          : theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

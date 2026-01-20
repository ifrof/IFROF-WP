import { Button } from "@/components/ui/button";
import {
  getOAuthLoginUrl,
  isOAuthConfigured,
  logOAuthConfigErrorOnce,
  OAUTH_UNAVAILABLE_MESSAGE,
} from "@/config/env";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type OAuthLoginButtonProps = {
  label: string;
  buttonClassName?: string;
  messageClassName?: string;
};

export function OAuthLoginButton({
  label,
  buttonClassName,
  messageClassName,
}: OAuthLoginButtonProps) {
  const oauthConfigured = isOAuthConfigured();

  useEffect(() => {
    if (oauthConfigured) return;
    logOAuthConfigErrorOnce();
  }, [oauthConfigured]);

  const handleLogin = () => {
    const loginUrl = getOAuthLoginUrl();
    if (!loginUrl) {
      logOAuthConfigErrorOnce();
      return;
    }
    window.location.assign(loginUrl);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={handleLogin}
        disabled={!oauthConfigured}
        className={buttonClassName}
      >
        {label}
      </Button>
      {!oauthConfigured && (
        <p
          className={cn(
            "text-sm text-muted-foreground text-center",
            messageClassName
          )}
        >
          {OAUTH_UNAVAILABLE_MESSAGE}
        </p>
      )}
    </div>
  );
}

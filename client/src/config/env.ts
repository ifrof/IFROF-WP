export type OAuthConfig = {
  oauthPortalUrl: string | null;
  appId: string | null;
};

type OAuthEnv = {
  VITE_OAUTH_PORTAL_URL?: string;
  VITE_APP_ID?: string;
};

export const OAUTH_UNAVAILABLE_MESSAGE =
  "Login is temporarily unavailable. Please contact support@ifrof.com";

const normalizeEnvValue = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizePortalUrl = (value: string | null): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
};

export const createOAuthConfig = (env: OAuthEnv = import.meta.env): OAuthConfig => {
  const portalUrl = normalizePortalUrl(normalizeEnvValue(env.VITE_OAUTH_PORTAL_URL));
  const appId = normalizeEnvValue(env.VITE_APP_ID);

  return {
    oauthPortalUrl: portalUrl,
    appId,
  };
};

export const oauthConfig = createOAuthConfig();

export const isOAuthConfigured = (config: OAuthConfig = oauthConfig): boolean =>
  Boolean(config.oauthPortalUrl && config.appId);

export const getOAuthLoginUrl = (
  returnTo?: string,
  config: OAuthConfig = oauthConfig
): string | null => {
  if (!isOAuthConfigured(config)) return null;
  if (typeof window === "undefined" && !returnTo) return null;

  const redirectUri =
    returnTo ?? `${window.location.origin}/api/oauth/callback`;
  if (!redirectUri) return null;

  const state = btoa(redirectUri);
  const baseUrl = config.oauthPortalUrl!.endsWith("/")
    ? config.oauthPortalUrl!
    : `${config.oauthPortalUrl!}/`;
  const url = new URL("app-auth", baseUrl);

  url.searchParams.set("appId", config.appId!);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

let hasLoggedOAuthConfigError = false;

export const logOAuthConfigErrorOnce = (context?: string) => {
  if (hasLoggedOAuthConfigError) return;
  hasLoggedOAuthConfigError = true;
  const suffix = context ? ` ${context}` : "";
  console.error(
    `Login is temporarily unavailable. OAuth configuration is missing or invalid.${suffix}`
  );
};

export const resetOAuthConfigErrorLogForTests = () => {
  hasLoggedOAuthConfigError = false;
};

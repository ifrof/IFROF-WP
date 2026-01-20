import { describe, expect, it } from "vitest";
import {
  createOAuthConfig,
  getOAuthLoginUrl,
  isOAuthConfigured,
} from "@/config/env";

const ensureBtoa = () => {
  if (typeof globalThis.btoa === "function") return;
  globalThis.btoa = (value: string) =>
    Buffer.from(value, "utf-8").toString("base64");
};

describe("OAuth env config", () => {
  it("returns a login URL when configured", () => {
    ensureBtoa();
    const config = createOAuthConfig({
      VITE_OAUTH_PORTAL_URL: "https://auth.ifrof.com",
      VITE_APP_ID: "ifrof-app",
    });

    expect(isOAuthConfigured(config)).toBe(true);

    const redirectUri = "https://ifrof.com/api/oauth/callback";
    const loginUrl = getOAuthLoginUrl(redirectUri, config);

    expect(loginUrl).not.toBeNull();
    const url = new URL(loginUrl!);
    expect(url.origin).toBe("https://auth.ifrof.com");
    expect(url.pathname).toBe("/app-auth");
    expect(url.searchParams.get("appId")).toBe("ifrof-app");
    expect(url.searchParams.get("redirectUri")).toBe(redirectUri);
    expect(url.searchParams.get("state")).toBe(btoa(redirectUri));
    expect(url.searchParams.get("type")).toBe("signIn");
  });

  it("returns null when env is missing", () => {
    const config = createOAuthConfig({});

    expect(isOAuthConfigured(config)).toBe(false);
    expect(getOAuthLoginUrl("https://ifrof.com/api/oauth/callback", config)).toBeNull();
  });

  it("rejects invalid or non-https portal URLs", () => {
    const httpConfig = createOAuthConfig({
      VITE_OAUTH_PORTAL_URL: "http://auth.ifrof.com",
      VITE_APP_ID: "ifrof-app",
    });

    expect(isOAuthConfigured(httpConfig)).toBe(false);
    expect(httpConfig.oauthPortalUrl).toBeNull();

    const invalidConfig = createOAuthConfig({
      VITE_OAUTH_PORTAL_URL: "not-a-url",
      VITE_APP_ID: "ifrof-app",
    });

    expect(isOAuthConfigured(invalidConfig)).toBe(false);
    expect(invalidConfig.oauthPortalUrl).toBeNull();
  });
});

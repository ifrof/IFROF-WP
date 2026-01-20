import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import React from "react";

const getOAuthLoginUrl = vi.fn();
const isOAuthConfigured = vi.fn();
const logOAuthConfigErrorOnce = vi.fn();

vi.mock("@/config/env", () => ({
  getOAuthLoginUrl,
  isOAuthConfigured,
  logOAuthConfigErrorOnce,
  OAUTH_UNAVAILABLE_MESSAGE:
    "Login is temporarily unavailable. Please contact support@ifrof.com",
}));

import { OAuthLoginButton } from "@/components/OAuthLoginButton";

describe("OAuthLoginButton", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it("disables the button and shows a message when OAuth is missing", () => {
    isOAuthConfigured.mockReturnValue(false);
    getOAuthLoginUrl.mockReturnValue(null);

    act(() => {
      root.render(<OAuthLoginButton label="Login" />);
    });

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button?.disabled).toBe(true);
    expect(container.textContent).toContain(
      "Login is temporarily unavailable. Please contact support@ifrof.com"
    );
  });

  it("redirects when configured", () => {
    isOAuthConfigured.mockReturnValue(true);
    getOAuthLoginUrl.mockReturnValue("https://auth.ifrof.com/app-auth");

    const assignSpy = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => undefined as never);

    act(() => {
      root.render(<OAuthLoginButton label="Login" />);
    });

    const button = container.querySelector("button");
    expect(button).not.toBeNull();

    act(() => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(assignSpy).toHaveBeenCalledWith("https://auth.ifrof.com/app-auth");
    assignSpy.mockRestore();
  });
});

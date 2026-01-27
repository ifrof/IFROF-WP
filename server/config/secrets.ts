import { z } from "zod";

const secretsSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().or(z.string().startsWith("mysql://")),

  // Security
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_PRICE_ID_BASIC: z.string(),
  STRIPE_PRICE_ID_PRO: z.string(),

  // Email
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string().email(),
  EMAIL_SUPPORT: z.string().email(),

  // Redis
  REDIS_URL: z.string().url().or(z.string().startsWith("redis://")),

  // Application
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().default("3000"),
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  WEBHOOK_URL: z.string().url(),

  // CORS
  CORS_ORIGINS: z.string(),

  // Feature flags
  ENABLE_EMAIL_NOTIFICATIONS: z.string().transform(v => v === "true"),
  ENABLE_STRIPE_PAYMENTS: z.string().transform(v => v === "true"),
  ENABLE_AI_VERIFICATION: z.string().transform(v => v === "true"),
  ENABLE_ADMIN_DASHBOARD: z.string().transform(v => v === "true"),

  // AI Services
  ANTHROPIC_API_KEY: z.string().optional(),
});

export type Secrets = z.infer<typeof secretsSchema>;

let secrets: Secrets | null = null;

export function validateSecrets(): Secrets {
  if (secrets) return secrets;

  try {
    const raw = {
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      SESSION_SECRET: process.env.SESSION_SECRET,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_PRICE_ID_BASIC: process.env.STRIPE_PRICE_ID_BASIC,
      STRIPE_PRICE_ID_PRO: process.env.STRIPE_PRICE_ID_PRO,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM,
      EMAIL_SUPPORT: process.env.EMAIL_SUPPORT,
      REDIS_URL: process.env.REDIS_URL,
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      BACKEND_URL: process.env.BACKEND_URL,
      WEBHOOK_URL: process.env.WEBHOOK_URL,
      CORS_ORIGINS: process.env.CORS_ORIGINS,
      ENABLE_EMAIL_NOTIFICATIONS:
        process.env.ENABLE_EMAIL_NOTIFICATIONS || "true",
      ENABLE_STRIPE_PAYMENTS: process.env.ENABLE_STRIPE_PAYMENTS || "true",
      ENABLE_AI_VERIFICATION: process.env.ENABLE_AI_VERIFICATION || "true",
      ENABLE_ADMIN_DASHBOARD: process.env.ENABLE_ADMIN_DASHBOARD || "true",
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    };

    secrets = secretsSchema.parse(raw);
    console.log("✅ All secrets validated successfully");
    return secrets;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ CRITICAL: Missing or invalid environment variables:");
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export function getSecrets(): Secrets {
  return secrets || validateSecrets();
}

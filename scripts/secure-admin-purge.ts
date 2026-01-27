import * as db from "../server/db";
import * as schema from "../drizzle/schema";
import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import fs from "fs";
import path from "path";

async function secureAdminPurge() {
  console.log("[Security] Starting Admin Purge and Secure Creation...");

  try {
    // We will use the internal db.ts logic which handles fallbacks
    console.log("[Security] Initializing database access...");

    // 1. Purge all existing admin accounts
    console.log("[Security] Purging all existing admin accounts...");
    const localDbPath = path.join(process.cwd(), "local_db.json");
    if (fs.existsSync(localDbPath)) {
      const data = JSON.parse(fs.readFileSync(localDbPath, "utf-8"));
      const originalCount = data.users.length;
      data.users = data.users.filter((u: any) => u.role !== "admin");
      console.log(
        `[Security] Purged ${originalCount - data.users.length} admin accounts from JSON DB.`
      );
      fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
    }

    // Also try MySQL if available
    try {
      const mysqlDb = await db.getDb();
      if (mysqlDb && !mysqlDb.isJsonMode) {
        await mysqlDb
          .delete(schema.users)
          .where(eq(schema.users.role, "admin"));
        console.log("[Security] Purged admin accounts from MySQL.");
      }
    } catch (e) {
      console.log(
        "[Security] MySQL purge skipped or failed (likely not configured)."
      );
    }

    // 2. Generate high-entropy credentials
    const newAdminEmail = `admin_${crypto.randomBytes(4).toString("hex")}@ifrof.com`;
    const newAdminPassword = crypto.randomBytes(24).toString("base64"); // Extremely strong password
    const hashedPassword = await bcrypt.hash(newAdminPassword, 10); // Standard salt rounds used in auth-complete.ts
    const openId = crypto.randomBytes(32).toString("hex"); // High entropy OpenID

    console.log("[Security] Creating new secure admin account...");

    // 3. Create the new admin
    const newUser = {
      email: newAdminEmail,
      password: hashedPassword,
      role: "admin" as const,
      name: "System Administrator",
      openId: openId,
      loginMethod: "email",
      emailVerified: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    await db.upsertUser(newUser);

    console.log("\n====================================================");
    console.log("   SECURE ADMIN CREATED SUCCESSFULLY");
    console.log("====================================================");
    console.log(`Email: ${newAdminEmail}`);
    console.log(`Password: ${newAdminPassword}`);
    console.log(`OpenID: ${openId}`);
    console.log("====================================================\n");
    console.log(
      "IMPORTANT: Save these credentials securely. All other admin accounts have been deleted."
    );
  } catch (error) {
    console.error("[Security] Error during admin purge/creation:", error);
  }
}

secureAdminPurge().then(() => process.exit(0));

import * as db from "../server/db";
import * as schema from "../drizzle/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const email = "ifrof4@gmail.com";
  const password = "IFROF_Admin_2026_Secure_Strong!"; // كلمة مرور قوية جداً
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // التحقق من وجود المستخدم
    const existingUser = await db.getUserByEmail(email);

    if (existingUser) {
      console.log("User already exists, updating to admin...");
      // تحديث المستخدم الحالي ليكون أدمن
      const dbInstance = await db.getDb();
      if (dbInstance) {
        await dbInstance
          .update(schema.users)
          .set({
            role: "admin",
            isVerified: true,
            password: hashedPassword,
          })
          .where(eq(schema.users.email, email));
        console.log("User updated to Admin successfully.");
      } else {
        // Fallback for JSON mode if needed
        existingUser.role = "admin";
        existingUser.isVerified = true;
        existingUser.password = hashedPassword;
        console.log("User updated in JSON mode.");
      }
    } else {
      console.log("Creating new Admin user...");
      // إنشاء مستخدم جديد
      await db.upsertUser({
        email,
        password: hashedPassword,
        role: "admin",
        fullName: "Hady Essam",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("New Admin user created successfully.");
    }

    console.log("\n-----------------------------------");
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("Dashboard: https://ifrof.com/login");
    console.log("-----------------------------------\n");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin().then(() => process.exit(0));

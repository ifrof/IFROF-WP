import * as db from '../server/db';
import bcrypt from 'bcrypt';

async function testLogin() {
  const email = 'admin_deda4d38@ifrof.com';
  const password = '55Sc1UA9q/TRvBn/Co3ExEIwMgSb20K8';

  console.log(`[Test] Testing login for: ${email}`);

  try {
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      console.error("[Test] FAILED: User not found in database.");
      return;
    }

    console.log("[Test] User found. Role:", user.role);
    console.log("[Test] Email Verified:", user.emailVerified);

    if (!user.password) {
      console.error("[Test] FAILED: User has no password set.");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log("[Test] SUCCESS: Password matches!");
      if (user.role === 'admin' && user.emailVerified === 1) {
        console.log("[Test] FINAL VERDICT: Login will succeed on production.");
      } else {
        console.log("[Test] FINAL VERDICT: Login might fail due to role or verification status.");
      }
    } else {
      console.error("[Test] FAILED: Password does not match.");
    }

  } catch (error) {
    console.error("[Test] Error during login test:", error);
  }
}

testLogin().then(() => process.exit(0));

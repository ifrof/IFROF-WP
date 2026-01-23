import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

/**
 * Utility to report critical errors to the admin dashboard/logs
 */
export const reportErrorToAdmin = async (error: Error, context?: any) => {
  console.error(`[CRITICAL_ERROR] ${error.message}`, {
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });

  // In a real implementation, we would insert into a 'system_errors' table
  // or send an email/Slack notification to the admin.
  try {
    const db = await getDb();
    // Example: await db.insert(schema.systemLogs).values({ ... });
  } catch (e) {
    console.error("Failed to save error to database", e);
  }
};

import { Lucia } from "lucia";
import { MySQLAdapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";
import { ENV } from "./env";

const pool = ENV.databaseUrl ? mysql.createPool(ENV.databaseUrl) : null;

export const lucia = pool
  ? new Lucia(new MySQLAdapter(pool, { user: "users", session: "sessions" }), {
      sessionCookie: {
        attributes: {
          secure: ENV.isProduction,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        },
      },
    })
  : null;

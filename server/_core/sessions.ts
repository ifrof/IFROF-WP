import crypto from "crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { User } from "../../drizzle/schema";
import { getSessionCookieOptions } from "./cookies";
import { lucia } from "./lucia";
import * as db from "../db";

const getCookieValue = (req: Request, name: string) => {
  const cookies = req.cookies ?? parseCookieHeader(req.headers.cookie ?? "");
  return cookies?.[name];
};

export const getSessionIdFromRequest = (req: Request) =>
  getCookieValue(req, COOKIE_NAME);

export async function createUserSession(
  userId: number,
  req: Request,
  res: Response,
  options: { maxAgeMs?: number } = {}
) {
  const maxAgeMs = options.maxAgeMs ?? ONE_YEAR_MS;
  const cookieOptions = getSessionCookieOptions(req);

  if (lucia) {
    const session = await lucia.createSession(String(userId), {});
    res.cookie(COOKIE_NAME, session.id, {
      ...cookieOptions,
      maxAge: maxAgeMs,
    });
    return session.id;
  }

  const sessionToken = crypto.randomBytes(32).toString("hex");
  await db.createSession({
    id: sessionToken,
    userId,
    expiresAt: new Date(Date.now() + maxAgeMs),
  });
  res.cookie(COOKIE_NAME, sessionToken, {
    ...cookieOptions,
    maxAge: maxAgeMs,
  });
  return sessionToken;
}

export async function clearUserSession(req: Request, res: Response) {
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId) {
    return;
  }

  if (lucia) {
    await lucia.invalidateSession(sessionId);
  }

  await db.deleteSession(sessionId);

  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
}

export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId) {
    return null;
  }

  if (lucia) {
    const { session } = await lucia.validateSession(sessionId);
    if (session?.userId) {
      const userId = Number(session.userId);
      if (!Number.isNaN(userId)) {
        const user = await db.getUserById(userId);
        if (user) {
          return user;
        }
      }
    }
  }

  const dbSession = await db.getSession(sessionId);
  if (!dbSession) {
    return null;
  }

  if (new Date() > new Date(dbSession.expiresAt)) {
    await db.deleteSession(sessionId);
    return null;
  }

  return db.getUserById(dbSession.userId);
}

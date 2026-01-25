import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../_core/sessions";

export async function attachAuthUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const user = await getAuthenticatedUser(req);
    if (user) {
      (req as Request & { user?: typeof user }).user = user;
    }
  } catch (error) {
    console.warn("[Auth] Failed to attach user", error);
  }
  next();
}

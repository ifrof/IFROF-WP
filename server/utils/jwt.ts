import * as jose from "jose";
import { getSecrets } from "../config/secrets";

const secrets = getSecrets();

const jwtSecret = new TextEncoder().encode(secrets.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(secrets.REFRESH_TOKEN_SECRET);

export interface JWTPayload {
  sub: string; // user ID
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export async function generateAccessToken(userId: string, role: "user" | "admin"): Promise<string> {
  return await new jose.SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(jwtSecret);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const verified = await jose.jwtVerify(token, jwtSecret);
    return verified.payload as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string }> {
  try {
    const verified = await jose.jwtVerify(token, refreshSecret);
    return { sub: verified.payload.sub as string };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export async function rotateTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const payload = await verifyRefreshToken(refreshToken);
    const newAccessToken = await generateAccessToken(payload.sub, "user");
    const newRefreshToken = await generateRefreshToken(payload.sub);
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new Error("Token rotation failed");
  }
}

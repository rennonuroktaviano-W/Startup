import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import type { Role, User } from "@prisma/client";

export const SESSION_COOKIE = "ki_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export type SessionUser = Pick<User, "id" | "name" | "email" | "role" | "status" | "lastLoginAt">;

export async function establishSession(
  userId: string,
  ipMasked?: string | null,
  userAgentSummary?: string | null,
): Promise<void> {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const session = await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
      ipMasked: ipMasked ?? null,
      userAgentSummary: userAgentSummary ?? null,
    },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  store.delete(SESSION_COOKIE);
}

export const getSession = cache(async (): Promise<{ user: SessionUser; sessionId: string } | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    if (session && !session.revokedAt) {
      await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    }
    return null;
  }
  const { user } = session;
  if (user.status !== "ACTIVE") {
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    return null;
  }
  return {
    sessionId: session.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    },
  };
});

export async function getRequiredSession(): Promise<{ user: SessionUser; sessionId: string }> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
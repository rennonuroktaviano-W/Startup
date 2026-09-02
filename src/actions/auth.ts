"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { hash, verify } from "argon2";
import { prisma } from "@/lib/db";
import { establishSession, destroySession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const LOCK_LIMIT = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

export type LoginResult =
  | { ok: true }
  | { ok: false; message: string; field?: "email" | "password" };

export async function login(input: { email: string; password: string }): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Periksa kembali isianmu.",
      field: first?.path[0] === "password" ? "password" : "email",
    };
  }
  const { email, password } = parsed.data;

  const now = Date.now();
  const attempt = attempts.get(email);
  if (attempt && attempt.resetAt > now && attempt.count >= LOCK_LIMIT) {
    return { ok: false, message: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "ACTIVE") {
    registerAttempt(email, now);
    await logAudit({ action: "login_failed", summary: { email, reason: "no_user" } });
    return { ok: false, message: "Email atau password salah.", field: "email" };
  }

  let valid = false;
  try {
    valid = await verify(user.passwordHash, password);
  } catch {
    valid = false;
  }
  if (!valid) {
    registerAttempt(email, now);
    await logAudit({ actorId: user.id, action: "login_failed", summary: { reason: "wrong_password" } });
    return { ok: false, message: "Email atau password salah.", field: "password" };
  }

  attempts.delete(email);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip");
  const ua = h.get("user-agent")?.slice(0, 120);
  await establishSession(user.id, ip, ua);
  await logAudit({ actorId: user.id, action: "login_success", summary: { email } });

  return { ok: true };
}

function registerAttempt(email: string, now: number) {
  const existing = attempts.get(email);
  if (!existing || existing.resetAt < now) {
    attempts.set(email, { count: 1, resetAt: now + LOCK_WINDOW_MS });
    return;
  }
  existing.count += 1;
}

export async function logout(): Promise<void> {
  await destroySession();
  await logAudit({ action: "logout" });
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}
"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/actions/auth";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { hashToken } from "@/lib/auth/session";

const roleSchema = z.object({ id: z.string().cuid(), role: z.enum(["SUPER_ADMIN", "CONTENT_EDITOR", "SALES"]) });

export async function updateUserRole(input: z.infer<typeof roleSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "users:manage");
  const { id, role } = roleSchema.parse(input);
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { ok: false as const, message: "User tidak ditemukan." };
  if (target.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const other = await prisma.user.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE", id: { not: id } } });
    if (other === 0) return { ok: false as const, message: "Super Admin terakhir tidak bisa diturunkan." };
  }
  await prisma.user.update({ where: { id }, data: { role } });
  await logAudit({ actorId: session.user.id, action: "role_change", entityType: "User", entityId: id, summary: { from: target.role, to: role } });
  return { ok: true as const };
}

export async function setUserStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "users:manage");
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { ok: false as const, message: "User tidak ditemukan." };
  if (target.role === "SUPER_ADMIN" && status === "INACTIVE") {
    const other = await prisma.user.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE", id: { not: id } } });
    if (other === 0) return { ok: false as const, message: "Super Admin terakhir tidak bisa dinonaktifkan." };
  }
  await prisma.user.update({ where: { id }, data: { status } });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "User", entityId: id, summary: { status } });
  return { ok: true as const };
}

const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email(), role: z.enum(["SUPER_ADMIN", "CONTENT_EDITOR", "SALES"]) });

export async function createAdmin(input: z.infer<typeof createUserSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "users:manage");
  const { name, email, role } = createUserSchema.parse(input);
  const password = `temp-${Math.random().toString(36).slice(2, 10)}`;
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash, role, status: "ACTIVE" },
  });
  await logAudit({ actorId: session.user.id, action: "create", entityType: "User", entityId: user.id, summary: { email, role } });
  // Password is returned once via this result so the creator can hand it over.
  return { ok: true as const, id: user.id, tempPassword: password };
}

export async function forceLogout(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "users:manage");
  await prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "User", entityId: id, summary: { forceLogout: true } });
  return { ok: true as const };
}

export { hashToken };

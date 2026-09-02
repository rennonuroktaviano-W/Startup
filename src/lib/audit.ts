import "server-only";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export type AuditAction =
  | "login_success"
  | "login_failed"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "publish"
  | "preview"
  | "role_change"
  | "settings_update"
  | "lead_export"
  | "attachment_download"
  | "backup";

function maskIp(ip?: string | null): string | null {
  if (!ip) return null;
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip.slice(0, Math.min(ip.length, 8)) + "*";
}

export async function logAudit({
  actorId,
  action,
  entityType,
  entityId,
  summary,
}: {
  actorId?: string | null;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  summary?: Record<string, unknown>;
}) {
  try {
    const h = await headers();
    const ip = maskIp(h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip"));
    const ua = h.get("user-agent");
    const uaSummary = ua ? ua.slice(0, 120) : null;
    await prisma.auditLog.create({
      data: {
        actorId: actorId ?? null,
        action,
        entityType: entityType ?? null,
        entityId: entityId ?? null,
        summaryJson: summary ? (summary as never) : undefined,
        ipMasked: ip,
        userAgentSummary: uaSummary,
      },
    });
  } catch {
    // Audit logging must never break the main flow.
  }
}
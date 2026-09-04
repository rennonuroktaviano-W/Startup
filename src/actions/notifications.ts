"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { sendMail } from "@/lib/mail";
import type { NotificationSettingRow } from "@/features/notifications/meta";

function parseRecipients(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string").map((v) => v.trim()).filter(Boolean);
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function listNotifications(): Promise<NotificationSettingRow[]> {
  await getRequiredSession();
  const rows = await prisma.notificationSetting.findMany({ orderBy: { eventKey: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    eventKey: r.eventKey,
    recipients: parseRecipients(r.recipientsJson),
    channel: (r.channel === "whatsapp" ? "whatsapp" : "email") as "email" | "whatsapp",
    isEnabled: r.isEnabled,
  }));
}

const settingSchema = z.object({
  id: z.string().optional(),
  eventKey: z.string().min(1),
  recipients: z.array(z.string().trim().email("Email tidak valid").max(200)).max(10),
  channel: z.enum(["email", "whatsapp"]),
  isEnabled: z.boolean(),
});

export async function upsertNotification(input: z.infer<typeof settingSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  const data = settingSchema.parse(input);
  if (data.id) {
    await prisma.notificationSetting.update({
      where: { id: data.id },
      data: {
        eventKey: data.eventKey,
        recipientsJson: data.recipients,
        channel: data.channel,
        isEnabled: data.isEnabled,
      },
    });
  } else {
    await prisma.notificationSetting.create({
      data: {
        eventKey: data.eventKey,
        recipientsJson: data.recipients,
        channel: data.channel,
        isEnabled: data.isEnabled,
      },
    });
  }
  await logAudit({ actorId: session.user.id, action: "settings_update", entityType: "NotificationSetting", summary: { eventKey: data.eventKey } });
  return { ok: true as const };
}

export async function deleteNotification(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.notificationSetting.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "NotificationSetting", entityId: id });
  return { ok: true as const };
}

/**
 * Helper umum untuk mengirim notifikasi sesuai konfigurasi NotificationSetting.
 * Fallback ke ADMIN_NOTIFICATION_EMAILS bila tidak ada baris konfigurasi.
 */
export async function notifyAdmins(
  eventKey: string,
  subject: string,
  text: string,
  html?: string,
): Promise<void> {
  try {
    const row = await prisma.notificationSetting.findUnique({ where: { eventKey } });
    if ((row && !row.isEnabled) || row === null) {
      if (row === null && (eventKey === "inquiry.new" || eventKey === "content.publish")) {
        const fallback = (process.env.ADMIN_NOTIFICATION_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (fallback.length) {
          await sendMail({ to: fallback.join(","), subject, text, html });
        }
      }
      return;
    }
    const recipients = parseRecipients(row.recipientsJson);
    if (!recipients.length) return;
    await sendMail({ to: recipients.join(","), subject, text, html });
  } catch (err) {
    console.error("[notify] gagal:", err instanceof Error ? err.message : err);
  }
}

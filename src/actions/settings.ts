"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";

function asSettingValue(value: string): never {
  try {
    return JSON.parse(value) as never;
  } catch {
    return value as never;
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany({ select: { key: true, valueJson: true, group: true } });
  return Object.fromEntries(
    rows.map((r) => [
      r.key,
      typeof r.valueJson === "string" ? r.valueJson : JSON.stringify(r.valueJson),
    ])
  );
}

const settingSchema = z.object({ key: z.string().min(1), value: z.string() });

export async function upsertSetting(input: z.infer<typeof settingSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  const { key, value } = settingSchema.parse(input);
  const record = await prisma.siteSetting.upsert({
    where: { key },
    create: { key, valueJson: asSettingValue(value) },
    update: { valueJson: asSettingValue(value) },
  });
  await logAudit({ actorId: session.user.id, action: "settings_update", entityType: "SiteSetting", entityId: record.id, summary: { key } });
  return { ok: true };
}

export async function upsertSettingsBulk(entries: Record<string, string>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.$transaction(
    Object.entries(entries).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, valueJson: asSettingValue(value) },
        update: { valueJson: asSettingValue(value) },
      })
    )
  );
  await logAudit({ actorId: session.user.id, action: "settings_update", entityType: "SiteSetting", summary: { keys: Object.keys(entries) } });
  return { ok: true };
}

export async function deleteSetting(key: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.siteSetting.delete({ where: { key } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "SiteSetting", entityId: key });
  return { ok: true };
}
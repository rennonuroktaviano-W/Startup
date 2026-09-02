"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";

export async function getNavigation() {
  return prisma.navigationItem.findMany({ orderBy: [{ desktopOrder: "asc" }, { createdAt: "asc" }] });
}

export async function reorderNavigation(orderedIds: string[]) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.navigationItem.update({ where: { id }, data: { desktopOrder: i, mobileOrder: i } })
    )
  );
  await logAudit({ actorId: session.user.id, action: "update", entityType: "NavigationItem", summary: { newOrder: orderedIds } });
  return { ok: true };
}

const navSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  type: z.enum(["INTERNAL", "EXTERNAL"]).optional(),
  iconKey: z.string().optional().nullable(),
  isCta: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  desktopOrder: z.coerce.number().optional(),
  mobileOrder: z.coerce.number().optional(),
  desktopOnly: z.boolean().optional(),
});

export async function upsertNavigationItem(input: z.infer<typeof navSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  const { id, ...rest } = navSchema.parse(input);
  const maxOrder = (await prisma.navigationItem.aggregate({ _max: { desktopOrder: true } }))._max.desktopOrder ?? -1;
  const data = {
    label: rest.label,
    href: rest.href,
    type: rest.type ?? (rest.href.startsWith("http") ? "EXTERNAL" : "INTERNAL"),
    iconKey: rest.iconKey ?? null,
    isCta: rest.isCta ?? false,
    isVisible: rest.isVisible ?? true,
    desktopOrder: rest.desktopOrder ?? maxOrder + 1,
    mobileOrder: rest.mobileOrder ?? maxOrder + 1,
    desktopOnly: rest.desktopOnly ?? false,
  };
  const record = id ? await prisma.navigationItem.update({ where: { id }, data }) : await prisma.navigationItem.create({ data });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "NavigationItem", entityId: record.id, summary: { label: data.label } });
  return { ok: true, id: record.id };
}

export async function deleteNavigationItem(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.navigationItem.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "NavigationItem", entityId: id });
  return { ok: true };
}
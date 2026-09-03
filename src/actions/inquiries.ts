"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { sendMail, adminNotificationEmails } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "KotakIde Studio";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  companyName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().toLowerCase().email("Email tidak valid").max(200),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+()\s.-]{8,20}$/, "Nomor WhatsApp tidak valid")
    .optional()
    .default(""),
  preferredContact: z.enum(["WHATSAPP", "EMAIL", "PHONE", "OTHER"]),
  serviceSlug: z.string().trim().max(80).optional().default(""),
  goal: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().min(10, "Ceritakan minimal 10 karakter").max(4000),
  features: z.array(z.string().trim().max(80)).max(10).optional().default([]),
  assets: z.array(z.string().trim().max(80)).max(8).optional().default([]),
  referenceUrl: z
    .union([z.string().trim().url("URL tidak valid").max(500), z.literal("")])
    .optional()
    .transform((v) => v || null),
  targetDate: z.string().trim().max(100).optional().default(""),
  budgetRange: z.string().trim().max(100).optional().default(""),
  consent: z
    .boolean({ errorMap: () => ({ message: "Kamu perlu menyetujui kebijakan privasi" }) })
    .refine((v) => v === true, "Kamu perlu menyetujui kebijakan privasi"),
  honeypot: z.string().max(0).optional().default(""),
  startedAt: z.number().int(),
  attachments: z
    .array(
      z.object({
        uploadId: z.string().regex(/^[0-9a-f]{18}$/, "Referensi file tidak valid"),
        originalName: z.string().trim().min(1).max(200),
        mimeType: z.string().trim().max(200),
        sizeBytes: z.number().int().min(0),
      })
    )
    .max(3)
    .optional()
    .default([]),
});

function generateReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KI-${year}-${rand}`;
}

export type SubmitInquiryResult =
  | { ok: true; referenceNumber: string }
  | { ok: false; message: string; errors?: Record<string, string> };

export async function submitInquiry(
  input: z.input<typeof inquirySchema>,
): Promise<SubmitInquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] = issue.message;
    }
    return { ok: false, message: "Periksa kembali isianmu.", errors };
  }

  const data = parsed.data;

  if (data.honeypot) {
    return { ok: true, referenceNumber: generateReference() };
  }

  const rl = await rateLimit({ key: "inquiry", limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return { ok: false, message: "Terlalu banyak permintaan. Coba lagi nanti." };
  }

  const elapsedMs = Date.now() - data.startedAt;
  if (elapsedMs < 4000) {
    return { ok: false, message: "Isian tampaknya terlalu cepat. Coba lagi sebentar." };
  }

  let service = null;
  if (data.serviceSlug) {
    service = await prisma.service.findUnique({ where: { slug: data.serviceSlug } });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        referenceNumber: generateReference(),
        name: data.name,
        companyName: data.companyName || null,
        email: data.email,
        whatsapp: data.whatsapp || null,
        preferredContact: data.preferredContact,
        serviceId: service?.id ?? null,
        projectType: service?.name ?? "website",
        goal: data.goal || null,
        description: data.description,
        scopeJson: { features: data.features, referenceUrl: data.referenceUrl, targetDate: data.targetDate },
        assetsStateJson: { has: data.assets },
        budgetRange: data.budgetRange || null,
        consentAt: new Date(),
        source: "website",
        activities: {
          create: {
            action: "brief_submitted",
            metadataJson: { stepCount: 4, preferredContact: data.preferredContact },
          },
        },
        attachments:
          data.attachments.length > 0
            ? {
                create: data.attachments.map((a) => ({
                  privateStorageKey: a.uploadId,
                  originalName: a.originalName,
                  mimeType: a.mimeType,
                  sizeBytes: a.sizeBytes,
                })),
              }
            : undefined,
      },
    });

    void notifyInquiryCreated(inquiry.referenceNumber, data.name, data.email, data.description, service?.name)
      .catch(() => {});

    return { ok: true, referenceNumber: inquiry.referenceNumber };
  } catch {
    return { ok: false, message: "Simpan gagal. Coba lagi sesaat lagi, ya." };
  }
}

async function notifyInquiryCreated(
  referenceNumber: string,
  name: string,
  email: string,
  description: string,
  serviceName?: string | null,
): Promise<void> {
  const service = serviceName ?? "Website";
  await sendMail({
    to: email,
    subject: `${siteName} — Brief kamu sudah kami terima (${referenceNumber})`,
    text: `Halo ${name},\n\nTerima kasih sudah bercerita tentang proyek ${service} kamu.\n\nNomor referensi kamu: ${referenceNumber}\n\nKami akan menindaklanjuti permintaanmu. Butuh lebih cepat? Balas email ini.\n\n— ${siteName}\n${siteUrl}`,
    html: `<p>Halo <strong>${name}</strong>,</p><p>Terima kasih sudah bercerita tentang proyek <strong>${service}</strong> kamu.</p><p>Nomor referensi kamu: <strong>${referenceNumber}</strong></p><p>Kami akan menindaklanjuti permintaanmu. Butuh lebih cepat? Balas email ini.</p><p>— ${siteName}</p>`,
  });

  const recipients = adminNotificationEmails();
  if (recipients.length) {
    await sendMail({
      to: recipients.join(","),
      subject: `[${siteName}] Project brief baru: ${name}`,
      text: `Brief baru ${referenceNumber}\nNama: ${name}\nLayanan: ${service}\nDeskripsi: ${description}\n\nBuka di ${siteUrl}/admin/leads`,
      html: `<p><strong>Project brief baru</strong> (${referenceNumber})</p><p><strong>Nama:</strong> ${name}</p><p><strong>Layanan:</strong> ${service}</p><p><strong>Deskripsi:</strong> ${description}</p><p><a href="${siteUrl}/admin/leads">Buka di CMS</a></p>`,
    });
  }
}

export type LeadActionResult = { ok: true; message?: string } | { ok: false; message: string };

const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST", "SPAM"] as const;

async function authLeadWrite() {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "leads:write");
  return session;
}

export async function setLeadStatus(id: string, status: (typeof LEAD_STATUSES)[number], lostReason?: string) {
  const session = await authLeadWrite();
  if (!LEAD_STATUSES.includes(status)) return { ok: false as const, message: "Status tidak valid." };
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) return { ok: false as const, message: "Prospek tidak ditemukan." };

  const now = new Date();
  const isClosed = status === "WON" || status === "LOST" || status === "SPAM";
  await prisma.inquiry.update({
    where: { id },
    data: {
      status,
      lostReason: status === "LOST" && lostReason ? lostReason : status === "LOST" ? inquiry.lostReason : null,
      lastContactedAt: isClosed ? inquiry.lastContactedAt : inquiry.lastContactedAt ?? now,
      activities: {
        create: {
          actorId: session.user.id,
          action: "status_change",
          metadataJson: { from: inquiry.status, to: status },
        },
      },
    },
  });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "Inquiry", entityId: id, summary: { from: inquiry.status, to: status } });
  return { ok: true as const };
}

export async function markLeadRead(id: string, isRead: boolean) {
  await authLeadWrite();
  await prisma.inquiry.update({ where: { id }, data: { isRead } });
  return { ok: true as const };
}

export async function assignLead(id: string, assigneeId: string | null) {
  const session = await authLeadWrite();
  await prisma.inquiry.update({
    where: { id },
    data: {
      assigneeId,
      activities: {
        create: { actorId: session.user.id, action: "assign", metadataJson: { assigneeId } },
      },
    },
  });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "Inquiry", entityId: id, summary: { assigneeId } });
  return { ok: true as const };
}

const noteSchema = z.object({ inquiryId: z.string().cuid(), body: z.string().trim().min(1).max(4000) });

export async function addInquiryNote(input: z.infer<typeof noteSchema>) {
  const session = await authLeadWrite();
  const p = noteSchema.parse(input);
  await prisma.inquiryNote.create({
    data: {
      inquiryId: p.inquiryId,
      authorId: session.user.id,
      body: p.body,
    },
  });
  await prisma.inquiryActivity.create({
    data: {
      inquiryId: p.inquiryId,
      actorId: session.user.id,
      action: "note_added",
      metadataJson: { bodyPreview: p.body.slice(0, 60) },
    },
  });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "Inquiry", entityId: p.inquiryId, summary: { note: p.body.slice(0, 40) } });
  return { ok: true as const };
}

export async function togglePinNote(noteId: string, isPinned: boolean) {
  await authLeadWrite();
  await prisma.inquiryNote.update({ where: { id: noteId }, data: { isPinned } });
  return { ok: true as const };
}

export async function deleteInquiryNote(noteId: string) {
  await authLeadWrite();
  await prisma.inquiryNote.delete({ where: { id: noteId } });
  return { ok: true as const };
}

export async function archiveLead(id: string, archive: boolean) {
  const session = await authLeadWrite();
  await prisma.inquiry.update({
    where: { id },
    data: {
      deletedAt: archive ? new Date() : null,
      activities: {
        create: { actorId: session.user.id, action: archive ? "archive" : "restore" },
      },
    },
  });
  await logAudit({ actorId: session.user.id, action: archive ? "delete" : "restore", entityType: "Inquiry", entityId: id });
  return { ok: true as const };
}

export async function bulkUpdateStatus(ids: string[], status: (typeof LEAD_STATUSES)[number]) {
  const session = await authLeadWrite();
  if (!LEAD_STATUSES.includes(status)) return { ok: false as const, message: "Status tidak valid." };
  const result = await prisma.inquiry.updateMany({
    where: { id: { in: ids } },
    data: { status, lastContactedAt: new Date() },
  });
  if (result.count > 0) {
    await prisma.inquiryActivity.createMany({
      data: ids.map((id) => ({ inquiryId: id, actorId: session.user.id, action: "bulk_status", metadataJson: { status } as never })),
    });
  }
  await logAudit({ actorId: session.user.id, action: "update", entityType: "Inquiry", summary: { bulk: ids.length, status } });
  return { ok: true as const, count: result.count };
}
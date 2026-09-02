"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

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
      },
    });

    return { ok: true, referenceNumber: inquiry.referenceNumber };
  } catch {
    return { ok: false, message: "Simpan gagal. Coba lagi sesaat lagi, ya." };
  }
}
import { describe, it, expect } from "vitest";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  companyName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().toLowerCase().email("Email tidak valid").max(200),
  whatsapp: z.string().trim().max(20).optional().default(""),
  preferredContact: z.enum(["WHATSAPP", "EMAIL", "PHONE", "OTHER"]),
  serviceSlug: z.string().trim().max(80).optional().default(""),
  goal: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().min(10, "Ceritakan minimal 10 karakter").max(4000),
  features: z.array(z.string().trim().max(80)).max(10).optional().default([]),
  assets: z.array(z.string().trim().max(80)).max(8).optional().default([]),
  referenceUrl: z
    .union([z.string().trim().url("URL tidak valid").max(500), z.literal("")])
    .optional()
    .default(""),
  targetDate: z.string().trim().max(100).optional().default(""),
  budgetRange: z.string().trim().max(100).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Perlu persetujuan privasi" }) }),
  honeypot: z.string().max(0).optional().default(""),
  startedAt: z.number().int(),
});

const validInquiry = {
  name: "Budi Santoso",
  email: "budi@example.com",
  preferredContact: "WHATSAPP" as const,
  description: "Saya butuh website toko online yang modern.",
  consent: true as const,
  startedAt: Date.now(),
};

describe("inquirySchema", () => {
  it("menerima data valid", () => {
    const result = inquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
  });

  it("menolak nama terlalu pendek", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, name: "B" });
    expect(result.success).toBe(false);
  });

  it("menolak email tidak valid", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, email: "bukan-email" });
    expect(result.success).toBe(false);
  });

  it("menolak deskripsi terlalu pendek", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, description: "pendek" });
    expect(result.success).toBe(false);
  });

  it("menolak tanpa consent", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, consent: false });
    expect(result.success).toBe(false);
  });

  it("menolak honeypot terisi", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, honeypot: "spam" });
    expect(result.success).toBe(false);
  });

  it("menerima field opsional kosong", () => {
    const result = inquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyName).toBe("");
      expect(result.data.whatsapp).toBe("");
      expect(result.data.serviceSlug).toBe("");
      expect(result.data.features).toEqual([]);
      expect(result.data.assets).toEqual([]);
    }
  });

  it("mempersilakan whatsapp kosong", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, whatsapp: "" });
    expect(result.success).toBe(true);
  });

  it("menolak whatsapp terlalu panjang", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, whatsapp: "a".repeat(21) });
    expect(result.success).toBe(false);
  });
});

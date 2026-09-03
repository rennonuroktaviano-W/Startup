import { describe, it, expect } from "vitest";
import {
  LEAD_STATUSES,
  LEAD_STATUS_META,
  LEAD_STATUS_ORDER,
  parseScopeJson,
} from "@/lib/leads";

describe("LEAD_STATUS invariants", () => {
  it("setiap status memiliki metadata dan terdaftar di urutan", () => {
    for (const s of LEAD_STATUSES) {
      expect(LEAD_STATUS_META[s]).toBeDefined();
      expect(LEAD_STATUS_ORDER).toContain(s);
    }
  });

  it("urutan status mencakup semua status", () => {
    expect(new Set(LEAD_STATUS_ORDER).size).toBe(LEAD_STATUSES.length);
  });
});

describe("parseScopeJson", () => {
  it("memetakan fitur dan mengabaikan nilai asing", () => {
    const out = parseScopeJson({ features: ["A", "B"], force: "x" });
    expect(out.features).toEqual(["A", "B"]);
    expect(out).toHaveProperty("referenceUrl", null);
    expect(out).toHaveProperty("targetDate", null);
  });

  it("menangani null dan nilai non-objek dengan aman", () => {
    expect(parseScopeJson(null)).toEqual({ features: [], referenceUrl: null, targetDate: null });
    expect(parseScopeJson("nonsense")).toEqual({
      features: [],
      referenceUrl: null,
      targetDate: null,
    });
    expect(parseScopeJson({})).toEqual({ features: [], referenceUrl: null, targetDate: null });
  });

  it("mengubah tiap elemen fitur menjadi string", () => {
    const out = parseScopeJson({ features: ["ok", 123, null, false] });
    expect(out.features).toEqual(["ok", "123", "null", "false"]);
  });
});
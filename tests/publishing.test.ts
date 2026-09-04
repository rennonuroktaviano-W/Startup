import { describe, it, expect } from "vitest";
import {
  validateForPublish,
  canTransition,
  PUBLISHING_FLOW,
} from "@/features/publishing/validate";

describe("validateForPublish", () => {
  it("mengembalikan tanpa issue untuk kandidat lengkap", () => {
    const issues = validateForPublish({
      title: "Project A",
      slug: "project-a",
      metaTitle: "Project A",
      metaDescription: "Deskripsi",
      summary: "Ringkasan",
    });
    expect(issues).toEqual([]);
  });

  it("mendeteksi field wajib yang kosong", () => {
    const issues = validateForPublish({
      title: "",
      slug: "project-a",
      metaTitle: "Project A",
      metaDescription: "Deskripsi",
    });
    const fields = issues.map((i) => i.field);
    expect(fields).toContain("title");
    expect(issues.some((i) => i.field === "slug")).toBe(false);
  });

  it("menolak slug yang tidak aman", () => {
    const issues = validateForPublish({
      title: "A",
      slug: "Project A#Bug",
      metaTitle: "A",
      metaDescription: "D",
    });
    expect(issues.some((i) => i.field === "slug")).toBe(true);
  });

  it("hanya memvalidasi field yang diminta", () => {
    const issues = validateForPublish({ title: "A" }, ["title", "summary"]);
    expect(issues).toEqual([{ field: "summary", reason: "Field wajib belum diisi" }]);
  });
});

describe("canTransition / PUBLISHING_FLOW", () => {
  it("mengizinkan alur DRAFT → REVIEW", () => {
    expect(canTransition("DRAFT", "REVIEW", PUBLISHING_FLOW)).toBe(true);
  });

  it("mengizinkan REVIEW → PUBLISHED", () => {
    expect(canTransition("REVIEW", "PUBLISHED", PUBLISHING_FLOW)).toBe(true);
  });

  it("menolak lompatan dari ARCHIVED → PUBLISHED", () => {
    expect(canTransition("ARCHIVED", "PUBLISHED", PUBLISHING_FLOW)).toBe(false);
  });

  it("memperlakukan tanpa status awal sebagai diizinkan", () => {
    expect(canTransition(undefined, "PUBLISHED", PUBLISHING_FLOW)).toBe(true);
  });
});

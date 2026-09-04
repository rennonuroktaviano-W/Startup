import { describe, it, expect } from "vitest";
import { slugify, cn } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class names", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("menangani conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
    expect(result).not.toContain("hidden");
  });

  it("menangani undefined dan null", () => {
    const result = cn("a", undefined, null, "b");
    expect(result).toContain("a");
    expect(result).toContain("b");
  });

  it("mengembalikan string kosong untuk input kosong", () => {
    expect(cn()).toBe("");
  });
});

describe("slugify edge cases", () => {
  it("menangani string kosong", () => {
    expect(slugify("")).toBe("");
  });

  it("menangani karakter unicode", () => {
    expect(slugify("Héllo Wörld")).toBe("hello-world");
  });

  it("menangani angka", () => {
    expect(slugify("2026 Trend")).toBe("2026-trend");
  });

  it("menangani multiple strip", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("menangani spesial chars", () => {
    expect(slugify("React & Next.js")).toBe("react-next-js");
  });

  it("menanganiemoji dan special unicode", () => {
    expect(slugify("Hello 🌍 World")).toBe("hello-world");
  });
});

import { describe, it, expect } from "vitest";
import {
  slugify,
  formatDate,
  formatDateTime,
  formatIDR,
  timeAgo,
  randomRecId,
} from "@/lib/utils";

describe("slugify", () => {
  it("merubah case dan spasi menjadi slug", () => {
    expect(slugify("KotakIde Studio Website")).toBe("kotakide-studio-website");
  });

  it("menghapus diakritik dan tanda kutip", () => {
    expect(slugify("Konten artikel 'Baru' é")).toBe("konten-artikel-baru-e");
  });

  it("menggabungkan karakter non-alphanumeric dengan strip", () => {
    expect(slugify("A  B / C")).toBe("a-b-c");
  });

  it("menghapus strip di ujung", () => {
    expect(slugify("--padding--")).toBe("padding");
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("menghasilkan slug yang aman untuk URL", () => {
    expect(slugify("Halo, dunia! #1")).toBe("halo-dunia-1");
    expect(slugify("Wawasan & Tren 2026")).toBe("wawasan-tren-2026");
  });
});

describe("formatIDR", () => {
  it("memformat angka sebagai rupiah tanpa desimal", () => {
    const result = formatIDR(15000000);
    // Intl id-ID memberi narrow-no-break space antara "Rp" dan nominalnya.
    expect(result.replace(/[\u00A0\u202F]/g, "")).toBe("Rp15.000.000");
    expect(formatIDR(1000).replace(/[\u00A0\u202F]/g, "")).toBe("Rp1.000");
  });

  it("mengembalikan string kosong untuk null/undefined", () => {
    expect(formatIDR(null)).toBe("");
    expect(formatIDR(undefined)).toBe("");
  });
});

describe("formatDate / formatDateTime", () => {
  it("mengembalikan '-' untuk nilai kosong", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDateTime(null)).toBe("-");
  });

  it("memformat tanggal dengan locale id-ID", () => {
    const d = new Date("2026-08-15T00:00:00Z");
    expect(formatDate(d)).toContain("15");
    expect(formatDate(d)).not.toBe("-");
  });
});

describe("timeAgo", () => {
  it("mengembalikan label kini untuk detik terakhir", () => {
    expect(timeAgo(new Date())).toBe("baru saja");
  });

  it("mengembalikan label menit untuk rentang < 1 jam", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(d)).toContain("menit lalu");
  });

  it("mengembalikan label jam, lalu hari", () => {
    expect(timeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000))).toContain("jam lalu");
    expect(timeAgo(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))).toContain("hari lalu");
  });
});

describe("randomRecId", () => {
  it("diawali prefix dan berisi waktu serta acak", () => {
    const id = randomRecId("GEN");
    expect(id.startsWith("GEN-")).toBe(true);
    expect(id.length).toBeGreaterThan("GEN-".length + 8);
  });

  it("menghasilkan nilai unik berurutan", () => {
    const a = randomRecId("LEAD");
    const b = randomRecId("LEAD");
    expect(a).not.toBe(b);
  });
});
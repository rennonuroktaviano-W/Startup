import { describe, it, expect } from "vitest";
import { siteConfig, whatsappLink } from "@/lib/site";
import { budgetRanges, servicesList } from "@/lib/content";

describe("siteConfig", () => {
  it("memiliki property yang diperlukan", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.tagline).toBeTruthy();
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.email).toContain("@");
    expect(siteConfig.whatsapp).toMatch(/^\d+$/);
    expect(siteConfig.siteUrl).toBeTruthy();
  });

  it("siteUrl valid URL", () => {
    expect(() => new URL(siteConfig.siteUrl)).not.toThrow();
  });
});

describe("whatsappLink", () => {
  it("membuat link dengan nomor default", () => {
    const link = whatsappLink();
    expect(link).toContain("wa.me/");
    expect(link).toContain(siteConfig.whatsapp);
  });

  it("membuat link dengan nomor custom", () => {
    const link = whatsappLink(undefined, "6289999999999");
    expect(link).toContain("6289999999999");
  });

  it("membuat link dengan message", () => {
    const link = whatsappLink("Halo");
    expect(link).toContain("text=");
    expect(link).toContain("Halo");
  });

  it("meng-encode message dengan benar", () => {
    const link = whatsappLink("Halo dunia!");
    expect(link).toContain(encodeURIComponent("Halo dunia!"));
  });
});

describe("budgetRanges", () => {
  it("memiliki minimal 4 opsi budget", () => {
    expect(budgetRanges.length).toBeGreaterThanOrEqual(4);
  });

  it("setiap opsi memiliki value dan label", () => {
    for (const range of budgetRanges) {
      expect(range.value).toBeTruthy();
      expect(range.label).toBeTruthy();
    }
  });
});

describe("servicesList", () => {
  it("memiliki minimal 3 layanan", () => {
    expect(servicesList.length).toBeGreaterThanOrEqual(3);
  });

  it("setiap layanan memiliki slug unik", () => {
    const slugs = servicesList.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("setiap layanan memiliki nama dan deskripsi", () => {
    for (const service of servicesList) {
      expect(service.name).toBeTruthy();
      expect(service.shortDescription).toBeTruthy();
    }
  });
});

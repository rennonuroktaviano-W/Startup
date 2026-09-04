import { describe, it, expect } from "vitest";
import { buildMetadata } from "@/lib/seo";

describe("buildMetadata", () => {
  it("membangun metadata default dengan nama site", () => {
    const meta = buildMetadata();
    expect(meta.title).toContain("KotakIde");
    expect(meta.description).toBeTruthy();
    expect(meta.openGraph?.locale).toBe("id_ID");
  });

  it("menggabungkan custom title dengan site name", () => {
    const meta = buildMetadata({ title: "Layanan Kami" });
    expect(meta.title).toBe("Layanan Kami — KotakIde Studio");
  });

  it("menggunakan path yang diberikan untuk canonical URL", () => {
    const meta = buildMetadata({ path: "/services" });
    expect(meta.alternates?.canonical).toContain("/services");
  });

  it("menggunakan custom description bila diberikan", () => {
    const meta = buildMetadata({ description: "Deskripsi kustom" });
    expect(meta.description).toBe("Deskripsi kustom");
  });

  it("mengatur noIndex dengan benar", () => {
    const meta = buildMetadata({ noIndex: true });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("menggunakan OG image custom bila diberikan", () => {
    const meta = buildMetadata({ image: "https://example.com/custom.png" });
    const ogImages = meta.openGraph?.images as { url: string }[];
    expect(ogImages[0].url).toBe("https://example.com/custom.png");
  });

  it("menggunakan OG image default bila tidak diberikan", () => {
    const meta = buildMetadata();
    const ogImages = meta.openGraph?.images as { url: string }[];
    expect(ogImages[0].url).toContain("/brand/og-default.png");
  });

  it("membuat twitter metadata", () => {
    const meta = buildMetadata({ title: "Test" });
    expect(meta.twitter?.title).toContain("Test");
  });
});

import { describe, it, expect } from "vitest";
import {
  extractHeadings,
  assignHeadingIds,
  computeReadingMinutes,
  headingId,
} from "@/lib/headings";
import type { ArticleBlock } from "@/lib/content-articles";

function doc(content: ArticleBlock[]): ArticleBlock {
  return { type: "doc", content };
}

function heading(level: number, text: string): ArticleBlock {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}

describe("extractHeadings", () => {
  it("mengambil hanya h2/h3 dalam urutan dokumen", () => {
    const d = doc([
      heading(2, "Pendahuluan"),
      heading(3, "Sub bagian"),
      heading(4, "Diabaikan"),
      heading(2, "Kesimpulan"),
    ]);
    const result = extractHeadings(d);
    expect(result.map((h) => h.level)).toEqual([2, 3, 2]);
    expect(result.map((h) => h.text)).toEqual(["Pendahuluan", "Sub bagian", "Kesimpulan"]);
  });

  it("memberi id unik untuk judul duplikat", () => {
    const d = doc([heading(2, "Langkah A"), heading(2, "Langkah A")]);
    const result = extractHeadings(d);
    expect(result[0].id).not.toBe(result[1].id);
  });
});

describe("headingId", () => {
  it("membuat slug aman", () => {
    expect(headingId("Cara & Tips 123!")).toBe("cara-tips-123");
  });
});

describe("assignHeadingIds", () => {
  it("menstempel id stabil ke heading h2/h3 tanpa memutasi input", () => {
    const d = doc([heading(2, "Pendahuluan"), heading(3, "Sub")]);
    const stamped = assignHeadingIds(d);
    expect(stamped.content?.[0].attrs?.id).toBe("pendahuluan");
    expect(stamped.content?.[1].attrs?.id).toBe("sub");
    expect(d.content?.[0].attrs?.id).toBeUndefined();
  });
});

describe("computeReadingMinutes", () => {
  it("membulatkan berdasarkan jumlah kata", () => {
    const words = Array.from({ length: 250 }, () => "kata").join(" ");
    expect(computeReadingMinutes(doc([{ type: "paragraph", content: [{ type: "text", text: words }] }]))).toBe(1);
  });
});

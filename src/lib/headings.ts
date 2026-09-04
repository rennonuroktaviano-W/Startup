import type { ArticleBlock } from "@/lib/content-articles";

export type Heading = { id: string; level: number; text: string };

export function extractText(node: ArticleBlock): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(extractText).join("");
}

export function headingId(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "bagian";
}

function plainText(doc: ArticleBlock): string {
  if (doc.type === "text") return doc.text ?? "";
  return (doc.content ?? []).map(plainText).join(" ");
}

export function computeReadingMinutes(doc: ArticleBlock): number {
  const words = plainText(doc).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Returns a shallow-cloned tree with stable `id` stamped onto h2/h3 heading attrs. Pure. */
export function assignHeadingIds(doc: ArticleBlock): ArticleBlock {
  const headings = extractHeadings(doc);
  let i = 0;
  const stamp = (node: ArticleBlock): ArticleBlock => {
    if (node.type === "heading") {
      const level = (node.attrs?.level as number) ?? 2;
      if (level >= 2 && level <= 3 && i < headings.length) {
        const id = headings[i].id;
        i += 1;
        return { ...node, attrs: { ...node.attrs, id } };
      }
    }
    if (node.content) return { ...node, content: node.content.map(stamp) };
    return node;
  };
  return stamp(doc);
}

export function extractHeadings(doc: ArticleBlock): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();
  const walk = (node: ArticleBlock) => {
    if (node.type === "heading") {
      const level = (node.attrs?.level as number) ?? 2;
      if (level >= 2 && level <= 3) {
        const text = extractText(node).trim();
        const base = headingId(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count + 1}`;
        out.push({ id, level, text });
      }
    }
    (node.content ?? []).forEach(walk);
  };
  walk(doc);
  return out;
}

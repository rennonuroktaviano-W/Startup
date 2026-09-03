import Link from "next/link";
import type { ArticleBlock } from "@/lib/content-articles";

function InlineText({ node }: { node: ArticleBlock }) {
  const text = node.text ?? "";
  const marks = node.marks ?? [];
  let el: React.ReactNode = text;
  for (const m of marks) {
    const href = (m.attrs?.href as string) ?? "";
    if (m.type === "link" && href) {
      el = (
        <Link href={href} className="font-semibold text-purple underline underline-offset-4">
          {el}
        </Link>
      );
    } else if (m.type === "bold" || m.type === "strong") {
      el = <strong>{el}</strong>;
    } else if (m.type === "italic" || m.type === "em") {
      el = <em>{el}</em>;
    } else if (m.type === "underline") {
      el = <u>{el}</u>;
    } else if (m.type === "code") {
      el = <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[0.9em]">{el}</code>;
    } else if (m.type === "strike") {
      el = <s>{el}</s>;
    }
  }
  return <>{el}</>;
}

function NodeRenderer({ node }: { node: ArticleBlock }) {
  const type = node.type;

  if (type === "doc") {
    return (
      <>
        {(node.content ?? []).map((child, i) => (
          <NodeRenderer key={i} node={child} />
        ))}
      </>
    );
  }

  if (type === "paragraph") {
    return (
      <p className="mt-4 leading-relaxed text-ink/75">
        {(node.content ?? []).map((child, i) => (
          <NodeRenderer key={i} node={child} />
        ))}
      </p>
    );
  }

  if (type === "heading") {
    const level = (node.attrs?.level as number) ?? 2;
    const Tag = (["h1", "h2", "h3", "h4", "h5", "h6"][level - 1] ?? "h2") as
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6";
    const size =
      level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : level === 3 ? "text-xl" : "text-lg";
    const cls = `mt-8 font-display font-semibold text-ink ${size}`;
    const inner = (
      <>
        {(node.content ?? []).map((child, i) => (
          <NodeRenderer key={i} node={child} />
        ))}
      </>
    );
    switch (Tag) {
      case "h1":
        return <h1 className={cls}>{inner}</h1>;
      case "h3":
        return <h3 className={cls}>{inner}</h3>;
      case "h4":
        return <h4 className={cls}>{inner}</h4>;
      case "h5":
        return <h5 className={cls}>{inner}</h5>;
      case "h6":
        return <h6 className={cls}>{inner}</h6>;
      default:
        return <h2 className={cls}>{inner}</h2>;
    }
  }

  if (type === "bulletList" || type === "orderedList") {
    const items = (node.content ?? []).filter((c) => c.type === "listItem");
    const list = items.map((item, i) => (
      <li key={i} className="leading-relaxed text-ink/75">
        {(item.content ?? []).filter((c) => c.type !== "paragraph" || c.content).map((child, j) => (
          <NodeRenderer key={j} node={child} />
        ))}
      </li>
    ));
    return type === "orderedList" ? (
      <ol className="mt-4 list-decimal space-y-2 pl-5">{list}</ol>
    ) : (
      <ul className="mt-4 list-disc space-y-2 pl-5">{list}</ul>
    );
  }

  if (type === "blockquote") {
    return (
      <blockquote className="mt-6 border-l-4 border-ink bg-white/50 p-4 italic text-ink/75">
        {(node.content ?? []).map((child, i) => (
          <NodeRenderer key={i} node={child} />
        ))}
      </blockquote>
    );
  }

  if (type === "codeBlock") {
    return (
      <pre className="mt-6 overflow-x-auto rounded-xl border-2 border-ink bg-ink p-4 text-sm text-white">
        <code>{(node.content ?? []).map((child, i) => <NodeRenderer key={i} node={child} />)}</code>
      </pre>
    );
  }

  if (type === "horizontalRule") {
    return <hr className="my-8 border-dashed border-ink/20" />;
  }

  if (type === "hardBreak") {
    return <br />;
  }

  if (type === "text") {
    return <InlineText node={node} />;
  }

  return null;
}

export function RichText({ blocks }: { blocks: ArticleBlock }) {
  return (
    <div className="[&_h1]:mt-8 [&_h2]:mt-8">
      <NodeRenderer node={blocks} />
    </div>
  );
}

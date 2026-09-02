"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

export function TogglePublish({
  id,
  status,
  entityType,
  onToggle,
}: {
  id: string;
  status: string;
  entityType: string;
  onToggle?: (id: string, newStatus: "DRAFT" | "PUBLISHED") => void;
}) {
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    const newStatus: "DRAFT" | "PUBLISHED" = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      let res: { ok: boolean; status: string } | undefined;
      if (entityType === "Service") {
        const { togglePublishService } = await import("@/actions/services");
        res = await togglePublishService(id, newStatus);
      } else if (entityType === "Project") {
        const { togglePublishProject } = await import("@/actions/projects");
        res = await togglePublishProject(id, newStatus);
      } else if (entityType === "BlogPost") {
        const { togglePublishBlogPost } = await import("@/actions/content");
        res = await togglePublishBlogPost(id, newStatus);
      }
      if (res?.ok) {
        setCurrent(res.status);
        onToggle?.(id, res.status as "DRAFT" | "PUBLISHED");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPublished = current === "PUBLISHED";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={isPublished ? "Turunkan ke draft" : "Terbitkan"}
      className={`flex h-9 items-center gap-1.5 rounded-full border-2 border-ink px-3 text-xs font-bold shadow-[2px_2px_0_0_var(--ink)] ${
        isPublished ? "bg-mint text-ink" : "bg-surface text-ink/60"
      }`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}
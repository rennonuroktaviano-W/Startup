import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolvePreviewToken } from "@/lib/preview-token";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Entity =
  | { kind: "Project"; title: string; status: string; summary: string | null }
  | { kind: "BlogPost"; title: string; status: string; excerpt: string | null }
  | { kind: "Service"; title: string; status: string; shortDescription: string | null };

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tokenRecord = await resolvePreviewToken(token);
  if (!tokenRecord) notFound();

  let entity: Entity | null = null;
  if (tokenRecord.entityType === "Project") {
    const p = await prisma.project.findUnique({ where: { id: tokenRecord.entityId } });
    if (p) entity = { kind: "Project", title: p.title, status: p.status, summary: p.summary };
  } else if (tokenRecord.entityType === "BlogPost") {
    const p = await prisma.blogPost.findUnique({ where: { id: tokenRecord.entityId } });
    if (p) entity = { kind: "BlogPost", title: p.title, status: p.status, excerpt: p.excerpt };
  } else if (tokenRecord.entityType === "Service") {
    const p = await prisma.service.findUnique({ where: { id: tokenRecord.entityId } });
    if (p) entity = { kind: "Service", title: p.name, status: p.status, shortDescription: p.shortDescription };
  }

  if (!entity) notFound();

  const description =
    entity.kind === "Project"
      ? entity.summary
      : entity.kind === "BlogPost"
        ? entity.excerpt
        : entity.shortDescription;

  return (
    <main className="min-h-screen bg-surface text-ink">
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink bg-purple px-5 py-3 text-white">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Eye className="h-4 w-4" /> Mode Pratinjau
        </p>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          Status: {entity.status}
        </span>
      </div>
      <div className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Pratinjau {entity.kind === "Project" ? "Proyek" : entity.kind === "BlogPost" ? "Artikel" : "Layanan"}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{entity.title}</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          {description ?? "(belum ada ringkasan)"}
        </p>
        <p className="mt-6 rounded-xl border-2 border-dashed border-ink/20 bg-white/50 px-4 py-3 text-sm text-ink/60">
          Halaman ini hanya terlihat lewat tautan pratinjau sementara dan tidak diindeks. Tautan kedaluwarsa dalam 24
          jam sejak dibuat.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-xl border-2 border-ink bg-purple px-5 py-2.5 text-sm font-semibold text-white"
          >
            Kembali ke situs
          </Link>
        </div>
      </div>
    </main>
  );
}
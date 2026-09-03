import { prisma } from "@/lib/db";
import { getSettings } from "@/actions/settings";
import { SeoForm } from "@/components/admin/cms/seo-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "SEO & Redirect — Admin" };

export default async function SeoAdminPage() {
  const [settings, redirects] = await Promise.all([
    getSettings(),
    prisma.redirect.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">SEO & Redirect</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <SeoForm
          initial={settings}
          redirects={redirects.map((r) => ({
            id: r.id,
            sourcePath: r.sourcePath,
            destinationUrl: r.destinationUrl,
            statusCode: r.statusCode,
            isActive: r.isActive,
          }))}
        />
      </div>
    </div>
  );
}
import { MediaManager } from "@/components/admin/cms/media-manager";

export const metadata = { title: "Media — Admin" };

export default function MediaAdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Media &amp; Upload</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <MediaManager />
      </div>
    </div>
  );
}
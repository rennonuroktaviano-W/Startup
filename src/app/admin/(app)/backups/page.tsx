import Link from "next/link";
import { BackupClient } from "@/components/admin/cms/backup-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Backup — Admin" };

export default async function BackupsAdminPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Backup</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <BackupClient />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/20 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Catatan</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink/70">
          <li>Export menyimpan seluruh konten (layanan, proyek, artikel, halaman, redirect, dan pengaturan) sebagai file JSON.</li>
          <li>Gunakan tombol di atas untuk unduh berkas, lalu simpan di tempat aman (mis. penyimpanan cloud internal).</li>
          <li>Untuk backup database penuh (termasuk akun & media), lakukan <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-xs">mysqldump</code> di server database.</li>
        </ul>
      </div>
      <div className="mt-6 text-sm text-ink/60">
        Terkait pemulihan: lihat <Link href="/admin/audit-logs" className="font-semibold text-purple underline">Audit Log</Link> dan riwayat revisi di tiap editor konten.
      </div>
    </div>
  );
}
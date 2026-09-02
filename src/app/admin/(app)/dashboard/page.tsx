import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Inbox,
  MailOpen,
  Target,
  Trophy,
  FolderKanban,
  DraftingCompass,
  CalendarClock,
  Activity,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { siteConfig } from "@/lib/site";
import { formatDate, formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Dashboard — Admin",
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const counts = await Promise.all([
    prisma.inquiry.aggregate({ where: { deletedAt: null }, _count: { _all: true } }),
    prisma.inquiry.count({ where: { deletedAt: null, isRead: false } }),
    prisma.inquiry.count({ where: { deletedAt: null, status: "QUALIFIED" } }),
    prisma.inquiry.count({ where: { deletedAt: null, status: { in: ["WON", "LOST"] } } }),
    prisma.project.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.service.count({ where: { deletedAt: null, status: { in: ["DRAFT", "REVIEW"] } } }),
    prisma.blogPost.count({ where: { deletedAt: null, status: "SCHEDULED" } }),
  ]);

  const recentAudit = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { actor: { select: { name: true, email: true } } },
  });

  const recentInquiries = await prisma.inquiry.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { service: { select: { name: true } } },
  });

  const widgets = [
    { label: "Total Inquiry", value: counts[0]._count._all, icon: Inbox, tone: "bg-sky", href: "/admin/leads" },
    { label: "Belum Dibaca", value: counts[1], icon: MailOpen, tone: "bg-coral", href: "/admin/leads" },
    { label: "Qualified", value: counts[2], icon: Target, tone: "bg-purple text-white", href: "/admin/leads" },
    { label: "Won / Lost", value: counts[3], icon: Trophy, tone: "bg-mint", href: "/admin/leads" },
    { label: "Proyek Published", value: counts[4], icon: FolderKanban, tone: "bg-lemon", href: "/admin/projects" },
    { label: "Draft Konten", value: counts[5], icon: DraftingCompass, tone: "bg-lemon", href: "/admin/services" },
    { label: "Terjadwal", value: counts[6], icon: CalendarClock, tone: "bg-sky", href: "/admin/blog" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{greeting}, {session.user.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-sm text-ink/60">Ringkasan {siteConfig.name} hari ini.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]"
          >
            Buka Lead
          </Link>
          <Link
            href="/"
            target="_blank"
            className="rounded-full border-2 border-ink bg-surface px-4 py-2 text-sm font-semibold"
          >
            Lihat Website
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {widgets.map((w) => (
          <WidgetCard key={w.label} {...w} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Inbox className="h-5 w-5 text-purple" /> Inquiry terbaru
          </h2>
          {recentInquiries.length === 0 ? (
            <p className="mt-4 rounded-xl border-2 border-dashed border-ink/20 p-4 text-sm text-ink/60">
              Belum ada project brief masuk. Hubungan publik ke /contact akan mulai mengisi halaman ini.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-dashed divide-ink/15">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {inquiry.name}
                      {!inquiry.isRead && (
                        <span className="ml-2 rounded-full border-2 border-ink bg-coral px-1.5 py-0.5 text-[10px] font-bold">
                          BARU
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-ink/60">
                      {inquiry.service?.name ?? "Tanpa layanan"} · {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border-2 border-ink bg-lemon px-2 py-0.5 text-[11px] font-bold">
                    {inquiry.referenceNumber}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Activity className="h-5 w-5 text-mint" /> Aktivitas terakhir
          </h2>
          {recentAudit.length === 0 ? (
            <p className="mt-4 rounded-xl border-2 border-dashed border-ink/20 p-4 text-sm text-ink/60">
              Belum ada aktivitas tercatat. Login pertama akan muncul di sini.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-dashed divide-ink/15">
              {recentAudit.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {ACTION_LABEL[log.action] ?? log.action}
                    </p>
                    <p className="truncate text-xs text-ink/60">
                      {log.actor?.name ?? "Sistem"} · {log.entityType ?? "-"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink/50">{formatDateTime(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const ACTION_LABEL: Record<string, string> = {
  login_success: "Login berhasil",
  login_failed: "Login gagal",
  logout: "Logout",
  create: "Membuat entri baru",
  update: "Memperbarui entri",
  delete: "Menghapus entri",
  publish: "Menerbitkan konten",
};

function WidgetCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink ${tone}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs font-semibold text-ink/60">{label}</p>
    </Link>
  );
}
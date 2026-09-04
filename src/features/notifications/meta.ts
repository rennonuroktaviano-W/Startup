/**
 * Metadata event notifikasi (PRD §23, §16.15). Nilai teks ini aman untuk
 * dipakai di client maupun server, sehingga dipisah dari modul `"use server"`.
 */

export const NOTIFICATION_EVENTS = [
  { key: "inquiry.new", label: "Project brief baru", description: "Dikirim saat visitor mengirim project brief." },
  { key: "inquiry.status_change", label: "Perubahan status prospek", description: "Dikirim saat status prospek berubah (mis. QUALIFIED, WON, LOST)." },
  { key: "inquiry.assignment", label: "Penugasan prospek", description: "Dikirim saat prospek ditugaskan ke staf." },
  { key: "content.publish", label: "Konten diterbitkan", description: "Pemberitahuan saat konten berhasil atau gagal diterbitkan." },
] as const;

export type NotificationEventKey = (typeof NOTIFICATION_EVENTS)[number]["key"];

export type NotificationSettingRow = {
  id: string;
  eventKey: string;
  recipients: string[];
  channel: "email" | "whatsapp";
  isEnabled: boolean;
};

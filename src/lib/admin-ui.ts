import type { Role } from "@prisma/client";

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_EDITOR: "Editor Konten",
  SALES: "Sales",
};

export function toySwitchFromRole(role: Role): string {
  return roleLabels[role] ?? role;
}
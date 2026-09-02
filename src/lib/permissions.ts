import "server-only";

import type { Role } from "@prisma/client";

export type Capability =
  | "dashboard"
  | "content:read"
  | "content:write"
  | "content:publish"
  | "leads:read"
  | "leads:write"
  | "leads:export"
  | "media:write"
  | "settings:write"
  | "users:manage"
  | "audit:read"
  | "backup:run";

export const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  SUPER_ADMIN: [
    "dashboard",
    "content:read",
    "content:write",
    "content:publish",
    "leads:read",
    "leads:write",
    "leads:export",
    "media:write",
    "settings:write",
    "users:manage",
    "audit:read",
    "backup:run",
  ],
  CONTENT_EDITOR: ["dashboard", "content:read", "content:write", "media:write"],
  SALES: ["dashboard", "leads:read", "leads:write", "leads:export"],
};

export function can(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}

export class ForbiddenError extends Error {
  constructor() {
    super("FORBIDDEN");
  }
}

export function requireCapability(role: Role, capability: Capability): void {
  if (!can(role, capability)) throw new ForbiddenError();
}
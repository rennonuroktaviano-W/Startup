import { describe, it, expect } from "vitest";
import { can, requireCapability, ForbiddenError, ROLE_CAPABILITIES } from "@/lib/permissions";

describe("permissions.can", () => {
  it("SUPER_ADMIN memiliki semua capability", () => {
    const all: Array<Parameters<typeof can>[1]> = [
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
    ];
    for (const cap of all) expect(can("SUPER_ADMIN", cap)).toBe(true);
  });

  it("CONTENT_EDITOR hanya untuk konten & media", () => {
    expect(can("CONTENT_EDITOR", "content:write")).toBe(true);
    expect(can("CONTENT_EDITOR", "media:write")).toBe(true);
    expect(can("CONTENT_EDITOR", "users:manage")).toBe(false);
    expect(can("CONTENT_EDITOR", "leads:export")).toBe(false);
  });

  it("SALES hanya untuk leads", () => {
    expect(can("SALES", "leads:read")).toBe(true);
    expect(can("SALES", "leads:export")).toBe(true);
    expect(can("SALES", "content:publish")).toBe(false);
    expect(can("SALES", "settings:write")).toBe(false);
  });

  it("role tak dikenal tidak dapat apa pun", () => {
    expect(can("GUEST" as never, "dashboard")).toBe(false);
  });
});

describe("permissions.requireCapability", () => {
  it("tidak melempar saat capability terpenuhi", () => {
    expect(() => requireCapability("SUPER_ADMIN", "settings:write")).not.toThrow();
  });

  it("melempar ForbiddenError saat tidak terpenuhi", () => {
    expect(() => requireCapability("CONTENT_EDITOR", "leads:export")).toThrow(ForbiddenError);
  });
});

describe("ROLE_CAPABILITIES", () => {
  it("semua role terdaftar dan bebas dari duplikat", () => {
    for (const list of Object.values(ROLE_CAPABILITIES)) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
});
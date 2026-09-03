import "server-only";

import { getRequiredSession } from "@/lib/auth/session";

export async function requiresAuth() {
  return getRequiredSession();
}

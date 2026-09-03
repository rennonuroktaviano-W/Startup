import "server-only";

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export async function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ allowed: boolean; msUntilReset: number }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";
  const bucketKey = `${options.key}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + options.windowMs };
    buckets.set(bucketKey, bucket);
  }
  bucket.count += 1;
  if (bucket.count > options.limit) {
    return { allowed: false, msUntilReset: bucket.resetAt - now };
  }
  return { allowed: true, msUntilReset: 0 };
}

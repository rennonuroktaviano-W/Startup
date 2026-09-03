import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Proxy dijalankan sebelum route dirender. Di sini kami menegakkan redirect 301/302
 * yang tercatat di tabel `Redirect` (mis. saat slug berubah). Proxy memakai runtime
 * Node (default di Next 16), sehingga aman mengakses DB via Prisma/MySQL.
 * Pemanggilan DB di-guard agar tidak menggagalkan request bila terjadi error.
 */
export async function proxy(request: NextRequest) {
  if (request.method !== "GET") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/" || pathname.length === 0) return NextResponse.next();

  let redirect;
  try {
    redirect = await prisma.redirect.findUnique({
      where: { sourcePath: pathname },
      select: { destinationUrl: true, statusCode: true, isActive: true },
    });
  } catch {
    return NextResponse.next();
  }

  if (!redirect || !redirect.isActive) return NextResponse.next();

  const dest = redirect.destinationUrl.startsWith("/")
    ? new URL(redirect.destinationUrl, request.url)
    : new URL(redirect.destinationUrl);

  return NextResponse.redirect(dest, redirect.statusCode === 302 ? 302 : 301);
}

export const config = {
  matcher: [
    // Jangan jalankan untuk api, statik, gambar, dan metadata file
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|uploads).*)",
  ],
};
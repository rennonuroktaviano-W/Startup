"use client";

import { useEffect } from "react";
import { ToyButton } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="text-center text-white">
          <p className="font-display text-6xl font-bold text-lemon">Ups!</p>
          <p className="mt-4 max-w-sm text-base text-white/80">
            Kesalahan yang lebih serius terjadi. Muat ulang halaman untuk mencoba kembali.
          </p>
          <div className="mt-8">
            <ToyButton onClick={reset}>Muat ulang</ToyButton>
          </div>
        </div>
      </body>
    </html>
  );
}
"use client";

import { useEffect } from "react";
import { ToyButton } from "@/components/ui/button";

export default function ErrorPage({
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
    <div className="relative grid min-h-[70vh] place-items-center px-5">
      <div className="text-center">
        <p className="font-display text-6xl font-bold text-coral">Ups!</p>
        <p className="mt-4 max-w-sm text-base text-ink/70">
          Ada yang tidak beres saat memuat halaman. Coba lagi — kalau tetap terjadi, kabari kami ya.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ToyButton onClick={reset}>Coba lagi</ToyButton>
          <ToyButton href="/" variant="secondary">
            Kembali ke Home
          </ToyButton>
        </div>
      </div>
    </div>
  );
}
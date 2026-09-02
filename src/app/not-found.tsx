import Link from "next/link";
import { ToyButton } from "@/components/ui/button";
import { Burst, Sparkle, Star } from "@/components/public/shapes";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden px-5">
      <div className="bg-grain absolute inset-0" />
      <Burst className="absolute left-[8%] top-[15%] h-10 w-10 rotate-12 text-lemon" />
      <Star className="absolute right-[10%] top-[20%] h-9 w-9 -rotate-6 text-coral" />
      <Sparkle className="absolute bottom-[18%] left-[18%] h-6 w-6 text-sky" />
      <div className="relative text-center">
        <p className="font-display text-[7rem] font-bold leading-none text-purple sm:text-[10rem]">
          404
        </p>
        <p className="toy-sticker mx-auto -mt-2 rotate-[-2deg] bg-coral">Halaman ini hilang di playground.</p>
        <p className="mx-auto mt-6 max-w-sm text-base text-ink/70">
          Sepertinya yang kamu cari sudah pindah tempat atau belum pernah dibuat.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ToyButton href="/">Kembali ke Home</ToyButton>
          <ToyButton href="/work" variant="secondary">
            Lihat Karya
          </ToyButton>
        </div>
        <p className="mt-6 text-sm text-ink/50">
          Atau{" "}
          <Link href="/contact" className="font-semibold text-purple underline underline-offset-4">
            ceritakan idemu
          </Link>{" "}
          kalau memang belum ada halamannya.
        </p>
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-28 pt-32 md:px-10">
      <Skeleton className="h-8 w-44" />
      <Skeleton className="h-16 w-3/4 max-w-2xl" />
      <Skeleton className="h-5 w-1/2 max-w-lg" />
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
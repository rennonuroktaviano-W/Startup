import { requiresAuth } from "@/lib/admin-guard";
import { TestimonialForm } from "@/components/admin/cms/testimonial-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Testimoni — Admin" };

export default async function NewTestimonialPage() {
  await requiresAuth();
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah Testimoni</h1>
      <TestimonialForm />
    </div>
  );
}

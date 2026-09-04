"use client";

import { toast } from "sonner";

export function showToast({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}) {
  switch (variant) {
    case "success":
      toast.success(title, { description });
      break;
    case "error":
      toast.error(title, { description });
      break;
    case "warning":
      toast.warning(title, { description });
      break;
    default:
      toast(title, { description });
  }
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { login } from "@/actions/auth";
import { ToyButton } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [field, setField] = useState<"email" | "password" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setField(null);
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(res.message);
      setField(res.field ?? null);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink/80">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={field === "email"}
          className={cn(inputCls, field === "email" && "border-danger focus-visible:outline-danger")}
          placeholder="admin@example.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-ink/80">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={field === "password"}
          className={cn(inputCls, field === "password" && "border-danger focus-visible:outline-danger")}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <ToyButton type="submit" className="w-full" disabled={loading}>
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Masuk
      </ToyButton>
    </form>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple";
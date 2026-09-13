"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "register") {
        await api.register(email.trim(), password, name.trim() || undefined);
      } else {
        await api.login(email.trim(), password);
      }
      router.replace("/dashboard");
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      let parsed = "";
      try {
        const body = JSON.parse(detail) as { detail?: unknown };
        parsed = typeof body.detail === "string" ? body.detail : "";
      } catch {
        // ignore
      }
      setError(parsed || t("auth.error.fallback"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-secondary focus:border-accent/50 focus:outline-none";

  return (
    <div className="grid min-h-screen w-full place-items-center bg-black p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-accent/25">
            <Sparkles size={22} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">
              {t("auth.brand")}
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              {mode === "login" ? t("auth.subtitle.login") : t("auth.subtitle.register")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-xl shadow-black/30">
          <h2 className="mb-4 text-[16px] font-semibold text-text-primary">
            {mode === "login" ? t("auth.title.login") : t("auth.title.register")}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "register" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-text-secondary">
                  {t("auth.name")}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.placeholder.name")}
                  className={inputCls}
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-text-secondary">
                {t("auth.email")}
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-text-secondary">
                {t("auth.password")}
              </span>
              <input
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>

            {error && (
              <p className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[12px] text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim() || !password}
              className="mt-1 w-full rounded-lg bg-accent px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
            >
              {submitting
                ? mode === "login"
                  ? t("auth.loading.login")
                  : t("auth.loading.register")
                : mode === "login"
                  ? t("auth.submit.login")
                  : t("auth.submit.register")}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="mt-4 block w-full text-center text-[13px] text-accent-hover transition-colors hover:underline"
          >
            {mode === "login" ? t("auth.toggle.toRegister") : t("auth.toggle.toLogin")}
          </button>
        </div>
      </div>
    </div>
  );
}
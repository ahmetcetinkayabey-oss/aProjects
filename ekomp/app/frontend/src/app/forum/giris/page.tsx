"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErrorText, Section, buttonClass, fieldClass } from "@/components/forum/forum-ui";
import { ForumApiError, post, setForumToken } from "@/lib/forum-api";
import type { DictKey } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<DictKey | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return setError("err.required");
    setBusy(true);
    setError(null);
    try {
      const { token } = await post<{ token: string }>("/forum/auth/login", { email, password });
      setForumToken(token);
      router.push("/forum/panel");
    } catch (err) {
      const key = err instanceof ForumApiError ? err.key : "err.generic";
      setError(key === "notVerified" ? "login.notVerified" : key);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title={t("login.title")}>
      <form onSubmit={submit} noValidate className="grid max-w-md gap-4">
        <label>
          <span className="mb-1 block text-sm font-bold">{t("reg.email")}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={fieldClass} />
        </label>
        <label>
          <span className="mb-1 block text-sm font-bold">{t("reg.password").replace(/ \(.*\)$/, "")}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={fieldClass} />
        </label>
        {error ? <ErrorText>{t(error)}</ErrorText> : null}
        <button type="submit" disabled={busy} className={buttonClass}>
          {t("login.submit")}
        </button>
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/forum/sifre-unuttum" className="font-bold underline">
            {t("login.forgot")}
          </Link>
          <span>
            {t("login.noAccount")}{" "}
            <Link href="/forum/kayit" className="font-bold underline">
              {t("forum.register")}
            </Link>
          </span>
        </p>
      </form>
    </Section>
  );
}

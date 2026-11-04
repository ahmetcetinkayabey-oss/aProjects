"use client";

import { useState, type FormEvent } from "react";
import { ErrorText, Section, buttonClass, fieldClass } from "@/components/forum/forum-ui";
import { ForumApiError, post } from "@/lib/forum-api";
import type { DictKey } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<DictKey | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("err.email");
    setError(null);
    try {
      await post("/forum/auth/forgot-password", { email });
      setDone(true);
    } catch (err) {
      setError(err instanceof ForumApiError && err.key !== "notVerified" ? err.key : "err.generic");
    }
  }

  return (
    <Section title={t("forgot.title")}>
      {done ? (
        <p role="status" className="text-lg">{t("forgot.done")}</p>
      ) : (
        <form onSubmit={submit} noValidate className="grid max-w-md gap-4">
          <p className="text-on-surface-variant">{t("forgot.text")}</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label={t("reg.email")} autoComplete="email" className={fieldClass} />
          {error ? <ErrorText>{t(error)}</ErrorText> : null}
          <button type="submit" className={buttonClass}>{t("forgot.submit")}</button>
        </form>
      )}
    </Section>
  );
}

"use client";

import Link from "@/components/locale-link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { ErrorText, Section, buttonClass, fieldClass } from "@/components/forum/forum-ui";
import { ForumApiError, post } from "@/lib/forum-api";
import type { DictKey } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";

function Reset() {
  const { t } = useLocale();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<DictKey | null>(token ? null : "err.token");
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("err.password");
    setError(null);
    try {
      await post("/forum/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ForumApiError && err.key !== "notVerified" ? err.key : "err.generic");
    }
  }

  return (
    <Section title={t("reset.title")}>
      {done ? (
        <p role="status" className="text-lg">
          {t("reset.done")}{" "}
          <Link href="/forum/giris" className="font-bold underline">
            {t("login.title")}
          </Link>
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="grid max-w-md gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label={t("reg.password")}
            placeholder={t("reg.password")}
            autoComplete="new-password"
            className={fieldClass}
          />
          {error ? <ErrorText>{t(error)}</ErrorText> : null}
          <button type="submit" className={buttonClass}>{t("reset.submit")}</button>
        </form>
      )}
    </Section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Reset />
    </Suspense>
  );
}

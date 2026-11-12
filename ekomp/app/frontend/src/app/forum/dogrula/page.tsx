"use client";

import Link from "@/components/locale-link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ErrorText, Section } from "@/components/forum/forum-ui";
import { ForumApiError, post } from "@/lib/forum-api";
import type { DictKey } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";

function Verify() {
  const { t } = useLocale();
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"working" | "ok" | DictKey>(token ? "working" : "err.token");
  const started = useRef(false);

  useEffect(() => {
    // Jeton tek kullanımlıktır; geliştirme modunda efektin iki kez çalışması ikinci çağrıyı bozmasın.
    if (!token || started.current) return;
    started.current = true;
    post("/forum/auth/verify-email", { token })
      .then(() => setState("ok"))
      .catch((e) => setState(e instanceof ForumApiError && e.key !== "notVerified" ? e.key : "err.token"));
  }, [token]);

  return (
    <Section title={t("verify.title")}>
      {state === "working" ? <p role="status">{t("verify.working")}</p> : null}
      {state === "ok" ? (
        <p role="status" className="text-lg">
          {t("verify.ok")}{" "}
          <Link href="/forum/giris" className="font-bold underline">
            {t("login.title")}
          </Link>
        </p>
      ) : null}
      {state !== "working" && state !== "ok" ? <ErrorText>{t(state)}</ErrorText> : null}
    </Section>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}

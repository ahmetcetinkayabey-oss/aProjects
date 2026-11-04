"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ErrorText, Section, buttonClass, fieldClass } from "@/components/forum/forum-ui";
import type { DictKey } from "@/lib/dictionary";
import { CATEGORIES, ForumApiError, post } from "@/lib/forum-api";
import { useLocale } from "@/lib/i18n";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  organization: string;
  jobTitle: string;
  category: string;
  bio: string;
  wantsB2B: boolean;
  visibility: string;
  password: string;
  privacyAccepted: boolean;
}

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  organization: "",
  jobTitle: "",
  category: "",
  bio: "",
  wantsB2B: false,
  visibility: "PARTICIPANTS",
  password: "",
  privacyAccepted: false,
};

const REQUIRED: (keyof FormState)[] = [
  "firstName", "lastName", "email", "phone", "country", "city", "organization", "jobTitle", "category",
];

/** Doğrulama sonucu çeviri anahtarı olarak tutulur; dil değişince mesaj da değişir, form korunur. */
function validate(f: FormState): DictKey | null {
  if (REQUIRED.some((k) => !String(f[k]).trim())) return "err.required";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "err.email";
  if (f.password.length < 8) return "err.password";
  if (!f.privacyAccepted) return "err.privacy";
  return null;
}

export default function RegisterPage() {
  const { t } = useLocale();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<DictKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const problem = validate(form);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      await post("/forum/auth/register", { ...form, bio: form.bio || undefined });
      setDone(true);
    } catch (err) {
      setError(err instanceof ForumApiError && err.key !== "notVerified" ? err.key : "err.generic");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Section title={t("reg.done.title")}>
        <p role="status" className="max-w-xl text-lg text-on-surface-variant">{t("reg.done.text")}</p>
      </Section>
    );
  }

  const text = (key: keyof FormState, label: DictKey, extra: { type?: string; span?: boolean; autoComplete?: string } = {}) => (
    <label className={extra.span ? "sm:col-span-2" : ""}>
      <span className="mb-1 block text-sm font-bold">{t(label)}</span>
      <input
        type={extra.type ?? "text"}
        value={String(form[key])}
        onChange={(e) => set(key, e.target.value as never)}
        autoComplete={extra.autoComplete}
        className={fieldClass}
      />
    </label>
  );

  return (
    <Section title={t("reg.title")}>
      <p className="mb-8 max-w-2xl text-on-surface-variant">{t("reg.intro")}</p>
      <form onSubmit={submit} noValidate className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {text("firstName", "reg.firstName", { autoComplete: "given-name" })}
        {text("lastName", "reg.lastName", { autoComplete: "family-name" })}
        {text("email", "reg.email", { type: "email", span: true, autoComplete: "email" })}
        {text("phone", "reg.phone", { type: "tel", autoComplete: "tel" })}
        {text("country", "reg.country", { autoComplete: "country-name" })}
        {text("city", "reg.city")}
        {text("organization", "reg.organization", { autoComplete: "organization" })}
        {text("jobTitle", "reg.jobTitle", { autoComplete: "organization-title" })}
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-bold">{t("reg.category")}</span>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={fieldClass}>
            <option value="">{t("reg.categoryPick")}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`cat.${c}` as DictKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-bold">{t("reg.bio")}</span>
          <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} maxLength={1000} className={fieldClass} />
        </label>
        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={form.wantsB2B} onChange={(e) => set("wantsB2B", e.target.checked)} className="h-5 w-5" />
          <span>{t("reg.wantsB2B")}</span>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-bold">{t("reg.visibility")}</span>
          <select value={form.visibility} onChange={(e) => set("visibility", e.target.value)} className={fieldClass}>
            {["PARTICIPANTS", "PUBLIC", "HIDDEN"].map((v) => (
              <option key={v} value={v}>
                {t(`reg.vis.${v}` as DictKey)}
              </option>
            ))}
          </select>
        </label>
        {text("password", "reg.password", { type: "password", span: true, autoComplete: "new-password" })}
        <label className="flex items-start gap-3 sm:col-span-2">
          <input type="checkbox" checked={form.privacyAccepted} onChange={(e) => set("privacyAccepted", e.target.checked)} className="mt-1 h-5 w-5" />
          <span className="text-sm">
            {t("reg.privacy")}{" "}
            <Link href="/gizlilik" target="_blank" className="font-semibold underline underline-offset-4">
              {t("privacy.read")}
            </Link>
          </span>
        </label>
        {error ? (
          <div className="sm:col-span-2">
            <ErrorText>{t(error)}</ErrorText>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? t("reg.sending") : t("reg.submit")}
          </button>
          <span className="text-sm">
            {t("reg.haveAccount")}{" "}
            <Link href="/forum/giris" className="font-bold underline">
              {t("login.title")}
            </Link>
          </span>
        </div>
      </form>
    </Section>
  );
}

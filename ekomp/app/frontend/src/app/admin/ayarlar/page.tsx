"use client";

import { useState, type FormEvent } from "react";
import { Field, Notice, PageHeading, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { adminFetch } from "@/lib/admin-api";

export default function AccountSettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (next !== again) {
      setError("Yeni şifreler birbiriyle aynı değil.");
      return;
    }
    setBusy(true);
    try {
      await adminFetch("/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setDone(true);
      setCurrent("");
      setNext("");
      setAgain("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Şifre değiştirilemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeading title="Hesap Ayarları" subtitle="Yönetici şifrenizi değiştirin." />
      <form onSubmit={onSubmit} className="max-w-md space-y-space-md border border-surface-container-highest bg-white p-space-lg">
        {error ? <Notice kind="error">{error}</Notice> : null}
        {done ? <Notice kind="success">Şifreniz değiştirildi.</Notice> : null}
        <Field label="Mevcut şifre">
          <input className={inputClass} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Field label="Yeni şifre" hint="En az 8 karakter.">
          <input className={inputClass} type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Yeni şifre (tekrar)">
          <input className={inputClass} type="password" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" minLength={8} required />
        </Field>
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Kaydediliyor..." : "Şifreyi değiştir"}
        </button>
      </form>
    </>
  );
}

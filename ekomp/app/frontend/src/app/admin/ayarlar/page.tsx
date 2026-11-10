"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Field, Notice, PageHeading, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { adminFetch, setToken } from "@/lib/admin-api";

interface MailStatus {
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUser: string | null;
  smtpPassSet: boolean;
  from: string | null;
  notifyTo: string | null;
  ready: boolean;
  fromPanel: boolean;
}

interface MailForm {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  notifyFrom: string;
  notifyTo: string;
}

const BREVO_HOST = "smtp-relay.brevo.com";

function formFrom(s: MailStatus): MailForm {
  return {
    smtpHost: s.smtpHost ?? BREVO_HOST,
    smtpPort: s.smtpPort ?? "587",
    smtpUser: s.smtpUser ?? "",
    smtpPass: "",
    notifyFrom: s.from ?? "",
    notifyTo: s.notifyTo ?? "",
  };
}

function MailSettings() {
  const [status, setStatus] = useState<MailStatus | null>(null);
  const [form, setForm] = useState<MailForm | null>(null);
  const [testTo, setTestTo] = useState("");
  const [busy, setBusy] = useState<"save" | "test" | "clear" | null>(null);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    adminFetch<MailStatus>("/admin/mail-status")
      .then((s) => {
        setStatus(s);
        setForm(formFrom(s));
        setTestTo(s.notifyTo ?? "");
      })
      .catch(() => undefined);
  }, []);

  const set = (key: keyof MailForm) => (e: { target: { value: string } }) =>
    setForm((f) => (f ? { ...f, [key]: e.target.value } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy("save");
    setResult(null);
    try {
      const s = await adminFetch<MailStatus>("/admin/mail-settings", { method: "PUT", body: JSON.stringify(form) });
      setStatus(s);
      setForm(formFrom(s));
      setTestTo((t) => t || s.notifyTo || "");
      setResult({ ok: true, text: "E-posta ayarları kaydedildi. Aşağıdan test e-postası göndererek doğrulayabilirsiniz." });
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : "Kaydedilemedi." });
    } finally {
      setBusy(null);
    }
  }

  async function clearPassword() {
    if (!window.confirm("Kayıtlı SMTP anahtarı silinsin mi? E-postalar yeni bir anahtar girene kadar gönderilemez.")) return;
    setBusy("clear");
    setResult(null);
    try {
      const s = await adminFetch<MailStatus>("/admin/mail-settings/password", { method: "DELETE" });
      setStatus(s);
      setResult({ ok: true, text: "SMTP anahtarı silindi." });
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : "Silinemedi." });
    } finally {
      setBusy(null);
    }
  }

  async function sendTest(e: FormEvent) {
    e.preventDefault();
    setBusy("test");
    setResult(null);
    try {
      const r = await adminFetch<{ ok: boolean; error?: string }>("/admin/mail-test", { method: "POST", body: JSON.stringify({ to: testTo }) });
      setResult(
        r.ok
          ? { ok: true, text: `Test e-postası ${testTo} adresine gönderildi. Gelen kutunuzu (ve gereksiz klasörünü) kontrol edin.` }
          : { ok: false, text: r.error ?? "Gönderilemedi." },
      );
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : "Gönderilemedi." });
    } finally {
      setBusy(null);
    }
  }

  const checks: [string, boolean, string][] = status
    ? [
        ["SMTP sunucusu", !!status.smtpHost, status.smtpHost ?? "tanımlı değil"],
        ["Kullanıcı ve anahtar", !!status.smtpUser && status.smtpPassSet, status.smtpUser && status.smtpPassSet ? "tanımlı" : "eksik"],
        ["Gönderen adres", !!status.from, status.from ?? "tanımlı değil"],
        ["Yönetici bildirimi", !!status.notifyTo, status.notifyTo ?? "tanımlı değil (yeni talep bildirimi size gitmez)"],
      ]
    : [];

  return (
    <section className="mt-space-xl max-w-2xl border border-surface-container-highest bg-white p-space-lg">
      <h2 className="font-headline-md text-lg font-bold text-on-surface">E-posta bildirimleri (Brevo / SMTP)</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Yeni kamp talebi geldiğinde size, talebi gönderen kişiye de onay e-postası gider. Ayarları buradan girebilirsiniz; sunucuyu yeniden başlatmanız gerekmez.
      </p>

      <ul className="mt-space-md space-y-1 text-sm">
        {checks.map(([label, ok, value]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${ok ? "text-green-700" : "text-red-700"}`}>{ok ? "check_circle" : "warning"}</span>
            <span className="w-40 shrink-0 font-semibold">{label}</span>
            <span className="truncate text-on-surface-variant">{value}</span>
          </li>
        ))}
      </ul>

      {status && !status.ready ? (
        <div className="mt-space-md border border-amber-300 bg-amber-50 p-space-md text-sm text-amber-900">
          <p className="font-semibold">Brevo (ücretsiz) için:</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>
              brevo.com&apos;da hesap açın; <strong>SMTP ve API</strong> bölümünden bir <strong>SMTP anahtarı</strong> oluşturun.
            </li>
            <li>Gönderen e-posta adresinizi Brevo&apos;da doğrulayın (Gönderenler bölümü).</li>
            <li>Aşağıdaki forma Brevo giriş e-postanızı, SMTP anahtarını ve doğruladığınız gönderen adresi yazıp kaydedin.</li>
          </ol>
        </div>
      ) : null}

      {form ? (
        <form onSubmit={save} className="mt-space-md grid gap-space-md sm:grid-cols-2">
          <Field label="SMTP sunucusu">
            <input className={inputClass} value={form.smtpHost} onChange={set("smtpHost")} placeholder={BREVO_HOST} />
          </Field>
          <Field label="Port" hint="Brevo için 587.">
            <input className={inputClass} inputMode="numeric" value={form.smtpPort} onChange={set("smtpPort")} placeholder="587" />
          </Field>
          <Field label="SMTP kullanıcı adı" hint="Brevo'da genellikle giriş e-postanız.">
            <input className={inputClass} value={form.smtpUser} onChange={set("smtpUser")} autoComplete="off" />
          </Field>
          <Field label="SMTP anahtarı" hint={status?.smtpPassSet ? "Kayıtlı anahtar var; değiştirmek için yeni anahtarı yazın, boş bırakırsanız korunur." : "Brevo'dan oluşturduğunuz SMTP anahtarı."}>
            <input className={inputClass} type="password" value={form.smtpPass} onChange={set("smtpPass")} autoComplete="new-password" placeholder={status?.smtpPassSet ? "••••••••••••" : ""} />
          </Field>
          <Field label="Gönderen adres" hint="Brevo'da doğruladığınız adres olmalı.">
            <input className={inputClass} value={form.notifyFrom} onChange={set("notifyFrom")} placeholder="ornek@alanadi.com" />
          </Field>
          <Field label="Bildirim alacak adres" hint="Yeni talep e-postaları buraya gelir.">
            <input className={inputClass} type="email" value={form.notifyTo} onChange={set("notifyTo")} placeholder="ornek@alanadi.com" />
          </Field>
          <div className="flex flex-wrap items-center gap-space-sm sm:col-span-2">
            <button type="submit" disabled={busy !== null} className={btnPrimary}>
              {busy === "save" ? "Kaydediliyor..." : "Ayarları kaydet"}
            </button>
            {status?.smtpPassSet ? (
              <button type="button" disabled={busy !== null} onClick={clearPassword} className="text-sm font-semibold text-red-700 underline">
                Kayıtlı anahtarı sil
              </button>
            ) : null}
            {status?.fromPanel ? <span className="ml-auto text-xs text-on-surface-variant">Ayarlar panelden kaydedildi.</span> : null}
          </div>
        </form>
      ) : null}

      <form onSubmit={sendTest} className="mt-space-lg flex flex-wrap items-end gap-space-sm border-t border-surface-container pt-space-md">
        <div className="min-w-[16rem] flex-1">
          <Field label="Test e-postası gönderilecek adres">
            <input className={inputClass} type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} required placeholder="ornek@alanadi.com" />
          </Field>
        </div>
        <button type="submit" disabled={busy !== null || !status?.ready} className={btnGhost}>
          {busy === "test" ? "Gönderiliyor..." : "Test e-postası gönder"}
        </button>
      </form>

      {result ? (
        <div className="mt-space-md">
          <Notice kind={result.ok ? "success" : "error"}>{result.text}</Notice>
        </div>
      ) : null}
    </section>
  );
}

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
      // Parola değişince eski oturumlar kapanır; bu oturumu yeni parolayla yenilemek için kullanıcı adı önceden alınır.
      const me = await adminFetch<{ username: string }>("/admin/me");
      await adminFetch("/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const fresh = await adminFetch<{ token: string }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: me.username, password: next }),
      });
      setToken(fresh.token);
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
      <PageHeading title="Hesap Ayarları" subtitle="Yönetici şifrenizi ve e-posta bildirimlerini yönetin." />
      <form onSubmit={onSubmit} className="max-w-md space-y-space-md border border-surface-container-highest bg-white p-space-lg">
        {error ? <Notice kind="error">{error}</Notice> : null}
        {done ? <Notice kind="success">Şifreniz değiştirildi.</Notice> : null}
        <Field label="Mevcut şifre">
          <input className={inputClass} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Field label="Yeni şifre" hint="En az 10 karakter. Değişince diğer cihazlardaki oturumlar kapanır.">
          <input className={inputClass} type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={10} required />
        </Field>
        <Field label="Yeni şifre (tekrar)">
          <input className={inputClass} type="password" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" minLength={10} required />
        </Field>
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Kaydediliyor..." : "Şifreyi değiştir"}
        </button>
      </form>
      <MailSettings />
    </>
  );
}

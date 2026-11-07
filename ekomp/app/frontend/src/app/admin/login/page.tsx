"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Field, Notice, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { adminFetch, getToken, setToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await adminFetch<{ token: string }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-space-md">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-space-md bg-white p-space-xl">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Kamp Merkezi" className="mx-auto h-32 w-auto" />
          <h1 className="mt-space-sm font-headline-md text-headline-md text-on-surface">
            Yönetim Paneli
          </h1>
        </div>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <Field label="Kullanıcı adı">
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            autoFocus
          />
        </Field>
        <Field label="Şifre">
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
          {busy ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}

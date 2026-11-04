"use client";

import { useRef, useState, type ReactNode } from "react";
import { assetUrl } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

export const inputClass =
  "w-full border border-surface-container-highest bg-white px-space-md py-space-sm font-body-md text-body-md text-on-surface outline-none focus:border-primary";

export const btnPrimary =
  "bg-primary-container px-space-lg py-space-sm font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-[#222222] hover:text-white disabled:opacity-60";

// Ghost ve danger aynı ölçülerde: yan yana durduklarında hizası bozulmaz.
export const btnGhost =
  "inline-flex min-h-10 items-center justify-center border border-surface-container-highest px-space-lg py-space-sm font-label-caps text-label-caps text-on-surface uppercase transition-colors hover:bg-surface-container disabled:opacity-60";

export const btnDanger =
  "inline-flex min-h-10 items-center justify-center border border-red-300 px-space-lg py-space-sm font-label-caps text-label-caps text-red-700 uppercase transition-colors hover:bg-red-50 disabled:opacity-60";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant uppercase">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-on-surface-variant">{hint}</span> : null}
    </label>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-space-lg flex flex-wrap items-end justify-between gap-space-md">
      <div>
        <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`mb-space-md border px-space-md py-space-sm text-sm ${
        kind === "error"
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-green-300 bg-green-50 text-green-800"
      }`}
    >
      {children}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-space-md"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="my-space-xl w-full max-w-2xl bg-white p-space-lg shadow-xl">
        <div className="mb-space-md flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Görsel yükleme alanı: dosya seç -> backend'e yükle -> adres alanına yazılır. */
export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const preview = assetUrl(value);
  return (
    <div>
      <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant uppercase">
        Görsel
      </span>
      <div className="flex flex-wrap items-start gap-space-md">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Önizleme" className="h-24 w-36 border object-cover" />
        ) : (
          <div className="flex h-24 w-36 items-center justify-center border bg-surface-container text-xs text-on-surface-variant">
            Görsel yok
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-space-xs">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="block w-full text-sm"
            disabled={busy}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="veya görsel adresi (https://... ya da /images/...)"
            className={inputClass}
          />
          {busy ? <p className="text-xs text-on-surface-variant">Yükleniyor...</p> : null}
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
          <p className="text-xs text-on-surface-variant">JPG, PNG veya WebP — en çok 8 MB.</p>
        </div>
      </div>
    </div>
  );
}

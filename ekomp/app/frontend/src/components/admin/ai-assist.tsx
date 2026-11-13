"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Action = "translate-en" | "translate-tr" | "polish" | "shorten";

/** Yapay zekâ ile metin çevirme/düzeltme düğmeleri. Sonuç yalnızca ilgili alana yazılır; kaydetmek yöneticiye kalır. */
export function AiAssist({
  actions,
  source,
  onResult,
}: {
  actions: { action: Action; label: string }[];
  source: string;
  onResult: (text: string) => void;
}) {
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState("");

  async function run(action: Action) {
    if (!source.trim()) {
      setError("Önce kaynak metni yazın.");
      return;
    }
    setBusy(action);
    setError("");
    try {
      const r = await adminFetch<{ text: string }>("/admin/ai/text", {
        method: "POST",
        body: JSON.stringify({ action, text: source }),
      });
      onResult(r.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "İşlem başarısız.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="-mt-2 mb-space-md flex flex-wrap items-center gap-2 text-sm">
      {actions.map((a) => (
        <button
          key={a.action}
          type="button"
          disabled={busy !== null}
          onClick={() => run(a.action)}
          className="rounded border border-outline-variant px-3 py-1 text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
        >
          {busy === a.action ? "Çalışıyor…" : `✨ ${a.label}`}
        </button>
      ))}
      {error && <span role="alert" className="text-error">{error}</span>}
    </div>
  );
}

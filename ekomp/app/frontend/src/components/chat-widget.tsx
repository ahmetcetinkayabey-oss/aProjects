"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/api";
import { useLocale } from "@/lib/i18n";

type Turn = { role: "user" | "assistant"; text: string };

const COPY = {
  tr: {
    open: "Soru sor",
    title: "Kamp Asistanı",
    hello: "Merhaba! Tesislerimiz hakkında soru sorabilirsiniz. Rezervasyon için lütfen rezervasyon sayfasını kullanın.",
    placeholder: "Sorunuzu yazın…",
    send: "Gönder",
    close: "Kapat",
    error: "Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyin.",
    note: "Yapay zekâ yanıtları hata içerebilir.",
  },
  en: {
    open: "Ask a question",
    title: "Camp Assistant",
    hello: "Hello! Ask me anything about our facilities. For bookings, please use the reservation page.",
    placeholder: "Type your question…",
    send: "Send",
    close: "Close",
    error: "I can't answer right now, please try again later.",
    note: "AI answers may contain mistakes.",
  },
} as const;

/** Ziyaretçi sohbet asistanı: yalnızca tesis verisine dayanarak cevap verir (sunucu tarafında sınırlandırılır). */
export function ChatWidget() {
  const { locale } = useLocale();
  const c = COPY[locale === "en" ? "en" : "tr"];
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, busy, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message || busy) return;
    const history = turns.slice(-6);
    setTurns((t) => [...t, { role: "user", text: message }]);
    setText("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const body = (await res.json().catch(() => ({}))) as { reply?: string; message?: string };
      if (!res.ok || !body.reply) throw new Error(typeof body.message === "string" ? body.message : c.error);
      setTurns((t) => [...t, { role: "assistant", text: body.reply as string }]);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : c.error);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-lg hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden>chat</span>
        {c.open}
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-label={c.title}
      className="fixed bottom-4 right-4 z-40 flex h-[min(32rem,calc(100vh-2rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-2xl"
    >
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-on-primary">
        <h2 className="text-sm font-bold">{c.title}</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="material-symbols-outlined text-[20px]">close</button>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm" aria-live="polite">
        <p className="rounded-lg bg-surface-container p-2 text-on-surface">{c.hello}</p>
        {turns.map((t, i) => (
          <p key={i} className={`whitespace-pre-wrap rounded-lg p-2 ${t.role === "user" ? "ml-8 bg-primary text-on-primary" : "mr-8 bg-surface-container text-on-surface"}`}>
            {t.text}
          </p>
        ))}
        {busy && <p className="mr-8 rounded-lg bg-surface-container p-2 text-on-surface-variant">…</p>}
        {error && <p role="alert" className="text-error">{error}</p>}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="border-t border-outline-variant p-2">
        <div className="flex gap-2">
          <input
            value={text}
            maxLength={500}
            onChange={(e) => setText(e.target.value)}
            placeholder={c.placeholder}
            aria-label={c.placeholder}
            className="min-w-0 flex-1 rounded border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <button type="submit" disabled={busy || !text.trim()} className="rounded bg-primary px-3 py-2 text-sm font-bold text-on-primary disabled:opacity-50">
            {c.send}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-on-surface-variant">{c.note}</p>
      </form>
    </section>
  );
}

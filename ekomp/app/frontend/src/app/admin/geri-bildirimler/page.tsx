"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice, PageHeading, btnDanger, btnGhost } from "@/components/admin/admin-ui";
import { adminFetch, type AdminFeedback } from "@/lib/admin-api";

const CATEGORY_STYLES: Record<string, string> = {
  Öneri: "bg-blue-100 text-blue-900",
  Şikayet: "bg-red-100 text-red-900",
  Teşekkür: "bg-green-100 text-green-900",
  Diğer: "bg-surface-container-high text-on-surface-variant",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

export default function FeedbackPage() {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "DONE">("OPEN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminFetch<AdminFeedback[]>("/admin/feedback")
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const visible = useMemo(
    () =>
      items.filter((f) => filter === "ALL" || (filter === "OPEN" ? !f.handled : f.handled)),
    [items, filter],
  );

  async function toggle(item: AdminFeedback) {
    setError("");
    try {
      const updated = await adminFetch<AdminFeedback>(`/admin/feedback/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ handled: !item.handled }),
      });
      setItems((list) => list.map((f) => (f.id === updated.id ? updated : f)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(item: AdminFeedback) {
    if (!window.confirm("Bu geri bildirim silinsin mi?")) return;
    setError("");
    try {
      await adminFetch(`/admin/feedback/${item.id}`, { method: "DELETE" });
      setItems((list) => list.filter((f) => f.id !== item.id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <PageHeading title="Geri Bildirimler" subtitle="Ziyaretçilerin sitedeki formdan gönderdiği mesajlar." />
      {error ? <Notice kind="error">{error}</Notice> : null}

      <div className="mb-space-md flex flex-wrap gap-2">
        {(
          [
            ["OPEN", "Bekleyen"],
            ["DONE", "İşlenen"],
            ["ALL", "Tümü"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              filter === value ? "bg-primary-container text-on-primary-container" : "bg-white text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? <p className="text-on-surface-variant">Yükleniyor...</p> : null}
      {!loading && visible.length === 0 ? (
        <p className="bg-white p-space-lg text-on-surface-variant">Gösterilecek geri bildirim yok.</p>
      ) : null}

      <ul className="grid gap-space-md">
        {visible.map((f) => (
          <li key={f.id} className={`bg-white p-space-lg shadow-sm ${f.handled ? "opacity-70" : ""}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[f.category] ?? CATEGORY_STYLES["Diğer"]}`}
              >
                {f.category}
              </span>
              {f.rating ? (
                <span className="text-sm font-bold text-on-surface" aria-label={`${f.rating} / 5`}>
                  {"★".repeat(f.rating)}
                  <span className="text-surface-container-high">{"★".repeat(5 - f.rating)}</span>
                </span>
              ) : null}
              <span className="ml-auto text-xs text-on-surface-variant">{formatDateTime(f.createdAt)}</span>
            </div>
            <p className="mt-3 font-semibold text-on-surface">
              {f.name}
              {f.email ? (
                <a href={`mailto:${f.email}`} className="ml-2 text-sm font-normal text-primary underline">
                  {f.email}
                </a>
              ) : null}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-on-surface-variant">{f.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => toggle(f)} className={btnGhost}>
                {f.handled ? "Beklemeye al" : "İşlendi olarak işaretle"}
              </button>
              <button type="button" onClick={() => remove(f)} className={btnDanger}>
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

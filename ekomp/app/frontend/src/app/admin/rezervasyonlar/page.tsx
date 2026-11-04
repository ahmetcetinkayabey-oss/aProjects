"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Notice, PageHeading, btnDanger, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import {
  STATUS_LABELS,
  adminFetch,
  type AdminReservation,
  type ReservationStatus,
} from "@/lib/admin-api";

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-primary-container text-on-primary-container",
  CONTACTED: "bg-blue-100 text-blue-900",
  CONFIRMED: "bg-green-100 text-green-900",
  CANCELLED: "bg-surface-container-high text-on-surface-variant",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

function formatDate(iso?: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("tr-TR") : "—";
}

export default function ReservationsPage() {
  const [items, setItems] = useState<AdminReservation[]>([]);
  const [filter, setFilter] = useState<ReservationStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    adminFetch<AdminReservation[]>("/admin/reservations")
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return items.filter(
      (r) =>
        (filter === "ALL" || r.status === filter) &&
        (!q ||
          [r.organizationName, r.contactName, r.email, r.phone, r.sportBranch]
            .join(" ")
            .toLocaleLowerCase("tr")
            .includes(q)),
    );
  }, [items, filter, query]);

  async function update(id: string, changes: { status?: ReservationStatus; adminNote?: string }) {
    setError("");
    setMessage("");
    try {
      const saved = await adminFetch<AdminReservation>(`/admin/reservations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setItems((prev) => prev.map((r) => (r.id === id ? saved : r)));
      setMessage("Kaydedildi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  }

  async function remove(item: AdminReservation) {
    if (!window.confirm(`"${item.organizationName}" talebi kalıcı olarak silinsin mi?`)) return;
    setError("");
    try {
      await adminFetch(`/admin/reservations/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((r) => r.id !== item.id));
      setOpenId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi.");
    }
  }

  const tabs: (ReservationStatus | "ALL")[] = ["ALL", "PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"];

  return (
    <>
      <PageHeading
        title="Rezervasyon Talepleri"
        subtitle="Web sitesindeki formdan gelen kamp talepleri."
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {message ? <Notice kind="success">{message}</Notice> : null}

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        {tabs.map((tab) => {
          const count = tab === "ALL" ? items.length : items.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-space-md py-space-xs text-sm font-semibold ${
                filter === tab
                  ? "bg-[#222222] text-white"
                  : "border border-surface-container-highest bg-white text-on-surface"
              }`}
            >
              {tab === "ALL" ? "Tümü" : STATUS_LABELS[tab]} ({count})
            </button>
          );
        })}
        <input
          className={`${inputClass} max-w-xs sm:ml-auto`}
          placeholder="Kulüp, kişi, e-posta, branş ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border border-surface-container-highest bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="px-space-md py-space-sm">Tarih</th>
              <th className="px-space-md py-space-sm">Kurum / Kulüp</th>
              <th className="px-space-md py-space-sm">Branş</th>
              <th className="px-space-md py-space-sm">Kafile</th>
              <th className="px-space-md py-space-sm">Durum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-space-md py-space-lg text-center text-on-surface-variant">
                  Yükleniyor...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-space-md py-space-lg text-center text-on-surface-variant">
                  Gösterilecek talep yok.
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <Fragment key={r.id}>
                  <tr
                    className="cursor-pointer border-t border-surface-container hover:bg-surface-container-low"
                    onClick={() => setOpenId(openId === r.id ? null : r.id)}
                  >
                    <td className="px-space-md py-space-sm whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td className="px-space-md py-space-sm font-semibold">{r.organizationName}</td>
                    <td className="px-space-md py-space-sm">{r.sportBranch}</td>
                    <td className="px-space-md py-space-sm">{r.groupSize ?? "—"}</td>
                    <td className="px-space-md py-space-sm">
                      <span className={`px-space-sm py-0.5 text-xs font-bold ${STATUS_STYLES[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                  {openId === r.id ? (
                    <tr className="border-t border-surface-container bg-surface-container-low">
                      <td colSpan={5} className="px-space-md py-space-md">
                        <div className="grid gap-space-md md:grid-cols-2">
                          <dl className="space-y-1">
                            <div><dt className="inline font-semibold">Yetkili: </dt><dd className="inline">{r.contactName}</dd></div>
                            <div><dt className="inline font-semibold">E-posta: </dt><dd className="inline"><a className="text-primary underline" href={`mailto:${r.email}`}>{r.email}</a></dd></div>
                            <div><dt className="inline font-semibold">Telefon: </dt><dd className="inline"><a className="text-primary underline" href={`tel:${r.phone}`}>{r.phone}</a></dd></div>
                            <div><dt className="inline font-semibold">İstenen tarih: </dt><dd className="inline">{formatDate(r.preferredStartDate)} – {formatDate(r.preferredEndDate)}</dd></div>
                            <div><dt className="font-semibold">Mesaj:</dt><dd className="whitespace-pre-wrap">{r.message || "—"}</dd></div>
                          </dl>
                          <div className="space-y-space-sm">
                            <label className="block">
                              <span className="mb-1 block font-semibold">Durum</span>
                              <select
                                className={inputClass}
                                value={r.status}
                                onChange={(e) => update(r.id, { status: e.target.value as ReservationStatus })}
                              >
                                {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
                                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className="mb-1 block font-semibold">Not (yalnızca yöneticiler görür)</span>
                              <textarea
                                className={inputClass}
                                rows={3}
                                value={notes[r.id] ?? r.adminNote ?? ""}
                                onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                              />
                            </label>
                            <div className="flex gap-space-sm">
                              <button
                                type="button"
                                className={btnPrimary}
                                onClick={() => update(r.id, { adminNote: notes[r.id] ?? r.adminNote ?? "" })}
                              >
                                Notu kaydet
                              </button>
                              <button type="button" className={btnDanger} onClick={() => remove(r)}>
                                Sil
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

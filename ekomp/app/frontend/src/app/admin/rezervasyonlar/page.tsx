"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Notice, PageHeading, btnDanger, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import {
  STATUS_LABELS,
  adminFetch,
  type AdminReservation,
  type ReservationStatus,
} from "@/lib/admin-api";

const STATUSES = Object.keys(STATUS_LABELS) as ReservationStatus[];

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-primary-container text-on-primary-container",
  CONTACTED: "bg-blue-100 text-blue-900",
  CONFIRMED: "bg-green-100 text-green-900",
  CANCELLED: "bg-surface-container-high text-on-surface-variant",
};

const STATUS_HINT: Record<ReservationStatus, string> = {
  PENDING: "Henüz kimse bakmadı",
  CONTACTED: "Müşteriyle konuşuldu",
  CONFIRMED: "Rezervasyon kesinleşti",
  CANCELLED: "Vazgeçildi / iptal",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

function formatDate(iso?: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("tr-TR") : "—";
}

/** "5 dk önce", "3 saat önce", "2 gün önce" */
function timeAgo(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} gün önce` : formatDate(iso);
}

/** Formdaki "Konu" satırı mesajın başına yazılır; ilk satırı konu olarak gösteririz. */
function subjectOf(r: AdminReservation): string {
  const first = r.message?.split("\n")[0]?.trim() ?? "";
  return first.length > 0 && first.length <= 120 ? first : "";
}

function digits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv(rows: AdminReservation[]) {
  const header = ["Tarih", "Kurum", "Yetkili", "E-posta", "Telefon", "Branş / Tür", "Kafile", "Başlangıç", "Bitiş", "Durum", "Mesaj", "Yönetici notu"];
  const lines = rows.map((r) =>
    [
      formatDateTime(r.createdAt),
      r.organizationName,
      r.contactName,
      r.email,
      r.phone,
      r.sportBranch,
      r.groupSize ?? "",
      formatDate(r.preferredStartDate),
      formatDate(r.preferredEndDate),
      STATUS_LABELS[r.status],
      r.message ?? "",
      r.adminNote ?? "",
    ]
      .map(csvCell)
      .join(";"),
  );
  // Başındaki BOM, Excel'in Türkçe karakterleri doğru açmasını sağlar.
  const blob = new Blob(["﻿" + [header.map(csvCell).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rezervasyon-talepleri-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Detail({
  r,
  note,
  onNote,
  onStatus,
  onSaveNote,
  onRemove,
}: {
  r: AdminReservation;
  note: string;
  onNote: (value: string) => void;
  onStatus: (status: ReservationStatus) => void;
  onSaveNote: () => void;
  onRemove: () => void;
}) {
  const wa = digits(r.phone);
  return (
    <div className="grid gap-space-lg border-t border-surface-container bg-surface-container-low p-space-md md:grid-cols-2">
      <div className="space-y-space-md">
        <div className="flex flex-wrap gap-space-sm">
          <a className={`${btnGhost} gap-1 normal-case`} href={`tel:${r.phone}`}>
            <span className="material-symbols-outlined text-[18px]">call</span>Ara
          </a>
          <a className={`${btnGhost} gap-1 normal-case`} href={`mailto:${r.email}?subject=${encodeURIComponent("Kamp talebiniz hakkında")}`}>
            <span className="material-symbols-outlined text-[18px]">mail</span>E-posta
          </a>
          {wa ? (
            <a className={`${btnGhost} gap-1 normal-case`} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-[18px]">chat</span>WhatsApp
            </a>
          ) : null}
        </div>
        <dl className="grid grid-cols-[7rem_1fr] gap-x-space-sm gap-y-1 text-sm">
          <dt className="font-semibold text-on-surface-variant">Yetkili</dt>
          <dd>{r.contactName}</dd>
          <dt className="font-semibold text-on-surface-variant">Telefon</dt>
          <dd>{r.phone}</dd>
          <dt className="font-semibold text-on-surface-variant">E-posta</dt>
          <dd className="break-all">{r.email}</dd>
          <dt className="font-semibold text-on-surface-variant">Tür / Branş</dt>
          <dd>{r.sportBranch}</dd>
          <dt className="font-semibold text-on-surface-variant">Kafile</dt>
          <dd>{r.groupSize ? `${r.groupSize} kişi` : "—"}</dd>
          <dt className="font-semibold text-on-surface-variant">İstenen tarih</dt>
          <dd>
            {formatDate(r.preferredStartDate)} – {formatDate(r.preferredEndDate)}
          </dd>
          <dt className="font-semibold text-on-surface-variant">Gönderildi</dt>
          <dd>{formatDateTime(r.createdAt)}</dd>
        </dl>
        <div>
          <p className="mb-1 text-sm font-semibold text-on-surface-variant">Mesaj</p>
          <p className="whitespace-pre-wrap border border-surface-container-highest bg-white p-space-sm text-sm">{r.message || "—"}</p>
        </div>
      </div>

      <div className="space-y-space-md">
        <div>
          <p className="mb-1 text-sm font-semibold text-on-surface-variant">Durum</p>
          <div className="grid grid-cols-2 gap-space-xs">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatus(s)}
                aria-pressed={r.status === s}
                title={STATUS_HINT[s]}
                className={`px-space-sm py-space-sm text-sm font-semibold transition-colors ${
                  r.status === s
                    ? "bg-[#0B132B] text-white"
                    : "border border-surface-container-highest bg-white text-on-surface hover:bg-surface-container"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-on-surface-variant">Not (yalnızca yöneticiler görür)</span>
          <textarea className={inputClass} rows={4} value={note} onChange={(e) => onNote(e.target.value)} placeholder="Örn. Cuma günü aranacak, teklif gönderildi..." />
        </label>
        <div className="flex flex-wrap gap-space-sm">
          <button type="button" className={btnPrimary} onClick={onSaveNote} disabled={note === (r.adminNote ?? "")}>
            Notu kaydet
          </button>
          <button type="button" className={btnDanger} onClick={onRemove}>
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

function TableRow({
  children,
  open,
  onToggle,
  detail,
}: {
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  detail: ReactNode;
}) {
  return (
    <>
      <tr
        className={`cursor-pointer border-t border-surface-container hover:bg-surface-container-low ${open ? "bg-surface-container-low" : ""}`}
        onClick={onToggle}
        aria-expanded={open}
      >
        {children}
      </tr>
      {open ? (
        <tr>
          <td colSpan={6} className="p-0">
            {detail}
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function ReservationsPage() {
  const [items, setItems] = useState<AdminReservation[]>([]);
  const [status, setStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [kind, setKind] = useState("ALL");
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

  const kinds = useMemo(() => [...new Set(items.map((r) => r.sportBranch))].sort((a, b) => a.localeCompare(b, "tr")), [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return items.filter(
      (r) =>
        (status === "ALL" || r.status === status) &&
        (kind === "ALL" || r.sportBranch === kind) &&
        (!q ||
          [r.organizationName, r.contactName, r.email, r.phone, r.sportBranch, r.message ?? ""]
            .join(" ")
            .toLocaleLowerCase("tr")
            .includes(q)),
    );
  }, [items, status, kind, query]);

  const count = (s: ReservationStatus) => items.filter((r) => r.status === s).length;

  async function update(id: string, changes: { status?: ReservationStatus; adminNote?: string }, done: string) {
    setError("");
    setMessage("");
    try {
      const saved = await adminFetch<AdminReservation>(`/admin/reservations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setItems((prev) => prev.map((r) => (r.id === id ? saved : r)));
      setNotes((n) => {
        const rest = { ...n };
        delete rest[id];
        return rest;
      });
      setMessage(done);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    }
  }

  async function remove(item: AdminReservation) {
    if (!window.confirm(`"${item.organizationName}" talebi kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`)) return;
    setError("");
    try {
      await adminFetch(`/admin/reservations/${item.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((r) => r.id !== item.id));
      setOpenId(null);
      setMessage("Talep silindi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi.");
    }
  }

  function toggle(r: AdminReservation) {
    setOpenId(openId === r.id ? null : r.id);
    setMessage("");
  }

  const detail = (r: AdminReservation) => (
    <Detail
      r={r}
      note={notes[r.id] ?? r.adminNote ?? ""}
      onNote={(value) => setNotes((n) => ({ ...n, [r.id]: value }))}
      onStatus={(s) => {
        if (s !== r.status) void update(r.id, { status: s }, `Durum “${STATUS_LABELS[s]}” olarak güncellendi.`);
      }}
      onSaveNote={() => void update(r.id, { adminNote: notes[r.id] ?? r.adminNote ?? "" }, "Not kaydedildi.")}
      onRemove={() => void remove(r)}
    />
  );

  return (
    <>
      <PageHeading
        title="Rezervasyon Talepleri"
        subtitle="Sitedeki formlardan gelen konaklama, ekipman, branş kampı, masa ve test talepleri."
        action={
          <button type="button" className={`${btnGhost} gap-1`} onClick={() => exportCsv(visible)} disabled={visible.length === 0}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Excel&apos;e aktar ({visible.length})
          </button>
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {message ? <Notice kind="success">{message}</Notice> : null}

      <div className="mb-space-md grid grid-cols-2 gap-space-sm md:grid-cols-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(status === s ? "ALL" : s)}
            aria-pressed={status === s}
            className={`border p-space-md text-left transition-colors ${
              status === s ? "border-[#0B132B] bg-[#0B132B] text-white" : "border-surface-container-highest bg-white hover:bg-surface-container-low"
            }`}
          >
            <span className="block text-3xl leading-none font-extrabold">{count(s)}</span>
            <span className="mt-1 block text-sm font-semibold">{STATUS_LABELS[s]}</span>
            <span className={`block text-xs ${status === s ? "text-white/70" : "text-on-surface-variant"}`}>{STATUS_HINT[s]}</span>
          </button>
        ))}
      </div>

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        <input
          className={`${inputClass} max-w-sm`}
          placeholder="Kulüp, kişi, telefon, e-posta ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={`${inputClass} max-w-[14rem]`} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Tür / branş">
          <option value="ALL">Tüm türler</option>
          {kinds.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        {status !== "ALL" || kind !== "ALL" || query ? (
          <button
            type="button"
            className="text-sm font-semibold text-primary underline"
            onClick={() => {
              setStatus("ALL");
              setKind("ALL");
              setQuery("");
            }}
          >
            Filtreleri temizle
          </button>
        ) : null}
        <span className="ml-auto text-sm text-on-surface-variant">
          {visible.length} / {items.length} talep
        </span>
      </div>

      {loading ? (
        <p className="border border-surface-container-highest bg-white p-space-lg text-center text-on-surface-variant">Yükleniyor...</p>
      ) : visible.length === 0 ? (
        <p className="border border-surface-container-highest bg-white p-space-lg text-center text-on-surface-variant">
          {items.length === 0 ? "Henüz talep gelmedi. Sitedeki formdan gelen talepler burada görünür." : "Filtreye uyan talep yok."}
        </p>
      ) : (
        <>
          {/* Masaüstü: tablo */}
          <div className="hidden border border-surface-container-highest bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="px-space-md py-space-sm">Kurum / Kulüp</th>
                  <th className="px-space-md py-space-sm">Tür / Branş</th>
                  <th className="px-space-md py-space-sm">Kafile</th>
                  <th className="px-space-md py-space-sm">İstenen tarih</th>
                  <th className="px-space-md py-space-sm">Gelişi</th>
                  <th className="px-space-md py-space-sm">Durum</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <TableRow key={r.id} open={openId === r.id} onToggle={() => toggle(r)} detail={detail(r)}>
                    <td className="px-space-md py-space-sm">
                      <span className="flex items-center gap-2 font-semibold">
                        {r.status === "PENDING" ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary-container" title="Yeni" /> : null}
                        {r.organizationName}
                      </span>
                      <span className="block text-xs text-on-surface-variant">{r.contactName}</span>
                    </td>
                    <td className="px-space-md py-space-sm">
                      {r.sportBranch}
                      {subjectOf(r) ? <span className="block max-w-[16rem] truncate text-xs text-on-surface-variant">{subjectOf(r)}</span> : null}
                    </td>
                    <td className="px-space-md py-space-sm">{r.groupSize ?? "—"}</td>
                    <td className="px-space-md py-space-sm whitespace-nowrap">
                      {r.preferredStartDate ? `${formatDate(r.preferredStartDate)} – ${formatDate(r.preferredEndDate)}` : "—"}
                    </td>
                    <td className="px-space-md py-space-sm whitespace-nowrap" title={formatDateTime(r.createdAt)}>
                      {timeAgo(r.createdAt)}
                    </td>
                    <td className="px-space-md py-space-sm">
                      <span className={`px-space-sm py-0.5 text-xs font-bold ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil: kartlar */}
          <ul className="space-y-space-sm md:hidden">
            {visible.map((r) => (
              <li key={r.id} className="border border-surface-container-highest bg-white">
                <button type="button" onClick={() => toggle(r)} className="block w-full p-space-md text-left" aria-expanded={openId === r.id}>
                  <span className="flex items-start justify-between gap-space-sm">
                    <span className="font-semibold">{r.organizationName}</span>
                    <span className={`shrink-0 px-space-sm py-0.5 text-xs font-bold ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </span>
                  <span className="mt-1 block text-sm text-on-surface-variant">
                    {r.sportBranch} · {r.groupSize ? `${r.groupSize} kişi · ` : ""}
                    {timeAgo(r.createdAt)}
                  </span>
                </button>
                {openId === r.id ? detail(r) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

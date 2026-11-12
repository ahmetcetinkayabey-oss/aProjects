"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, Notice, PageHeading, btnDanger, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { ApiError, adminFetch } from "@/lib/admin-api";

type Status =
  | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "QUOTATION_PREPARED" | "AWAITING_CUSTOMER_APPROVAL"
  | "AWAITING_ADMIN_APPROVAL" | "CONFIRMED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
  | "CANCELLATION_REQUESTED" | "CANCELLED" | "REJECTED" | "EXPIRED";

interface BookingRow {
  id: string;
  number: string;
  status: Status;
  startDate: string | null;
  endDate: string | null;
  customerName: string;
  createdAt: string;
}
interface BookingDetail extends BookingRow {
  source: string;
  paymentStatus: string;
  participantCount: number | null;
  notes: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  allocations: Array<{
    id: string;
    resourceName: string;
    quantity: number;
    status: string;
    from: string;
    to: string;
    holdExpiresAt: string | null;
  }>;
  history: Array<{ from: Status | null; to: Status; note: string; at: string }>;
}

const STATUS_LABEL: Record<Status, string> = {
  DRAFT: "Taslak",
  SUBMITTED: "Talep alındı",
  UNDER_REVIEW: "İncelemede",
  QUOTATION_PREPARED: "Teklif hazırlandı",
  AWAITING_CUSTOMER_APPROVAL: "Müşteri onayı bekleniyor",
  AWAITING_ADMIN_APPROVAL: "Yönetici onayı bekleniyor",
  CONFIRMED: "Onaylandı",
  CHECKED_IN: "Giriş yapıldı",
  IN_PROGRESS: "Devam ediyor",
  COMPLETED: "Tamamlandı",
  CANCELLATION_REQUESTED: "İptal talebi var",
  CANCELLED: "İptal edildi",
  REJECTED: "Reddedildi",
  EXPIRED: "Süresi doldu",
};

/** Backend'deki TRANSITIONS tablosunun aynısı: yalnızca izin verilen geçişler düğme olarak gösterilir (asıl denetim sunucudadır). */
const TRANSITIONS: Record<Status, Status[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["UNDER_REVIEW", "CONFIRMED", "REJECTED", "CANCELLED", "EXPIRED"],
  UNDER_REVIEW: ["QUOTATION_PREPARED", "CONFIRMED", "REJECTED", "CANCELLED", "EXPIRED"],
  QUOTATION_PREPARED: ["AWAITING_CUSTOMER_APPROVAL", "REJECTED", "CANCELLED"],
  AWAITING_CUSTOMER_APPROVAL: ["AWAITING_ADMIN_APPROVAL", "CONFIRMED", "REJECTED", "CANCELLED", "EXPIRED"],
  AWAITING_ADMIN_APPROVAL: ["CONFIRMED", "REJECTED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLATION_REQUESTED", "CANCELLED"],
  CHECKED_IN: ["IN_PROGRESS", "COMPLETED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLATION_REQUESTED: ["CANCELLED", "CONFIRMED"],
  CANCELLED: [],
  REJECTED: [],
  EXPIRED: [],
};

const ALLOCATION_LABEL: Record<string, string> = {
  HELD: "Geçici tutuluyor",
  CONFIRMED: "Kesinleşti",
  RELEASED: "Serbest bırakıldı",
};

const FILTERS: Array<{ value: "" | Status; label: string }> = [
  { value: "", label: "Tümü" },
  { value: "SUBMITTED", label: "Yeni talepler" },
  { value: "UNDER_REVIEW", label: "İncelemede" },
  { value: "CONFIRMED", label: "Onaylanan" },
  { value: "CANCELLATION_REQUESTED", label: "İptal talebi" },
  { value: "COMPLETED", label: "Tamamlanan" },
  { value: "CANCELLED", label: "İptal" },
  { value: "REJECTED", label: "Reddedilen" },
  { value: "EXPIRED", label: "Süresi dolan" },
];

const PAGE_SIZE = 20;

function badgeClass(s: Status): string {
  if (["CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED"].includes(s)) return "bg-green-100 text-green-800";
  if (["CANCELLED", "REJECTED", "EXPIRED"].includes(s)) return "bg-red-100 text-red-800";
  if (s === "CANCELLATION_REQUESTED") return "bg-orange-100 text-orange-800";
  return "bg-amber-100 text-amber-800";
}

const fmtDate = (v: string | null) => (v ? new Date(v).toLocaleDateString("tr-TR") : "—");
const fmtDateTime = (v: string | null) =>
  v ? new Date(v).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" }) : "—";

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${badgeClass(status)}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

/** Kaynak tahsisli rezervasyonlar. PostgreSQL gerektirir; geliştirme SQLite'ında uçlar kayıtlı değildir (404). */
export default function BookingRecordsPage() {
  const [rows, setRows] = useState<BookingRow[] | null>(null);
  const [filter, setFilter] = useState<"" | Status>("");
  const [page, setPage] = useState(1);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [detail, setDetail] = useState<BookingDetail | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (filter) q.set("status", filter);
    return adminFetch<BookingRow[]>(`/bookings?${q}`).then(
      (data) => {
        setRows(data);
        setUnavailable(false);
        setError(null);
      },
      (e: unknown) => {
        if (e instanceof ApiError && e.status === 404) setUnavailable(true);
        else setError(e instanceof Error ? e.message : "Yüklenemedi.");
        setRows([]);
      },
    );
  }, [filter, page]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function open(id: string) {
    setError(null);
    setNotice(null);
    setNote("");
    try {
      setDetail(await adminFetch<BookingDetail>(`/bookings/${id}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ayrıntı yüklenemedi.");
    }
  }

  async function transition(to: Status) {
    if (!detail) return;
    if ((to === "CANCELLED" || to === "REJECTED") && !window.confirm(`Bu rezervasyon “${STATUS_LABEL[to]}” olarak işaretlenecek ve tahsisleri serbest bırakılacak. Devam edilsin mi?`)) return;
    setBusy(true);
    setError(null);
    try {
      await adminFetch(`/bookings/${detail.id}/transition`, {
        method: "POST",
        body: JSON.stringify({ to, note: note.trim() || undefined }),
      });
      setNotice(`${detail.number}: durum “${STATUS_LABEL[to]}” olarak güncellendi.`);
      setNote("");
      setDetail(await adminFetch<BookingDetail>(`/bookings/${detail.id}`));
      await load();
    } catch (e) {
      // Sunucu çakışma/süre dolması gibi nedenleri anlaşılır mesajla döner (409).
      setError(e instanceof Error ? e.message : "İşlem başarısız.");
    } finally {
      setBusy(false);
    }
  }

  const actions = detail ? TRANSITIONS[detail.status] : [];

  return (
    <div>
      <PageHeading
        title="Kaynak Rezervasyonları"
        subtitle="Saha, salon ve oda tahsisli rezervasyonlar: durumlarını izleyin, onaylayın, reddedin veya iptal edin. Form üzerinden gelen basit talepler “Rezervasyon Talepleri” sayfasındadır."
      />
      {unavailable ? (
        <Notice kind="error">
          Bu özellik PostgreSQL veritabanı gerektirir; geliştirme ortamında (SQLite) kapalıdır. Yayında
          DB_MIGRATIONS_RUN=true ile migration&apos;lar çalıştırıldıktan sonra etkinleşir.
        </Notice>
      ) : null}
      {error && !detail ? <Notice kind="error">{error}</Notice> : null}
      {notice && !detail ? <Notice kind="success">{notice}</Notice> : null}

      {!unavailable ? (
        <>
          <div className="mb-space-md flex flex-wrap gap-2" role="group" aria-label="Duruma göre filtrele">
            {FILTERS.map((f) => (
              <button
                key={f.value || "all"}
                type="button"
                onClick={() => {
                  setFilter(f.value);
                  setPage(1);
                }}
                aria-pressed={filter === f.value}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f.value
                    ? "border-primary bg-primary text-white"
                    : "border-surface-container-highest bg-white text-on-surface hover:bg-surface-container"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {rows === null ? <p className="text-on-surface-variant">Yükleniyor…</p> : null}
          {rows && rows.length === 0 ? (
            <p className="border border-surface-container-high bg-white p-space-lg text-on-surface-variant">
              Bu filtreyle rezervasyon bulunamadı.
            </p>
          ) : null}

          {rows && rows.length > 0 ? (
            <div className="overflow-x-auto border border-surface-container-high bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Müşteri</th>
                    <th className="px-4 py-3">Tarih aralığı</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Oluşturma</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-surface-container-high hover:bg-surface-container-low">
                      <td className="px-4 py-3 font-bold">{r.number}</td>
                      <td className="px-4 py-3">{r.customerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {fmtDate(r.startDate)} – {fmtDate(r.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{fmtDateTime(r.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" className={btnGhost} onClick={() => void open(r.id)}>
                          Aç
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {rows && (page > 1 || rows.length === PAGE_SIZE) ? (
            <div className="mt-space-md flex items-center justify-between">
              <button type="button" className={btnGhost} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Önceki
              </button>
              <span className="text-sm text-on-surface-variant">Sayfa {page}</span>
              <button
                type="button"
                className={btnGhost}
                disabled={rows.length < PAGE_SIZE}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </button>
            </div>
          ) : null}
        </>
      ) : null}

      {detail ? (
        <Modal
          title={`Rezervasyon ${detail.number}`}
          onClose={() => {
            setDetail(null);
            setError(null);
            setNotice(null);
          }}
        >
          {error ? <Notice kind="error">{error}</Notice> : null}
          {notice ? <Notice kind="success">{notice}</Notice> : null}

          <div className="mb-space-md flex items-center gap-3">
            <StatusBadge status={detail.status} />
            <span className="text-sm text-on-surface-variant">Ödeme: {detail.paymentStatus}</span>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">Müşteri</dt>
              <dd className="font-semibold">{detail.customerName}</dd>
            </div>
            <div>
              <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">İletişim</dt>
              <dd>{[detail.customerPhone, detail.customerEmail].filter(Boolean).join(" · ") || "—"}</dd>
            </div>
            <div>
              <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tarih aralığı</dt>
              <dd>
                {fmtDate(detail.startDate)} – {fmtDate(detail.endDate)}
              </dd>
            </div>
            <div>
              <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">Kişi sayısı</dt>
              <dd>{detail.participantCount ?? "—"}</dd>
            </div>
          </dl>
          {detail.notes ? <p className="mt-3 border-l-4 border-primary-container bg-surface-container-low p-3 text-sm">{detail.notes}</p> : null}

          <h3 className="mt-space-lg mb-2 font-title-md text-lg font-bold">Tahsis edilen kaynaklar</h3>
          {detail.allocations.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Tahsis yok.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {detail.allocations.map((a) => (
                <li key={a.id} className="border border-surface-container-high p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">
                      {a.resourceName} × {a.quantity}
                    </span>
                    <span className="text-on-surface-variant">{ALLOCATION_LABEL[a.status] ?? a.status}</span>
                  </div>
                  <div className="text-on-surface-variant">
                    {fmtDateTime(a.from)} → {fmtDateTime(a.to)}
                  </div>
                  {a.status === "HELD" && a.holdExpiresAt ? (
                    <div className="mt-1 text-amber-700">Tutma süresi: {fmtDateTime(a.holdExpiresAt)} tarihinde dolar</div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-space-lg mb-2 font-title-md text-lg font-bold">Durum geçmişi</h3>
          <ol className="space-y-1 text-sm">
            {detail.history.map((h, i) => (
              <li key={i} className="text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {h.from ? `${STATUS_LABEL[h.from]} → ` : ""}
                  {STATUS_LABEL[h.to]}
                </span>{" "}
                · {fmtDateTime(h.at)}
                {h.note ? ` · ${h.note}` : ""}
              </li>
            ))}
          </ol>

          {actions.length > 0 ? (
            <div className="mt-space-lg border-t border-surface-container-high pt-space-md">
              <label className="mb-1 block text-sm font-semibold" htmlFor="booking-note">
                Not (isteğe bağlı, geçmişe yazılır)
              </label>
              <input
                id="booking-note"
                className={inputClass}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="mt-space-md flex flex-wrap gap-2">
                {actions.map((to) => {
                  const danger = to === "CANCELLED" || to === "REJECTED" || to === "EXPIRED";
                  const primary = to === "CONFIRMED";
                  return (
                    <button
                      key={to}
                      type="button"
                      disabled={busy}
                      onClick={() => void transition(to)}
                      className={primary ? btnPrimary : danger ? btnDanger : btnGhost}
                    >
                      {to === "CONFIRMED" ? "Onayla" : STATUS_LABEL[to]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-space-lg text-sm text-on-surface-variant">Bu durumdan yeni bir geçiş yapılamaz.</p>
          )}
        </Modal>
      ) : null}
    </div>
  );
}

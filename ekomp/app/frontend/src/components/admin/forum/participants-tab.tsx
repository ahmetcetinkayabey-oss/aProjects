"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Modal, Notice, btnDanger, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { adminFetch } from "@/lib/admin-api";
import { DICTIONARY } from "@/lib/dictionary";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  organization: string;
  jobTitle: string;
  category: string;
  bio?: string | null;
  interests?: string | null;
  wantsB2B: boolean;
  visibility: string;
  shareContact: boolean;
  emailVerifiedAt?: string | null;
  status: string;
  adminNote?: string | null;
  createdAt: string;
}

const STATUSES: { value: string; label: string; tone: string }[] = [
  { value: "RECEIVED", label: "Yeni başvuru", tone: "bg-amber-50 text-amber-800 border-amber-300" },
  { value: "REVIEW", label: "İnceleniyor", tone: "bg-blue-50 text-blue-800 border-blue-300" },
  { value: "APPROVED", label: "Onaylandı", tone: "bg-green-50 text-green-800 border-green-300" },
  { value: "REJECTED", label: "Reddedildi", tone: "bg-red-50 text-red-800 border-red-300" },
  { value: "CANCELLED", label: "İptal", tone: "bg-surface-container text-on-surface-variant border-surface-container-highest" },
];

const VISIBILITY: Record<string, string> = {
  PUBLIC: "Herkese açık dizin",
  PARTICIPANTS: "Yalnızca onaylı katılımcılar",
  HIDDEN: "Listelenmez",
};

const categoryLabel = (c: string) => (DICTIONARY.tr as Record<string, string>)[`cat.${c}`] ?? c;
const statusDef = (s: string) => STATUSES.find((x) => x.value === s) ?? STATUSES[0];

function csvCell(v: unknown): string {
  const text = String(v ?? "");
  // Formül enjeksiyonunu önle (Excel'de = + - @ ile başlayan hücreler formül sayılır); düz telefon numaraları hariç.
  const isPlainPhone = /^\+?\d[\d\s()-]*$/.test(text);
  const safe = /^[=+\-@\t\r]/.test(text) && !isPlainPhone ? "'" + text : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function ParticipantsTab({ onChanged }: { onChanged?: () => void }) {
  const [rows, setRows] = useState<Participant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState<Participant | null>(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(() => {
    adminFetch<Participant[]>("/admin/forum/participants")
      .then((r) => {
        setRows(r);
        setLoaded(true);
      })
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!statusFilter || r.status === statusFilter) &&
        (!q || [r.firstName, r.lastName, r.email, r.organization, r.country, r.city].join(" ").toLowerCase().includes(q)),
    );
  }, [rows, query, statusFilter]);

  function show(p: Participant) {
    setOpen(p);
    setStatus(p.status);
    setNote(p.adminNote ?? "");
    setFormError("");
  }

  async function save(extra: { verifyEmail?: boolean } = {}) {
    if (!open) return;
    setBusy(true);
    setFormError("");
    try {
      const updated = await adminFetch<Participant>(`/admin/forum/participants/${open.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminNote: note.trim() || null, ...extra }),
      });
      setOpen(updated);
      setNotice("Kaydedildi.");
      load();
      onChanged?.();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!open) return;
    if (!window.confirm(`${open.firstName} ${open.lastName} kaydı ve tüm kişisel verileri kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`)) return;
    setBusy(true);
    setFormError("");
    try {
      await adminFetch(`/admin/forum/participants/${open.id}`, { method: "DELETE" });
      setOpen(null);
      setNotice("Kayıt kalıcı olarak silindi.");
      load();
      onChanged?.();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    const head = ["Ad", "Soyad", "E-posta", "Telefon", "Ülke", "Şehir", "Kurum", "Unvan", "Kategori", "Durum", "E-posta doğrulandı", "B2B", "Başvuru tarihi"];
    const lines = filtered.map((r) =>
      [r.firstName, r.lastName, r.email, r.phone, r.country, r.city, r.organization, r.jobTitle, categoryLabel(r.category), statusDef(r.status).label, r.emailVerifiedAt ? "Evet" : "Hayır", r.wantsB2B ? "Evet" : "Hayır", new Date(r.createdAt).toLocaleDateString("tr-TR")]
        .map(csvCell)
        .join(";"),
    );
    const blob = new Blob(["﻿" + [head.map(csvCell).join(";"), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `forum-katilimcilar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const counts = (s: string) => rows.filter((r) => r.status === s).length;

  return (
    <>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {notice ? <Notice kind="success">{notice}</Notice> : null}

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        <input className={`${inputClass} max-w-xs`} placeholder="Ad, e-posta, kurum, ülke ara…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className={`${inputClass} max-w-[14rem]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Duruma göre filtrele">
          <option value="">Tüm durumlar ({rows.length})</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} ({counts(s.value)})
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-on-surface-variant">
          {filtered.length} / {rows.length} kayıt
        </span>
        <button type="button" className={btnGhost} onClick={exportCsv} disabled={filtered.length === 0}>
          Excel’e aktar ({filtered.length})
        </button>
      </div>

      <ul className="space-y-space-sm">
        {loaded && rows.length === 0 ? (
          <li className="border border-surface-container-highest bg-white p-space-md text-on-surface-variant">
            Henüz başvuru yok. Katılımcılar sitedeki “Kayıt Ol” formundan başvurur; e-postasını doğrulayan ve burada “Onaylandı” yapılan kişiler katılımcı dizininde görünür.
          </li>
        ) : null}
        {loaded && rows.length > 0 && filtered.length === 0 ? <li className="text-on-surface-variant">Aramaya uyan kayıt yok.</li> : null}
        {filtered.map((p) => {
          const st = statusDef(p.status);
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-space-md border border-surface-container-highest bg-white p-space-md">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-on-surface">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {p.organization} · {p.jobTitle} · {p.city}, {p.country}
                </p>
                <p className="mt-1 flex flex-wrap gap-1 text-xs font-semibold">
                  <span className={`border px-2 py-0.5 ${st.tone}`}>{st.label}</span>
                  <span className="border border-surface-container-highest bg-surface-container px-2 py-0.5 text-on-surface-variant">{categoryLabel(p.category)}</span>
                  {!p.emailVerifiedAt ? <span className="border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-800">E-posta doğrulanmadı</span> : null}
                  {p.wantsB2B ? <span className="border border-surface-container-highest bg-surface-container px-2 py-0.5 text-on-surface-variant">B2B ister</span> : null}
                </p>
              </div>
              <span className="text-xs text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
              <button type="button" className={btnGhost} onClick={() => show(p)}>
                İncele
              </button>
            </li>
          );
        })}
      </ul>

      {open ? (
        <Modal title={`${open.firstName} ${open.lastName}`} onClose={() => setOpen(null)}>
          <div className="space-y-space-md">
            {formError ? <Notice kind="error">{formError}</Notice> : null}
            <dl className="grid gap-x-space-lg gap-y-space-sm text-sm sm:grid-cols-2">
              {[
                ["E-posta", open.email],
                ["Telefon", open.phone],
                ["Kurum", open.organization],
                ["Unvan", open.jobTitle],
                ["Şehir / ülke", `${open.city}, ${open.country}`],
                ["Kategori", categoryLabel(open.category)],
                ["Dizin görünürlüğü", VISIBILITY[open.visibility] ?? open.visibility],
                ["İletişim paylaşımı", open.shareContact ? "Paylaşmayı kabul etti" : "Paylaşmıyor"],
                ["B2B görüşme", open.wantsB2B ? "İstiyor" : "İstemiyor"],
                ["Başvuru tarihi", new Date(open.createdAt).toLocaleString("tr-TR")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">{k}</dt>
                  <dd className="break-words text-on-surface">{v}</dd>
                </div>
              ))}
            </dl>
            {open.bio ? <p className="border-l-4 border-primary-container bg-surface-container-low p-space-sm text-sm">{open.bio}</p> : null}
            {open.interests ? <p className="text-sm text-on-surface-variant">İlgi alanları: {open.interests}</p> : null}

            <div className="flex flex-wrap items-center gap-space-sm border border-surface-container-highest p-space-sm text-sm">
              <span className={open.emailVerifiedAt ? "text-green-700" : "text-amber-800"}>
                {open.emailVerifiedAt ? `E-posta doğrulandı (${new Date(open.emailVerifiedAt).toLocaleDateString("tr-TR")})` : "E-posta henüz doğrulanmadı"}
              </span>
              {!open.emailVerifiedAt ? (
                <button type="button" className={btnGhost} disabled={busy} onClick={() => save({ verifyEmail: true })}>
                  Elle doğrulandı say
                </button>
              ) : null}
            </div>

            <Field label="Başvuru durumu" hint="“Onaylandı” yapılan kişiler katılımcı dizininde (görünürlük ayarına göre) yer alır.">
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Yönetici notu" hint="Yalnızca burada görünür; katılımcıya gösterilmez.">
              <textarea className={inputClass} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <div className="flex flex-wrap justify-end gap-space-sm">
              <button type="button" className={`${btnDanger} mr-auto`} disabled={busy} onClick={remove} title="Kişisel verilerin silinmesi talebi (KVKK) için">
                Kaydı sil (KVKK)
              </button>
              <button type="button" className={btnGhost} onClick={() => setOpen(null)}>
                Kapat
              </button>
              <button type="button" className={btnPrimary} disabled={busy || (status === open.status && note === (open.adminNote ?? ""))} onClick={() => save()}>
                {busy ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

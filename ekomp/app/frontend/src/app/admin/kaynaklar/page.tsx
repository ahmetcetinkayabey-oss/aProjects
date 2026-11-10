"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Field, Notice, PageHeading, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { ApiError, adminFetch } from "@/lib/admin-api";

interface ResourceType {
  id: string;
  code: string;
  name: string;
}
interface Resource {
  id: string;
  code: string;
  name: string;
  typeCode: string;
  capacity: number;
  quantity: number;
  exclusive: boolean;
  maintenanceStatus: "OK" | "MAINTENANCE" | "CLOSED";
  isDemo: boolean;
  active: boolean;
}
interface Availability {
  available: boolean;
  remaining: number;
  reasons: string[];
}

const MAINTENANCE_LABEL: Record<Resource["maintenanceStatus"], string> = {
  OK: "Kullanımda",
  MAINTENANCE: "Bakımda",
  CLOSED: "Kapalı",
};
const REASON_LABEL: Record<string, string> = {
  INACTIVE: "Kaynak pasif",
  MAINTENANCE: "Bakımda ya da kapalı",
  BLOCKED: "Bakım/kapatma blokajı var",
  BOOKED: "Bu aralıkta dolu",
  CAPACITY: "Kapasite dolu",
};

const emptyForm = { code: "", name: "", typeCode: "", quantity: "1", exclusive: true, isDemo: false };

/** Bu ekran PostgreSQL gerektirir (kaynak/tahsis çekirdeği). Geliştirme SQLite'ında uçlar kayıtlı değildir (404). */
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newType, setNewType] = useState({ code: "", name: "" });
  const [check, setCheck] = useState<{ id: string; from: string; to: string; result?: Availability } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      Promise.all([adminFetch<Resource[]>("/resources?all=1"), adminFetch<ResourceType[]>("/resources/types")]).then(
        ([r, t]) => {
          setResources(r);
          setTypes(t);
          setUnavailable(false);
        },
        (e: unknown) => {
          if (e instanceof ApiError && e.status === 404) setUnavailable(true);
          else setError(e instanceof Error ? e.message : "Yüklenemedi.");
          setResources([]);
        },
      ),
    [],
  );

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "İşlem başarısız.");
    } finally {
      setBusy(false);
    }
  }

  const addType = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await adminFetch("/resources/types", { method: "POST", body: JSON.stringify(newType) });
      setNewType({ code: "", name: "" });
    });
  };

  const addResource = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await adminFetch("/resources", {
        method: "POST",
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) || 1 }),
      });
      setForm(emptyForm);
    });
  };

  const patch = (id: string, body: Partial<Pick<Resource, "maintenanceStatus" | "active">>) =>
    run(() => adminFetch(`/resources/${id}`, { method: "PATCH", body: JSON.stringify(body) }));

  async function runCheck(e: FormEvent) {
    e.preventDefault();
    if (!check) return;
    setError(null);
    try {
      const q = new URLSearchParams({ from: new Date(check.from).toISOString(), to: new Date(check.to).toISOString() });
      const result = await adminFetch<Availability>(`/resources/${check.id}/availability?${q}`);
      setCheck({ ...check, result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sorgulanamadı.");
    }
  }

  return (
    <div>
      <PageHeading
        title="Kaynaklar ve Müsaitlik"
        subtitle="Saha, salon, oda ve ekipman kaynakları; bakım durumu ve belirli bir aralıkta müsaitlik sorgusu."
      />
      {unavailable ? (
        <Notice kind="error">
          Bu özellik PostgreSQL veritabanı gerektirir; geliştirme ortamında (SQLite) kapalıdır. Yayında
          DB_MIGRATIONS_RUN=true ile migration&apos;lar çalıştırıldıktan sonra etkinleşir.
        </Notice>
      ) : null}
      {error ? <Notice kind="error">{error}</Notice> : null}

      {!unavailable && resources ? (
        <>
          <section className="mb-space-lg grid gap-space-md border border-outline-variant bg-surface-container-lowest p-space-md md:grid-cols-2">
            <form onSubmit={addType} className="space-y-space-sm">
              <h2 className="font-headline-md text-lg text-on-surface">Yeni kaynak türü</h2>
              <Field label="Kod" hint="Örn. SAHA, ODA, EKIPMAN">
                <input className={inputClass} required value={newType.code} onChange={(e) => setNewType({ ...newType, code: e.target.value })} />
              </Field>
              <Field label="Ad">
                <input className={inputClass} required value={newType.name} onChange={(e) => setNewType({ ...newType, name: e.target.value })} />
              </Field>
              <button className={btnGhost} disabled={busy}>Tür ekle</button>
            </form>

            <form onSubmit={addResource} className="space-y-space-sm">
              <h2 className="font-headline-md text-lg text-on-surface">Yeni kaynak</h2>
              <Field label="Kod">
                <input className={inputClass} required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Ad">
                <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Tür">
                <select className={inputClass} required value={form.typeCode} onChange={(e) => setForm({ ...form, typeCode: e.target.value })}>
                  <option value="">Seçin</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.code}>{t.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Adet" hint="Tek kullanımlı kaynakta 1">
                <input className={inputClass} type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.exclusive} onChange={(e) => setForm({ ...form, exclusive: e.target.checked })} />
                Aynı anda tek rezervasyon (saha, oda); kapalıysa toplam adet aşılamaz
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isDemo} onChange={(e) => setForm({ ...form, isDemo: e.target.checked })} />
                Demo kayıt (gerçek envanter değil)
              </label>
              <button className={btnPrimary} disabled={busy}>Kaynak ekle</button>
            </form>
          </section>

          <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="p-space-sm">Kaynak</th>
                  <th className="p-space-sm">Tür</th>
                  <th className="p-space-sm">Adet</th>
                  <th className="p-space-sm">Durum</th>
                  <th className="p-space-sm">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr><td colSpan={5} className="p-space-md text-on-surface-variant">Henüz kaynak yok.</td></tr>
                ) : null}
                {resources.map((r) => (
                  <tr key={r.id} className={`border-t border-outline-variant ${r.active ? "" : "opacity-60"}`}>
                    <td className="p-space-sm">
                      <div className="font-semibold">{r.name} {r.isDemo ? <span className="text-xs text-on-surface-variant">(demo)</span> : null}</div>
                      <div className="text-xs text-on-surface-variant">{r.code}</div>
                    </td>
                    <td className="p-space-sm">{r.typeCode}</td>
                    <td className="p-space-sm">{r.exclusive ? "Tek" : r.quantity}</td>
                    <td className="p-space-sm">
                      <select
                        aria-label={`${r.name} durumu`}
                        className={inputClass}
                        value={r.maintenanceStatus}
                        disabled={busy}
                        onChange={(e) => void patch(r.id, { maintenanceStatus: e.target.value as Resource["maintenanceStatus"] })}
                      >
                        {Object.entries(MAINTENANCE_LABEL).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </td>
                    <td className="space-x-2 p-space-sm whitespace-nowrap">
                      <button className={btnGhost} onClick={() => setCheck({ id: r.id, from: "", to: "" })}>Müsaitlik</button>
                      <button className={btnGhost} disabled={busy} onClick={() => void patch(r.id, { active: !r.active })}>
                        {r.active ? "Pasifleştir" : "Etkinleştir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {check ? (
            <form onSubmit={runCheck} className="mt-space-lg grid gap-space-sm border border-outline-variant bg-surface-container-lowest p-space-md md:grid-cols-3">
              <h2 className="font-headline-md text-lg text-on-surface md:col-span-3">
                Müsaitlik: {resources.find((x) => x.id === check.id)?.name}
              </h2>
              <Field label="Başlangıç">
                <input className={inputClass} type="datetime-local" required value={check.from} onChange={(e) => setCheck({ ...check, from: e.target.value, result: undefined })} />
              </Field>
              <Field label="Bitiş">
                <input className={inputClass} type="datetime-local" required value={check.to} onChange={(e) => setCheck({ ...check, to: e.target.value, result: undefined })} />
              </Field>
              <div className="flex items-end gap-2">
                <button className={btnPrimary}>Sorgula</button>
                <button type="button" className={btnGhost} onClick={() => setCheck(null)}>Kapat</button>
              </div>
              {check.result ? (
                <div className="md:col-span-3">
                  <Notice kind={check.result.available ? "success" : "error"}>
                    {check.result.available
                      ? `Müsait (kalan: ${check.result.remaining}).`
                      : `Müsait değil: ${check.result.reasons.map((x) => REASON_LABEL[x] ?? x).join(", ")}.`}
                  </Notice>
                </div>
              ) : null}
            </form>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

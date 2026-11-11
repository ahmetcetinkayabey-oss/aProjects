"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Field,
  ImageField,
  Modal,
  Notice,
  PageHeading,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputClass,
} from "@/components/admin/admin-ui";
import { assetUrl } from "@/lib/api";
import { SUPPORTED_ICONS } from "@/lib/icons";
import { adminFetch, slugify, type AdminFacility } from "@/lib/admin-api";

interface FormState {
  slug: string;
  title: string;
  category: string;
  icon: string;
  badge: string;
  description: string;
  details: string;
  footerLeft: string;
  footerRight: string;
  imageUrl: string;
  sortOrder: string;
  stats: { label: string; value: string }[];
  categoryEn: string;
  titleEn: string;
  descriptionEn: string;
  detailsEn: string;
  badgeEn: string;
  footerLeftEn: string;
  footerRightEn: string;
  statsEn: { label: string; value: string }[];
}

const EMPTY: FormState = {
  slug: "",
  title: "",
  category: "",
  icon: "sports",
  badge: "",
  description: "",
  details: "",
  footerLeft: "",
  footerRight: "",
  imageUrl: "",
  sortOrder: "0",
  stats: [],
  categoryEn: "",
  titleEn: "",
  descriptionEn: "",
  detailsEn: "",
  badgeEn: "",
  footerLeftEn: "",
  footerRightEn: "",
  statsEn: [],
};

function toForm(f: AdminFacility): FormState {
  return {
    slug: f.slug,
    title: f.title,
    category: f.category,
    icon: f.icon,
    badge: f.badge,
    description: f.description,
    details: f.details ?? "",
    footerLeft: f.footerLeft,
    footerRight: f.footerRight,
    imageUrl: f.imageUrl ?? "",
    sortOrder: String(f.sortOrder),
    stats: f.stats ?? [],
    categoryEn: f.categoryEn ?? "",
    titleEn: f.titleEn ?? "",
    descriptionEn: f.descriptionEn ?? "",
    detailsEn: f.detailsEn ?? "",
    badgeEn: f.badgeEn ?? "",
    footerLeftEn: f.footerLeftEn ?? "",
    footerRightEn: f.footerRightEn ?? "",
    statsEn: f.statsEn ?? [],
  };
}

/** Sabit ölçülü küçük görsel; görsel yoksa ya da yüklenemezse simge gösterilir. */
function FacilityThumb({ imageUrl, icon }: { imageUrl?: string | null; icon: string }) {
  const [failed, setFailed] = useState(false);
  const src = assetUrl(imageUrl);
  return (
    <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden bg-surface-container text-on-surface-variant">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="material-symbols-outlined">{icon}</span>
      )}
    </div>
  );
}

export default function FacilitiesAdminPage() {
  const [items, setItems] = useState<AdminFacility[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; form: FormState } | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<AdminFacility | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    adminFetch<AdminFacility[]>("/admin/facilities")
      .then((list) => {
        setItems(list);
        setError("");
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(load, [load]);

  function openNew() {
    setSlugTouched(false);
    setFormError("");
    setEditing({ id: null, form: { ...EMPTY, sortOrder: String(items.length + 1) } });
  }

  function openEdit(f: AdminFacility) {
    setSlugTouched(true);
    setFormError("");
    setEditing({ id: f.id, form: toForm(f) });
  }

  function patch(changes: Partial<FormState>) {
    setEditing((cur) => (cur ? { ...cur, form: { ...cur.form, ...changes } } : cur));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { form } = editing;
    setBusy(true);
    setFormError("");
    const body = {
      slug: form.slug,
      title: form.title,
      category: form.category,
      icon: form.icon,
      badge: form.badge,
      description: form.description,
      footerLeft: form.footerLeft,
      footerRight: form.footerRight,
      imageUrl: form.imageUrl.trim() || null,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      stats: form.stats.filter((s) => s.label.trim() && s.value.trim()),
      categoryEn: form.categoryEn.trim() || null,
      titleEn: form.titleEn.trim() || null,
      descriptionEn: form.descriptionEn.trim() || null,
      details: form.details.trim() || null,
      detailsEn: form.detailsEn.trim() || null,
      badgeEn: form.badgeEn.trim() || null,
      footerLeftEn: form.footerLeftEn.trim() || null,
      footerRightEn: form.footerRightEn.trim() || null,
      statsEn: form.statsEn.filter((s) => s.label.trim() && s.value.trim()),
    };
    try {
      await adminFetch(editing.id ? `/admin/facilities/${editing.id}` : "/admin/facilities", {
        method: editing.id ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmRemove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/facilities/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      load();
    } catch (e) {
      setDeleting(null);
      setError(e instanceof Error ? e.message : "Silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Tesisler"
        subtitle="Sitedeki “Tesisler” bölümünde görünen kartlar. Sıra numarası küçük olan önce çıkar."
        action={
          <button type="button" className={btnPrimary} onClick={openNew}>
            + Yeni tesis
          </button>
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}

      {loaded && items.length === 0 && !error ? (
        <p className="border border-dashed border-surface-container-highest bg-white p-space-xl text-center text-on-surface-variant">
          Henüz tesis yok. “+ Yeni tesis” ile ilk kartı ekleyin.
        </p>
      ) : null}

      <ul className="space-y-space-sm">
        {items.map((f) => {
          return (
            <li
              key={f.id}
              className="grid grid-cols-[2rem_5rem_minmax(0,1fr)] items-center gap-x-space-md gap-y-space-sm border border-surface-container-highest bg-white p-space-md sm:grid-cols-[2rem_5rem_minmax(0,1fr)_auto]"
            >
              <span className="text-center text-sm font-semibold text-on-surface-variant">{f.sortOrder}</span>
              <FacilityThumb imageUrl={f.imageUrl} icon={f.icon} />
              <div className="min-w-0">
                <p className="line-clamp-1 font-semibold text-on-surface">{f.title}</p>
                <p className="mt-0.5 truncate text-xs font-semibold tracking-wide text-primary uppercase">
                  {f.category}
                  {f.badge ? ` • ${f.badge}` : ""}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{f.description}</p>
              </div>
              <div className="col-span-3 flex gap-space-sm sm:col-span-1 sm:col-start-4">
                <button type="button" className={`${btnGhost} flex-1 sm:flex-none`} onClick={() => openEdit(f)}>
                  Düzenle
                </button>
                <button type="button" className={`${btnDanger} flex-1 sm:flex-none`} onClick={() => setDeleting(f)}>
                  Sil
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editing ? (
        <Modal title={editing.id ? "Tesisi düzenle" : "Yeni tesis"} onClose={() => setEditing(null)}>
          <form onSubmit={onSubmit} className="space-y-space-md">
            {formError ? <Notice kind="error">{formError}</Notice> : null}
            <Field label="Tesis adı">
              <input
                className={inputClass}
                value={editing.form.title}
                required
                onChange={(e) =>
                  patch({
                    title: e.target.value,
                    ...(slugTouched ? {} : { slug: slugify(e.target.value) }),
                  })
                }
              />
            </Field>
            <div className="grid gap-space-md sm:grid-cols-2">
              <Field label="Kategori" hint="Örn: JUDO, KAYAK & SNOWBOARD">
                <input className={inputClass} value={editing.form.category} required onChange={(e) => patch({ category: e.target.value })} />
              </Field>
              <Field label="Rozet" hint="Görselin köşesindeki etiket">
                <input className={inputClass} value={editing.form.badge} onChange={(e) => patch({ badge: e.target.value })} />
              </Field>
            </div>
            <Field label="Açıklama">
              <textarea className={inputClass} rows={4} value={editing.form.description} required onChange={(e) => patch({ description: e.target.value })} />
            </Field>
            <Field label="Ayrıntılı açıklama" hint="Tesis sayfasında kartın altında görünür. Her satır bir paragraf; ara başlık için satırı ‘## ’ ile başlatın.">
              <textarea className={inputClass} rows={10} maxLength={12000} value={editing.form.details} onChange={(e) => patch({ details: e.target.value })} />
            </Field>
            <div className="grid gap-space-md sm:grid-cols-2">
              <Field label="Alt bilgi (sol)">
                <input className={inputClass} value={editing.form.footerLeft} onChange={(e) => patch({ footerLeft: e.target.value })} />
              </Field>
              <Field label="Alt bilgi (sağ)">
                <input className={inputClass} value={editing.form.footerRight} onChange={(e) => patch({ footerRight: e.target.value })} />
              </Field>
            </div>
            <ImageField value={editing.form.imageUrl} onChange={(url) => patch({ imageUrl: url })} />

            <fieldset className="space-y-space-xs">
              <legend className="mb-1 font-label-caps text-label-caps text-on-surface-variant uppercase">
                Öne çıkan rakamlar (isteğe bağlı)
              </legend>
              {editing.form.stats.map((s, i) => (
                <div key={i} className="flex gap-space-xs">
                  <input
                    className={inputClass}
                    placeholder="Başlık (örn: Kapasite)"
                    value={s.label}
                    onChange={(e) => patch({ stats: editing.form.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Değer (örn: 3.000 koltuk)"
                    value={s.value}
                    onChange={(e) => patch({ stats: editing.form.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
                  />
                  <button type="button" className={btnDanger} onClick={() => patch({ stats: editing.form.stats.filter((_, j) => j !== i) })} aria-label="Satırı sil">
                    ✕
                  </button>
                </div>
              ))}
              {editing.form.stats.length < 4 ? (
                <button type="button" className={btnGhost} onClick={() => patch({ stats: [...editing.form.stats, { label: "", value: "" }] })}>
                  + Rakam ekle
                </button>
              ) : null}
            </fieldset>

            <fieldset className="space-y-space-md border border-surface-container-highest p-space-md">
              <legend className="px-2 text-sm font-semibold text-on-surface-variant">English (optional)</legend>
              <p className="text-sm text-on-surface-variant">Boş bırakılırsa İngilizce sayfada Türkçe metin gösterilir.</p>
              <Field label="Facility name">
                <input className={inputClass} value={editing.form.titleEn} onChange={(e) => patch({ titleEn: e.target.value })} />
              </Field>
              <div className="grid gap-space-md sm:grid-cols-2">
                <Field label="Category">
                  <input className={inputClass} value={editing.form.categoryEn} onChange={(e) => patch({ categoryEn: e.target.value })} />
                </Field>
                <Field label="Badge">
                  <input className={inputClass} value={editing.form.badgeEn} onChange={(e) => patch({ badgeEn: e.target.value })} />
                </Field>
              </div>
              <Field label="Description">
                <textarea className={inputClass} rows={4} value={editing.form.descriptionEn} onChange={(e) => patch({ descriptionEn: e.target.value })} />
              </Field>
              <Field label="Detailed description" hint="One paragraph per line; start a line with ‘## ’ for a subheading.">
                <textarea className={inputClass} rows={10} maxLength={12000} value={editing.form.detailsEn} onChange={(e) => patch({ detailsEn: e.target.value })} />
              </Field>
              <div className="grid gap-space-md sm:grid-cols-2">
                <Field label="Footer (left)">
                  <input className={inputClass} value={editing.form.footerLeftEn} onChange={(e) => patch({ footerLeftEn: e.target.value })} />
                </Field>
                <Field label="Footer (right)">
                  <input className={inputClass} value={editing.form.footerRightEn} onChange={(e) => patch({ footerRightEn: e.target.value })} />
                </Field>
              </div>
              <div className="space-y-space-xs">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Key figures (same order as the Turkish rows)</p>
                {editing.form.statsEn.map((s, i) => (
                  <div key={i} className="flex gap-space-xs">
                    <input
                      className={inputClass}
                      placeholder="Label (e.g. Capacity)"
                      value={s.label}
                      onChange={(e) => patch({ statsEn: editing.form.statsEn.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Value (e.g. 3,000 seats)"
                      value={s.value}
                      onChange={(e) => patch({ statsEn: editing.form.statsEn.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
                    />
                    <button type="button" className={btnDanger} onClick={() => patch({ statsEn: editing.form.statsEn.filter((_, j) => j !== i) })} aria-label="Satırı sil">
                      ✕
                    </button>
                  </div>
                ))}
                {editing.form.statsEn.length < 4 ? (
                  <button type="button" className={btnGhost} onClick={() => patch({ statsEn: [...editing.form.statsEn, { label: "", value: "" }] })}>
                    + Add figure
                  </button>
                ) : null}
              </div>
            </fieldset>

            <div className="grid gap-space-md sm:grid-cols-3">
              <Field label="Sıra no">
                <input className={inputClass} type="number" value={editing.form.sortOrder} onChange={(e) => patch({ sortOrder: e.target.value })} />
              </Field>
              <Field label="Simge" hint="Listeden seçin (örn: pool, sports_mma). Listede olmayan bir ad sitede görünmez.">
                <input
                  className={inputClass}
                  list="site-icon-names"
                  value={editing.form.icon}
                  required
                  onChange={(e) => patch({ icon: e.target.value })}
                />
                <datalist id="site-icon-names">
                  {SUPPORTED_ICONS.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </Field>
              <Field label="Adres (slug)" hint="Otomatik oluşur">
                <input
                  className={inputClass}
                  value={editing.form.slug}
                  required
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch({ slug: e.target.value });
                  }}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-space-sm">
              <button type="button" className={btnGhost} onClick={() => setEditing(null)}>Vazgeç</button>
              <button type="submit" className={btnPrimary} disabled={busy}>{busy ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal title="Tesisi sil" onClose={() => setDeleting(null)}>
          <p className="text-on-surface">
            <strong>“{deleting.title}”</strong> tesisi sitedeki listeden kalıcı olarak silinsin mi? Bu işlem geri alınamaz.
          </p>
          <div className="mt-space-lg flex justify-end gap-space-sm">
            <button type="button" className={btnGhost} onClick={() => setDeleting(null)}>Vazgeç</button>
            <button type="button" className={btnDanger} onClick={confirmRemove} disabled={busy}>
              {busy ? "Siliniyor..." : "Evet, sil"}
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

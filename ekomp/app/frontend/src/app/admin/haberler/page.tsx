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
import { adminFetch, slugify, type AdminNews } from "@/lib/admin-api";

interface FormState {
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  dateLabel: string;
  titleEn: string;
  summaryEn: string;
  contentEn: string;
  categoryEn: string;
  sourceNameEn: string;
  dateLabelEn: string;
  publishedAt: string;
  published: boolean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): FormState {
  return { slug: "", title: "", summary: "", content: "", imageUrl: "", category: "", sourceName: "", sourceUrl: "", dateLabel: "", titleEn: "", summaryEn: "", contentEn: "", categoryEn: "", sourceNameEn: "", dateLabelEn: "", publishedAt: today(), published: true };
}

export default function NewsAdminPage() {
  const [items, setItems] = useState<AdminNews[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; form: FormState } | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminFetch<AdminNews[]>("/admin/news")
      .then(setItems)
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  function openNew() {
    setSlugTouched(false);
    setFormError("");
    setEditing({ id: null, form: emptyForm() });
  }

  function openEdit(n: AdminNews) {
    setSlugTouched(true);
    setFormError("");
    setEditing({
      id: n.id,
      form: {
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        content: n.content ?? "",
        imageUrl: n.imageUrl ?? "",
        category: n.category ?? "",
        sourceName: n.sourceName ?? "",
        sourceUrl: n.sourceUrl ?? "",
        dateLabel: n.dateLabel ?? "",
        titleEn: n.titleEn ?? "",
        summaryEn: n.summaryEn ?? "",
        contentEn: n.contentEn ?? "",
        categoryEn: n.categoryEn ?? "",
        sourceNameEn: n.sourceNameEn ?? "",
        dateLabelEn: n.dateLabelEn ?? "",
        publishedAt: n.publishedAt.slice(0, 10),
        published: n.published,
      },
    });
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
    try {
      await adminFetch(editing.id ? `/admin/news/${editing.id}` : "/admin/news", {
        method: editing.id ? "PATCH" : "POST",
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          summary: form.summary,
          content: form.content.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          category: form.category.trim() || null,
          sourceName: form.sourceName.trim() || null,
          sourceUrl: form.sourceUrl.trim() || null,
          dateLabel: form.dateLabel.trim() || null,
          titleEn: form.titleEn.trim() || null,
          summaryEn: form.summaryEn.trim() || null,
          contentEn: form.contentEn.trim() || null,
          categoryEn: form.categoryEn.trim() || null,
          sourceNameEn: form.sourceNameEn.trim() || null,
          dateLabelEn: form.dateLabelEn.trim() || null,
          publishedAt: form.publishedAt,
          published: form.published,
        }),
      });
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(n: AdminNews) {
    try {
      await adminFetch(`/admin/news/${n.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !n.published }),
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Güncellenemedi.");
    }
  }

  async function remove(n: AdminNews) {
    if (!window.confirm(`"${n.title}" haberi kalıcı olarak silinsin mi?`)) return;
    try {
      await adminFetch(`/admin/news/${n.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi.");
    }
  }

  return (
    <>
      <PageHeading
        title="Haberler"
        subtitle="Sitedeki haberler bölümü. Yayından kaldırdığınız haberler sitede görünmez."
        action={
          <button type="button" className={btnPrimary} onClick={openNew}>
            + Yeni haber
          </button>
        }
      />
      {error ? <Notice kind="error">{error}</Notice> : null}

      <ul className="space-y-space-sm">
        {items.length === 0 ? <li className="text-on-surface-variant">Henüz haber yok.</li> : null}
        {items.map((n) => (
          <li key={n.id} className="flex flex-wrap items-center gap-space-md border border-surface-container-highest bg-white p-space-md">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-on-surface">{n.title}</p>
              <p className="text-sm text-on-surface-variant">
                {n.dateLabel ?? new Date(n.publishedAt).toLocaleDateString("tr-TR")}
                {n.sourceName ? ` · ${n.sourceName}` : ""} •{" "}
                <span className={n.published ? "text-green-700" : "text-on-surface-variant"}>
                  {n.published ? "Yayında" : "Taslak"}
                </span>
              </p>
            </div>
            <button type="button" className={btnGhost} onClick={() => togglePublished(n)}>
              {n.published ? "Yayından kaldır" : "Yayınla"}
            </button>
            <button type="button" className={btnGhost} onClick={() => openEdit(n)}>Düzenle</button>
            <button type="button" className={btnDanger} onClick={() => remove(n)}>Sil</button>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal title={editing.id ? "Haberi düzenle" : "Yeni haber"} onClose={() => setEditing(null)}>
          <form onSubmit={onSubmit} className="space-y-space-md">
            {formError ? <Notice kind="error">{formError}</Notice> : null}
            <Field label="Başlık">
              <input
                className={inputClass}
                value={editing.form.title}
                required
                onChange={(e) =>
                  patch({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })
                }
              />
            </Field>
            <Field label="Kısa özet" hint="Liste kartında görünür.">
              <textarea className={inputClass} rows={2} value={editing.form.summary} required onChange={(e) => patch({ summary: e.target.value })} />
            </Field>
            <Field label="Haber metni (isteğe bağlı)">
              <textarea className={inputClass} rows={6} value={editing.form.content} onChange={(e) => patch({ content: e.target.value })} />
            </Field>
            <ImageField value={editing.form.imageUrl} onChange={(url) => patch({ imageUrl: url })} />
            <fieldset className="space-y-space-md border border-surface-container-highest p-space-md">
              <legend className="px-2 text-sm font-semibold text-on-surface-variant">
                Basın haberi bilgileri (isteğe bağlı)
              </legend>
              <p className="text-sm text-on-surface-variant">
                Başka bir sitedeki haberi eklemek için kaynak bağlantısını girin; karta tıklayınca o sayfa yeni sekmede açılır.
              </p>
              <Field label="Kaynak bağlantısı" hint="https:// ile başlamalı">
                <input
                  className={inputClass}
                  type="url"
                  placeholder="https://..."
                  value={editing.form.sourceUrl}
                  onChange={(e) => patch({ sourceUrl: e.target.value })}
                />
              </Field>
              <div className="grid gap-space-md sm:grid-cols-2">
                <Field label="Kaynak adı" hint="Örn. Anadolu Ajansı">
                  <input className={inputClass} value={editing.form.sourceName} onChange={(e) => patch({ sourceName: e.target.value })} />
                </Field>
                <Field label="Kategori rozeti" hint="Örn. KAMP SEZONU">
                  <input className={inputClass} value={editing.form.category} onChange={(e) => patch({ category: e.target.value })} />
                </Field>
              </div>
              <Field label="Tarih yerine gösterilecek metin" hint="Örn. Arşiv haberi. Boşsa tarih gösterilir.">
                <input className={inputClass} value={editing.form.dateLabel} onChange={(e) => patch({ dateLabel: e.target.value })} />
              </Field>
            </fieldset>
            <fieldset className="space-y-space-md border border-surface-container-highest p-space-md">
              <legend className="px-2 text-sm font-semibold text-on-surface-variant">English (optional)</legend>
              <p className="text-sm text-on-surface-variant">Boş bırakılırsa İngilizce sayfada Türkçe metin gösterilir.</p>
              <Field label="Title">
                <input className={inputClass} value={editing.form.titleEn} onChange={(e) => patch({ titleEn: e.target.value })} />
              </Field>
              <Field label="Short summary">
                <textarea className={inputClass} rows={2} value={editing.form.summaryEn} onChange={(e) => patch({ summaryEn: e.target.value })} />
              </Field>
              <Field label="Article text">
                <textarea className={inputClass} rows={6} value={editing.form.contentEn} onChange={(e) => patch({ contentEn: e.target.value })} />
              </Field>
              <div className="grid gap-space-md sm:grid-cols-2">
                <Field label="Source name">
                  <input className={inputClass} value={editing.form.sourceNameEn} onChange={(e) => patch({ sourceNameEn: e.target.value })} />
                </Field>
                <Field label="Category badge">
                  <input className={inputClass} value={editing.form.categoryEn} onChange={(e) => patch({ categoryEn: e.target.value })} />
                </Field>
              </div>
              <Field label="Text shown instead of the date">
                <input className={inputClass} value={editing.form.dateLabelEn} onChange={(e) => patch({ dateLabelEn: e.target.value })} />
              </Field>
            </fieldset>
            <div className="grid gap-space-md sm:grid-cols-2">
              <Field label="Tarih">
                <input className={inputClass} type="date" value={editing.form.publishedAt} required onChange={(e) => patch({ publishedAt: e.target.value })} />
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
            <label className="flex items-center gap-space-sm">
              <input type="checkbox" checked={editing.form.published} onChange={(e) => patch({ published: e.target.checked })} />
              <span>Sitede yayınlansın</span>
            </label>
            <div className="flex justify-end gap-space-sm">
              <button type="button" className={btnGhost} onClick={() => setEditing(null)}>Vazgeç</button>
              <button type="submit" className={btnPrimary} disabled={busy}>{busy ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

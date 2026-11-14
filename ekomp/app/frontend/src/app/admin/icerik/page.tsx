"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice, PageHeading, btnGhost, btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { AiAssist } from "@/components/admin/ai-assist";
import { adminFetch, getToken } from "@/lib/admin-api";
import { HOTEL_CONTENT_GROUPS } from "@/lib/content-hotels";
import { CONTENT_GROUPS as SITE_GROUPS, type ContentField } from "@/lib/content-registry";
import { DICTIONARY } from "@/lib/dictionary";

const CONTENT_GROUPS = [...SITE_GROUPS, ...HOTEL_CONTENT_GROUPS];

type Pair = { tr: string; en: string };
type Overrides = Record<string, { tr: string; en: string | null }>;

function defaultsOf(field: ContentField): Pair {
  if (field.dict) return { tr: DICTIONARY.tr[field.dict], en: DICTIONARY.en[field.dict] };
  return { tr: field.tr ?? "", en: field.en ?? "" };
}

const same = (a: Pair, b: Pair) => a.tr === b.tr && a.en === b.en;

export default function ContentPage() {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [drafts, setDrafts] = useState<Record<string, Pair>>({});
  const [groupId, setGroupId] = useState(CONTENT_GROUPS[0].id);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    adminFetch<Overrides>("/admin/content")
      .then(setOverrides)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  /** Kayıtlı (panelde değiştirilmiş) değer varsa o, yoksa varsayılan. */
  const savedOf = useCallback(
    (field: ContentField): Pair => {
      const o = overrides[field.key];
      return o ? { tr: o.tr, en: o.en ?? "" } : defaultsOf(field);
    },
    [overrides],
  );
  const valueOf = (field: ContentField): Pair => drafts[field.key] ?? savedOf(field);

  const allFields = useMemo(() => CONTENT_GROUPS.flatMap((g) => g.fields), []);
  const dirtyKeys = useMemo(
    () => allFields.filter((f) => drafts[f.key] && !same(drafts[f.key], savedOf(f))).map((f) => f.key),
    [allFields, drafts, savedOf],
  );

  const q = query.trim().toLocaleLowerCase("tr");
  const visibleGroups = q
    ? CONTENT_GROUPS.map((g) => ({
        ...g,
        fields: g.fields.filter((f) => {
          const v = valueOf(f);
          return [f.label, v.tr, v.en, g.title].join(" ").toLocaleLowerCase("tr").includes(q);
        }),
      })).filter((g) => g.fields.length > 0)
    : CONTENT_GROUPS.filter((g) => g.id === groupId);

  function edit(field: ContentField, part: keyof Pair, value: string) {
    setMessage("");
    setDrafts((d) => ({ ...d, [field.key]: { ...valueOf(field), [part]: value } }));
  }

  function resetToDefault(field: ContentField) {
    setMessage("");
    setDrafts((d) => ({ ...d, [field.key]: defaultsOf(field) }));
  }

  function discard() {
    setDrafts({});
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      let changed = 0;
      for (const field of allFields) {
        const draft = drafts[field.key];
        if (!draft || same(draft, savedOf(field))) continue;
        if (same(draft, defaultsOf(field))) {
          if (overrides[field.key]) await adminFetch(`/admin/content/${field.key}`, { method: "DELETE" });
        } else {
          await adminFetch(`/admin/content/${field.key}`, {
            method: "PUT",
            body: JSON.stringify({ tr: draft.tr, en: draft.en }),
          });
        }
        changed += 1;
      }
      await fetch("/api/revalidate-content", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      }).catch(() => undefined);
      setDrafts({});
      load();
      setMessage(`${changed} metin kaydedildi. Değişiklik sitede birkaç saniye içinde görünür.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  const changedCount = (g: (typeof CONTENT_GROUPS)[number]) =>
    g.fields.filter((f) => overrides[f.key] || (drafts[f.key] && !same(drafts[f.key], savedOf(f)))).length;

  return (
    <>
      <PageHeading
        title="Sayfa İçerikleri"
        subtitle="Sitedeki başlıkları ve yazıları buradan değiştirin. Kaydettiğiniz metin sitede hemen yayına girer."
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {message ? <Notice kind="success">{message}</Notice> : null}

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        <input
          className={`${inputClass} max-w-sm`}
          placeholder="Metin ara (ör. kamp, başlık, Forum)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button type="button" className={btnGhost} onClick={() => setQuery("")}>
            Aramayı temizle
          </button>
        ) : null}
        <Link href="/" target="_blank" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary underline">
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          Siteyi aç
        </Link>
      </div>

      <div className="grid gap-space-lg lg:grid-cols-[17rem_1fr] lg:items-start">
        {q ? null : (
          <nav aria-label="Bölümler" className="flex flex-wrap gap-space-xs lg:sticky lg:top-space-md lg:flex-col lg:gap-0 lg:border lg:border-surface-container-highest lg:bg-white">
            {CONTENT_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupId(g.id)}
                aria-current={g.id === groupId ? "true" : undefined}
                className={`flex items-center justify-between gap-space-sm px-space-md py-space-sm text-left text-sm font-semibold transition-colors lg:border-b lg:border-surface-container ${
                  g.id === groupId
                    ? "bg-[#0B132B] text-white"
                    : "border border-surface-container-highest bg-white text-on-surface hover:bg-surface-container lg:border-0"
                }`}
              >
                <span>{g.title}</span>
                {changedCount(g) ? (
                  <span className="shrink-0 bg-primary-container px-1.5 text-xs font-bold text-on-primary-container" title="Değiştirilmiş metin sayısı">
                    {changedCount(g)}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        )}

        <div className="min-w-0 space-y-space-lg pb-24">
          {loading ? <p className="text-on-surface-variant">Yükleniyor...</p> : null}
          {!loading && visibleGroups.length === 0 ? <p className="text-on-surface-variant">Aramayla eşleşen metin yok.</p> : null}
          {visibleGroups.map((g) => (
            <section key={g.id} className="border border-surface-container-highest bg-white">
              <header className="flex flex-wrap items-start justify-between gap-space-sm border-b border-surface-container bg-surface-container-low px-space-md py-space-md">
                <div>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">{g.title}</h2>
                  <p className="mt-0.5 text-sm text-on-surface-variant">{g.description}</p>
                </div>
                <Link href={g.path} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Sayfada gör
                </Link>
              </header>
              <div className="divide-y divide-surface-container">
                {g.fields.map((f) => {
                  const v = valueOf(f);
                  const isDirty = dirtyKeys.includes(f.key);
                  const isCustom = isDirty ? !same(v, defaultsOf(f)) : Boolean(overrides[f.key]);
                  return (
                    <div key={f.key} className="px-space-md py-space-md">
                      <div className="mb-space-xs flex flex-wrap items-center gap-space-sm">
                        <span className="font-semibold text-on-surface">{f.label}</span>
                        {isDirty ? (
                          <span className="bg-amber-100 px-1.5 text-xs font-bold text-amber-900">Kaydedilmedi</span>
                        ) : isCustom ? (
                          <span className="bg-green-100 px-1.5 text-xs font-bold text-green-900">Değiştirildi</span>
                        ) : null}
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={() => resetToDefault(f)}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant underline"
                          >
                            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                            Varsayılana dön
                          </button>
                        ) : null}
                      </div>
                      {f.hint ? <p className="mb-space-xs text-xs text-on-surface-variant">{f.hint}</p> : null}
                      <div className="grid gap-space-sm md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold text-on-surface-variant">TÜRKÇE</span>
                          {f.multiline ? (
                            <textarea className={inputClass} rows={3} value={v.tr} onChange={(e) => edit(f, "tr", e.target.value)} />
                          ) : (
                            <input className={inputClass} value={v.tr} onChange={(e) => edit(f, "tr", e.target.value)} />
                          )}
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs font-bold text-on-surface-variant">İNGİLİZCE</span>
                          {f.multiline ? (
                            <textarea className={inputClass} rows={3} value={v.en} onChange={(e) => edit(f, "en", e.target.value)} />
                          ) : (
                            <input className={inputClass} value={v.en} onChange={(e) => edit(f, "en", e.target.value)} />
                          )}
                        </label>
                      </div>
                      <AiAssist
                        actions={[{ action: "translate-en", label: "Türkçe → İngilizce" }]}
                        source={v.tr}
                        onResult={(text) => edit(f, "en", text)}
                      />
                      <AiAssist
                        actions={[{ action: "translate-tr", label: "İngilizce → Türkçe" }]}
                        source={v.en}
                        onResult={(text) => edit(f, "tr", text)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {dirtyKeys.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-container-highest bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:left-64">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-space-md px-space-md py-space-sm md:px-space-xl">
            <p className="text-sm font-semibold text-on-surface">{dirtyKeys.length} değişiklik kaydedilmedi</p>
            <div className="ml-auto flex gap-space-sm">
              <button type="button" className={btnGhost} onClick={discard} disabled={saving}>
                Vazgeç
              </button>
              <button type="button" className={btnPrimary} onClick={save} disabled={saving}>
                {saving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

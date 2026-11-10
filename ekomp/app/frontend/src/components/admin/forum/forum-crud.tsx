"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Field,
  ImageField,
  Modal,
  Notice,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputClass,
} from "@/components/admin/admin-ui";
import { adminFetch } from "@/lib/admin-api";

export type Item = { id: string } & Record<string, unknown>;
type Value = string | boolean | string[];
type FormValues = Record<string, Value>;

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "date"
  | "time"
  | "url"
  | "number"
  | "image"
  | "lines"
  | "speakers";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  /** Boş bırakılırsa sunucuya null gider (adres/URL alanları için). */
  nullable?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  /** "en" alanları İngilizce kutusunda toplanır. */
  group?: "en";
  /** İki sütunlu satırda yan yana durur. */
  half?: boolean;
  /** Kayıtta değer farklı bir alandan okunuyorsa (örn. speakerIds ← speakers). */
  itemKey?: string;
}

export interface Badge {
  text: string;
  tone: "ok" | "warn" | "muted";
}

export interface CrudConfig {
  /** /admin/forum/<path> */
  path: string;
  /** Başlıkta ve onay iletisinde kullanılan tekil ad ("konuşmacı"). */
  noun: string;
  empty: string;
  fields: FieldDef[];
  defaults: FormValues;
  rowTitle: (item: Item) => string;
  rowMeta: (item: Item) => string;
  badges?: (item: Item) => Badge[];
  /** published alanı varsa Yayınla/Yayından kaldır düğmesi gösterilir. */
  publishToggle?: boolean;
}

const BADGE_TONE: Record<Badge["tone"], string> = {
  ok: "bg-green-50 text-green-800 border-green-300",
  warn: "bg-amber-50 text-amber-800 border-amber-300",
  muted: "bg-surface-container text-on-surface-variant border-surface-container-highest",
};

function toForm(config: CrudConfig, item: Item | null): FormValues {
  const out: FormValues = {};
  for (const f of config.fields) {
    const raw = item ? item[f.itemKey ?? f.key] : config.defaults[f.key];
    if (f.type === "checkbox") out[f.key] = Boolean(raw);
    else if (f.type === "lines") out[f.key] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
    else if (f.type === "speakers") {
      out[f.key] = Array.isArray(raw)
        ? (raw as { id: string }[]).map((s) => (typeof s === "string" ? s : s.id))
        : [];
    } else out[f.key] = raw == null ? "" : String(raw);
  }
  return out;
}

function toPayload(config: CrudConfig, values: FormValues): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of config.fields) {
    const v = values[f.key];
    switch (f.type) {
      case "checkbox":
        out[f.key] = Boolean(v);
        break;
      case "lines":
        out[f.key] = String(v)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "speakers":
        out[f.key] = v as string[];
        break;
      case "number":
        if (String(v).trim() !== "") out[f.key] = Number(v);
        break;
      default: {
        const s = String(v);
        out[f.key] = f.nullable ? s.trim() || null : s;
      }
    }
  }
  return out;
}

interface SpeakerOption {
  id: string;
  name: string;
}

function FieldInput({
  def,
  value,
  onChange,
  speakers,
}: {
  def: FieldDef;
  value: Value;
  onChange: (v: Value) => void;
  speakers: SpeakerOption[];
}) {
  switch (def.type) {
    case "textarea":
      return (
        <Field label={def.label} hint={def.hint}>
          <textarea className={inputClass} rows={def.rows ?? 3} required={def.required} value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case "lines":
      return (
        <Field label={def.label} hint={def.hint ?? "Her satıra bir adres yazın."}>
          <textarea className={inputClass} rows={def.rows ?? 3} value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case "select":
      return (
        <Field label={def.label} hint={def.hint}>
          <select className={inputClass} required={def.required} value={String(value)} onChange={(e) => onChange(e.target.value)}>
            {def.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-space-sm">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>{def.label}</span>
        </label>
      );
    case "image":
      return <ImageField value={String(value)} onChange={onChange} />;
    case "speakers": {
      const selected = value as string[];
      return (
        <Field label={def.label} hint={speakers.length ? def.hint : "Önce Konuşmacılar sekmesinden konuşmacı ekleyin."}>
          <div className="max-h-40 space-y-1 overflow-y-auto border border-surface-container-highest bg-white p-space-sm">
            {speakers.map((s) => (
              <label key={s.id} className="flex items-center gap-space-sm text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={(e) => onChange(e.target.checked ? [...selected, s.id] : selected.filter((x) => x !== s.id))}
                />
                {s.name}
              </label>
            ))}
          </div>
        </Field>
      );
    }
    default:
      return (
        <Field label={def.label} hint={def.hint}>
          <input
            className={inputClass}
            type={def.type === "number" ? "number" : def.type}
            required={def.required}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
  }
}

/** Forum içerik türleri için ortak liste + ekle/düzenle/sil ekranı; ayrıntılar CrudConfig ile verilir. */
export function ForumCrud({ config, onChanged }: { config: CrudConfig; onChanged?: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: string | null; values: FormValues } | null>(null);
  const [speakers, setSpeakers] = useState<SpeakerOption[]>([]);
  const needsSpeakers = config.fields.some((f) => f.type === "speakers");

  const load = useCallback(() => {
    adminFetch<Item[]>(`/admin/forum/${config.path}`)
      .then((rows) => {
        setItems(rows);
        setLoaded(true);
      })
      .catch((e: Error) => setError(e.message));
  }, [config.path]);
  useEffect(load, [load]);

  useEffect(() => {
    if (!needsSpeakers) return;
    adminFetch<SpeakerOption[]>("/admin/forum/speakers")
      .then((rows) => setSpeakers(rows.map((r) => ({ id: r.id, name: r.name }))))
      .catch(() => undefined);
  }, [needsSpeakers]);

  function after(message: string) {
    setNotice(message);
    load();
    onChanged?.();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setFormError("");
    try {
      await adminFetch(editing.id ? `/admin/forum/${config.path}/${editing.id}` : `/admin/forum/${config.path}`, {
        method: editing.id ? "PATCH" : "POST",
        body: JSON.stringify(toPayload(config, editing.values)),
      });
      setEditing(null);
      after(editing.id ? "Kaydedildi." : "Eklendi.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: Item) {
    try {
      await adminFetch(`/admin/forum/${config.path}/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !item.published }),
      });
      after(item.published ? "Yayından kaldırıldı." : "Yayınlandı.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Güncellenemedi.");
    }
  }

  async function remove(item: Item) {
    if (!window.confirm(`"${config.rowTitle(item)}" ${config.noun} kalıcı olarak silinsin mi?`)) return;
    try {
      await adminFetch(`/admin/forum/${config.path}/${item.id}`, { method: "DELETE" });
      after("Silindi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silinemedi.");
    }
  }

  const mainFields = config.fields.filter((f) => f.group !== "en");
  const enFields = config.fields.filter((f) => f.group === "en");

  function renderFields(fields: FieldDef[]) {
    const out: React.ReactNode[] = [];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const input = (def: FieldDef) => (
        <FieldInput
          key={def.key}
          def={def}
          value={editing!.values[def.key]}
          speakers={speakers}
          onChange={(v) => setEditing((cur) => (cur ? { ...cur, values: { ...cur.values, [def.key]: v } } : cur))}
        />
      );
      const next = fields[i + 1];
      if (f.half && next?.half) {
        out.push(
          <div key={f.key} className="grid gap-space-md sm:grid-cols-2">
            {input(f)}
            {input(next)}
          </div>,
        );
        i++;
      } else out.push(input(f));
    }
    return out;
  }

  return (
    <>
      <div className="mb-space-md flex justify-end">
        <button type="button" className={btnPrimary} onClick={() => { setFormError(""); setEditing({ id: null, values: toForm(config, null) }); }}>
          + Yeni {config.noun}
        </button>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {notice ? <Notice kind="success">{notice}</Notice> : null}

      <ul className="space-y-space-sm">
        {loaded && items.length === 0 ? <li className="text-on-surface-variant">{config.empty}</li> : null}
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-space-md border border-surface-container-highest bg-white p-space-md">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-on-surface">{config.rowTitle(item)}</p>
              <p className="text-sm text-on-surface-variant">{config.rowMeta(item)}</p>
              {config.badges ? (
                <p className="mt-1 flex flex-wrap gap-1">
                  {config.badges(item).map((b) => (
                    <span key={b.text} className={`border px-2 py-0.5 text-xs font-semibold ${BADGE_TONE[b.tone]}`}>
                      {b.text}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            {config.publishToggle ? (
              <button type="button" className={btnGhost} onClick={() => togglePublished(item)}>
                {item.published ? "Yayından kaldır" : "Yayınla"}
              </button>
            ) : null}
            <button type="button" className={btnGhost} onClick={() => { setFormError(""); setEditing({ id: item.id, values: toForm(config, item) }); }}>
              Düzenle
            </button>
            <button type="button" className={btnDanger} onClick={() => remove(item)}>
              Sil
            </button>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal title={editing.id ? `${config.noun[0].toUpperCase()}${config.noun.slice(1)} düzenle` : `Yeni ${config.noun}`} onClose={() => setEditing(null)}>
          <form onSubmit={onSubmit} className="space-y-space-md">
            {formError ? <Notice kind="error">{formError}</Notice> : null}
            {renderFields(mainFields)}
            {enFields.length ? (
              <fieldset className="space-y-space-md border border-surface-container-highest p-space-md">
                <legend className="px-2 text-sm font-semibold text-on-surface-variant">English (optional)</legend>
                <p className="text-sm text-on-surface-variant">Boş bırakılırsa İngilizce sayfada Türkçe metin gösterilir.</p>
                {renderFields(enFields)}
              </fieldset>
            ) : null}
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

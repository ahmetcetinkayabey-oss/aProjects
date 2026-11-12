"use client";

import Link from "@/components/locale-link";
import { useEffect, useMemo, useState } from "react";
import { DataView, Section, fieldClass } from "@/components/forum/forum-ui";
import type { DictKey } from "@/lib/dictionary";
import {
  CATEGORIES,
  getForumToken,
  type DirectoryEntry,
  type PublicOrganization,
} from "@/lib/forum-api";
import { useLocale } from "@/lib/i18n";
import { useForumData, type DataState } from "@/lib/use-forum-data";

export default function ParticipantsPage() {
  const { t } = useLocale();
  const orgs = useForumData<PublicOrganization[]>("/forum/organizations");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- oturum yalnızca tarayıcıda okunabilir
    setLoggedIn(Boolean(getForumToken()));
  }, []);

  return (
    <Section title={t("participants.title")}>
      <DataView state={orgs} isEmpty={(d) => d.length === 0} emptyKey="participants.empty">
        {(list) => (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((o) => (
              <li key={`${o.organization}|${o.country}`} className="rounded-xl border border-surface-container-high p-5">
                <p className="font-title-md text-lg font-bold">{o.organization}</p>
                <p className="text-sm text-on-surface-variant">
                  {o.country} · {t(`cat.${o.category}` as DictKey)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DataView>

      <div className="mt-16">
        <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("participants.directory")}</h2>
        <p className="mt-1 text-on-surface-variant">{t("participants.directoryHint")}</p>
        {loggedIn === false ? (
          <p className="mt-6">
            <Link href="/forum/giris" className="font-bold underline">
              {t("participants.needLogin")}
            </Link>
          </p>
        ) : loggedIn ? (
          <Directory />
        ) : null}
      </div>
    </Section>
  );
}

function Directory() {
  const { t } = useLocale();
  const state: DataState<DirectoryEntry[]> = useForumData<DirectoryEntry[]>("/forum/directory", true);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  const entries = useMemo<DirectoryEntry[]>(() => (state.status === "ready" ? state.data : []), [state]);
  const countries = useMemo(() => [...new Set(entries.map((e) => e.country))].sort(), [entries]);

  if (state.status === "error") {
    // Onaysız hesaplarda sunucu 403 döner; hata yerine açıklayıcı mesaj gösterilir.
    return <p className="mt-6 text-on-surface-variant">{t("participants.needApproval")}</p>;
  }

  const q = query.trim().toLowerCase();
  const filtered = entries.filter(
    (e) =>
      (!country || e.country === country) &&
      (!category || e.category === category) &&
      (!q || `${e.firstName} ${e.lastName} ${e.organization}`.toLowerCase().includes(q)),
  );

  return (
    <div className="mt-6">
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("participants.search")}
          aria-label={t("participants.search")}
          className={fieldClass}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label={t("reg.country")} className={fieldClass}>
          <option value="">{t("participants.allCountries")}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t("reg.category")} className={fieldClass}>
          <option value="">{t("participants.allCategories")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`cat.${c}` as DictKey)}
            </option>
          ))}
        </select>
      </div>
      <DataView state={state} isEmpty={() => filtered.length === 0} emptyKey="participants.empty">
        {() => (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <li key={e.id} className="rounded-xl bg-surface-container-low p-5">
                <p className="font-title-md text-lg font-bold">
                  {e.firstName} {e.lastName}
                </p>
                <p className="text-sm">{e.jobTitle} · {e.organization}</p>
                <p className="text-sm text-on-surface-variant">
                  {e.city}, {e.country} · {t(`cat.${e.category}` as DictKey)}
                </p>
                {e.email ? <p className="mt-2 text-sm">{e.email}</p> : null}
                {e.phone ? <p className="text-sm">{e.phone}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </DataView>
    </div>
  );
}

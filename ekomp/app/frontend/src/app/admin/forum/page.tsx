"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeading } from "@/components/admin/admin-ui";
import {
  ANNOUNCEMENTS_CONFIG,
  MEDIA_CONFIG,
  SESSIONS_CONFIG,
  SPEAKERS_CONFIG,
  SPONSORS_CONFIG,
} from "@/components/admin/forum/forum-config";
import { ForumCrud } from "@/components/admin/forum/forum-crud";
import { ParticipantsTab } from "@/components/admin/forum/participants-tab";
import { adminFetch } from "@/lib/admin-api";

interface ForumStats {
  participants: { total: number; approved: number; pending: number; countries: number; tourOperators: number; federations: number };
  speakers: number;
  sessions: number;
  missingTranslations: number;
}

const TABS = [
  { id: "katilimcilar", label: "Katılımcılar", icon: "groups" },
  { id: "program", label: "Program", icon: "schedule" },
  { id: "konusmacilar", label: "Konuşmacılar", icon: "record_voice_over" },
  { id: "duyurular", label: "Duyurular", icon: "campaign" },
  { id: "destekciler", label: "Destekçiler", icon: "handshake" },
  { id: "medya", label: "Galeri ve medya", icon: "photo_library" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ForumAdminPage() {
  // Adres #program gibi bir parçayla açıldıysa o sekme seçilir (içerik yalnızca tarayıcıda, giriş doğrulandıktan sonra çizilir).
  const [tab, setTab] = useState<TabId>(() => {
    const id = typeof window === "undefined" ? "" : window.location.hash.slice(1);
    return TABS.find((t) => t.id === id)?.id ?? "katilimcilar";
  });
  const [stats, setStats] = useState<ForumStats | null>(null);

  const loadStats = useCallback(() => {
    adminFetch<ForumStats>("/admin/forum/stats")
      .then(setStats)
      .catch(() => undefined);
  }, []);
  useEffect(loadStats, [loadStats]);

  function choose(id: TabId) {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  const cards = stats
    ? [
        { label: "Onay bekleyen başvuru", value: stats.participants.pending, hot: stats.participants.pending > 0 },
        { label: "Onaylı katılımcı", value: stats.participants.approved },
        { label: "Ülke", value: stats.participants.countries },
        { label: "Konuşmacı", value: stats.speakers },
        { label: "Oturum", value: stats.sessions },
        { label: "Eksik İngilizce metin", value: stats.missingTranslations, hot: stats.missingTranslations > 0 },
      ]
    : [];

  return (
    <>
      <PageHeading title="Forum 2027" subtitle="16–17 Nisan 2027 forumunun başvurularını, programını ve sitedeki içeriğini buradan yönetin." />

      {cards.length ? (
        <div className="mb-space-lg grid grid-cols-2 gap-space-sm md:grid-cols-3 lg:grid-cols-6">
          {cards.map((c) => (
            <div key={c.label} className={`border bg-white p-space-md ${c.hot ? "border-primary-container" : "border-surface-container-highest"}`}>
              <p className="font-headline-md text-headline-md text-on-surface">{c.value}</p>
              <p className="text-xs text-on-surface-variant">{c.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div role="tablist" aria-label="Forum bölümleri" className="mb-space-lg flex flex-wrap gap-1 border-b border-surface-container-highest">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => choose(t.id)}
            className={`flex items-center gap-2 border-b-4 px-space-md py-space-sm text-sm font-semibold ${
              tab === t.id ? "border-primary-container text-on-surface" : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "katilimcilar" ? <ParticipantsTab onChanged={loadStats} /> : null}
        {tab === "program" ? <ForumCrud key="p" config={SESSIONS_CONFIG} onChanged={loadStats} /> : null}
        {tab === "konusmacilar" ? <ForumCrud key="s" config={SPEAKERS_CONFIG} onChanged={loadStats} /> : null}
        {tab === "duyurular" ? <ForumCrud key="a" config={ANNOUNCEMENTS_CONFIG} onChanged={loadStats} /> : null}
        {tab === "destekciler" ? <ForumCrud key="d" config={SPONSORS_CONFIG} onChanged={loadStats} /> : null}
        {tab === "medya" ? <ForumCrud key="m" config={MEDIA_CONFIG} onChanged={loadStats} /> : null}
      </div>
    </>
  );
}

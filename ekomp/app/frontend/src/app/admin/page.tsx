"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice, PageHeading } from "@/components/admin/admin-ui";
import { STATUS_LABELS, adminFetch, type AdminFeedback, type AdminStats, type ReservationStatus } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [openFeedback, setOpenFeedback] = useState<number | null>(null);
  const [forum, setForum] = useState<{ pending: number; approved: number; speakers: number; missing: number } | null>(null);

  useEffect(() => {
    adminFetch<AdminStats>("/admin/stats")
      .then(setStats)
      .catch((e: Error) => setError(e.message));
    // Aşağıdakiler ek bilgidir; alınamazsa kartlar boş (—) kalır, sayfa hata vermez.
    adminFetch<AdminFeedback[]>("/admin/feedback")
      .then((rows) => setOpenFeedback(rows.filter((r) => !r.handled).length))
      .catch(() => undefined);
    adminFetch<{ participants: { pending: number; approved: number }; speakers: number; missingTranslations: number }>("/admin/forum/stats")
      .then((s) => setForum({ pending: s.participants.pending, approved: s.participants.approved, speakers: s.speakers, missing: s.missingTranslations }))
      .catch(() => undefined);
  }, []);

  const byStatus = stats?.reservations.byStatus ?? {};
  const cards = [
    { label: "Yeni talepler", value: stats ? (byStatus.PENDING ?? 0) : null, href: "/admin/rezervasyonlar", icon: "mark_email_unread", highlight: true },
    { label: "Toplam talep", value: stats ? stats.reservations.total : null, href: "/admin/rezervasyonlar", icon: "event_available" },
    { label: "Açık geri bildirim", value: openFeedback, href: "/admin/geri-bildirimler", icon: "rate_review", highlight: true },
    { label: "Forum başvurusu", value: forum?.pending ?? null, href: "/admin/forum", icon: "event", highlight: true },
    { label: "Tesisler", value: stats?.facilities ?? null, href: "/admin/tesisler", icon: "stadium" },
    { label: "Haberler", value: stats?.news ?? null, href: "/admin/haberler", icon: "newspaper" },
  ];

  return (
    <>
      <PageHeading title="Özet" subtitle="Sitenizin genel durumu." />
      {error ? <Notice kind="error">{error}</Notice> : null}

      <div className="grid grid-cols-2 gap-space-md lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`block border p-space-lg transition-shadow hover:shadow-md ${
              card.highlight && (card.value ?? 0) > 0
                ? "border-primary-container bg-primary-container/30"
                : "border-surface-container-highest bg-white"
            }`}
          >
            <span className="material-symbols-outlined text-on-surface-variant">{card.icon}</span>
            <p className="mt-space-sm font-metric-display-mobile text-metric-display-mobile text-on-surface">
              {card.value ?? "—"}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-space-xl">
        <h2 className="mb-space-sm font-headline-md text-headline-md text-on-surface">Hızlı işlemler</h2>
        <div className="grid gap-space-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            { href: "/admin/rezervasyonlar", icon: "event_available", title: "Talepleri incele", text: "Gelen talepleri görüntüle, ara, durumunu güncelle." },
            { href: "/admin/icerik", icon: "edit_note", title: "Sayfa metinlerini düzenle", text: "Başlık ve yazıları değiştir." },
            { href: "/admin/forum", icon: "event", title: "Forum 2027", text: "Başvuruları onayla, programı ve konuşmacıları yönet." },
            { href: "/admin/haberler", icon: "newspaper", title: "Haber ekle", text: "Yeni haber yayınla veya düzenle." },
            { href: "/rezervasyon", icon: "open_in_new", title: "Siteyi görüntüle", text: "Rezervasyon sayfasını yeni sekmede aç.", external: true },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              className="flex gap-space-sm border border-surface-container-highest bg-white p-space-md transition-colors hover:border-primary hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-primary">{a.icon}</span>
              <span>
                <span className="block font-semibold text-on-surface">{a.title}</span>
                <span className="block text-sm text-on-surface-variant">{a.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-space-xl border border-surface-container-highest bg-white p-space-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Taleplerin durumu</h2>
        <ul className="mt-space-md grid gap-space-sm sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((status) => (
            <li key={status} className="flex items-center justify-between border-l-4 border-primary-container bg-surface-container-low px-space-md py-space-sm">
              <span className="text-sm text-on-surface-variant">{STATUS_LABELS[status]}</span>
              <span className="font-semibold text-on-surface">{byStatus[status] ?? 0}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

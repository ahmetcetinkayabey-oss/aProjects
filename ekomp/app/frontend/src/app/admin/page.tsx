"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice, PageHeading } from "@/components/admin/admin-ui";
import { STATUS_LABELS, adminFetch, type AdminStats, type ReservationStatus } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<AdminStats>("/admin/stats")
      .then(setStats)
      .catch((e: Error) => setError(e.message));
  }, []);

  const byStatus = stats?.reservations.byStatus ?? {};
  const cards = [
    { label: "Yeni talepler", value: byStatus.PENDING ?? 0, href: "/admin/rezervasyonlar", icon: "mark_email_unread", highlight: true },
    { label: "Toplam talep", value: stats?.reservations.total ?? 0, href: "/admin/rezervasyonlar", icon: "event_available" },
    { label: "Tesisler", value: stats?.facilities ?? 0, href: "/admin/tesisler", icon: "stadium" },
    { label: "Haberler", value: stats?.news ?? 0, href: "/admin/haberler", icon: "newspaper" },
  ];

  return (
    <>
      <PageHeading title="Özet" subtitle="Sitenizin genel durumu." />
      {error ? <Notice kind="error">{error}</Notice> : null}

      <div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`block border p-space-lg transition-shadow hover:shadow-md ${
              card.highlight && card.value > 0
                ? "border-primary-container bg-primary-container/30"
                : "border-surface-container-highest bg-white"
            }`}
          >
            <span className="material-symbols-outlined text-on-surface-variant">{card.icon}</span>
            <p className="mt-space-sm font-metric-display-mobile text-metric-display-mobile text-on-surface">
              {stats ? card.value : "—"}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">{card.label}</p>
          </Link>
        ))}
      </div>

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

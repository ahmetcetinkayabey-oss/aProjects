"use client";

import { useState, type FormEvent } from "react";
import { createReservation } from "@/lib/api";

const SPORT_BRANCHES = [
  "Futbol",
  "Yüzme",
  "Atletizm",
  "Kış Sporları & Curling",
  "Dövüş Sporları",
  "Salon Sporları",
  "Diğer",
];

type Status = "idle" | "submitting" | "success" | "error";

export function ReservationCta() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(event.currentTarget);
    const groupSizeRaw = form.get("groupSize") as string;

    const result = await createReservation({
      organizationName: String(form.get("organizationName") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      sportBranch: String(form.get("sportBranch") ?? ""),
      groupSize: groupSizeRaw ? Number(groupSizeRaw) : undefined,
      message: String(form.get("message") ?? "") || undefined,
    });

    if (result.success) {
      setStatus("success");
      event.currentTarget.reset();
    } else {
      setStatus("error");
      setError(result.error ?? "Talep gönderilemedi.");
    }
  }

  return (
    <section id="rezervasyon" className="w-full bg-surface px-margin-mobile py-space-xl md:px-margin">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-high p-space-xl">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-space-xl lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-space-xs inline-flex items-center gap-space-xs rounded bg-surface-container-lowest px-space-sm py-1 font-label-caps text-label-caps text-secondary uppercase">
              <span className="material-symbols-outlined text-sm">event_available</span>
              2025 - 2026 KAMP DÖNEMİ REZERVASYONLARI
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface uppercase md:text-headline-lg">
              Milli Takımınız veya Kulübünüz İçin Kamp Planlayın
            </h2>
            <p className="font-body-md text-body-md mt-space-xs text-on-surface-variant">
              Futbol kulüpleri, yüzme federasyonları, kış sporları kafileleri
              ve maraton takımları için 2.100m&apos;de konaklama, beslenme
              uzmanı, fizyoterapi ve antrenman sahası tek pakette.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid w-full max-w-xl grid-cols-1 gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg sm:grid-cols-2"
          >
            <input
              name="organizationName"
              required
              placeholder="Kulüp / Federasyon Adı"
              className="col-span-1 rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none sm:col-span-2"
            />
            <input
              name="contactName"
              required
              placeholder="Yetkili Adı Soyadı"
              className="rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none"
            />
            <input
              name="phone"
              required
              type="tel"
              placeholder="Telefon"
              className="rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none"
            />
            <input
              name="email"
              required
              type="email"
              placeholder="E-posta"
              className="rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none"
            />
            <select
              name="sportBranch"
              required
              defaultValue=""
              className="rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface focus:border-secondary focus:outline-none"
            >
              <option value="" disabled>
                Spor Branşı Seçin
              </option>
              {SPORT_BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <input
              name="groupSize"
              type="number"
              min={1}
              placeholder="Kafile Sayısı (opsiyonel)"
              className="rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Kamp talebiniz hakkında not (opsiyonel)"
              rows={2}
              className="col-span-1 rounded border border-surface-container-high bg-surface-container px-space-sm py-space-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none sm:col-span-2"
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="col-span-1 rounded bg-primary-container px-space-xl py-space-md font-label-caps text-label-caps text-on-primary-container uppercase shadow-[0_4px_20px_rgba(255,101,0,0.4)] transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              {status === "submitting" ? "Gönderiliyor..." : "Hemen Talep Oluşturun"}
            </button>

            {status === "success" ? (
              <p className="col-span-1 text-sm text-secondary sm:col-span-2">
                Talebiniz alındı, ekibimiz en kısa sürede sizinle iletişime
                geçecek.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="col-span-1 text-sm text-primary sm:col-span-2">{error}</p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

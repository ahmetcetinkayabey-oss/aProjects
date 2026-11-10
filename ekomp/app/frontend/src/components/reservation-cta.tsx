"use client";

import { Suspense, useState, type FormEvent } from "react";
import { createReservation } from "@/lib/api";
import { useC, useL } from "./t";
import { OptImg } from "@/components/opt-img";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SPORT_BRANCHES = [
  { value: "Futbol", en: "Football" },
  { value: "Yüzme", en: "Swimming" },
  { value: "Atletizm", en: "Athletics" },
  { value: "Kış Sporları & Curling", en: "Winter Sports & Curling" },
  { value: "Dövüş Sporları", en: "Combat Sports" },
  { value: "Ekipman kiralama", en: "Equipment rental" },
  { value: "Konaklama", en: "Accommodation" },
  { value: "Performans testi", en: "Performance test" },
  { value: "Masa rezervasyonu", en: "Table booking" },
  { value: "Salon Sporları", en: "Indoor Sports" },
  { value: "KVKK başvurusu", en: "KVKK (data protection) request" },
  { value: "Diğer", en: "Other" },
];

const CONTACT = [
  { icon: "location_on", label: "Palandöken / Erzurum", en: "Palandöken / Erzurum" },
  { icon: "schedule", label: "Talepler en kısa sürede yanıtlanır", en: "Requests are answered as soon as possible" },
  { icon: "check_circle", label: "Ücretsiz ve bağlayıcı değildir", en: "Free and non-binding" },
];

const FIELD =
  "w-full rounded-xl border border-surface-container-high bg-surface-container-low px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/70 transition-colors focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/30 focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

/** Rezervasyon sayfasındaki kartlar ?brans=...&konu=... ile formu önceden doldurur. */
export function ReservationCta() {
  return (
    <Suspense fallback={null}>
      <ReservationFormLoader />
    </Suspense>
  );
}

function ReservationFormLoader() {
  const params = useSearchParams();
  const brans = params.get("brans") ?? "";
  const konu = params.get("konu") ?? "";
  return <ReservationForm key={brans + "|" + konu} brans={brans} konu={konu} />;
}

function ReservationForm({ brans, konu }: { brans: string; konu: string }) {
  const l = useL();
  const c = useC();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [branch, setBranch] = useState(SPORT_BRANCHES.some((b) => b.value === brans) ? brans : "");
  const [note, setNote] = useState(konu ? konu.slice(0, 200) + ": " : "");
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setStatus("submitting");
    setError(null);

    const form = new FormData(formEl);
    const groupSizeRaw = form.get("groupSize") as string;

    const result = await createReservation({
      organizationName: String(form.get("organizationName") ?? ""),
      contactName: String(form.get("contactName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      sportBranch: String(form.get("sportBranch") ?? ""),
      groupSize: groupSizeRaw ? Number(groupSizeRaw) : undefined,
      preferredStartDate: String(form.get("preferredStartDate") ?? "") || undefined,
      preferredEndDate: String(form.get("preferredEndDate") ?? "") || undefined,
      message: String(form.get("message") ?? "") || undefined,
    });

    if (result.success) {
      setStatus("success");
      formEl.reset();
      setStartDate("");
      setBranch("");
      setNote("");
    } else {
      setStatus("error");
      setError(result.error ?? l("Talep gönderilemedi.", "Your request could not be sent."));
    }
  }

  return (
    <section
      id="rezervasyon"
      className="w-full scroll-mt-6 bg-surface px-margin-mobile py-16 md:px-margin md:py-24"
    >
      <div className="reveal-zoom mx-auto grid max-w-[1400px] overflow-hidden rounded-3xl bg-ink shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex flex-col justify-between gap-10 p-8 md:p-12">
          <OptImg sizes="100vw"
            src="/images/reservation-bg.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 font-label-caps text-label-caps text-on-primary-container uppercase">
              <span className="material-symbols-outlined text-[16px]">event_available</span>
              {c("cta.badge")}
            </span>
            <h2 className="mt-5 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-white md:text-5xl">
              {c("cta.title")}
            </h2>
            <p className="mt-4 font-body-lg text-lg text-white/75">
              {c("cta.text")}
            </p>
          </div>
          <ul className="relative grid gap-3">
            {CONTACT.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-white/90">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary-container">
                  <span className="material-symbols-outlined leading-none">{item.icon}</span>
                </span>
                {l(item.label, item.en)}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 bg-white p-8 sm:grid-cols-2 md:p-12"
        >
          <input
            name="organizationName"
            required
            placeholder={l("Kulüp / federasyon adı", "Club / federation name")}
            className={`${FIELD} sm:col-span-2`}
          />
          <input name="contactName" required placeholder={l("Yetkili adı soyadı", "Contact person's full name")} className={FIELD} />
          <input name="phone" required type="tel" placeholder={l("Telefon", "Phone")} className={FIELD} />
          <input
            name="email"
            required
            type="email"
            placeholder={l("E-posta", "Email")}
            className={`${FIELD} sm:col-span-2`}
          />
          <select name="sportBranch" required value={branch} onChange={(e) => setBranch(e.target.value)} aria-label={l("Spor branşı", "Sport")} className={FIELD}>
            <option value="" disabled>
              {l("Spor branşı", "Sport")}
            </option>
            {SPORT_BRANCHES.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {l(branch.value, branch.en)}
              </option>
            ))}
          </select>
          <input
            name="groupSize"
            type="number"
            min={1}
            placeholder={l("Kafile kişi sayısı (isteğe bağlı)", "Group size (optional)")}
            className={FIELD}
          />
          <label className="grid gap-1 text-xs font-semibold text-on-surface-variant">
            {l("Tercih edilen başlangıç (isteğe bağlı)", "Preferred start (optional)")}
            <input name="preferredStartDate" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className={FIELD} />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-on-surface-variant">
            {l("Tercih edilen bitiş (isteğe bağlı)", "Preferred end (optional)")}
            <input name="preferredEndDate" type="date" min={startDate || today} className={FIELD} />
          </label>
          <textarea
            name="message"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={l("Notunuz (isteğe bağlı)", "Your note (optional)")}
            rows={3}
            className={`${FIELD} sm:col-span-2`}
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {status === "submitting" ? l("Gönderiliyor...", "Sending...") : l("Talep gönder", "Send request")}
          </button>

          <p className="text-sm text-on-surface-variant sm:col-span-2">
            {l("Bilgileriniz yalnızca talebinizi yanıtlamak için işlenir.", "Your details are used only to respond to your request.")}{" "}
            <Link href="/gizlilik" target="_blank" className="font-semibold text-on-surface underline underline-offset-4">
              {l("Aydınlatma Metni", "Privacy notice")}
            </Link>
          </p>

          {status === "success" ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 sm:col-span-2">
              {c("cta.success")}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 sm:col-span-2">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

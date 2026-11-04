"use client";

import { useState, type FormEvent } from "react";
import { createFeedback } from "@/lib/api";
import { SectionHeading } from "./section-heading";
import { useL } from "./t";
import Link from "next/link";

const CATEGORIES = [
  { value: "Öneri", en: "Suggestion" },
  { value: "Şikayet", en: "Complaint" },
  { value: "Teşekkür", en: "Thanks" },
  { value: "Diğer", en: "Other" },
];

const FIELD =
  "w-full rounded-xl border border-surface-container-high bg-surface-container-low px-4 py-3.5 text-[15px] text-on-surface placeholder:text-on-surface-variant/70 transition-colors focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/30 focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

/** Ana sayfadaki geri bildirim alanı: ziyaretçiler öneri, şikayet veya teşekkürlerini iletir. */
export function FeedbackSection() {
  const l = useL();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setStatus("submitting");
    setError(null);

    const result = await createFeedback({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? "") || undefined,
      category: String(form.get("category") ?? "Öneri"),
      rating: rating || undefined,
      message: String(form.get("message") ?? ""),
    });

    if (result.success) {
      setStatus("success");
      setRating(0);
      formEl.reset();
    } else {
      setStatus("error");
      setError(result.error ?? l("Geri bildirim gönderilemedi.", "Your feedback could not be sent."));
    }
  }

  return (
    <section
      id="geri-bildirim"
      className="w-full scroll-mt-24 bg-surface px-margin-mobile py-20 md:px-margin md:py-28"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow={l("Geri bildirim", "Feedback")}
            title={l("Görüşünüz bizim için değerli", "Your opinion matters to us")}
            text={l(
              "Kamp deneyiminiz, önerileriniz veya sorunlarınız hakkında bize yazın. Mesajlarınızı yönetim ekibimiz okur.",
              "Write to us about your camp experience, suggestions or any problems. Our management team reads every message.",
            )}
          />
          <ul className="mt-8 grid gap-3 text-on-surface-variant">
            {[
              { icon: "lightbulb", text: l("Önerileriniz hizmetimizi geliştirir", "Your suggestions help us improve our service") },
              { icon: "support_agent", text: l("Şikayetleriniz dikkate alınır", "Your complaints are taken seriously") },
              { icon: "lock", text: l("E-posta adresiniz isteğe bağlıdır ve paylaşılmaz", "Your email address is optional and will not be shared") },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[22px] leading-none">{item.icon}</span>
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reveal grid grid-cols-1 gap-4 rounded-3xl border border-surface-container-high bg-white p-6 shadow-lg sm:grid-cols-2 md:p-10"
        >
          <input name="name" required minLength={2} maxLength={100} placeholder={l("Adınız soyadınız", "Your full name")} className={FIELD} />
          <input name="email" type="email" maxLength={200} placeholder={l("E-posta (isteğe bağlı)", "Email (optional)")} className={FIELD} />
          <select name="category" required defaultValue="Öneri" className={`${FIELD} sm:col-span-2`} aria-label={l("Konu", "Subject")}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {l(c.value, c.en)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 sm:col-span-2">
            <span className="text-sm font-semibold text-on-surface-variant">{l("Memnuniyetiniz:", "Your satisfaction:")}</span>
            <div role="radiogroup" aria-label={l("Memnuniyet puanı", "Satisfaction rating")} className="flex" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={l(`${n} yıldız`, `${n} ${n === 1 ? "star" : "stars"}`)}
                  onClick={() => setRating(rating === n ? 0 : n)}
                  onMouseEnter={() => setHover(n)}
                  className="p-0.5 focus-visible:outline-2 focus-visible:outline-primary-container"
                >
                  <span
                    className={`material-symbols-outlined text-[30px] transition-colors ${
                      n <= (hover || rating) ? "text-primary-container" : "text-surface-container-high"
                    }`}
                    style={{ fontVariationSettings: `'FILL' ${n <= (hover || rating) ? 1 : 0}` }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="message"
            required
            minLength={5}
            maxLength={2000}
            rows={5}
            placeholder={l("Mesajınız", "Your message")}
            className={`${FIELD} sm:col-span-2`}
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
          >
            {status === "submitting" ? l("Gönderiliyor...", "Sending...") : l("Geri bildirim gönder", "Send feedback")}
          </button>

          <p className="text-sm text-on-surface-variant sm:col-span-2">
            {l("Bilgileriniz yalnızca geri bildiriminizi değerlendirmek için işlenir.", "Your details are used only to review your feedback.")}{" "}
            <Link href="/gizlilik" target="_blank" className="font-semibold text-on-surface underline underline-offset-4">
              {l("Aydınlatma Metni", "Privacy notice")}
            </Link>
          </p>

          {status === "success" ? (
            <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 sm:col-span-2">
              {l("Teşekkürler! Geri bildiriminiz bize ulaştı.", "Thank you! Your feedback has reached us.")}
            </p>
          ) : null}
          {status === "error" ? (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 sm:col-span-2">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

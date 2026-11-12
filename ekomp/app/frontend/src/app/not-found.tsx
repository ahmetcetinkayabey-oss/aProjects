import Link from "@/components/locale-link";
import { L } from "@/components/t";

export default function NotFound() {
  return (
    <main className="flex w-full flex-col items-center bg-surface px-margin-mobile py-24 text-center md:px-margin md:py-32">
      <span className="font-metric-display text-7xl font-extrabold text-primary md:text-9xl">404</span>
      <h1 className="mt-4 font-headline-lg text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
        <L tr="Aradığınız sayfa bulunamadı" en="We couldn't find that page" />
      </h1>
      <p className="mt-4 max-w-xl font-body-lg text-lg text-on-surface-variant">
        <L
          tr="Adres değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfadan devam edebilirsiniz."
          en="The address may have changed or the page may have been removed. You can continue from the home page."
        />
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white"
        >
          <L tr="Ana sayfa" en="Home" />
        </Link>
        <Link
          href="/tesisler"
          className="inline-flex items-center rounded-full border border-on-surface px-8 py-4 font-label-caps text-label-caps text-on-surface uppercase transition-colors hover:bg-on-surface hover:text-white"
        >
          <L tr="Tesisler" en="Facilities" />
        </Link>
      </div>
    </main>
  );
}

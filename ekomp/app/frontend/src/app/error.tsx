"use client";

import { useEffect } from "react";
import { useL } from "@/components/t";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const l = useL();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex w-full flex-col items-center bg-surface px-margin-mobile py-24 text-center md:px-margin md:py-32">
      <h1 className="font-headline-lg text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
        {l("Bir şeyler ters gitti", "Something went wrong")}
      </h1>
      <p className="mt-4 max-w-xl font-body-lg text-lg text-on-surface-variant">
        {l("Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.", "There was a problem loading this page. Please try again.")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white"
      >
        {l("Tekrar dene", "Try again")}
      </button>
    </main>
  );
}

"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localizePath, useLocale } from "@/lib/i18n";

/** next/link yerine kullanılır: İngilizce görünümde site içi adreslere "/en" öneki ekler. */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const { locale } = useLocale();
  return <Link href={typeof href === "string" ? localizePath(locale, href) : href} {...rest} />;
}

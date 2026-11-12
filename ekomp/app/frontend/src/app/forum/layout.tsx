import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ForumSubNav } from "@/components/forum/forum-ui";
import { getRequestLocale } from "@/lib/server-locale";

export const generateMetadata = async (): Promise<Metadata> => {
  const en = (await getRequestLocale()) === "en";
  return {
    title: en ? "Palandöken International High Altitude & Winter Tourism Forum 2027" : "Palandöken Uluslararası Yüksek İrtifa ve Kış Turizmi Forumu 2027",
    description: en ? "16–17 April 2027 · Palandöken, Erzurum, Türkiye" : "16–17 Nisan 2027 · Palandöken, Erzurum, Türkiye",
  };
};

export default function ForumLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-surface">
      <ForumSubNav />
      <main>{children}</main>
    </div>
  );
}

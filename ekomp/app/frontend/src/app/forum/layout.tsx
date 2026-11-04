import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ForumSubNav } from "@/components/forum/forum-ui";

export const metadata: Metadata = {
  title: "Palandöken Uluslararası Yüksek İrtifa ve Kış Turizmi Forumu 2027",
  description: "16–17 Nisan 2027 · Palandöken, Erzurum, Türkiye",
};

export default function ForumLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-surface">
      <ForumSubNav />
      <main>{children}</main>
    </div>
  );
}

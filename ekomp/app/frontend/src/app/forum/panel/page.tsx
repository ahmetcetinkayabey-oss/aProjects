"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ErrorText, Section, buttonClass, fieldClass } from "@/components/forum/forum-ui";
import type { DictKey } from "@/lib/dictionary";
import { clearForumToken, forumFetch, getForumToken, ForumApiError, type OwnProfile } from "@/lib/forum-api";
import { useLocale, useLocalePath } from "@/lib/i18n";

export default function PanelPage() {
  const { t } = useLocale();
  const router = useRouter();
  const lp = useLocalePath();
  const [profile, setProfile] = useState<OwnProfile | null>(null);
  const [error, setError] = useState<DictKey | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getForumToken()) {
      router.replace(lp("/forum/giris"));
      return;
    }
    forumFetch<OwnProfile>("/forum/me", {}, true)
      .then(setProfile)
      .catch((e) => {
        if (e instanceof ForumApiError && e.status === 401) {
          clearForumToken();
          router.replace(lp("/forum/giris"));
        } else setError("common.loadError");
      });
  }, [router, lp]);

  if (!profile) {
    return (
      <Section title={t("panel.title")}>
        {error ? <ErrorText>{t(error)}</ErrorText> : <p role="status">{t("common.loading")}</p>}
      </Section>
    );
  }

  const set = <K extends keyof OwnProfile>(key: K, value: OwnProfile[K]) => {
    setSaved(false);
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    try {
      const { firstName, lastName, organization, jobTitle, phone, bio, interests, photoUrl, visibility, shareContact, wantsB2B } = profile;
      const next = await forumFetch<OwnProfile>(
        "/forum/me",
        {
          method: "PATCH",
          body: JSON.stringify({
            firstName, lastName, organization, jobTitle, phone, visibility, shareContact, wantsB2B,
            bio: bio ?? "",
            interests: interests ?? "",
            photoUrl: photoUrl ?? "",
          }),
        },
        true,
      );
      setProfile(next);
      setSaved(true);
    } catch {
      setError("err.generic");
    }
  }

  const text = (key: "firstName" | "lastName" | "organization" | "jobTitle" | "phone" | "interests" | "photoUrl", label: DictKey) => (
    <label>
      <span className="mb-1 block text-sm font-bold">{t(label)}</span>
      <input value={profile[key] ?? ""} onChange={(e) => set(key, e.target.value)} className={fieldClass} />
    </label>
  );

  return (
    <Section title={t("panel.title")}>
      <p className="mb-8 rounded-xl bg-surface-container-low p-5">
        <span className="font-bold">{t("panel.status")}:</span> {t(`status.${profile.status}` as DictKey)}
      </p>

      <form onSubmit={save} className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <h2 className="font-headline-md text-2xl font-bold sm:col-span-2">{t("panel.profile")}</h2>
        {text("firstName", "reg.firstName")}
        {text("lastName", "reg.lastName")}
        {text("organization", "reg.organization")}
        {text("jobTitle", "reg.jobTitle")}
        {text("phone", "reg.phone")}
        {text("interests", "panel.interests")}
        <div className="sm:col-span-2">{text("photoUrl", "panel.photoUrl")}</div>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-bold">{t("reg.bio")}</span>
          <textarea value={profile.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={3} maxLength={1000} className={fieldClass} />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-bold">{t("reg.visibility")}</span>
          <select value={profile.visibility} onChange={(e) => set("visibility", e.target.value as OwnProfile["visibility"])} className={fieldClass}>
            {["PARTICIPANTS", "PUBLIC", "HIDDEN"].map((v) => (
              <option key={v} value={v}>{t(`reg.vis.${v}` as DictKey)}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={profile.shareContact} onChange={(e) => set("shareContact", e.target.checked)} className="h-5 w-5" />
          <span>{t("panel.shareContact")}</span>
        </label>
        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={profile.wantsB2B} onChange={(e) => set("wantsB2B", e.target.checked)} className="h-5 w-5" />
          <span>{t("reg.wantsB2B")}</span>
        </label>
        {error ? <div className="sm:col-span-2"><ErrorText>{t(error)}</ErrorText></div> : null}
        {saved ? <p role="status" className="font-bold text-green-800 sm:col-span-2">{t("panel.saved")}</p> : null}
        <div className="sm:col-span-2">
          <button type="submit" className={buttonClass}>{t("panel.save")}</button>
        </div>
      </form>

      <div className="mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-surface-container-high p-6">
          <h2 className="font-title-md text-xl font-bold">{t("panel.b2b")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("panel.b2b.soon")}</p>
        </div>
        <div className="rounded-xl border border-surface-container-high p-6">
          <h2 className="font-title-md text-xl font-bold">{t("panel.notifications")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("panel.notifications.empty")}</p>
        </div>
      </div>
    </Section>
  );
}

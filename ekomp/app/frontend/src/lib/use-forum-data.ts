"use client";

import { useEffect, useState } from "react";
import { forumFetch } from "./forum-api";

export type DataState<T> = { status: "loading" } | { status: "error" } | { status: "ready"; data: T };

/** Herkese açık forum verisini bir kez çeker; dil değişiminde yeniden çekmek gerekmez (iki dil de gelir). */
export function useForumData<T>(path: string, auth = false): DataState<T> {
  const [state, setState] = useState<DataState<T>>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    forumFetch<T>(path, {}, auth)
      .then((data) => !cancelled && setState({ status: "ready", data }))
      .catch(() => !cancelled && setState({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [path, auth]);
  return state;
}

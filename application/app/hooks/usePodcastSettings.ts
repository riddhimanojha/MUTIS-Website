import { useEffect, useState } from "react";
import type { Tables } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

type PodcastSettings = Tables<"podcast_settings">;

export function usePodcastSettings() {
  const [settings, setSettings] = useState<PodcastSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("podcast_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("Failed to load podcast settings", error);
        setSettings(data ?? null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, isLoading };
}

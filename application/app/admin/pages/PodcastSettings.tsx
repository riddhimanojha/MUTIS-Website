import { useEffect, useState, type FormEvent } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { fetchSpotifyOEmbed, sanitizeSpotifyEmbedHtml } from "@/lib/spotifyEmbed";
import { useAdminMutation } from "../useAdminMutation";
import { useToast } from "../components/Toast";
import { usePageCache, hasCached } from "../usePageCache";

type PodcastSettings = Database["public"]["Tables"]["podcast_settings"]["Row"];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function PodcastSettingsPage() {
  const toast = useToast();
  const { updateRow } = useAdminMutation();

  const [row, setRow] = usePageCache<PodcastSettings | null>("admin:podcast:row", null);
  const [loading, setLoading] = useState(!hasCached("admin:podcast:row"));
  const [url, setUrl] = usePageCache<string | null>("admin:podcast:url", null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("podcast_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) toast.error("Could not load podcast settings.");
        else {
          setRow(data);
          // Only populate on first load — a background refetch on revisit
          // shouldn't clobber an in-progress edit the admin hasn't saved yet.
          setUrl((prev) => prev ?? (data?.spotify_url ?? ""));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = (url ?? "").trim();
    if (!trimmed) {
      toast.error("Enter a Spotify show or episode link.");
      return;
    }
    if (!trimmed.startsWith("https://open.spotify.com/")) {
      toast.error("That doesn't look like a Spotify link (should start with https://open.spotify.com/).");
      return;
    }
    if (!row) return;

    setSaving(true);
    try {
      const oembed = await fetchSpotifyOEmbed(trimmed);
      const updated = await updateRow(
        "podcast_settings",
        row.id,
        {
          spotify_url: trimmed,
          embed_html: sanitizeSpotifyEmbedHtml(oembed.html),
          embed_width: oembed.width,
          embed_height: oembed.height,
          embed_title: oembed.title ?? null,
          thumbnail_url: oembed.thumbnail_url ?? null,
          fetched_at: new Date().toISOString(),
        },
        row
      );
      setRow(updated);
      toast.success("Podcast embed updated.");
    } catch (err) {
      // The oEmbed fetch failed — still save the link so the public site can at
      // least show a plain "Open in Spotify" fallback, per the graceful-degradation requirement.
      try {
        const updated = await updateRow(
          "podcast_settings",
          row.id,
          {
            spotify_url: trimmed,
            embed_html: null,
            embed_width: null,
            embed_height: null,
            embed_title: null,
            thumbnail_url: null,
            fetched_at: null,
          },
          row
        );
        setRow(updated);
        toast.error(
          err instanceof Error
            ? `Saved the link, but couldn't fetch a preview: ${err.message} The site will show a plain link until this succeeds.`
            : "Saved the link, but couldn't fetch a preview. The site will show a plain link until this succeeds."
        );
      } catch (saveErr) {
        toast.error(saveErr instanceof Error ? saveErr.message : "Could not save that link.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Settings</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Podcast</h1>
      <p className="mt-[8px] text-[13px] leading-[1.6] text-muted-foreground">
        Paste the show or episode link from Spotify. Saving fetches a fresh embed preview via Spotify's oEmbed
        API and caches it — the public site never calls Spotify directly.
      </p>

      {loading ? (
        <div className="mt-[32px] flex items-center justify-center py-[48px] text-muted-foreground">
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="mt-[24px] flex flex-col gap-[8px] sm:flex-row">
            <input
              type="url"
              required
              placeholder="https://open.spotify.com/show/…"
              value={url ?? ""}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full flex-1 rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-[6px] rounded-[10px] bg-primary px-[20px] py-[12px] text-[14px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-[14px] w-[14px] animate-spin" />}
              {saving ? "Fetching preview…" : "Save"}
            </button>
          </form>

          <div className="mt-[32px] rounded-[14px] border border-border p-[20px]">
            <p className="text-[12px] font-medium text-muted-foreground">Current embed</p>
            {row?.embed_html ? (
              <>
                <div
                  className="mt-[14px] max-w-[624px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeSpotifyEmbedHtml(row.embed_html) }}
                />
                <p className="mt-[12px] text-[12px] text-muted-foreground">
                  {row.embed_title && <>{row.embed_title} · </>}
                  Last synced {row.fetched_at ? formatDateTime(row.fetched_at) : "—"}
                </p>
              </>
            ) : (
              <p className="mt-[10px] text-[13px] text-muted-foreground">
                {row?.spotify_url
                  ? "No cached preview yet — the public site is showing a plain link fallback."
                  : "Nothing saved yet."}
              </p>
            )}
            {row?.spotify_url && (
              <a
                href={row.spotify_url}
                target="_blank"
                rel="noreferrer"
                className="mt-[14px] inline-flex items-center gap-[6px] text-[12px]! font-medium text-accent hover:underline"
              >
                Open in Spotify <ExternalLink className="h-[12px] w-[12px]" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

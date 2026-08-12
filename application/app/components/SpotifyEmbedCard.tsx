import type { CSSProperties } from "react";
import type { Tables } from "@/lib/database.types";
import { sanitizeSpotifyEmbedHtml } from "@/lib/spotifyEmbed";

type PodcastSettings = Tables<"podcast_settings">;

interface SpotifyEmbedCardProps {
  settings: PodcastSettings | null;
  isLoading?: boolean;
}

export function SpotifyEmbedCard({ settings, isLoading }: SpotifyEmbedCardProps) {
  if (isLoading) {
    return <p className="lede r-up" role="status">Loading podcast…</p>;
  }

  if (!settings || !settings.spotify_url) {
    return (
      <p className="lede r-up">
        Our podcast is launching soon. Once it&apos;s live, you&apos;ll be able to stream every episode
        right here.
      </p>
    );
  }

  return (
    <div className="spotify-embed r-up">
      {settings.embed_html && (
        <div
          className="spotify-embed-frame"
          style={{ "--embed-ratio": `${settings.embed_width ?? 624} / ${settings.embed_height ?? 351}` } as CSSProperties}
          dangerouslySetInnerHTML={{ __html: sanitizeSpotifyEmbedHtml(settings.embed_html) }}
        />
      )}
      <a href={settings.spotify_url} target="_blank" rel="noreferrer" className="spotify-embed-fallback">
        Open in Spotify →
      </a>
    </div>
  );
}

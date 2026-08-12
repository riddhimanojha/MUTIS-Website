import DOMPurify from "dompurify";

const SPOTIFY_EMBED_ORIGIN = "https://open.spotify.com/embed/";

/** oEmbed responses only ever contain a single trusted <iframe> — allowlist just that. */
export function sanitizeSpotifyEmbedHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["iframe"],
    ALLOWED_ATTR: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "loading", "title", "style"],
  });
}

/** Defense in depth: confirm the oEmbed response actually points at Spotify before we persist it. */
export function isTrustedSpotifyEmbedUrl(url: string | undefined | null): url is string {
  return typeof url === "string" && url.startsWith(SPOTIFY_EMBED_ORIGIN);
}

export interface SpotifyOEmbedResponse {
  html: string;
  iframe_url: string;
  width: number;
  height: number;
  title?: string;
  thumbnail_url?: string;
}

export async function fetchSpotifyOEmbed(spotifyUrl: string): Promise<SpotifyOEmbedResponse> {
  const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`);
  if (!res.ok) throw new Error(`Spotify oEmbed request failed (${res.status}).`);
  const data = (await res.json()) as SpotifyOEmbedResponse;
  if (!isTrustedSpotifyEmbedUrl(data.iframe_url) || !data.html) {
    throw new Error("Unexpected response from Spotify's oEmbed API.");
  }
  return data;
}

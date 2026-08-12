/** True if sanitized TipTap HTML has no visible content (no text, no image). */
export function isHtmlEmpty(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  if (div.querySelector("img")) return false;
  return !(div.textContent ?? "").trim();
}

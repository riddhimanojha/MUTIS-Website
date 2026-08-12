/** Plain-text excerpt from a rich-text HTML field — strips markup for compact card display. */
export function htmlToExcerpt(html: string, maxLen = 150) {
  // Insert a space after block-level closing tags first, since textContent
  // concatenates across element boundaries with no whitespace of its own.
  const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote|div|tr)>/gi, "$& ");
  const div = document.createElement("div");
  div.innerHTML = spaced;
  const text = (div.textContent ?? "").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen).trimEnd()}…` : text;
}

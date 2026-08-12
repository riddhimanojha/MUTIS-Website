import { useEffect, useState } from "react";

/** Matches the design brief's "major layout collapse" breakpoint (900px) — the same one
 * DataTable switches to stacked cards at. Drag-and-drop reordering isn't usable via native
 * HTML5 DnD on touch anyway, so pages fall back to the plain table below this width. */
export function useIsMobile(breakpointPx = 900): boolean {
  const query = `(max-width: ${breakpointPx}px)`;
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpointPx]);

  return isMobile;
}

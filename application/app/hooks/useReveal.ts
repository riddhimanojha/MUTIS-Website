import { useEffect } from "react";

/**
 * Adds the `.in` class to any element with class `.r-up` once it intersects the
 * viewport. Mirrors website/page-shell.js. Re-runs whenever `deps` change so
 * elements rendered after async data loads also get observed.
 */
export function useReveal(deps: ReadonlyArray<unknown> = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".r-up"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => {
      if (!el.classList.contains("in")) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

import { useCallback, useEffect, useRef } from "react";

// Per-element tilt for explicit React components (used by Home page).
export function useTilt(intensity = 8) {
  const ref = useRef<HTMLElement | null>(null);
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-y", `${mx * intensity}deg`);
      el.style.setProperty("--tilt-x", `${-my * intensity}deg`);
      el.style.setProperty("--tilt-tx", `${mx * 4}px`);
      el.style.setProperty("--tilt-ty", `${my * 4}px`);
    },
    [intensity]
  );
  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-y", `0deg`);
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-tx", `0px`);
    el.style.setProperty("--tilt-ty", `0px`);
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

// Selector-based tilt  -  mirrors website/page-shell.js so static subpage markup
// gets the same hover tilt as the React-built homepage. Idempotent.
const TILT_INTENSITY: Record<string, number> = {
  ".nav-logo": 12,
  ".nav-links a": 14,
  ".nav-cta": 10,
  ".btn": 10,
  ".cta-btn": 12,
  ".dark-card": 8,
  ".numlist-item": 5,
  ".sponsor-cell": 8,
  ".article": 5,
  ".member": 8,
  ".tl-item": 5,
  ".sector": 6,
  ".sector-block": 4,
  ".footer a": 12,
  ".contact-info .v a": 10,
  ".crumb a": 14,
  "form button": 10,
};

type TiltEl = HTMLElement & { _tiltMove?: (e: MouseEvent) => void; _tiltLeave?: () => void };

export function useTiltOnSelectors(deps: ReadonlyArray<unknown> = []) {
  useEffect(() => {
    const wired: TiltEl[] = [];
    for (const [sel, intensity] of Object.entries(TILT_INTENSITY)) {
      document.querySelectorAll<TiltEl>(sel).forEach((el) => {
        if (el.dataset.tiltInit) return;
        el.dataset.tiltInit = "1";
        el.classList.add("tilt");
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width - 0.5;
          const my = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--tilt-y", `${mx * intensity}deg`);
          el.style.setProperty("--tilt-x", `${-my * intensity}deg`);
          el.style.setProperty("--tilt-tx", `${mx * 4}px`);
          el.style.setProperty("--tilt-ty", `${my * 4}px`);
        };
        const leave = () => {
          el.style.setProperty("--tilt-y", `0deg`);
          el.style.setProperty("--tilt-x", `0deg`);
          el.style.setProperty("--tilt-tx", `0px`);
          el.style.setProperty("--tilt-ty", `0px`);
        };
        el._tiltMove = move;
        el._tiltLeave = leave;
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        wired.push(el);
      });
    }
    return () => {
      wired.forEach((el) => {
        if (el._tiltMove) el.removeEventListener("mousemove", el._tiltMove);
        if (el._tiltLeave) el.removeEventListener("mouseleave", el._tiltLeave);
        delete el.dataset.tiltInit;
        el.classList.remove("tilt");
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

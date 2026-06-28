import { useEffect, useRef, useState } from "react";

type Parsed = { value: number; suffix: string; prefix: string };

function parseStat(input: string): Parsed {
  // Capture leading non-digits, digits (with optional decimals/commas), trailing non-digits.
  const match = input.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: "", value: 0, suffix: input };
  const prefix = match[1] ?? "";
  const numStr = (match[2] ?? "0").replace(/,/g, "");
  const suffix = match[3] ?? "";
  const value = Number(numStr);
  return { prefix, value: Number.isFinite(value) ? value : 0, suffix };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Count-up that fires when the host element scrolls into view.
 * Returns a ref to attach to the container and the formatted display string.
 */
export function useCountUp(target: string, durationMs = 1800) {
  const { prefix, value, suffix } = parseStat(target);
  const [display, setDisplay] = useState<string>(`${prefix}0${suffix}`);
  const ref = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || startedRef.current) return;

    const startAnimation = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTs = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTs;
        const t = Math.min(1, elapsed / durationMs);
        const eased = easeOutCubic(t);
        const current = Math.round(value * eased);
        setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs, prefix, value, suffix]);

  return { ref, display };
}

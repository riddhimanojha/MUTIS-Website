import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const cache = new Map<string, unknown>();

/**
 * Like useState, but the value survives this component unmounting — e.g. navigating
 * to another admin page and back — by persisting in a module-level cache keyed by
 * `key`. Used so list data, search text, and filters aren't reset on every visit.
 * Keys should be namespaced per page (e.g. "sponsors:rows", "sponsors:search").
 */
export function usePageCache<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => (cache.has(key) ? (cache.get(key) as T) : initialValue));

  useEffect(() => {
    cache.set(key, value);
  }, [key, value]);

  return [value, setValue];
}

/** Whether a page-cache key already has a value — used to decide whether a page's
 * first render this session should show a loading spinner or cached content. */
export function hasCached(key: string): boolean {
  return cache.has(key);
}

import { useEffect, useRef, useState } from 'react';

interface ViewCountResponse {
  views: number;
}

export function useBlogViews(slug: string | undefined): number {
  const [views, setViews] = useState<number>(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!slug || hasIncremented.current) return;
    hasIncremented.current = true;

    fetch(`/api/views/${encodeURIComponent(slug)}`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: ViewCountResponse) => {
        setViews(data.views);
      })
      .catch(() => {
        // Gracefully degrade to 0 if the API is unavailable
        setViews(0);
      });
  }, [slug]);

  return views;
}

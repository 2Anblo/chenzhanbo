'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface VisitCountResponse {
  visits: number;
}

export default function SiteVisits() {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    fetch('/api/visits', { method: 'POST' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: VisitCountResponse) => {
        setCount(data.visits);
      })
      .catch(() => {
        // Gracefully degrade: hide the widget if the API fails.
        setCount(null);
      });
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <span className="text-xs text-muted-foreground">
      {t('common.siteVisits')}: {count.toLocaleString()}
    </span>
  );
}

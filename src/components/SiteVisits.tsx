'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface VisitCountResponse {
  visits: number;
  visitors: number;
  since: string;
  until: string;
}

export default function SiteVisits() {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visits')
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
    <span className="text-xs text-[#5F6368] font-mono">
      {t('common.siteVisits')}: {count.toLocaleString()}
    </span>
  );
}

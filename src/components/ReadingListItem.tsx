'use client';

import { ArrowUpRight, ChevronDown } from 'lucide-react';
import ReadingCover from '@/components/ReadingCover';
import { useTranslation } from '@/hooks/useTranslation';
import type { ReadingItem } from '@/types/reading';
import styles from './ReadingListItem.module.css';

export default function ReadingListItem({ item, expanded, onExpand, onCollapse, onToggle }: {
  item: ReadingItem;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onToggle: () => void;
}) {
  const { t, locale } = useTranslation();
  const detailsId = `reading-details-${item.id}`;

  return (
    <li className={styles.row} data-expanded={expanded}
      onPointerMove={(event) => {
        if (event.target instanceof Element && event.target.closest('button')) return;
        if (!expanded && event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) onExpand();
      }}
      onFocusCapture={(event) => { if (!(event.target instanceof HTMLButtonElement)) onExpand(); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onCollapse(); }}
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div className={styles.cover}>
          <ReadingCover key={item.image ?? item.kind} item={item} />
        </div>
        <div className={styles.body}>
          <div className={styles.heading}>
          <p className={styles.meta}>
            <span className="text-primary">{t(`reading.${item.kind}`)}</span>
            <span>{item.source}</span>
          </p>
          <h2 className={styles.title}>{item.title}</h2>
          </div>
          <div className={styles.excerpt} aria-hidden={expanded}>
            <p className="line-clamp-2">{item.summary[locale]}</p>
          </div>
          <div id={detailsId} className={styles.details} aria-hidden={!expanded}>
            <div className={styles.detailsInner}><p>{item.summary[locale]}</p></div>
          </div>
          <span className={styles.cta}>
            {t('reading.readOriginal')}
            <span className={styles.arrow}><ArrowUpRight size={14} aria-hidden="true" /></span>
          </span>
        </div>
      </a>
      <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls={detailsId}
        aria-label={`${t(expanded ? 'reading.collapse' : 'reading.expand')}: ${item.title}`}
        onClick={onToggle}>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </li>
  );
}

'use client';

import { useEffect, useCallback } from 'react';
import { useI18n } from '@/components/I18nProvider';

interface ImmersiveIntroProps {
  onEnter: () => void;
}

const INTRO_DURATION_MS = 6500;

export default function ImmersiveIntro({ onEnter }: ImmersiveIntroProps) {
  const { t } = useI18n();

  useEffect(() => {
    const timer = window.setTimeout(onEnter, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  const handleClick = useCallback(() => {
    onEnter();
  }, [onEnter]);

  return (
    <section
      className="intro-scene"
      aria-label="Zhanbo Chen intro animation"
      onClick={handleClick}
    >
      {/* Background layers */}
      <div className="intro-bg-noise" aria-hidden="true" />
      <div className="intro-bg-vignette" aria-hidden="true" />
      <div className="intro-bg-spot" aria-hidden="true" />
      <div className="intro-bg-beam" aria-hidden="true" />

      {/* Content */}
      <div className="intro-inner">
        <div className="intro-mark" aria-hidden="true">
          {t('intro.mark') ? <span>{t('intro.mark')}</span> : null}
        </div>

        <h1 className="sr-only">{t('common.name')}</h1>
        <div className="intro-title" aria-hidden="true">
          {t('intro.titlePrefix')}
          {t('intro.titleEm') ? <em>{t('intro.titleEm')}</em> : null}
        </div>

        <p className="intro-sub" aria-hidden="true">
          {t('intro.sub')
            .split('\n')
            .map((line, i) => (
              <span key={i}>
                {line}
                {i < t('intro.sub').split('\n').length - 1 && <br />}
              </span>
            ))}
        </p>

        <button
          type="button"
          className="intro-enter"
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
        >
          {t('intro.enter')}
        </button>

        <div className="intro-deco" aria-hidden="true">
          <div className="intro-deco-l" />
          <div className="intro-deco-dot" />
          <div className="intro-deco-l" />
        </div>
      </div>

      <div className="intro-footer">
        <span>{t('common.name')}</span>
        <span>{t('intro.skip')}</span>
      </div>
    </section>
  );
}

import type { Locale } from '@/lib/i18n/config';

export interface ReadingItem {
  id: string;
  kind: 'paper' | 'blog';
  title: string;
  summary: Record<Locale, string>;
  url: string;
  source: string;
  image?: string;
}

// Display order is editorial: add new entries at the top.
export const readingItems: ReadingItem[] = [
  {
    id: 'effective-red-teaming-policy-adherent-agents',
    kind: 'paper',
    title: 'Effective Red-Teaming of Policy-Adherent Agents',
    summary: {
      zh: '当 AI 客服需要遵守退款、取消订单等业务规则时，如何抵御用户的诱导？这篇论文提出多智能体红队系统 CRAFT，以及基于 τ-bench 的 τ-break 基准，评估智能体在对抗性对话中遵守规则的能力，并探索防御策略的局限。',
      en: 'How can customer-service agents uphold refund and cancellation policies under manipulation? This paper introduces CRAFT, a multi-agent red-teaming system, and τ-break, a benchmark built on τ-bench, to evaluate policy adherence under adversarial conversations and explore the limits of defensive strategies.',
    },
    url: 'https://arxiv.org/abs/2506.09600',
    source: 'arXiv · 2025',
    image: '/images/reading/craft.svg',
  },
];

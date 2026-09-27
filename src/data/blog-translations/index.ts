import type { BlogPostTranslation } from '@/types';
import embeddings from './en/2026-09-26-cs546-word-embeddings-negative-sampling-language-models-learning-notes.json';
import optimizers from './en/2026-09-13-cs546-gradient-clipping-lstm-gru-optimizer-learning-notes.json';
import rnn from './en/2026-09-12-cs546-embeddings-rnn-bptt-learning-notes.json';
import backprop from './en/2026-09-11-cs546-softmax-mlp-backprop-learning-notes.json';
import regression from './en/2026-09-07-cs546-linear-regression-gradient-descent-sgd-learning-notes.json';
import evaluation from './en/2026-08-26-agent-evaluation-from-benchmarks-to-enterprise-practice.json';
import llamaindex from './en/2026-08-03-llamaindex-rag-agents-workflows-notes.json';
import piMinimalism from './en/2026-08-02-pi-agent-harness-minimalism-notes.json';
import piFirst from './en/2026-08-01-pi-agent-harness-first-notes.json';
import smolagents from './en/2026-07-28-smolagents-tools-and-rag-deep-dive.json';
import typora from './en/typora-picgo-r2-outputurl-pattern-trap.json';
import claudeCode from './en/claude-code-powershell-alias-bypass.json';

export const blogTranslations: Record<string, BlogPostTranslation & { sourceHash: string }> = {
  '2026-09-26-cs546-word-embeddings-negative-sampling-language-models-learning-notes': embeddings,
  '2026-09-13-cs546-gradient-clipping-lstm-gru-optimizer-learning-notes': optimizers,
  '2026-09-12-cs546-embeddings-rnn-bptt-learning-notes': rnn,
  '2026-09-11-cs546-softmax-mlp-backprop-learning-notes': backprop,
  '2026-09-07-cs546-linear-regression-gradient-descent-sgd-learning-notes': regression,
  '2026-08-26-agent-evaluation-from-benchmarks-to-enterprise-practice': evaluation,
  '2026-08-03-llamaindex-rag-agents-workflows-notes': llamaindex,
  '2026-08-02-pi-agent-harness-minimalism-notes': piMinimalism,
  '2026-08-01-pi-agent-harness-first-notes': piFirst,
  '2026-07-28-smolagents-tools-and-rag-deep-dive': smolagents,
  'typora-picgo-r2-outputurl-pattern-trap': typora,
  'claude-code-powershell-alias-bypass': claudeCode,
};

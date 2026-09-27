import type { ProjectTranslation } from '@/types';

export const projectTranslations: Record<string, ProjectTranslation> = {
  'online-coding-training-platform': {
    title: 'Online Programming Training Platform',
    subtitle: 'A microservices-based coding practice system with large language model support',
    description: 'An online judge and intelligent Q&A system built on Spring Cloud Alibaba, with a multilingual code sandbox and extensible judging strategies.',
    background: 'A single platform for problem management, code submissions, online judging, and AI-assisted Q&A, designed to make programming practice more efficient.',
    content: 'Details of the Online Programming Training Platform.',
    contributions: [
      'Built a microservices architecture with Spring Cloud Alibaba, separating user, problem, judging, and intelligent Q&A services.',
      'Used Nacos for service registration and discovery to support reliable calls between services.',
      'Designed the online judging module and a Docker-based execution sandbox to isolate submitted code, evaluate results, and record execution details.',
      'Applied the strategy and factory patterns to separate language-specific judging logic and execution environments, making the system easier to extend.',
    ],
    highlights: [
      'Extensible judging for multiple programming languages',
      'Isolated code execution in Docker',
      'Microservices architecture with LLM-powered Q&A',
    ],
  },
  musiclens: {
    title: 'MusicLens AI Music Creation and Analysis Platform',
    subtitle: 'AI-powered music generation, sentiment analysis, and work management',
    description: 'A decoupled AI music platform offering music generation, work management, sentiment analysis, AI cover art, and text recognition in images.',
    background: 'Explores how AI can lower the barrier to music creation and provide a single workflow from generation to analysis.',
    content: 'Details of the MusicLens AI Music Creation and Analysis Platform.',
    contributions: [
      'Designed a decoupled architecture and built back-end services for users and administrators with Spring Boot.',
      'Built a separate FastAPI service around Python AI capabilities, including music sentiment analysis.',
      'Integrated third-party AI services for music generation from prompts and lyrics, AI cover generation, and OCR.',
    ],
    highlights: [
      'Music generation and sentiment analysis in one platform',
      'Two-service architecture with Spring Boot and FastAPI',
      'AI cover generation and OCR',
    ],
  },
};

import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'coding-training-platform',
    title: '在线编程训练平台',
    subtitle: '基于微服务架构与大语言模型的智能刷题系统',
    description: '基于 Spring Cloud Alibaba 搭建的微服务架构在线判题与智能问答系统，支持多语言代码沙箱、智能问答与可扩展判题策略。',
    background: '为提升编程训练效率，构建覆盖题目管理、代码提交、在线判题与 AI 辅助问答的一站式平台。',
    techStack: ['Java', 'Spring Cloud Alibaba', 'Spring Boot', 'Nacos', 'Docker', 'MySQL', 'Redis', 'LLM'],
    contributions: [
      '基于 Spring Cloud Alibaba 搭建微服务架构，拆分为用户服务、题目服务、判题服务、智能问答服务等模块',
      '通过 Nacos 实现服务注册与发现，保障微服务间的高可用调用',
      '设计在线判题模块，基于 Docker 构建代码执行沙箱，实现用户代码隔离运行、结果评测与执行信息记录',
      '在判题系统中引入策略模式和工厂模式，抽象不同语言判题逻辑及代码执行环境，提升系统扩展能力'
    ],
    highlights: [
      '支持多语言判题扩展',
      '基于 Docker 的隔离代码执行沙箱',
      '微服务架构 + 大语言模型智能问答'
    ],
    githubUrl: 'https://github.com/2Anblo',
    category: 'microservices'
  },
  {
    id: 'musiclens',
    title: 'MusicLens AI 音乐创作与分析平台',
    subtitle: 'AI 驱动的音乐生成、情绪分析与作品管理平台',
    description: '前后端分离的 AI 音乐平台，提供音乐生成、作品管理、情绪分析、AI 封面生成与图片文字识别等能力。',
    background: '探索 AI 在音乐创作领域的应用，降低音乐创作门槛，提供从生成到分析的一站式服务。',
    techStack: ['Spring Boot', 'FastAPI', 'Python', 'AI API', 'Vue.js', 'MySQL'],
    contributions: [
      '设计并实现前后端分离架构，基于 Spring Boot 构建用户端与管理端后端服务',
      '搭建独立 AI 服务模块，基于 FastAPI 封装 Python AI 能力，完成音乐情绪分析等智能功能',
      '集成第三方 AI 服务，实现基于提示词和歌词的音乐生成、AI 封面生成以及图片文字识别'
    ],
    highlights: [
      '音乐生成 + 情绪分析一体化',
      'Spring Boot + FastAPI 双服务架构',
      'AI 封面生成与 OCR 能力集成'
    ],
    githubUrl: 'https://github.com/2Anblo/musiclens',
    category: 'ai'
  }
];

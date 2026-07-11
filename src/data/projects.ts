import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'ai-agent-rag',
    title: 'AI Agent Knowledge Hub',
    subtitle: '智能知识库问答系统',
    description: '基于 Spring AI + LLM + RAG 架构的智能知识库问答系统，支持多数据源接入、文档自动解析、向量化存储与智能检索。系统能够理解自然语言查询，从大量文档中精准定位答案，并支持多轮对话上下文理解。',
    background: '在企业知识管理场景中，传统搜索无法满足复杂查询需求。本项目旨在构建一个能够理解语义、支持对话的 AI 知识助手，提升信息检索效率。',
    techStack: ['Java 17', 'Spring Boot 3.x', 'Spring AI', 'OpenAI API', 'PostgreSQL', 'pgvector', 'Redis', 'Docker'],
    contributions: [
      '设计并实现 RAG (Retrieval-Augmented Generation) 完整链路，包括文档分块、向量化、检索与重排序',
      '基于 Spring AI 框架封装 LLM 调用层，支持多模型切换与 Fallback 机制',
      '实现文档智能解析模块，支持 PDF、Word、Markdown 等多种格式的自动提取与清洗',
      '构建对话上下文管理引擎，支持多轮对话的意图识别与上下文保持',
      '设计并实现向量数据库的混合检索策略 (Dense + Sparse)，提升检索准确率 35%'
    ],
    highlights: [
      'RAG 检索准确率达到 92%，端到端响应时间 < 2s',
      '支持百万级文档的向量化存储与秒级检索',
      '实现完整的 Agent 工作流：规划 → 执行 → 观察 → 反思'
    ],
    githubUrl: 'https://github.com/2Anblo/ai-agent-knowledge-hub',
    category: 'ai'
  },
  {
    id: 'microservices-platform',
    title: 'Cloud Native Microservices Platform',
    subtitle: '云原生微服务平台',
    description: '一套完整的企业级微服务基础架构平台，包含服务注册发现、配置中心、网关路由、分布式追踪、监控告警等核心能力。采用 Spring Cloud 技术栈，支持容器化部署与弹性伸缩。',
    background: '微服务架构已成为现代后端开发的标准模式。本项目从零搭建一套完整的微服务基础设施，为上层业务应用提供稳定、可观测的运行环境。',
    techStack: ['Java 17', 'Spring Boot', 'Spring Cloud Gateway', 'Nacos', 'Sentinel', 'Seata', 'MySQL', 'Redis', 'RocketMQ', 'Prometheus', 'Grafana'],
    contributions: [
      '搭建基于 Nacos 的服务注册发现与动态配置中心',
      '实现 Spring Cloud Gateway 动态路由与限流熔断策略',
      '集成 Sentinel 实现流量控制与系统自适应保护',
      '基于 Seata 实现分布式事务的 AT 模式，保证数据一致性',
      '构建完整的可观测性体系：日志聚合 (ELK) + 指标监控 (Prometheus) + 链路追踪 (SkyWalking)'
    ],
    highlights: [
      '网关 QPS 达到 10,000+，P99 延迟 < 50ms',
      '实现零停机的灰度发布与蓝绿部署',
      '完整的 DevOps 流水线：CI/CD + 自动化测试 + 容器化部署'
    ],
    githubUrl: 'https://github.com/2Anblo/microservices-platform',
    category: 'microservices'
  },
  {
    id: 'algorithm-lab',
    title: 'Algorithm Lab',
    subtitle: '算法可视化实验室',
    description: '一个交互式的算法学习平台，将经典数据结构与算法以可视化的方式呈现。支持排序算法、图算法、树结构操作等多种算法的逐步演示，帮助理解算法执行过程。',
    background: '数据结构与算法是计算机科学的基石。本项目通过可视化手段，将抽象的算法逻辑转化为直观的视觉表现，降低学习门槛。',
    techStack: ['TypeScript', 'React', 'HTML5 Canvas', 'Tailwind CSS'],
    contributions: [
      '设计并实现多种排序算法的可视化引擎 (冒泡、快排、归并、堆排序)',
      '构建图算法的交互式演示 (BFS、DFS、Dijkstra、A*)',
      '实现二叉树、AVL 树、红黑树的动态操作可视化',
      '设计步骤控制面板，支持暂停、单步执行、调速等功能'
    ],
    highlights: [
      '支持 15+ 种经典算法的可视化',
      '流畅的动画渲染，60fps 性能表现',
      '纯前端实现，无需后端服务'
    ],
    githubUrl: 'https://github.com/2Anblo/algorithm-lab',
    category: 'personal'
  }
];

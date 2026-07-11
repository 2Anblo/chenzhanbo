import type { ResumeData } from '@/types';

export const resumeData: ResumeData = {
  name: '陈展博',
  title: 'Java 后端开发 | AI Agent 开发',
  summary: '计算机科学与技术专业学生，专注于 Java 后端开发与 AI 应用开发。具备扎实的计算机科学基础，熟悉 Spring 生态、微服务架构和大语言模型应用开发。热衷于探索 AI Agent、RAG 等前沿技术在实际业务场景中的应用，致力于构建高效、可扩展的后端系统与智能化应用。',
  education: [
    {
      school: '伊利诺伊大学厄巴纳-香槟分校',
      major: '计算机科学',
      degree: '硕士',
      startDate: '2026-08',
      endDate: '2028-05',
      description: 'Rank: N/A'
    },
    {
      school: '首都师范大学',
      major: '计算机科学与技术',
      degree: '学士',
      startDate: '2022-09',
      endDate: '2026-07',
      description: 'Rank: 5%'
    }
  ],
  skills: [
    { name: 'Java', description: '核心语言，精通集合框架、并发编程、JVM 调优', category: 'backend', proficiency: 90 },
    { name: 'Spring Boot', description: '主力框架，熟悉自动配置、AOP、事务管理', category: 'backend', proficiency: 88 },
    { name: 'Spring Cloud', description: '微服务全家桶：Gateway、Nacos、Sentinel、Seata', category: 'backend', proficiency: 82 },
    { name: 'MySQL', description: '关系型数据库，擅长索引优化、慢查询分析、分库分表', category: 'backend', proficiency: 85 },
    { name: 'Redis', description: '缓存与消息队列，熟悉数据结构、持久化、集群模式', category: 'backend', proficiency: 83 },
    { name: 'MyBatis', description: 'ORM 框架，精通动态 SQL、插件机制、源码原理', category: 'backend', proficiency: 87 },
    { name: 'Docker', description: '容器化部署，熟悉镜像构建、网络配置、编排管理', category: 'tools', proficiency: 78 },
    { name: 'Git', description: '版本控制，熟练分支管理、Rebase、Cherry-pick', category: 'tools', proficiency: 90 },
    { name: 'Linux', description: '服务器运维，熟悉常用命令、Shell 脚本、性能监控', category: 'tools', proficiency: 75 },
    { name: 'Spring AI', description: 'AI 集成框架，熟悉 ChatClient、VectorStore、RAG 链路', category: 'ai', proficiency: 80 },
    { name: 'RAG', description: '检索增强生成，掌握文档分块、向量化、混合检索策略', category: 'ai', proficiency: 78 },
    { name: 'AI Agent', description: '智能体开发，理解 ReAct、Function Calling、记忆系统', category: 'ai', proficiency: 75 },
  ],
  projects: [
    {
      id: 'ai-agent-rag',
      title: 'AI Agent Knowledge Hub',
      subtitle: '智能知识库问答系统',
      description: '基于 Spring AI + LLM + RAG 架构的智能知识库问答系统',
      background: '企业知识管理场景',
      techStack: ['Java 17', 'Spring Boot 3.x', 'Spring AI', 'PostgreSQL', 'pgvector', 'Redis'],
      contributions: ['实现 RAG 完整链路', '基于 Spring AI 封装 LLM 调用层', '构建对话上下文管理引擎'],
      highlights: ['检索准确率 92%', '支持百万级文档'],
      githubUrl: 'https://github.com/czbczb/ai-agent-knowledge-hub',
      category: 'ai'
    },
    {
      id: 'microservices-platform',
      title: 'Cloud Native Microservices Platform',
      subtitle: '云原生微服务平台',
      description: '企业级微服务基础架构平台',
      background: '微服务基础设施搭建',
      techStack: ['Java 17', 'Spring Boot', 'Spring Cloud', 'Nacos', 'Sentinel', 'MySQL', 'Redis', 'RocketMQ'],
      contributions: ['搭建服务注册发现中心', '实现动态路由与限流熔断', '构建完整可观测性体系'],
      highlights: ['网关 QPS 10,000+', '零停机灰度发布'],
      githubUrl: 'https://github.com/czbczb/microservices-platform',
      category: 'microservices'
    }
  ],
  experience: [],
  contact: {
    email: 'czbczb@sina.com',
    github: 'https://github.com/czbczb',
    linkedin: 'https://linkedin.com/in/czbczb'
  }
};

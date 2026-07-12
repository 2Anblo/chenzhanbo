import type { ResumeData } from '@/types';

export const resumeData: ResumeData = {
  name: '陈展博',
  title: 'AI 应用开发工程师',
  summary: '硕士就读于伊利诺伊大学厄巴纳-香槟分校计算机科学专业，本科毕业于首都师范大学计算机科学与技术专业（Rank 5%）。专注于 AI 应用开发与 Java 后端工程，具备微服务架构、Docker 沙箱、LLM 集成等实践经验。曾参与国家新能源汽车技术创新中心自动驾驶仿真项目，主导在线编程训练平台与 AI 音乐创作平台开发。',
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
    { name: 'Java', description: '核心开发语言，熟悉高并发、JVM、Spring 生态', category: 'backend', proficiency: 90 },
    { name: 'Spring Boot', description: '主力后端框架，熟悉 RESTful API 设计与微服务拆分', category: 'backend', proficiency: 88 },
    { name: 'Spring Cloud Alibaba', description: '微服务架构：Nacos、Gateway、服务注册与发现', category: 'backend', proficiency: 82 },
    { name: 'Docker', description: '容器化与代码沙箱构建，熟悉镜像、网络与隔离运行', category: 'backend', proficiency: 80 },
    { name: 'JavaScript / ES6', description: '前端与全栈开发，熟悉 Vue.js、Node.js', category: 'backend', proficiency: 78 },
    { name: 'AI / LLM 集成', description: '大语言模型应用开发，FastAPI 封装 Python AI 能力', category: 'ai', proficiency: 82 },
    { name: 'Git / Linux', description: '团队协作流程、版本控制、Linux 运维与部署', category: 'tools', proficiency: 85 },
    { name: '计算机基础', description: '计算机网络、算法与数据结构、操作系统、计算机组成原理', category: 'tools', proficiency: 80 },
  ],
  projects: [],
  experience: [
    {
      company: '国家新能源汽车技术创新中心（NEVC）',
      role: '软件开发实习生',
      period: '2024.08 - 2024.11',
      description: '基于 VTD、ROD、ScenarioEditor 等仿真工具创建并验证自动驾驶测试场景；优化 Vue.js 前端页面。相关技术：Vue.js / Node.js / Java。'
    }
  ],
  contact: {
    email: 'zhanboc2@illinois.edu',
    github: 'https://github.com/2Anblo',
    linkedin: ''
  }
};

import type { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '深入理解 Spring AI 与 RAG 架构',
    excerpt: '从原理到实践，全面解析 Spring AI 框架的核心设计理念，以及 RAG (Retrieval-Augmented Generation) 架构在知识库问答系统中的应用。',
    content: `## 引言

随着大语言模型 (LLM) 的快速发展，如何将 LLM 与企业内部知识相结合成为一个关键课题。Spring AI 作为 Spring 生态的 AI 集成框架，为 Java 开发者提供了优雅的解决方案。

## 什么是 RAG？

RAG (Retrieval-Augmented Generation) 是一种将信息检索与文本生成相结合的技术架构。其核心思想是：

1. **检索 (Retrieval)**：从外部知识库中检索与查询相关的文档片段
2. **增强 (Augmentation)**：将检索到的上下文信息注入到 LLM 的提示词中
3. **生成 (Generation)**：基于增强后的提示词生成最终回答

## Spring AI 核心组件

### 1. ChatClient

\`\`\`java
ChatClient chatClient = ChatClient.builder(openAiChatModel)
    .defaultSystem("你是一个专业的技术助手")
    .build();

String response = chatClient.prompt()
    .user("解释什么是微服务架构")
    .call()
    .content();
\`\`\`

### 2. VectorStore

Spring AI 提供了统一的 VectorStore 抽象：

\`\`\`java
@Autowired
private VectorStore vectorStore;

public void storeDocuments(List<Document> documents) {
    vectorStore.add(documents);
}

public List<Document> search(String query) {
    return vectorStore.similaritySearch(
        SearchRequest.query(query).withTopK(5)
    );
}
\`\`\`

## RAG 实现流程

### 文档处理流水线

\`\`\`
原始文档 → 文档解析 → 文本分块 → 向量化 → 存储到 Vector DB
\`\`\`

### 查询处理流水线

\`\`\`
用户查询 → 查询向量化 → 相似度检索 → 上下文组装 → LLM 生成
\`\`\`

## 最佳实践

1. **文档分块策略**：根据文档类型选择合适的分块大小和重叠度
2. **混合检索**：结合 Dense Retrieval 和 Keyword Matching
3. **重排序 (Reranking)**：使用 Cross-Encoder 对初筛结果进行精排
4. **提示工程**：设计系统提示词引导 LLM 基于上下文回答

## 总结

Spring AI 极大地简化了 Java 开发者集成 LLM 的复杂度。结合 RAG 架构，可以构建出既具备通用能力、又了解企业私域知识的智能应用。`,
    category: 'AI Agent',
    tags: ['Spring AI', 'RAG', 'LLM', 'Java'],
    publishedAt: '2024-12-15',
    readingTime: 12,
    slug: 'spring-ai-rag-architecture'
  },
  {
    id: '2',
    title: 'Java 并发编程实战：从 synchronized 到 StampedLock',
    excerpt: '系统梳理 Java 并发编程的核心机制，从基础的 synchronized 关键字到高级的 JUC 工具类，深入理解锁的原理与性能优化策略。',
    content: `## Java 并发编程概览

Java 提供了丰富的并发编程工具，从早期的 \`synchronized\` 到现代 JUC 包中的高级工具类。

## synchronized 关键字

\`\`\`java
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
}
\`\`\`

### 底层原理

synchronized 基于 Monitor 机制实现，涉及对象头的 Mark Word 中的锁标志位。

## ReentrantLock

\`\`\`java
ReentrantLock lock = new ReentrantLock();

try {
    lock.lock();
    // 临界区
} finally {
    lock.unlock();
}
\`\`\`

## ReadWriteLock

读写锁适用于读多写少的场景：

\`\`\`java
ReadWriteLock rwLock = new ReentrantReadWriteLock();
Lock readLock = rwLock.readLock();
Lock writeLock = rwLock.writeLock();
\`\`\`

## StampedLock

JDK 8 引入的乐观锁实现：

\`\`\`java
StampedLock lock = new StampedLock();

long stamp = lock.tryOptimisticRead();
// 读取数据
if (!lock.validate(stamp)) {
    stamp = lock.readLock();
    try {
        // 重新读取
    } finally {
        lock.unlockRead(stamp);
    }
}
\`\`\`

## 性能对比

| 锁类型 | 适用场景 | 吞吐量 |
|--------|----------|--------|
| synchronized | 简单同步 | 中 |
| ReentrantLock | 需要灵活控制 | 高 |
| ReadWriteLock | 读多写少 | 很高 |
| StampedLock | 读极多写极少 | 最高 |

## 总结

选择合适的锁机制需要综合考虑并发度、读写比例和代码复杂度。`,
    category: 'Java',
    tags: ['Java', 'Concurrency', 'JUC', 'Performance'],
    publishedAt: '2024-11-20',
    readingTime: 15,
    slug: 'java-concurrency-from-synchronized-to-stampedlock'
  },
  {
    id: '3',
    title: '基于 Spring Cloud Gateway 构建高性能 API 网关',
    excerpt: '详解 Spring Cloud Gateway 的核心架构、路由机制、过滤器链以及生产环境下的性能调优策略。',
    content: `## API 网关的作用

API 网关是微服务架构的统一入口，承担路由转发、认证授权、限流熔断、日志记录等横切关注点。

## Spring Cloud Gateway 架构

基于 Spring 5 + WebFlux + Reactor 构建，采用异步非阻塞模型。

### 核心概念

1. **Route**：路由规则，包含 ID、目标 URI、断言集合和过滤器集合
2. **Predicate**：匹配条件，决定请求是否走该路由
3. **Filter**：对请求或响应进行处理

## 路由配置

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - Retry=3
\`\`\`

## 自定义过滤器

\`\`\`java
@Component
public class AuthFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest()
            .getHeaders().getFirst("Authorization");
        if (token == null || !validate(token)) {
            return unauthorized(exchange);
        }
        return chain.filter(exchange);
    }
}
\`\`\`

## 性能优化

1. **连接池调优**：调整 Netty 的 worker 线程数
2. **响应缓存**：对热点数据启用网关级缓存
3. **异步处理**：充分利用 Reactor 的异步特性
4. **JVM 参数**：G1 垃圾收集器 + 合理的堆内存配置

## 监控与告警

集成 Prometheus + Grafana 实现：
- 请求 QPS、P99 延迟
- 路由命中率
- 熔断器状态
- JVM 内存与 GC 情况`,
    category: 'Spring Boot',
    tags: ['Spring Cloud', 'Gateway', 'Microservices', 'Performance'],
    publishedAt: '2024-10-08',
    readingTime: 10,
    slug: 'spring-cloud-gateway-high-performance-api'
  },
  {
    id: '4',
    title: '构建 AI Agent：从 ReAct 到 Function Calling',
    excerpt: '探索 AI Agent 的核心架构模式，深入理解 ReAct (Reasoning + Acting) 框架和 Function Calling 机制的实现原理。',
    content: `## AI Agent 的本质

AI Agent = LLM + 工具使用 + 规划能力 + 记忆系统

## ReAct 框架

ReAct (Reasoning + Acting) 是一种让 LLM 交替进行思考和行动的框架。

### 核心循环

\`\`\`
Thought → Action → Observation → Thought → ...
\`\`\`

## Function Calling

OpenAI 引入的 Function Calling 机制允许 LLM 输出结构化的函数调用：

\`\`\`python
functions = [
    {
        "name": "search_knowledge",
        "description": "从知识库中搜索信息",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string"}
            },
            "required": ["query"]
        }
    }
]
\`\`\`

## Agent 工作流设计

### 规划 (Planning)

- 任务分解：将复杂任务拆解为子任务
- 依赖分析：确定子任务之间的执行顺序

### 执行 (Execution)

- 工具选择：根据当前状态选择合适的工具
- 参数构造：动态生成工具调用参数

### 观察 (Observation)

- 结果解析：将工具输出转化为内部状态
- 错误处理：处理工具调用失败的情况

## 记忆系统

1. **短期记忆**：当前对话上下文
2. **长期记忆**：历史对话摘要 + 向量检索
3. **实体记忆**：提取并维护关键实体信息

## 实践建议

1. 工具设计要遵循单一职责原则
2. 设置最大迭代次数防止死循环
3. 实现完善的日志记录便于调试
4. 考虑引入人类反馈机制 (Human-in-the-loop)`,
    category: 'AI Agent',
    tags: ['AI Agent', 'LLM', 'ReAct', 'Function Calling'],
    publishedAt: '2024-09-25',
    readingTime: 18,
    slug: 'building-ai-agent-react-to-function-calling'
  }
];

export const blogCategories = [
  'Java',
  'Spring Boot',
  'AI Agent',
  'RAG',
  'Algorithm',
  'Learning Notes'
];

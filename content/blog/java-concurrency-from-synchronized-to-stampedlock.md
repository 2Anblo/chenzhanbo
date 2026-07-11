---
id: '2'
title: 'Java 并发编程实战：从 synchronized 到 StampedLock'
excerpt: '系统梳理 Java 并发编程的核心机制，从基础的 synchronized 关键字到高级的 JUC 工具类，深入理解锁的原理与性能优化策略。'
category: 'Java'
tags: ['Java', 'Concurrency', 'JUC', 'Performance']
date: '2024-11-20'
readingTime: 15
slug: 'java-concurrency-from-synchronized-to-stampedlock'
---

## Java 并发编程概览

Java 提供了丰富的并发编程工具，从早期的 `synchronized` 到现代 JUC 包中的高级工具类。

## synchronized 关键字

```java
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
}
```

### 底层原理

synchronized 基于 Monitor 机制实现，涉及对象头的 Mark Word 中的锁标志位。

## ReentrantLock

```java
ReentrantLock lock = new ReentrantLock();

try {
    lock.lock();
    // 临界区
} finally {
    lock.unlock();
}
```

## ReadWriteLock

读写锁适用于读多写少的场景：

```java
ReadWriteLock rwLock = new ReentrantReadWriteLock();
Lock readLock = rwLock.readLock();
Lock writeLock = rwLock.writeLock();
```

## StampedLock

JDK 8 引入的乐观锁实现：

```java
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
```

## 性能对比

| 锁类型 | 适用场景 | 吞吐量 |
|--------|----------|--------|
| synchronized | 简单同步 | 中 |
| ReentrantLock | 需要灵活控制 | 高 |
| ReadWriteLock | 读多写少 | 很高 |
| StampedLock | 读极多写极少 | 最高 |

## 总结

选择合适的锁机制需要综合考虑并发度、读写比例和代码复杂度。

---
id: '5'
title: 'Claude Code 使用技巧：PowerShell Alias 与权限 Bypass'
excerpt: '在 Windows PowerShell 中为 Claude Code 设置快捷 alias c-d，并默认使用 --dangerously-skip-permissions 启动，减少重复输入与权限确认。'
category: 'Learning Notes'
tags: ['Claude Code', 'PowerShell', 'Alias', 'CLI']
date: '2026-07-11'
readingTime: 3
slug: 'claude-code-powershell-alias-bypass'
---

## 引言

最近把 Claude Code 当作日常编码助手，每次在 Windows PowerShell 里都要敲完整的：

```powershell
claude --dangerously-skip-permissions
```

手酸。于是给 PowerShell 加了个 alias，按 `c-d` 就能直接进 Claude Code。

## 修改 PowerShell 配置文件

PowerShell 的配置文件路径保存在 `$PROFILE` 变量里。最方便的修改方式是用记事本打开：

```powershell
notepad $PROFILE
```

如果提示文件不存在，先创建它：

```powershell
New-Item -Path $PROFILE -Type File -Force
```

然后再执行：

```powershell
notepad $PROFILE
```

## 添加 Claude Code Alias

在配置文件末尾加入：

```powershell
function c-d {
    claude --dangerously-skip-permissions
}
```

保存并关闭记事本。

> Claude Code 官方支持权限模式配置，可以通过权限设置管理 allow/deny 规则；`--dangerously-skip-permissions` 是直接跳过权限确认的方式。

## 使用

以后重新打开 PowerShell，直接输入：

```powershell
c-d
```

就等价于：

```powershell
claude --dangerously-skip-permissions
```

Claude Code 会立即启动，不再反复询问权限。

## 小提示

- 如果修改 `$PROFILE` 后没有生效，可以执行 `. $PROFILE` 重新加载，或重启 PowerShell。
- 不同 PowerShell 版本（Windows PowerShell 5.x / PowerShell 7+）的 `$PROFILE` 可能是分开的，需要各自配置。
- 想要更语义化的名字，也可以把函数改成 `cca`、`clauded` 等。

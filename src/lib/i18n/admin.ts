import type { Locale } from './config';

// Shared vocabulary for server-rendered admin pages and interactive editors.
export const adminMessages: Record<string, { zh: string; en: string }> = {
  "Personal": { "zh": "个人项目", "en": "Personal" },
  "AI applications": { "zh": "AI 应用", "en": "AI applications" },
  "Microservices": { "zh": "微服务", "en": "Microservices" },
  "Choose image": { "zh": "选择图片", "en": "Choose image" },
  "Dashboard": {
    "en": "Dashboard",
    "zh": "控制台"
  },
  "Blog": {
    "en": "Blog",
    "zh": "博客"
  },
  "Projects": {
    "en": "Projects",
    "zh": "项目"
  },
  "Admin": {
    "en": "Admin",
    "zh": "后台"
  },
  "Logout": {
    "en": "Logout",
    "zh": "退出登录"
  },
  "Back": {
    "en": "Back",
    "zh": "返回"
  },
  "Back to Home": {
    "en": "Back to Home",
    "zh": "返回首页"
  },
  "Back to Dashboard": {
    "en": "Back to Dashboard",
    "zh": "返回控制台"
  },
  "Blog Posts": {
    "en": "Blog Posts",
    "zh": "博客文章"
  },
  "Manage your blog posts and projects.": {
    "en": "Manage your blog posts and projects.",
    "zh": "管理博客、项目与阅览内容。"
  },
  "Manage technical writing and notes.": {
    "en": "Manage technical writing and notes.",
    "zh": "管理技术文章和笔记。"
  },
  "Manage portfolio case studies.": {
    "en": "Manage portfolio case studies.",
    "zh": "管理项目案例。"
  },
  "View all": {
    "en": "View all",
    "zh": "查看全部"
  },
  "New": {
    "en": "New",
    "zh": "新增"
  },
  "Recent Updates": {
    "en": "Recent Updates",
    "zh": "最近更新"
  },
  "Last modified content.": {
    "en": "Last modified content.",
    "zh": "最近修改的内容。"
  },
  "No content yet. Create your first post or project.": {
    "en": "No content yet. Create your first post or project.",
    "zh": "暂无内容，开始创建文章或项目。"
  },
  "Manage your portfolio projects.": {
    "en": "Manage your portfolio projects.",
    "zh": "管理你的项目。"
  },
  "All Projects": {
    "en": "All Projects",
    "zh": "全部项目"
  },
  "No projects yet.": {
    "en": "No projects yet.",
    "zh": "暂无项目。"
  },
  "Manage your blog posts.": {
    "en": "Manage your blog posts.",
    "zh": "管理你的博客文章。"
  },
  "All Posts": {
    "en": "All Posts",
    "zh": "全部文章"
  },
  "No blog posts yet.": {
    "en": "No blog posts yet.",
    "zh": "暂无博客文章。"
  },
  "Edit": {
    "en": "Edit",
    "zh": "编辑"
  },
  "Delete": {
    "en": "Delete",
    "zh": "删除"
  },
  "New Post": {
    "en": "New Post",
    "zh": "新增文章"
  },
  "Edit Post": {
    "en": "Edit Post",
    "zh": "编辑文章"
  },
  "New Project": {
    "en": "New Project",
    "zh": "新增项目"
  },
  "Edit Project": {
    "en": "Edit Project",
    "zh": "编辑项目"
  },
  "Title *": {
    "en": "Title *",
    "zh": "标题 *"
  },
  "Slug": {
    "en": "Slug",
    "zh": "网址标识"
  },
  "Slug *": {
    "en": "Slug *",
    "zh": "网址标识 *"
  },
  "Leave blank to use a date timestamp": {
    "en": "Leave blank to use a date timestamp",
    "zh": "留空自动生成日期标识"
  },
  "The slug cannot be changed after creation.": {
    "en": "The slug cannot be changed after creation.",
    "zh": "创建后无法修改网址标识。"
  },
  "Optional. Leave blank to generate a UTC date timestamp when saving.": {
    "en": "Optional. Leave blank to generate a UTC date timestamp when saving.",
    "zh": "可选，留空则在保存时自动生成日期标识。"
  },
  "Categories *": {
    "en": "Categories *",
    "zh": "分类 *"
  },
  "Published Date *": {
    "en": "Published Date *",
    "zh": "发布日期 *"
  },
  "Excerpt *": {
    "en": "Excerpt *",
    "zh": "概要 *"
  },
  "Tags (comma separated)": {
    "en": "Tags (comma separated)",
    "zh": "标签（逗号分隔）"
  },
  "Reading Time (minutes)": {
    "en": "Reading Time (minutes)",
    "zh": "阅读时长（分钟）"
  },
  "Auto": {
    "en": "Auto",
    "zh": "自动"
  },
  "Auto-calculate from Markdown": {
    "en": "Auto-calculate from Markdown",
    "zh": "根据正文自动计算"
  },
  "CJK characters +": {
    "en": "CJK characters +",
    "zh": "中日韩字符 +"
  },
  "words": {
    "en": "words",
    "zh": "单词"
  },
  "min estimated": {
    "en": "min estimated",
    "zh": "分钟预计阅读"
  },
  "Cover Image Path": {
    "en": "Cover Image Path",
    "zh": "封面图片路径"
  },
  "Preview": {
    "en": "Preview",
    "zh": "预览"
  },
  "Markdown Content *": {
    "en": "Markdown Content *",
    "zh": "Markdown 正文 *"
  },
  "Markdown Content": {
    "en": "Markdown Content",
    "zh": "Markdown 正文"
  },
  "English version": {
    "en": "English version",
    "zh": "英文内容"
  },
  "Shown when visitors switch to English. Keep code and math unchanged.": {
    "en": "Shown when visitors switch to English. Keep code and math unchanged.",
    "zh": "访客切换到英文时显示，请保留代码和公式。"
  },
  "English title *": {
    "en": "English title *",
    "zh": "英文标题 *"
  },
  "English excerpt *": {
    "en": "English excerpt *",
    "zh": "英文概要 *"
  },
  "English Markdown content *": {
    "en": "English Markdown content *",
    "zh": "英文 Markdown 正文 *"
  },
  "Saving...": {
    "en": "Saving...",
    "zh": "保存中…"
  },
  "Update Post": {
    "en": "Update Post",
    "zh": "更新文章"
  },
  "Create Post": {
    "en": "Create Post",
    "zh": "创建文章"
  },
  "Cancel": {
    "en": "Cancel",
    "zh": "取消"
  },
  "Subtitle *": {
    "en": "Subtitle *",
    "zh": "副标题 *"
  },
  "Category *": {
    "en": "Category *",
    "zh": "分类 *"
  },
  "Date": {
    "en": "Date",
    "zh": "日期"
  },
  "Description *": {
    "en": "Description *",
    "zh": "描述 *"
  },
  "Background *": {
    "en": "Background *",
    "zh": "背景 *"
  },
  "GitHub URL *": {
    "en": "GitHub URL *",
    "zh": "GitHub 链接 *"
  },
  "Demo URL": {
    "en": "Demo URL",
    "zh": "演示链接"
  },
  "Tech Stack (one per line)": {
    "en": "Tech Stack (one per line)",
    "zh": "技术栈（每行一项）"
  },
  "Contributions (one per line)": {
    "en": "Contributions (one per line)",
    "zh": "贡献（每行一项）"
  },
  "Highlights (one per line)": {
    "en": "Highlights (one per line)",
    "zh": "亮点（每行一项）"
  },
  "Project Image Path": {
    "en": "Project Image Path",
    "zh": "项目图片路径"
  },
  "Edit Markdown": {
    "en": "Edit Markdown",
    "zh": "编辑 Markdown"
  },
  "English": {
    "en": "English",
    "zh": "英文"
  },
  "Update Project": {
    "en": "Update Project",
    "zh": "更新项目"
  },
  "Create Project": {
    "en": "Create Project",
    "zh": "创建项目"
  },
  "Please select at least one category.": {
    "en": "Please select at least one category.",
    "zh": "请至少选择一个分类。"
  },
  "Failed to save": {
    "en": "Failed to save",
    "zh": "保存失败，请稍后重试。"
  },
  "Invalid slug": {
    "en": "Invalid slug",
    "zh": "网址标识无效。"
  },
  "At least one valid category is required": {
    "en": "At least one valid category is required",
    "zh": "请至少选择一个有效分类。"
  },
  "English title, excerpt, and content are required": {
    "en": "English title, excerpt, and content are required",
    "zh": "请填写英文标题、概要和正文。"
  },
  "Complete the English project fields": {
    "en": "Complete the English project fields",
    "zh": "请补全英文项目信息。"
  },
  "Admin Disabled": {
    "en": "Admin Disabled",
    "zh": "后台未启用"
  },
  "Set ADMIN_PASSWORD in your environment to enable the admin panel.": {
    "en": "Set ADMIN_PASSWORD in your environment to enable the admin panel.",
    "zh": "请配置后台密码后启用管理功能。"
  },
  "Admin Login": {
    "en": "Admin Login",
    "zh": "后台登录"
  },
  "Enter the admin password to continue.": {
    "en": "Enter the admin password to continue.",
    "zh": "输入后台密码以继续。"
  },
  "Password": {
    "en": "Password",
    "zh": "密码"
  },
  "Incorrect password.": {
    "en": "Incorrect password.",
    "zh": "密码错误。"
  },
  "Login": {
    "en": "Login",
    "zh": "登录"
  },
  "The admin panel is not configured. Set": {
    "en": "The admin panel is not configured. Set",
    "zh": "后台尚未配置，请设置"
  },
  "in your environment to enable it.": {
    "en": "in your environment to enable it.",
    "zh": "以启用管理功能。"
  },
  "Note: the CMS requires ADMIN_PASSWORD to be set and a serverful Next.js deployment.": {
    "en": "Note: the CMS requires ADMIN_PASSWORD to be set and a serverful Next.js deployment.",
    "zh": "后台需要配置管理密码，并使用支持服务端的 Next.js 部署。"
  },
  "title": {
    "en": "title",
    "zh": "标题"
  },
  "subtitle": {
    "en": "subtitle",
    "zh": "副标题"
  },
  "description": {
    "en": "description",
    "zh": "描述"
  },
  "background": {
    "en": "background",
    "zh": "背景"
  },
  "content": {
    "en": "content",
    "zh": "正文"
  },
  "contributions": {
    "en": "contributions",
    "zh": "贡献"
  },
  "highlights": {
    "en": "highlights",
    "zh": "亮点"
  },
  "blog": {
    "en": "blog",
    "zh": "博客"
  },
  "project": {
    "en": "project",
    "zh": "项目"
  },
  "Algorithm": {
    "en": "Algorithm",
    "zh": "算法"
  },
  "Learning Notes": {
    "en": "Learning Notes",
    "zh": "学习笔记"
  },
  "Pitfall Notes": {
    "en": "Pitfall Notes",
    "zh": "踩坑记录"
  },
  "AI Agent": {
    "en": "AI Agent",
    "zh": "AI 智能体"
  },
  "阅览": {
    "zh": "阅览",
    "en": "Reading"
  },
  "管理最近在读的论文与文章。": {
    "zh": "管理最近在读的论文与文章。",
    "en": "Manage papers and posts from your reading list."
  },
  "查看全部": {
    "zh": "查看全部",
    "en": "View all"
  },
  "新增": {
    "zh": "新增",
    "en": "New"
  },
  "返回后台": {
    "zh": "返回后台",
    "en": "Back to dashboard"
  },
  "管理论文与文章。排序数字越小越靠前，相同时新增内容在前。": {
    "zh": "管理论文与文章。排序数字越小越靠前，相同时新增内容在前。",
    "en": "Manage papers and posts. Lower sort numbers appear first; newer entries come first when tied."
  },
  "新增内容": {
    "zh": "新增内容",
    "en": "New entry"
  },
  "查看前台列表 →": {
    "zh": "查看前台列表 →",
    "en": "View public list →"
  },
  "保存失败": {
    "zh": "保存失败",
    "en": "Failed to save."
  },
  "保存失败，请检查连接后重试。": {
    "zh": "保存失败，请检查连接后重试。",
    "en": "Could not save. Check your connection and try again."
  },
  "← 返回阅览": {
    "zh": "← 返回阅览",
    "en": "← Back to reading"
  },
  "编辑阅览": {
    "zh": "编辑阅览",
    "en": "Edit reading entry"
  },
  "新增阅览": {
    "zh": "新增阅览",
    "en": "New reading entry"
  },
  "类型": {
    "zh": "类型",
    "en": "Type"
  },
  "论文": {
    "zh": "论文",
    "en": "Paper"
  },
  "Blog / 文章": {
    "zh": "文章",
    "en": "Blog / Article"
  },
  "排序（越小越靠前）": {
    "zh": "排序（越小越靠前）",
    "en": "Sort order (lower first)"
  },
  "标题 *": {
    "zh": "标题 *",
    "en": "Title *"
  },
  "来源 *": {
    "zh": "来源 *",
    "en": "Source *"
  },
  "原文链接 *": {
    "zh": "原文链接 *",
    "en": "Original URL *"
  },
  "封面图片链接": {
    "zh": "封面图片链接",
    "en": "Cover image URL"
  },
  "填写图片网址或站内路径，留空则显示默认图标。": {
    "zh": "填写图片网址或站内路径，留空则显示默认图标。",
    "en": "Enter an image URL or site-relative path; leave blank for a placeholder."
  },
  "填写图片网址或站内图片路径，留空则显示默认图标。": {
    "zh": "填写图片网址或站内图片路径，留空则显示默认图标。",
    "en": "Enter an image URL or site-relative path; leave blank for a placeholder."
  },
  "中文概要 *": {
    "zh": "中文概要 *",
    "en": "Chinese summary *"
  },
  "英文概要 *": {
    "zh": "英文概要 *",
    "en": "English summary *"
  },
  "保存中…": {
    "zh": "保存中…",
    "en": "Saving…"
  },
  "保存": {
    "zh": "保存",
    "en": "Save"
  },
  "删除失败": {
    "zh": "删除失败",
    "en": "Failed to delete."
  },
  "删除失败，请稍后重试。": {
    "zh": "删除失败，请稍后重试。",
    "en": "Could not delete. Please try again."
  },
  "还没有内容，添加第一篇论文或文章吧。": {
    "zh": "还没有内容，添加第一篇论文或文章吧。",
    "en": "No entries yet. Add your first paper or post."
  },
  "文章": {
    "zh": "文章",
    "en": "Article"
  },
  "排序": {
    "zh": "排序",
    "en": "Sort order"
  },
  "确认删除？": {
    "zh": "确认删除？",
    "en": "Delete this entry?"
  },
  "删除中…": {
    "zh": "删除中…",
    "en": "Deleting…"
  },
  "确认删除": {
    "zh": "确认删除",
    "en": "Confirm delete"
  },
  "取消": {
    "zh": "取消",
    "en": "Cancel"
  },
  "编辑": {
    "zh": "编辑",
    "en": "Edit"
  },
  "删除": {
    "zh": "删除",
    "en": "Delete"
  },
  "这条内容已不存在，请返回列表刷新。": {
    "zh": "这条内容已不存在，请返回列表刷新。",
    "en": "This entry no longer exists. Refresh the list."
  },
  "保存失败，请稍后重试。": {
    "zh": "保存失败，请稍后重试。",
    "en": "Could not save. Please try again."
  },
  "无效的内容编号。": {
    "zh": "无效的内容编号。",
    "en": "Invalid entry ID."
  },
  "请填写标题": {
    "zh": "请填写标题",
    "en": "Please enter a title."
  },
  "请填写中文概要": {
    "zh": "请填写中文概要",
    "en": "Please enter a Chinese summary."
  },
  "请填写英文概要": {
    "zh": "请填写英文概要",
    "en": "Please enter an English summary."
  },
  "请填写来源": {
    "zh": "请填写来源",
    "en": "Please enter a source."
  },
  "请输入有效的 HTTP 或 HTTPS 链接": {
    "zh": "请输入有效的 HTTP 或 HTTPS 链接",
    "en": "Enter a valid HTTP or HTTPS URL."
  },
  "请输入图片链接或站内路径": {
    "zh": "请输入图片链接或站内路径",
    "en": "Enter an image URL or site-relative path."
  },
  "Cover image": {
    "en": "Cover image",
    "zh": "封面图片"
  },
  "Cover preview": {
    "en": "Cover preview",
    "zh": "封面预览"
  },
  "Remove cover": {
    "en": "Remove cover",
    "zh": "移除封面"
  },
  "Image preview unavailable. Check the URL.": {
    "en": "Image preview unavailable. Check the URL.",
    "zh": "无法预览图片，请检查链接。"
  },
  "JPEG, PNG, or WebP, up to 2 MB. Select an image to upload and preview.": {
    "en": "JPEG, PNG, or WebP, up to 2 MB. Select an image to upload and preview.",
    "zh": "支持 JPEG、PNG、WebP，最大 2 MB。选择图片后即可上传并预览。"
  },
  "Uploading…": {
    "en": "Uploading…",
    "zh": "上传中…"
  },
  "Image must be smaller than 2 MB.": {
    "en": "Image must be smaller than 2 MB.",
    "zh": "图片大小需小于 2 MB。"
  },
  "Choose a JPEG, PNG, or WebP image.": {
    "en": "Choose a JPEG, PNG, or WebP image.",
    "zh": "请选择 JPEG、PNG 或 WebP 图片。"
  },
  "This image could not be read. Choose another file.": {
    "en": "This image could not be read. Choose another file.",
    "zh": "无法读取这张图片，请选择其他文件。"
  },
  "Upload failed. Please try again.": {
    "en": "Upload failed. Please try again.",
    "zh": "上传失败，请重试。"
  },
  "Please sign in again.": {
    "en": "Please sign in again.",
    "zh": "请重新登录。"
  },
  "Please check the reading entry fields.": {
    "en": "Please check the reading entry fields.",
    "zh": "请检查阅览内容的必填项、链接和排序。"
  }
};

export function translateAdmin(locale: Locale, key: string): string {
  return adminMessages[key]?.[locale] ?? key;
}

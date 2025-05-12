
# Cursor 指令文档：Pokémon Infinite Fusion 多语言网站 MVP

---

## 🌍 项目目标

构建一个多语言（支持至少英文 + 中文）的 Pokémon Infinite Fusion 网站，包含：
✅ 融合计算器（Fusion Calculator）  
✅ 融合图鉴（Fusion Dex）  
✅ 安装指南（Install Guide）

要求：
- 快速开发 MVP  
- 响应式、适配桌面和移动端  
- 基础 SEO + 多语言 SEO 优化  
- 未来可扩展（支持更多工具、社区模块）

---

## 🏗 技术要求

- 前端：Next.js 14 (App Router) + TypeScript  
- 样式：Tailwind CSS + shadcn/ui  
- 动效：Framer Motion  
- 数据：本地 JSON 文件 (`/public/data/fusion-data.json`)  
- 多语言：用 `next-intl` 或 `next-i18next` 实现国际化  
- SEO：`next-seo` 配置 + 多语言 sitemap  
- 部署：Vercel 免费版

---

## 📂 文件结构

```
/pages
  ├─ index.tsx                # 首页
  ├─ calculator.tsx           # 融合计算器页面
  ├─ dex.tsx                  # 融合图鉴页面
  ├─ install-guide.tsx        # 安装指南页面
  └─ [...locale]/             # 多语言动态路由支持

/public
  ├─ images/                  # 宝可梦图片
  └─ data/
      └─ fusion-data.json     # 融合组合数据

/components
  ├─ Layout.tsx               # 布局组件（多语言切换按钮）
  ├─ Calculator.tsx           # 计算器组件
  ├─ DexTable.tsx             # 图鉴表格组件
  └─ LanguageSwitcher.tsx     # 切换语言组件

/styles
  └─ globals.css              # 全局样式
```

---

## 🔧 核心任务

✅ 设置多语言框架：使用 `next-intl` 或 `next-i18next`  
✅ 每个页面支持英文 + 中文内容，基于 JSON 翻译文件  
✅ URL 包含语言前缀（如 `/en/`、`/zh/`）  
✅ `<head>` 标签的 `<title>`、`<meta>` 等多语言配置  
✅ 在 Layout 中加入 `<LanguageSwitcher>` 下拉菜单  
✅ 首页、计算器、图鉴、安装指南页面按模块拆分  
✅ SEO 配置支持多语言 sitemap、hreflang 标签

---

## 📃 多语言翻译文件（示例）

```
/locales/en/common.json
{
  "title": "Pokémon Infinite Fusion Hub",
  "calculator": "Fusion Calculator",
  "dex": "Fusion Dex",
  "installGuide": "Install Guide"
}

/locales/zh/common.json
{
  "title": "宝可梦无限融合站",
  "calculator": "融合计算器",
  "dex": "融合图鉴",
  "installGuide": "安装指南"
}
```

---

## ⚙ 页面功能拆解

### 首页 `/`

- 显示：Hero Banner、快速入口（Calculator / Dex / Install Guide）
- 布局：响应式网格
- 多语言：标题、简介、按钮文字

### Calculator `/calculator`

- 左右下拉选择 Pokémon A + B  
- 点击计算 → 显示：
  - 融合后图片、名称、属性、能力值  
- 多语言：输入提示、按钮文字、输出标签

### Dex `/dex`

- 搜索框、排序下拉菜单  
- 表格展示：编号、名称、属性、攻击、防御、速度  
- 多语言：表头、搜索提示、排序项

### Install Guide `/install-guide`

- Markdown 渲染：安装步骤、FAQ、补丁说明  
- 多语言：每段内容使用不同翻译文件或多语言 Markdown 文件

---

## 🛠 技术细节

✅ 使用 `getStaticProps` / `getStaticPaths` 实现静态生成  
✅ 图片懒加载（`next/image`）  
✅ SEO：`next-seo` 配置多语言 meta、OG 标签  
✅ 多语言 sitemap 自动生成（`next-sitemap` 配置）  
✅ Lighthouse 性能 ≥90

---

## 🌐 额外模块

| 模块               | 作用                          |
|------------------|-----------------------------|
| `<LanguageSwitcher>` | 切换当前语言、更新 URL 和 context |
| 翻译 JSON 文件        | 存放多语言文案                    |
| hreflang 标签       | 提升多语言 SEO 覆盖                |

---

## ✅ 最小交付目标（MVP）

- [ ] 多语言首页  
- [ ] 多语言计算器  
- [ ] 多语言图鉴  
- [ ] 多语言安装指南  
- [ ] 多语言切换组件  
- [ ] 多语言 SEO 配置  
- [ ] Vercel 部署 + 多语言 sitemap 提交

---

如需：翻译 JSON 文件模板、LanguageSwitcher 组件代码样板、next-intl/next-i18next 配置模板，请提出！

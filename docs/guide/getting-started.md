# 项目介绍

## 目标

这个站点用于承载 ChartStudio 的项目文档、团队知识沉淀和协作规范。

## 当前目录建议

```text
docs/
  index.md
  guide/
    getting-started.md
    contributing.md
  .vitepress/
    config.mts
    theme/
```

## 推荐的后续模块

- `product/`：产品背景、需求说明、流程设计
- `engineering/`：开发规范、架构说明、部署文档
- `components/`：图表能力、组件说明、API 示例
- `changelog/`：版本记录与里程碑

## 本地运行

```bash
npm install
npm run docs:dev
```

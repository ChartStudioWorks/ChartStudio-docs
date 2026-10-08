import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "谱面工坊 文档站",
  description: "ChartStudio Wiki",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "ChartStudio Wiki",
    lastUpdated: {
      text: "最后更新于",
    },
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "格式说明",
        link: "/format/format-metadata-structure.md",
      },
      {
        text: "规范",
        link: "/guide/contributing",
      },
    ],
    sidebar: [
      {
        text: "开始使用",
        items: [
          {
            text: "项目介绍",
            link: "/guide/getting-started",
          },
          {
            text: "文档协作",
            link: "/guide/contributing",
          },
        ],
      },
      {
        text: "结构解析",
        items: [
          {
            text: "Malody 谱面包",
            link: "/structure/malody",
          },
          {
            text: "DCS 谱面包",
            link: "/structure/dcs",
          },
          {
            text: "ChartStudio 谱面包",
            link: "/structure/chartstudio",
          },
        ],
      },
      {
        text: "格式说明",
        items: [
          {
            text: "ChartStudio 谱面元数据结构",
            link: "/format/format-metadata-structure.md",
          },
          {
            text: "第三方谱面格式解析",
            link: "/format/format-analyze",
          },
        ],
      },
      {
        text: "导入规则",
        items: [
          {
            text: "谱面导入规则",
            link: "/import/import-format-rules.md",
          },
          {
            text: "字段映射规则",
            link: "/import/import-mapping-rules.md",
          },
        ],
      },
      {
        text: "导出规则",
        items: [
          {
            text: "导出为 .csc",
            link: "/export/export-csc",
          },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Tenqui-Noir/chartstudio-docs",
      },
    ],
    footer: {
      message: "谱面工坊 文档站",
      copyright: "© 2026 尘柒，保留所有权利",
    },
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
  },
});

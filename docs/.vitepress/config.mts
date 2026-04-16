import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "ChartStudio Wiki",
  description: "ChartStudio Wiki",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "ChartStudio Wiki",
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/guide/getting-started" },
      { text: "规范", link: "/guide/contributing" }
    ],
    sidebar: [
      {
        text: "开始使用",
        items: [
          { text: "项目介绍", link: "/guide/getting-started" },
          { text: "文档协作", link: "/guide/contributing" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/" }
    ],
    footer: {
      message: '谱面工坊 文档站 · <a href="https://github.com/Tenqui-Noir/chartstudio-docs" target="_blank" rel="noreferrer">GitHub</a>',
      copyright: '© 2026 尘柒，保留所有权利。'
    },
    search: {
      provider: "local"
    },
    outline: {
      level: [2, 3],
      label: "本页目录"
    },
    docFooter: {
      prev: "上一页",
      next: "下一页"
    }
  }
});

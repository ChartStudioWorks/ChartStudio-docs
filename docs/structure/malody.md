# Malody 谱面包结构

Malody 谱面包通常使用 `.mcz` 扩展名，本质上是压缩包。谱面工坊也支持从 `.zip` 和 `.7z` 压缩包导入。

```text
chart-package/
├── chart.mc
├── audio.ogg
├── cover.jpg
└── background.jpg
```

| 文件 | 用途 |
| --- | --- |
| `*.mc` | Malody 谱面文件；一个包内可以包含多个谱面文件。 |
| 音频文件 | 谱面对应的歌曲音频。 |
| 图片文件 | 封面图、背景图等谱面图片资源。 |

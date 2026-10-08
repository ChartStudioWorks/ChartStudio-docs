# ChartStudio 谱面包结构

ChartStudio 工程谱面包使用 `.csc` 扩展名，本质上是一个 ZIP 压缩包。包内至少包含元数据、音频和谱面文件，封面与背景等图片资源可一并放入。

```text
PUPA/
├── metadata.json
├── assets/
│   ├── audio.ogg
│   ├── cover.jpg
│   └── background.jpg
└── charts/
    └── chart.chart
```

| 文件或目录 | 用途 |
| --- | --- |
| `metadata.json` | 工程元数据文件。 |
| `assets/` | 音频、封面、背景等资源文件。 |
| `charts/` | 工程谱面文件所在目录。 |
| `*.chart` | ChartStudio 原生谱面数据文件。 |

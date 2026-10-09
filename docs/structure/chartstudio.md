# ChartStudio 谱面包结构

ChartStudio 工程谱面包使用 `.csc` 扩展名，本质上是一个 ZIP 压缩包。标准工程以 `metadata.json` 保存元数据，谱面和关联资源分别放入 `charts/`、`assets/`。音频、封面或背景可以缺失，对应资源字段为 `null`。

```text
PUPA.csc
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
| `*.chart` | ChartStudio 原生谱面数据文件，内部采用 JSON。 |

上述为含有完整资源的包内示例，`metadata.json` 位于 ZIP 根目录；未关联资源不会写入工程，没有事件的谱面仍使用空数组。当前导入兼容 `charts/*.json`，导出统一使用 `.chart`，不兼容 `.charts`。字段类型与时间单位见[谱面元数据结构](/format/format-metadata-structure)。

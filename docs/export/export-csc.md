# 导出为 `.csc`

`.csc` 是 ChartStudio 的原生工程包格式，以 ZIP 压缩包保存。导出时，应用会根据当前谱面的曲名生成下载文件名，并添加 `.csc` 后缀；曲名为空时使用来源文件名。文件名中的 `\ / : * ? " < > |` 会替换为下划线。

## 导出内容

导出的 `.csc` 包以 `metadata.json` 保存工程元数据；有可用谱面时写入 `charts/`，并将元数据引用的资源放入 `assets/`：

```text
<曲名>.csc
├── metadata.json
├── charts/
│   └── <谱面名>.chart
└── assets/
    ├── <音频文件>
    ├── <封面图片>
    └── <背景图片>
```

| 文件或目录 | 用途 |
| --- | --- |
| `metadata.json` | 保存 ChartStudio 工程元数据。 |
| `charts/*.chart` | 保存 ChartStudio 谱面数据；可用谱面统一使用 `.chart` 扩展名。 |
| `assets/` | 保存元数据引用的音频、封面和背景资源；未引用的资源不会打包。 |

导出时，谱面文件统一使用 `.chart` 扩展名。元数据字段见[谱面包元数据结构](/format/format-metadata-structure)，包内目录说明见[ChartStudio 工程结构](/structure/chartstudio)。

当前导入 Malody/DCS 时，以来源谱面文件名去掉扩展名、清理非法字符，再追加从 `1` 开始的包内序号生成 `.chart` 文件名，例如第一张 `A017.txt` 转为 `charts/A0171.chart`。读取现有 CSC 时规范化原文件名并统一扩展名，没有要求文件名必须与难度键同名。

音频或图片缺失不会阻止 `.csc` 导出；包内只写入元数据引用且能找到的资源。CSC 的版本、可空字段与时间轴定义见[格式说明](/format/format-metadata-structure)。

## 操作

在谱面信息面板中选择“导出”，再选择“ChartStudio `.csc`”并确认，即可下载工程包。

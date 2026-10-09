# 谱面工坊 谱面文件格式

## 文件概览

谱面工坊的谱面文件后缀为 `.csc`，本质上是一个 Zip 压缩包。

标准工程包含以下内容：

- [谱面包元数据文件](/format/format-metadata-structure#谱面包示例结构)
- `assets/` 下关联的音频和图片资源；缺失时对应元数据字段为 `null`
- [谱面文件](/format/format-metadata-structure#谱面示例结构)

当前支持[导出 `.csc`](/export/export-csc) 和[导出 DCS `.zip`](/export/export-dcs)。Malody `.mcz` 导出尚未实现。包内结构见[ChartStudio 谱面包结构](/structure/chartstudio)。

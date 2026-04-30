# 谱面工坊 谱面文件格式

## 文件概览

谱面工坊的谱面文件后缀为 `.csc`，本质上是一个 Zip 压缩包。

对于通过谱面工坊正常导入/导出的谱面文件，压缩包内至少会有以下内容：

- [谱面包元数据文件](/format/FORMAT_METADATA_STRUCTURE#谱面包示例结构)
- 音频文件
- [谱面文件](/format/FORMAT_METADATA_STRUCTURE#谱面示例结构)

您可以在网站中选择导出为 Malody / DCS 格式的谱面包或工程文件。
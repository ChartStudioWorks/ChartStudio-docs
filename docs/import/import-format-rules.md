# 谱面导入规则

本文将说明谱面工坊如何导入与处理谱面信息。


::: tip 提示
本文**并不是**字段映射规则文档。

若您在找关于谱面工坊如何将第三方格式转为谱面工坊格式，请查阅[字段映射规则](/import/import-mapping-rules.md)
:::

## 通用

- 允许导入：`.mcz`、`.zip`、`.7z`
- 忽略系统文件：
  - `__MACOSX/`
  - `.DS_Store`
  - `thumbs.db`
- 无法匹配任何模式时输出：`无法识别压缩包内容`
- 识别但非理想状态时必须顶部告警

## Malody 导入逻辑（模式一）

### 核心文件

- `.mc`
- 图片文件
- 音频文件

### 音频规则

- 允许：
  - `.mp3`
  - `.ogg`
  - `.wav`
  - `.flac`
  - `.m4a`
  - `.org`
- 多音频时优先同名匹配 `.mc`

### 图片规则

#### 若指定了封面图片

则使用封面图片。

#### 若未指定封面图片

则默认寻找与 `.mc` 文件同名的图片。若没有，则列出谱面中的图片，供玩家手动选择。

#### 若指定了背景图片

- 以 `background` 字段为准，指向某张图时，无论它的尺寸，大小，将其设置为背景图，若图片不足以覆盖背景，则将图片放大，直至填满背景。

#### 若未指定背景图片

背景图片将使用于封面相同的图片。您后续需手动指定背景图片。

### `.mc` 所需字段

- `meta.song.title`
- `meta.song.artist`
- `meta.creator`
- `meta.background`
- `meta.mode`
- `meta.mode_ext.column`
- `effect`
- `note`

### `.mc` 限制

- `.mc` 必须是合法 JSON
- `meta.mode` 必须为 `0`
- 仅可缺少[非必须字段](/format/format-metadata-structure#允许为空的字段)

## DCS 导入逻辑（模式二）

### 核心文件

- `musicInfo.json`
- `^[ABCDE]0\d+\.txt$`
- `^[ABCDE]0\d+_sv\.txt$`
- `audio.wav`
- `bg.jpg`
- `bigBg.jpg`

谱面文件名由难度识别字母、固定的 `0` 和难度级别组成，例如 6 级为 `A06.txt`、17 级为 `A017.txt`、114 级为 `A0114.txt`。变速文件使用相同名称并加 `_sv` 后缀。

#### 文件识别与映射

- `musicInfo.json` --> 曲目元信息文件
- `.txt` 文件 --> 谱面文件
- `_sv.txt` 文件 --> 变速文件
- `audio.wav` --> 歌曲文件
- `bg.jpg` --> 封面图片
- `bigBg.jpg` --> 背景图片

### `musicInfo.json` 必需键

- `name`
- `autor`(错别字？)
- `bpm`
- `firstTime`(秒)
- `bpmList`


### DCS 限制

- `musicInfo.json` 缺失：拒绝
- `musicInfo.json` 非法 JSON：拒绝
- 必需键缺失：拒绝

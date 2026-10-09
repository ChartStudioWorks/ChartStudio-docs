# 谱面导入规则

本文将说明谱面工坊如何导入与处理谱面信息。


::: tip 提示
本文**并不是**字段映射规则文档。

若您在找关于谱面工坊如何将第三方格式转为谱面工坊格式，请查阅[字段映射规则](/import/import-mapping-rules.md)
:::

## 通用

- 允许导入：`.mcz`、`.zip`、`.7z` 和原生工程 `.csc`
- 忽略系统文件：
  - `__MACOSX/`
  - `.DS_Store`
  - `thumbs.db`
- 无法匹配任何模式时输出：`无法识别压缩包内容`
- 识别但非理想状态时必须顶部告警

`.csc` 走原生工程读取；其余压缩包优先识别 Malody `.mc`，再识别 DCS。无法识别的额外文件会告警，并从生成的 CSC 中剔除。

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
- 主音频优先按全部难度的 BGM `note[].sound` 选择，其次使用 `meta.song.file`；没有显式引用时才按第一张 `.mc` 的文件名或首个可用音频回退。
- BGM 引用缺失、跨难度冲突或不安全路径会报错；完全没有音频且没有显式引用时仅告警，`assets.audio` 为 `null`。
- 普通音符的 Keysound 关联暂不保存。具体引用规则和错误边界见[音频资源与 Offset](/import/import-mapping-rules#malody-音频资源与-offset)。

### 图片规则

允许 `.png`、`.jpg`、`.jpeg`、`.webp`、`.bmp`、`.gif`。当前实现自动分配资源：

| 资源 | 当前选择方式 |
| --- | --- |
| 封面 | 优先与第一张 `.mc` 同名的图片，否则使用首张图片。 |
| 背景 | 优先按第一张 `.mc` 的 `meta.background` 匹配图片文件名，否则回退到封面。 |

指定背景未匹配到图片时会告警；没有图片时对应资源为空。当前不按图片宽高筛选，也没有手动选图窗口。

### `.mc` 读取字段

| 字段 | 当前用途 |
| --- | --- |
| `meta.mode` | 必须为数字 `0`，仅接受 Key 模式。 |
| `meta.song.title`、`meta.song.artist` | 曲名、曲师；兼容顶层 `song.title`、`song.artist`。缺失时曲名回退到来源包名，曲师使用空字符串。 |
| `meta.creator`、`meta.preview`、`meta.version` | 谱师、预览起始时间与等级信息。 |
| `meta.background` | 可选背景图片引用。 |
| `meta.song.file` | 可选歌曲音频引用。 |
| `time`、`effect`、`note` | BPM、效果与音符/音频事件数组；未提供时按空数组处理。 |

当前轨道校验依据每颗普通音符的 `column: 0～5`，不以 `meta.mode_ext.column` 为必需导入条件。

### `.mc` 限制

- `.mc` 必须是合法 JSON
- `meta.mode` 必须为 `0`
- `time`、`effect`、`note` 若提供，必须是数组；非法时间事件、轨道或 Hold 范围会报错，详见[时间事件与错误处理](/import/import-mapping-rules#malody-时间事件与错误处理)。
- 当前统一换算仅在 4/4 谱面得到验证，非 4/4 时间轴尚未验证。
- 所有 `.mc` 都会转换，多谱面难度信息的限制见[多谱面识别](/import/import-mapping-rules#多谱面识别)。

## DCS 导入逻辑（模式二）

### 核心文件

- `musicInfo.json`
- 谱面 `.txt`，例如 `A017.txt`
- 同名 `_sv.txt`，例如 `A017_sv.txt`
- `audio.wav`
- `bg.jpg`
- `bigBg.jpg`

谱面文件名由难度识别字母、固定的 `0` 和难度级别组成，例如 6 级为 `A06.txt`、17 级为 `A017.txt`、114 级为 `A0114.txt`。变速文件使用相同名称并加 `_sv` 后缀。

上述是当前导出的命名方式。导入为兼容现有包，实际接受 `^[ABCDE]\d+\.txt$` 及同名 `_sv.txt`，忽略大小写，不强制等级前已经带有 `0`。

#### 文件识别与映射

- `musicInfo.json` --> 曲目元信息文件
- `.txt` 文件 --> 谱面文件
- `_sv.txt` 文件 --> 变速文件
- `audio.wav` --> 歌曲文件
- `bg.jpg` --> 封面图片
- `bigBg.jpg` --> 背景图片

### `musicInfo.json` 必需键

- `name`
- `autor`（原始字段的实际拼写）
- `bpm`
- `firstTime`(秒)
- `bpmList`


### DCS 限制

- `musicInfo.json` 缺失：拒绝
- `musicInfo.json` 非法 JSON：拒绝
- 必需键缺失：拒绝
- `firstTime` 必须为有限数字，单位秒；`null`、字符串、布尔值、非有限数值及换算溢出均以「谱面元信息不合法」拒绝。此校验优先于谱面文件是否存在。
- `name`、`autor` 的非字符串值当前回退到空字符串；`bpm`、`bpmList` 的校验边界见[DCS BPM 映射](/import/import-mapping-rules#dcs-bpm-映射)。必需键存在不代表任意值都是有效数据。
- 未找到谱面、音频或图片时告警；非法音符行或 SV 行则报错，不会静默忽略。
- `uuid`、`c_time`、`e_time` 等额外元信息不参与当前映射，不因其缺失或 `null` 拒绝导入。

## CSC 导入逻辑

原生 `.csc` 是 ZIP 工程包，标准结构见[ChartStudio 谱面包结构](/structure/chartstudio)。当前读取 `charts/` 下的 `.chart`，也兼容 `.json` 谱面文件，重新生成工程时统一使用 `.chart`；旧的 `.charts` 扩展名不受支持。

`chartFormatVersion` 当前必须为 `1`，音符轨道按 `lane: 1～6` 校验；不会猜测旧编号体系或自动移动轨道。重新生成的工程只保留有效元数据、识别到的谱面和元数据引用的资源。当前逐字段校验范围见[CSC 格式补充说明](/format/format-metadata-structure#格式补充说明-1)。

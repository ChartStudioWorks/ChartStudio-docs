# ChartStudio 谱面元数据结构

本文说明谱面工坊谱面包的元数据 JSON 结构，以及各字段的含义。

## 用途

元数据用于描述一首曲目的基础信息、资源文件、时间信息和谱面列表。  
谱面工坊在进行导入工作时，会自动将谱面转为谱面工坊的工程文件，导出时也将转为相应谱面格式。

## 谱面包示例结构 <Badge type="info" text="当前实现" />

```jsonc
{
  "metadataFormatVersion": 1,   // 内部格式版本号
  "title": "歌曲名",
  "artist": "曲师",
  "charter": "谱师",
  "preview": {
    "start": 114,               // 歌曲预览开始时间(ms)
    "end": 514                  // 歌曲预览结束时间(ms)
  },
  "assets": {                   // 文件资源
    "audio": "音频文件.mp3",
    "background": "背景.jpg",
    "cover": "封面.jpg"
  },
  "song": {
    "bpm": 170,                 // 歌曲bpm
    "startTime": 155,           // 谱面起始参考时间(ms)
    "offset": 230               // 额外偏移(ms)，正值向后偏移
  },
  "charts": {                   // 谱面信息
    "master": 15,
    "legend": 20
  }
}
```

### 格式补充说明

#### 允许为空的字段：

以下字段使用 JSON `null` 表示尚未确定或没有关联值；`null` 与省略字段、空字符串、数字 `0` 含义不同。

| 字段 | `null` 的含义 |
| --- | --- |
| `charter` | 未提供谱师。 |
| `preview.start`、`preview.end` | 未提供对应预览时间。 |
| `assets.audio`、`assets.background`、`assets.cover` | 没有关联对应资源。 |
| `song.bpm` | 未确定曲目展示 BPM。 |
| `song.offset` | 未确定曲目偏移。 |
| `charts` 中的等级值 | 对应难度的等级待定。 |

`title`、`artist` 使用字符串；未提供艺术家时当前导入器使用空字符串。`preview`、`assets`、`song` 和 `charts` 本身是对象，`song.startTime` 是数字，均不以整个值为 `null` 表示缺失。版本字段 `metadataFormatVersion` 当前为 `1`。

`assets` 保存资源文件名；资源放在包内 `assets/` 下。`charts` 是难度名称到等级的映射，例如 `basic`、`advanced`、`expert`、`master`、`legend`；它不包含谱面文件路径。Malody 导入当前使用 `malody` 键，详见[多谱面识别](/import/import-mapping-rules#多谱面识别)。

#### 时间单位

`preview.start`、`preview.end`、`song.startTime` 和 `song.offset` 使用毫秒（ms）。`beat` 与 `endBeat` 使用四分音符拍，不能直接作为毫秒时间；BPM 是每分钟拍数，Scroll `value` 是流速倍率。

#### song.startTime 与 song.offset

`startTime` 表示谱面起始参考时间，使用有限数字；当前 Malody/DCS 导入将其设为 `0`。`offset` 表示在该基础上的额外偏移量，使用有限数字或 `null`，正值表示向后偏移。

显式 `offset: 0` 表示零额外偏移，`offset: null` 表示未确定。导出 DCS 时按 `(startTime + (offset ?? 0)) / 1000` 写入秒单位的 `firstTime`，因此无法保留未知偏移与显式零的区别。具体规则见[DCS 时间字段映射](/import/import-mapping-rules#dcs-时间字段映射)。

## 谱面示例结构 <Badge type="info" text="当前实现" />

```jsonc
{
  "chartFormatVersion": 1,      // 内部格式版本号
  "bpm": 170,                   // 基础bpm值
  "bpmChanges": [               // bpm变化表
    {
      "beat": 64,               // 节拍坐标
      "bpm": 200
    }
  ],
  "scroll": [                   // 变速表
    {
      "beat": 32,               // 节拍坐标
      "value": 0.5              // 流速倍率(与初始速度1相对)
    },
    {
      "beat": 64,
      "value": 1.25
    }
  ],
  "notes": [                    // 音符数据
    {
      "type": "tap",            // Note 类型
      "lane": 3,                // 轨道编号
      "beat": 0.25              // 所在节拍坐标
    },
    {
      "type": "hold",           // Note 类型
      "lane": 5,                // 轨道编号
      "beat": 1,                // 起始节拍坐标
      "endBeat": 2              // 结束节拍坐标
    }
  ]
}

```

### 轨道与多押

CSC 包内的 `.chart` 谱面文件使用 JSON 格式。`notes` 中的每个 Note 只对应一个轨道，`lane` 必须是 `1～6` 的整数：从舞立方左上按键开始，按逆时针方向递进编号。

双押和三押不是单独的 Note 类型，而是多个 Note 具有相同的起始 `beat`。例如，下面两个 Tap 表示同一拍的双押：

```json
[
  { "type": "tap", "lane": 1, "beat": 0.5 },
  { "type": "tap", "lane": 3, "beat": 0.5 }
]
```

CSC 内部不使用 DCS 的 `13`、`23` 等组合轨道编码；组合编码在格式转换时展开为多个单轨 Note。DCS 与 CSC 音符的转换规则见[字段映射规则](/import/import-mapping-rules#dcs-→-csc-音符展开)。

### 格式补充说明

`chartFormatVersion` 当前为 `1`；`bpm` 使用有限数字或 `null`。`bpmChanges`、`scroll`、`notes` 均使用数组，没有事件时使用 `[]`。

| 数组 | 单条记录 |
| --- | --- |
| `bpmChanges` | `{ "beat": number, "bpm": number }`，BPM 变化事件。 |
| `scroll` | `{ "beat": number, "value": number }`，流速变化事件。 |
| `notes` | `tap` 或 `hold` 音符；每颗音符保存独立的 `lane`。 |

::: info 当前读取校验范围
CSC 读取器会检查谱面版本、这三个数组的结构和音符 `lane`，但尚未逐字段校验所有元数据及时间事件。本文的数据结构说明不代表读取器已完成所有非法值检查。DCS 导出还会校验时间、音符、BPM 和 Scroll 数值。
:::

#### tap

`tap` 音符包含 `type: "tap"`、`lane` 和 `beat`。

#### hold

`hold` 音符包含 `type: "hold"`、`lane`、`beat` 和 `endBeat`；结束节拍应晚于起始节拍。Malody/DCS 转换会拒绝无效的 Hold 范围。

#### beat

`beat` 是从 `0` 开始、以一个四分音符拍为单位的连续节拍坐标，使用 JSON `number` 保存；`endBeat` 使用相同单位。

| 坐标 | 含义 |
| --- | --- |
| `0` | 第一拍起点。 |
| `0.5` | 第一拍中点。 |
| `0.75` | 第一拍的 3/4 位置。 |
| `1` | 第二拍起点。 |
| `4` | 4/4 拍下第二小节起点。 |
| `4.125` | 4/4 拍下第二小节起点后 1/8 拍。 |

底层存储允许任意合法有限小数位置，不限制两位小数，也不会固定保留小数位；实际数值精度仍受 JSON/JavaScript `number` 表示能力限制。编辑器网格精度决定交互时的对齐方式，与底层存储精度相互独立；当前应用尚未提供可用的时间轴编辑流程。

#### value

`value` 在这里指相对于原始流速 `1` 的速度倍率值。

#### BPM

::: tip 提示
元信息中的 `song.bpm` 用于快速索引与展示；谱面文件中的 `bpm` 是该谱面的时间轴基础 BPM。DCS 导出在谱面 `bpm` 为 `null` 时尝试使用元信息中的 BPM。
:::
基础 `bpm` 的设定意味着：在遇到第一个 `bpm` 事件之前，`bpm` 将保持为该设定值。

#### bpmChanges

若 `bpmChanges` 中存在 `beat: 0` 的 BPM 事件，则应以该事件作为初始 BPM，顶层 `bpm` 仅作为兼容或回退值。

导入转换会省略与基础 `bpm` 相同的零拍事件；不同值的零拍事件必须保留。DCS 导出仍会在 `bpmList` 中保存零拍项，详见[DCS BPM 映射](/import/import-mapping-rules#dcs-bpm-映射)。

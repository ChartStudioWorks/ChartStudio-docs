# ChartStudio 谱面元数据结构

本文说明谱面工坊谱面包的元数据 JSON 结构，以及各字段的含义。

## 用途

元数据用于描述一首曲目的基础信息、资源文件、时间信息和谱面列表。  
谱面工坊在进行导入工作时，会自动将谱面转为谱面工坊的工程文件，导出时也将转为相应谱面格式。

## 谱面包示例结构 <Badge type="warning" text="草案" />

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
    "offset": 230               // 音频偏移(+)(ms)
    
  },
  "charts": {                   // 谱面信息
    "master": 15,
    "legend": 20
  }
}
```

### 格式补充说明

#### 时间单位

除 `beat` 外，本文中所有时间值均使用毫秒（ms）表示。

#### song.startTime 与 song.offset

`startTime` 表示谱面起始参考时间。  
`offset` 表示在该基础上的额外偏移量，正值表示向后偏移。

## 谱面示例结构 <Badge type="warning" text="草案" />

```jsonc
{
  "chartFormatVersion": 1,      // 内部格式版本号
  "bpm": 170,                   // 基础bpm值
  "bpmChanges": [               // bpm变化表
    {
    "beat": 0,                  // 节拍数
    "bpm": 170                  // bpm值
    },
    {
    "beat": 64,
    "bpm": 200
    }
  ],
  "scroll": [                   // 变速表
    {
    "beat": 32,                 // 节拍数
    "value": 0.5                // 速度变化(与初始速度1相对)
    },
    {
    "beat": 64,
    "value": 1.25
    }
  ],
  "notes": [                    // 音符数据
    {
    "type": "tap",              // note 类型
    "lane": 3,                  // 轨道编号
    "beat": 0.25                // 所在节拍数
    },
    {
    "type": "hold",             // note 类型
    "lane": 5,                  // 轨道编号
    "beat": 1,                  // 所在节拍数
    "endBeat": 2                // 结束节拍数 
    }
  ]
}

```
### 格式补充说明

#### tap

`tap` 音符。

#### hold

`hold` 音符。

#### beat

`beat` 即 "节拍数"。

#### value

`value` 在这里指相对于原始流速 `1` 的速度倍率值。

#### BPM

::: tip 提示
元信息中的 bpm 用于快速索引与展示；谱面文件中的 bpm 为该谱面的时间轴基础 BPM，作为权威值使用。
:::
基础 `bpm` 的设定意味着：在遇到第一个 `bpm` 事件之前，`bpm` 将保持为该设定值。

#### bpmChanges

若 `bpmChanges` 中存在 `beat: 0` 的 BPM 事件，则应以该事件作为初始 BPM，顶层 `bpm` 仅作为兼容或回退值。

为避免冗余，谱面工坊一般不会主动输出 `"beat": 0` 的 `BPM` 事件；当基础 BPM 可由顶层 `bpm` 表达时，应优先使用顶层字段。
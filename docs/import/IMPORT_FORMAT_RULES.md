# 谱面导入规则

本文将说明谱面工坊如何导入与处理谱面信息。


::: tip 提示
本文并不是字段映射规则文档。

若您在找关于谱面工坊如何将第三方格式转为谱面工坊格式，请查阅[字段映射规则](/import/IMPORT_MAPPING_RULES.md)
:::

::: warning 注意
本文中对第三方谱面文件的解析仅供参考，不应作为权威信息来源。
:::

## 通用

- 允许导入：`.mcz`、`.zip`、`.7z`
- 忽略系统文件：
  - `__MACOSX/`
  - `.DS_Store`
  - `thumbs.db`
- 无法匹配任何模式时输出：`无法识别压缩包内容`
- 识别但非理想状态时必须顶部告警

## `.mc` 示例结构：

```jsonc
{
  "meta": {
    "$ver": 0,                            // 版本
    "creator": "谱师名",
    "background": "background.jpg",
    "version": "Lv.15",                   // 谱面名称
    "preview": 233,                       // 预览起始时间
    "id": 0,
    "mode": 0,                            // 当前样本中为 0，对应下落式 Key 模式
    "time": 1742122599,                   // 最后修改时间(戳)
    "song": {                             // 歌曲元信息
      "title": "歌曲名",
      "artist": "曲师名",
      "id": 0
    },
    "mode_ext": {
      "column": 6,                        // 轨道数，这里是 6 轨
      "bar_begin": 0                      // 可能与起始小节有关，当前不使用
    }
  },

  "time": [                               // BPM 表
    {
      "beat": [0, 0, 1],                  // [整数拍, 分子, 分母]
      "bpm": 170.0
    }
  ],

  "effect": [                             // 变速表
    {
      "beat": [1, 0, 1],
      "scroll": 1.0                       // 相对流速
    },
    {
      "beat": [60, 0, 4],
      "scroll": 0.0
    },
    {
      "beat": [61, 0, 4],
      "scroll": 6.0
    }
  ],

  "note": [                               // 音符数据
    {
      "beat": [4, 2, 4],
      "column": 0                         // 轨道编号
    },
    {
      "beat": [8, 0, 4],
      "endbeat": [9, 0, 4],               // 长条尾
      "column": 3
    },

    // 特殊音频对象，可近似理解为 meta_ext，属于极少数事件，而我并不想处理这坨东西
    {
      "beat": [0, 0, 1],
      "sound": "audio.ogg",               // 主音频文件名
      "vol": 100,                         // 音量
      "offset": 349,                      // 音频偏移
      "type": 1                           // 对象类型，当前具体枚举含义未完全确认
    }
  ],

  "extra": {                              // 补充字段，非核心信息，当前不使用
    "test": {
      "divide": 4,
      "speed": 100,
      "save": 0,
      "lock": 0,
      "edit_mode": 0
    }
  }
}
```

### 补充说明

`beat` 使用 `[整数拍, 分子, 分母]` 表示，换算为 `整数拍 + 分子 / 分母`。

带有 `"endbeat"` 的 `note` 为长条

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

#### 若指定了背景图片

- 以 `background` 字段为准，指向某张图时，无论它的尺寸，大小，将其设置为背景图，并呈-45°平铺。

#### 若未指定背景图片

- 背景图只允许横图：`width > height`
- `1:1` 图不能做背景
- 没背景就留空
- 没封面就显示 `?`

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

## DCS 导入逻辑（模式二）

### 核心文件

- `musicInfo.json`
- `^[ABCDE]\\d+\\.txt$`
- `audio.wav`
- `bg.jpg`
- `bigBg.jpg`

#### 文件说明

- `musicInfo.json` --> 曲目元信息文件
- `.txt` 文件 --> 谱面文件
- `audio.wav` --> 歌曲文件
- `bg.jpg` --> 封面图片
- `bigBg.jpg` --> 背景图片

### `musicInfo.json` 示例结构

```jsonc
{
    //uuid字段, 未发现引用
    "uuid": "3de894700cc245c4a1bb404071080915",
    "name": "曲名",
    "autor": "曲师",
    "bpm": 236,               // 默认bpm
    "firstTime": 0.22,        // 谱面偏移 / 歌曲起始时间(s)
    "bpmList": {              // bpm变化表，此值允许为空
        "0": 236
    },
    "c_time": "2026/4/11 14:29:48",     // 创建时间
    "e_time": "2026/4/11 14:29:48"      // 编辑时间
}
```

### `musicInfo.json` 必需键

- `name`
- `autor`(错别字？)
- `bpm`
- `firstTime`(秒)
- `bpmList`

### 模式二限制

- `musicInfo.json` 缺失：拒绝
- `musicInfo.json` 非法 JSON：拒绝
- 必需键缺失：拒绝

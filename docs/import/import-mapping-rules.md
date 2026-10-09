# 字段映射规则

本文用以说明谱面工坊如何导入/导出并处理其他编辑器的格式。若您遇到谱面工坊的相关报错信息，可参照本章进行问题排查。

::: tip 提示
当前 Malody/DCS 导入将 `song.startTime` 设为 `0`，偏移写入 `song.offset`；没有可靠的 Malody Offset 来源时保留 `null`。

导出 DCS 时，将 `startTime + (offset ?? 0)` 毫秒换算为 `firstTime` 秒。Malody 导出尚未实现。
:::

## Malody 元数据映射

`title` <Badge type="info" text="ChartStudio" />
```json
{
  "meta": {
    "song": {
      "title": "歌曲名"
    }
  }
}
```
`artist` <Badge type="info" text="ChartStudio" />
```json
{
  "meta": {
    "song": {
      "artist": "曲师名"
    }
  }
}
```

`charter` <Badge type="info" text="ChartStudio" />
```json
{
  "meta": {
    "creator": "谱师名"
  }
}
```

`preview.start` <Badge type="info" text="ChartStudio" />
```json
{
  "meta": {
    "preview": 233
  }
}
```

### Malody 音频资源与 Offset

| 字段 | 用途或映射关系 |
|---|---|
| `meta.song.file` | 可选的歌曲音频文件引用；可能缺失，缺少它不代表谱面没有音频。 |
| BGM `note[].sound` | BGM 事件引用的音频文件。 |
| BGM `note[].offset` | BGM 事件的音频偏移，单位为毫秒；样本中并非必需。它是当前确认的 Malody Offset 来源。 |
| `meta.preview` | 预览起始时间，对应 CSC `preview.start`，不是 Offset。 |
| CSC `assets.audio` | 导入后关联的歌曲音频资源。 |
| CSC `song.offset` | ChartStudio 统一的偏移字段；满足下方映射条件时保存 BGM Offset 原值。 |

当前样本中，`meta.song.file` 和 BGM `sound` 可以同时存在；观察到两者文件名一致，但这不代表所有 Malody 文件都如此。样本范围和统计见[第三方格式解析中的有限样本观察](/format/format-analyze#有限样本观察)。

示例：

```json
{
  "note": [
    {
      "beat": [0, 0, 1],
      "sound": "audio.ogg",
      "offset": 259,
      "type": 1
    }
  ]
}
```

当前 Key 模式导入将 `type: 1`、含有 `sound` 字段且没有 `column` 字段的对象分类为 BGM，再校验 `sound` 为非空字符串。BGM 不写入 CSC `notes`。带 `column` 的音符即使有 `sound`，也仍按 Tap/Hold 导入；其 Keysound 关联不会保存，并显示告警。当前没有 Keysound 回放或多音频时间轴支持。

主音频按以下顺序选择，这是 ChartStudio 当前实现的优先级：

1. 检查全部难度的 BGM `sound`，它们必须唯一解析到同一个包内音频。
2. 没有 BGM 引用时使用 `meta.song.file`；多个难度提供的有效引用必须一致。
3. 没有显式音频引用时，优先与第一张 `.mc` 文件同名的音频，再回退到首个可用音频。

当前兼容处理将缺失、`null` 或空白字符串的 `meta.song.file` 视为未提供引用；其他非字符串值报错。BGM `sound` 则必须是非空字符串。

引用支持大小写及 `/`、`\` 分隔符差异，按谱面所在目录或包内相对路径解析；仅有文件名时还会查找唯一同名文件。绝对路径、跳出包根目录、匹配到多个路径等情况拒绝导入，不会仅按扩展名猜测另一个文件。所选主音频存在多个同名路径时也会拒绝，因为 CSC 当前只关联一个主音频文件名。

| 情况 | 当前处理 |
| --- | --- |
| BGM 引用缺失文件或不支持的音频扩展名 | 拒绝导入。 |
| 多个 BGM 引用不同音频 | 拒绝导入。 |
| 没有 BGM，`meta.song.file` 引用无法解析或跨难度冲突 | 拒绝导入。 |
| BGM 有效，`meta.song.file` 未找到或指向另一有效音频 | 按 BGM 选择并告警；非法类型或不安全路径仍报错。 |
| 没有显式引用且包内没有音频 | 告警，`assets.audio` 为 `null`。 |

### Malody Offset 映射

第 0 拍 BGM `offset` 使用毫秒，直接写入 CSC `song.offset`，不取反、不转换单位。例如上方 `offset: 259` 映射为 `song.offset: 259`，`song.startTime` 为 `0`。用户实测将 `259` 改为 `1259` 后音乐延后 `1000` 毫秒，确认了正值方向与 CSC 一致。

| BGM Offset 状态 | CSC `song.offset` |
| --- | --- |
| 所有难度均有 BGM，全部 BGM 位于第 0 拍并提供相同的显式有限数字 | 保存原值；显式 `0` 保存为 `0`，负数和小数不截断。 |
| Offset 全部缺失，或完全没有 BGM | `null`，不自动补零。 |
| 仅部分事件提供 Offset，或部分难度没有 BGM 来源 | `null`，并告警。 |
| 同一谱面或不同难度的 Offset 数值冲突 | `null`，并告警。 |
| 任一 BGM 位于非零拍，或节拍无法解析 | `null`，并告警；不把 BGM `beat` 当作毫秒，也不推算曲目级 Offset。 |
| Offset 显式为 `null`、字符串、布尔值、非有限数值 | 拒绝导入，并指出来源文件和 `note[index].offset`。 |

::: warning 验证与兼容范围
正 Offset 的毫秒单位及延后方向已通过 Malody 编辑器保存和试听验证。负数、小数、显式零及跨难度一致性处理有代码和回归测试依据；负 Offset 的游戏内行为尚未单独实测。非零拍 BGM 仍采用保守处理，当前曲目级字段不能完整保存多音频事件。`meta.song.offset` 没有确认的样本依据，当前不作为映射来源。
:::

### Malody BPM 数据映射
::: info 关于 Malody 的 BPM 字段说明
Malody 将 BPM 事件放在 `time` 数组中。导入先统一换算 `time[].beat`，再以转换后位于 CSC 第 `0` 拍的首个事件作为基础 BPM；`[0, 0, 1]` 和 `[0, 0, 4]` 都转换为 `0`。

若没有零拍事件，当前实现回退到数组首项；没有 BPM 事件时为 `null`。与基础 BPM 相同的零拍事件会省略，其他事件保留原顺序。曲目元数据的 `song.bpm` 取第一张 `.mc` 的基础 BPM，每张 `.chart` 则保存自己的 BPM 数据。
:::

`song.bpm` <Badge type="info" text="ChartStudio" />
```json
{
  "time": [
    {
      "beat": [0, 0, 1],
      "bpm": 170.0
    }
  ]
}
```

`assets.background` <Badge type="info" text="ChartStudio" />
```json
{
  "meta": {
    "background": "background.jpg"
  }
}
```

### Malody 映射补充

- `assets.audio` <Badge type="info" text="ChartStudio" />
- `assets.cover` <Badge type="info" text="ChartStudio" />

以上字段记录导入后关联的音频和封面资源。当前实现会自动选择资源，不会弹出人工选择窗口；音频的选择行为见上方说明。

- `version`  <Badge type="tip" text="Malody" />

从 `meta.version` 中识别 `Lv.12`、`lv12` 等名称里的等级；当前匹配忽略大小写、允许一个可选点和空白。无法确定等级时保留 `null`。

### 多谱面识别

包内所有 `.mc` 均转换为独立 `.chart` 文件。多个 `.mc` 会提示需要指定难度等级，当前不会自动从“基础”开始为它们分配完整的 A–E 难度。

当前元数据使用 `charts: { "malody": 等级 }`：单谱面可保存识别出的等级，多谱面时该值为 `null`。这不构成逐谱面难度映射；缺少有效等级或难度项数量不足的工程无法导出 DCS，详见[DCS 导出限制](/export/export-dcs#导出限制)。

## DCS 元数据映射

`title` <Badge type="info" text="ChartStudio" />
```json
{
  "name": "曲名"
}
```

`artist` <Badge type="info" text="ChartStudio" />
```json
{
  "autor": "曲师"
}
```

`bpm` <Badge type="info" text="ChartStudio" />
```json
{
  "bpm": 236
}
```

### DCS 时间字段映射

`song.offset` <Badge type="info" text="ChartStudio" />
```json
{
  "firstTime": 0.22
}
```

导入后为 `song.startTime: 0`、`song.offset: 220`。`firstTime` 使用秒，CSC 两个时间字段使用毫秒：

| 方向 | 换算 |
| --- | --- |
| DCS → CSC | `song.startTime = 0`，`song.offset = firstTime × 1000`。 |
| CSC → DCS | `firstTime = (song.startTime + (song.offset ?? 0)) / 1000`。 |

`firstTime` 是必需的有限 JSON 数字，接受显式零、负数和小数。缺失、`null`、字符串、布尔值、非有限数值或换算溢出均以「谱面元信息不合法」拒绝导入。其他可选元信息的可空性不能推广到 `firstTime`。

导出要求 CSC `startTime` 为有限数字，`offset` 为有限数字或 `null`；`null` 按零额外偏移处理，输出始终是数字。秒/毫秒换算和合并不固定保留小数位，会避免普通浮点加法带来的额外尾数；无法表示的换算结果报错。DCS 的单一字段无法保留 CSC 中未知偏移与显式零的区别，也无法保留 `startTime` 与 `offset` 的独立分量。

## Malody 谱面字段映射

### Malody 节拍与轨道映射

在已验证的 4/4 范围内，Tap、Hold 起止点、BPM 和 Scroll 均使用 `(bar + numerator / denominator) × 4`，没有单独的两位小数限制。完整换算示例和非 4/4 边界见[节拍三元组](/format/format-analyze#节拍三元组)。

Malody `column: 0～5` 对应 CSC `lane: 1～6`，导入时加 `1`；小数、字符串及越界轨道值报错。例如 `beat: [4, 2, 4]`、`column: 0` 转为 CSC `beat: 18`、`lane: 1`。

`bpm` <Badge type="info" text="ChartStudio" />

`bpmChanges` <Badge type="info" text="ChartStudio" />

```json
{
  "time": [
    {
      "beat": [0, 0, 1],
      "bpm": 170.0
    },
    {
      "beat": [1, 0, 4],
      "bpm": 200
    }
  ]
}
```

此例转换为基础 `bpm: 170` 及 `bpmChanges: [{ "beat": 4, "bpm": 200 }]`。

`scroll` <Badge type="info" text="ChartStudio" />
```json
{
  "effect": [
    {
      "beat": [1, 0, 1],
      "scroll": 1.0
    }
  ]
}
```

上方 Scroll 事件的 `[1, 0, 1]` 转为 CSC `beat: 4`，倍率 `1.0` 保持原值。

`notes` <Badge type="info" text="ChartStudio" />
```json
{
  "note": [
    {
      "beat": [4, 2, 4],
      "column": 0
    }
  ]
}
```

### Malody 时间事件与错误处理

- 三元组必须是长度为 `3` 的数组，各分量均为有限数字，分母不能为 `0`；换算结果也必须有限。不会整数化或固定保留小数位。
- 当前兼容处理不额外限制分量必须为整数、分子小于分母或坐标非负；这不代表这些情况已在 Malody 编辑器中全部实测。
- `time`、`effect`、`note` 若提供，必须是数组。实际参与转换的 BPM/Scroll 坐标和数值非法时拒绝导入，并指出 `.mc` 文件及 `time[index].beat`、`effect[index].beat` 等位置。
- 不含 `scroll` 的 Effect 不写入 CSC `scroll`；带 `scroll` 的事件保留有限数字倍率，包括 `0`。
- 普通音符的起始坐标非法，或显式 `endbeat` 不是有效三元组、换算后不晚于起始坐标时，拒绝导入；不会丢弃该音符或将无效 Hold 降为 Tap。
- 无轨道的未知特殊事件、普通音符的未知显式类型均拒绝导入；当前普通 Key 音符允许省略 `type`，或使用 `0`、`1`。

BGM 节拍的异常采用上方 Offset 表中的保守告警处理，与普通音符、BPM、Scroll 的错误规则不同。

## DCS 谱面字段映射

### DCS BPM 映射

`bpm` <Badge type="info" text="ChartStudio" />
```json
{
  "bpm": 236
}
```

`bpmChanges` <Badge type="info" text="ChartStudio" />
```json
{
  "bpmList": {
    "0": 236
  }
}
```

导入保留 `musicInfo.bpm` 为谱面基础 `bpm`，不以 `bpmList["0"]` 覆盖它。`bpmList` 转为 `bpmChanges`，仅省略与基础 BPM 相同的零拍项。例如：

```json
{
  "bpm": 202,
  "bpmList": { "0": 236, "32": 180 }
}
```

转换为基础 `bpm: 202` 及 `bpmChanges: [{ "beat": 0, "bpm": 236 }, { "beat": 32, "bpm": 180 }]`；零拍起实际使用 `236`，基础值仍保留。`bpmList: {}` 表示没有 BPM 变化事件。

导出时以数字类型的谱面 `bpm` 为基础值，为 `null` 等非数字值时才尝试元数据 `song.bpm`；最终基础值必须有限，不能用元数据覆盖非法数字基础值。显式零拍事件保存到 `bpmList["0"]`；没有零拍事件时补入基础 BPM。同一数字节拍的重复 BPM 事件取最后一项，按数字节拍整理为 `bpmList`；它是对象，不以 JSON 键的显示顺序定义时间轴。基础值和零拍事件不要求相同；多谱面导出要求它们生成相同的基础 BPM 与完整事件表。

::: warning 当前 DCS BPM 校验边界
DCS 导入检查 `bpm`、`bpmList` 键存在，但尚未完整校验所有 BPM 值：非数字基础 BPM 会变为 `null`；`bpmList` 中无法转为有限节拍的键或非数字值会被跳过。当前 `bpmList: null` 按空表兼容处理，不代表原始格式的普遍承诺，更不代表 `firstTime` 可以为 `null`。导入未统一拒绝非有限数字 BPM，不能把这类数据视为正常可无损转换的谱面；DCS 导出会拒绝无效基础 BPM 和非有限事件数值。
:::

### DCS Scroll 映射

`scroll` <Badge type="info" text="ChartStudio" />
```txt
26.5,0.9
```

映射为 CSC `scroll` 中的 `{ "beat": 26.5, "value": 0.9 }`，节拍坐标与倍率原值保留。

- 每张谱面只读取同名 `_sv.txt`；没有对应文件时 `scroll` 为 `[]`。
- 每个非空行必须是 `beat,value` 两个有限十进制数字，空行忽略。非法行报出文件路径、行号、原文和原因，不会静默丢弃。
- 导入保留原事件顺序，同拍事件不合并；导出按节拍升序稳定排序，同拍事件保持相对顺序。
- 零倍率、小数和有限负值均保留；负值及同拍重复事件在 DCS 内的游戏行为尚未验证。
- 导出不固定保留小数位，TXT 使用普通十进制表示。空数组不生成 `_sv.txt`，非有限坐标或倍率会报错。

`notes` <Badge type="info" text="ChartStudio" />
```txt
1-0.5
6-24-24.5
```

### DCS → CSC 音符展开

DCS 记录中的单个轨道数字对应一个 CSC Note。两位轨道编码表示两个轨道，导入时展开为两个独立的 Note；不能将两位编码作为一个 `lane` 值。

CSC 的轨道编号范围和多押表示方式见 ChartStudio 的格式说明: [CSC 轨道与多押规范](/format/format-metadata-structure#轨道与多押)。

`13-0.5` 转换为两个 Tap：

```json
[
  { "type": "tap", "lane": 1, "beat": 0.5 },
  { "type": "tap", "lane": 3, "beat": 0.5 }
]
```

`23-1.5-2` 转换为两个 Hold：

```json
[
  { "type": "hold", "lane": 2, "beat": 1.5, "endBeat": 2 },
  { "type": "hold", "lane": 3, "beat": 1.5, "endBeat": 2 }
]
```

`13` 和 `31` 表示相同的两个轨道及相同音符位置、类型。双轨编码展开后，轨道顺序不改变音符含义。

导入保留原行及行内轨道顺序，DCS `1～6` 直接对应 CSC `1～6`。当前 Tap/Hold 坐标必须是非负有限数字，Hold 终点必须晚于起点；`11` 这类重复轨道编码、超过两轨、非法字段或数值均报出来源文件、行号、原文和原因。

### CSC → DCS 音符组合

导出为 DCS 时，可将符合条件的 CSC Note 合并为一条双轨记录：

- 起始节拍相同的 Tap 可以两两合并。
- 起始和结束节拍都相同的 Hold 可以两两合并。
- Tap 与 Hold 不合并；同拍的 Tap、Hold 分别输出。
- 起始节拍相同但结束节拍不同的 Hold 分别输出。
- 每条 DCS 音符记录最多编码两个轨道。超过两个的同拍音符拆分为多条记录，例如三押 Tap 可输出为一条双轨记录加一条单轨记录。
- 只合并不同轨道；同轨的重复音符仍分别保存，不生成 `11` 之类的编码。
- 当前实现按起始节拍升序，同拍先 Tap 后 Hold，再按 Hold 终点和轨道组合排序；组合内轨道升序。此确定性顺序不复现 DCS 编辑器的创建历史。
- 导出数值不固定保留小数位；TXT 使用普通十进制表示，细分节拍不会限制为两位小数。完整的谱面数、BPM、资源和难度限制见[导出为 DCS 谱面](/export/export-dcs)。

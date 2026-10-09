# 字段映射规则

本文用以说明谱面工坊如何导入/导出并处理其他编辑器的格式。若您遇到谱面工坊的相关报错信息，可参照本章进行问题排查。

::: tip 提示
由于 `startTime` 在谱面中并没有稳定来源，它将默认为0。

同样的，导出时，`startTime` 将被合并到 `offset` 中。
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
| CSC `song.offset` | ChartStudio 统一的偏移字段；字段本身保留，但当前 Malody 导入尚未将 BGM Offset 写入此字段。 |

当前样本中，`meta.song.file` 和 BGM `sound` 可以同时存在；观察到两者文件名一致，但这不代表所有 Malody 文件都如此。样本范围和统计见[第三方格式解析中的有限样本观察](/format/format-analyze#有限样本观察)。

示例：

```json
{
  "note": [
    {
      "beat": [0, 0, 1],
      "sound": "audio.ogg",
      "offset": 349,
      "type": 1
    }
  ]
}
```

::: warning 当前导入实现状态
当前工作区的 Malody Key 模式导入实现会识别 `type: 1`、包含 `sound` 且不含 `column` 的 BGM 事件，并将其排除在 CSC `notes` 之外。音频引用不一致时，当前实现优先采用 BGM `sound` 并给出告警；没有 BGM 引用时才尝试使用 `meta.song.file`，之后再按文件名或可用音频回退。这描述的是当前工作区实现，不是 Malody 格式对所有编辑器的优先级规定。

实现检测到 BGM `offset` 时会提示其正负方向尚未可靠确认，并让 CSC `song.offset` 保持 `null`。因此，格式来源已识别，但 Malody Offset 到 CSC 的符号转换和写入尚未完成或验证。
:::

### Malody BPM 数据映射
::: info 关于 Malody 的 BPM 字段说明
Malody 将 BPM 放在了 `time` 下，以 `[0, 0, 1]` 作为默认/起始BPM。

因此，谱面工坊将读取 `[0, 0, 1]` 下的 bpm 作为默认 bpm 值。
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

若匹配 `lv(.)+数字`，将其映射为难度等级。

### 多谱面识别

若谱面文件内有不止一个 `.mc` 文件，则将其映射为多个难度，难度默认从“基础”开始排序。

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

`offset` <Badge type="info" text="ChartStudio" />
```json
{
  "firstTime": 230
}
```

## Malody 谱面字段映射
`bpm` <Badge type="info" text="ChartStudio" />

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

`bpmChanges` <Badge type="info" text="ChartStudio" />
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

## DCS 谱面字段映射

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

`scroll` <Badge type="info" text="ChartStudio" />
```txt
26.5,0.9
```

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

### CSC → DCS 音符组合

导出为 DCS 时，可将符合条件的 CSC Note 合并为一条双轨记录：

- 起始节拍相同的 Tap 可以两两合并。
- 起始和结束节拍都相同的 Hold 可以两两合并。
- Tap 与 Hold 不合并；同拍的 Tap、Hold 分别输出。
- 起始节拍相同但结束节拍不同的 Hold 分别输出。
- 每条 DCS 音符记录最多编码两个轨道。超过两个的同拍音符拆分为多条记录，例如三押 Tap 可输出为一条双轨记录加一条单轨记录。
- 使用稳定、确定性的输出顺序即可，不需要复现 DCS 编辑器中的音符创建历史。

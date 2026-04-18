# 字段映射规则

本文用以说明谱面工坊如何导入并处理其他编辑器的格式。若您遇到谱面文件无法导入等问题，可参照本章进行问题排查。

## Malody 元数据映射

`title` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "song": {
      "title": "歌曲名"
    }
  }
}
```
`artist` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "song": {
      "artist": "曲师名"
    }
  }
}
```

`charter` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "creator": "谱师名"
  }
}
```

`preview.start` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "preview": 233
  }
}
```

`song.offset` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "song": {
      "offset" : 230
    }
  }
}
```

### Malody BPM 数据映射
::: info 关于 Malody 的 BPM 字段说明
Malody 将 BPM 放在了 `time` 下，以 `[0, 0, 1]` 作为默认/起始BPM。

因此，谱面工坊将读取 `[0, 0, 1]` 下的 bpm 作为默认 bpm 值。
:::

`song.bpm` <Badge type="tip" text="ChartStudio" />
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

`asset.background` <Badge type="tip" text="ChartStudio" />
```json
{
  "meta": {
    "background": "background.jpg"
  }
}
```

::: warning 警告

该字段出现时机尚不明确。

实验性功能。
:::
`song.offset` <Badge type="tip" text="ChartStudio" /> <Badge type="warning" text="实验性" />
```json
{
  "note": {
    "beat": [0, 0, 1],
    "sound": "audio.ogg",
    "vol": 100,
    "offset": 349,
    "type": 1
  }
}
```

### Malody 映射补充

- `asset.audio`
- `asset.cover`

以上字段将自动识别文件夹内音频文件与封面文件。

若出现多个音频文件/封面文件，谱面工坊将弹窗让用户主动选择指定文件。

- `version` 

若匹配 `lv(.)+数字`，将其映射为难度等级。

## DCS 元数据映射

`title` <Badge type="tip" text="ChartStudio" />
```json
{
  "name": "曲名"
}
```

`artist` <Badge type="tip" text="ChartStudio" />
```json
{
  "autor": "曲师"
}
```

`bpm` <Badge type="tip" text="ChartStudio" />
```json
{
  "bpm": 236
}
```

`offset` <Badge type="tip" text="ChartStudio" />
```json
{
  "firstTime": 230
}
```

## 谱面数据映射

### Malody 谱面映射规则
`bpm` <Badge type="tip" text="ChartStudio" />

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

`bpmChanges` <Badge type="tip" text="ChartStudio" />
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

`scroll` <Badge type="tip" text="ChartStudio" />
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

`notes` <Badge type="tip" text="ChartStudio" />
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

### 谱面映射说明
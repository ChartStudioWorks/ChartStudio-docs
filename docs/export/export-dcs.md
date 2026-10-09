# 导出为 DCS 谱面

当前 ChartStudio 支持将 CSC 工程导出为 DCS `.zip`。在谱面信息面板选择“导出”，再选择“DCS `.zip`”并确认。

## 导出内容

```text
<曲名>.zip
├── musicInfo.json
├── A017.txt
├── A017_sv.txt
├── audio.wav
├── bg.jpg
└── bigBg.jpg
```

| 文件 | 当前输出规则 |
| --- | --- |
| `musicInfo.json` | 保存 `name`、`autor`、基础 `bpm`、`bpmList` 及秒单位的 `firstTime`。 |
| `A～E` 难度 `.txt` | 保存 Tap/Hold，名称为“难度字母 + 0 + 等级”，如 `A06.txt`、`A017.txt`、`A0114.txt`。 |
| 同名 `_sv.txt` | 保存该难度的 Scroll；没有事件时不生成。 |
| `audio.wav` | 主音频，必须存在。已有 WAV 原样写入，其他音频由浏览器解码后转换为 PCM WAV。 |
| `bg.jpg`、`bigBg.jpg` | 可选封面和背景；已有 JPG/JPEG 原样写入，其他图片转换为 JPG。 |

当前按谱面文件顺序与 `metadata.charts` 的条目顺序对应分配难度。已知难度键优先使用下表字母，其他键使用尚未占用的 A–E 字母；不会仅根据 `.chart` 文件名推断难度。

| CSC 难度键 | DCS 字母 |
| --- | --- |
| `basic` | A |
| `advanced` | B |
| `expert` | C |
| `master` | D |
| `legend` | E |

## 转换规则

- 轨道 `1～6` 保持编号。同拍不同轨道的 Tap、同起止拍的 Hold 分别两两组合，每条最多两轨；排序与精度见[CSC → DCS 音符组合](/import/import-mapping-rules#csc-→-dcs-音符组合)。
- 基础 BPM 与零拍事件分别保存，多谱面需要共用一致的 BPM 数据，详见[DCS BPM 映射](/import/import-mapping-rules#dcs-bpm-映射)。
- `_sv.txt` 按节拍稳定排序，保留零倍率、小数及同拍事件，详见[DCS Scroll 映射](/import/import-mapping-rules#dcs-scroll-映射)。
- `firstTime = (song.startTime + (song.offset ?? 0)) / 1000`，详见[DCS 时间字段映射](/import/import-mapping-rules#dcs-时间字段映射)。

## 导出限制

遇到以下情况会报错，不生成不完整下载：

- 没有可导出的谱面，或谱面超过五张。
- `metadata.charts` 没有足够的难度条目，或对应等级不是非负整数。
- 多张谱面的基础 BPM 或完整 BPM 事件表不一致。
- 缺少有效基础 BPM、音频资源，或时间、音符、BPM/Scroll 事件含有当前导出器不接受的数值。
- 浏览器无法解码音频或转换图片。

CSC 的 `offset: null` 导出时按零额外偏移处理；重新导入后得到数字偏移，无法恢复原来的“未知”状态。Malody 导入的多谱面工程当前未自动生成完整难度映射，详见[多谱面识别](/import/import-mapping-rules#多谱面识别)。

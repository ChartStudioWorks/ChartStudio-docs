# DCS 谱面包结构

DCS 文件可以放在 `.mcz`、`.zip` 或 `.7z` 压缩包中。常见文件结构如下：

```text
DCS-package/
├── musicInfo.json
├── A06.txt
├── A06_sv.txt
├── audio.wav
├── bg.jpg
└── bigBg.jpg
```

| 文件 | 用途 |
| --- | --- |
| `musicInfo.json` | 曲目元信息。 |
| `A06.txt` | 谱面数据文件；不同难度级别使用不同文件名，例如 `A017.txt`、`A0114.txt`。 |
| `A06_sv.txt` | 对应谱面的变速数据文件，文件名在谱面文件名后加 `_sv`。 |
| `audio.wav` | 歌曲音频。 |
| `bg.jpg` | 封面图片。 |
| `bigBg.jpg` | 背景图片。 |

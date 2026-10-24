# 素材版权说明

## 背景音乐

- 曲目：**Funk Game Loop**
- 作者：Kevin MacLeod (incompetech.com)
- 许可：**CC BY 3.0**（署名即可商用）
- 来源：https://incompetech.com/music/royalty-free/funk-game-loop.html
- 本地文件：`public/bgm.mp3`（在 `AudioTrack` 中循环播放）

**使用要求**：公开发布时需在视频说明或片尾标注作者与许可，例如：

> BGM: "Funk Game Loop" by Kevin MacLeod (incompetech.com) — CC BY 3.0

## 配音

- 引擎：Microsoft Edge TTS（`zh-CN-YunxiNeural`），由 `make_voice.py` 从字幕轨生成
- 微软神经网络语音的使用需遵循 Microsoft 服务条款；商用前建议确认，或替换为自有录音 / 商用授权 TTS
- 本地文件：`public/voice.mp3`；逐条片段在 `public/vo/`

## 更换素材

- 换 BGM：替换 `public/bgm.mp3`（会自动循环，无需改代码）
- 换配音：替换 `public/voice.mp3`（需与字幕轨时间码对齐，用 `make_voice.py` 重新生成最省事）
- 只想静音音乐：`MuseWonder.tsx` 里给 `<AudioTrack bgmSrc={null} />`

## 0. 先对齐原版实测指标（不要拍脑袋定节奏）

有母版素材时，先量化它，再让成片对齐这些数字。参考博主近 10 条视频的实测基准（来自逐帧+音频统计）：

| 指标 | 实测值 |
|---|---|
| 单条字幕 | 3.0-3.34s / 约 17 字 |
| 语速 | ~5.47 汉字/秒 |
| 字幕条数 | 47-93（中位 68），总字数 700-1800 |
| 页数 | 18-30，每页 4-8s（复杂页更长，但页内要有持续视觉落点） |
| 字幕轨 | **几乎无缝填满全片**（64条×3.27s ≈ 成片时长），句间不留白 |
| 转场 | **80% 硬切 + 20% 推近/滑入**，不是全片滑动 |
| 页内动感 | 页面 100%→106% 缓慢推近（Ken Burns）、高亮刷、箭头绘制、指针移动 |
| 固定品牌层 | 右上角作者头像+名字，10/10 全有 |
| 章节页 | 每 20-50s 一个大标题页，4-10 字，只做视觉重定位 |

「节奏快」的正确理解：**每 3 秒一个新视觉落点**（短字幕+多页面+页内小动作），而不是"总时长短+少页面"。内容少、页面停留久才是真正的拖沓。

工具：`build_timeline.py` 把「镜头组+文案」自动变成 TTS→测时长→排时间码→铺配音轨→输出 `src/data/timeline.ts`，并打印与原版指标的对比（字数/语速/条数）。改文案后重跑即可，TTS 有缓存。

## 1. 配音：从字幕轨自动生成

模板自带 `make_voice.py`，原理是「字幕轨即配音稿」：每条 cue 单独 TTS → 超长则轻微加速塞进窗口 → 按 `start` 时间码铺轨。

```bash
pip install edge-tts        # 微软神经网络语音，中文自然度够用
python3 make_voice.py       # 产出 public/voice.mp3（与视频等长）
```

关键参数（脚本顶部）：

| 参数 | 建议 | 说明 |
|---|---|---|
| `VOICE` | `zh-CN-YunxiNeural` | 中文男声，科技解说合适；女声用 `zh-CN-XiaoxiaoNeural` |
| `RATE` | `+12%` | 信息流节奏偏快；超过 `+15%` 会显得赶 |
| 加速上限 | `1.35x` | 超过会明显变声，此时应改文案而不是硬压 |

**时间码对齐原则**：字幕轨的秒数是唯一时间基准，配音去迁就它，不是反过来。

### 节奏 = 由配音时长反推镜头时长（重要）

「节奏快」不是把动画调快就完事——**节奏拖沓的根源是镜头窗口比配音长 2-3 倍，画面在空转等旁白说完**。正确流程：

1. 先按目标语速生成配音，拿到每条 cue 的真实语音时长
2. 镜头时长 ≈ 语音时长 + 1.5~2.5s 缓冲（信息密集镜头取上限，过渡镜头取下限）
3. 按新窗口重排 cue 时间码，重新铺配音，确认**零压缩**（没有一条需要 atempo 加速）
4. 最后才调动效参数

实测样例：215s 版（语音 124s，浪费 91s）→ 语速 +12%→+20% → 按语音重排 → **147.8s**，提速 31%，且 19 条 cue 全部自然适配、零压缩。

配套动效提速参数（30fps）：`Rise` spring `durationInFrames 22→14, mass 0.6→0.45`；`CountUp duration 28→18`；`GrowBar 26→16`；`StaggerText perChar 2→1.3`。改完后检查每个镜头时长 ≥ 场景内最长动画链（约 3s），StoryScene / BlueprintScene 的分步时序是按 `durationInFrames` 自适应的，镜头缩短会自动加快，无需改。

常见坑：
- 一条 cue 语音超出窗口 → 脚本自动 `atempo` 压缩；若频繁触发（>5 条），说明这版文案写长了，回去精简字幕
- 数字读法：`100 万 token` 写成中文数字更稳；型号名（GPT-6）保持英文
- TTS 失败/无网 → 降级用 macOS `say -v Tingting -o out.aiff`，再 `ffmpeg` 转 mp3

## 2. BGM：轻快、无版权、可循环

选用标准：
- **轻快但不抢戏**：funk / upbeat electronic / ukulele，避免有强烈记忆点的流行曲
- **可循环**：30-90 秒的 loop 最佳，Remotion 的 `<Audio loop>` 会自动接
- **授权干净**：CC0 / CC BY（署名即可）

已验证的可用来源：

| 来源 | 说明 |
|---|---|
| incompetech.com (Kevin MacLeod) | CC BY 3.0，直链可 curl 下载，**需署名** |
| Pixabay Audio | 需登录/API，直链常 403 |
| Free Music Archive | CC0/CC BY 混杂，下载前看清许可 |

下载后放 `public/bgm.mp3`，代码不用改。**务必在 `public/CREDITS.md` 记录曲目/作者/许可**，CC BY 要求在发布时署名。

## 3. 混音：BGM 自动闪避（关键）

最忌讳 BGM 把解说糊住。模板的 `src/components/AudioTrack.tsx` 用**按帧计算音量**实现 ducking：

```tsx
const pressure = speechPressure(t, cues);      // 当前是否有人声（0~1，边界平滑过渡）
const vol = bgmVolume * (1 - pressure * 0.7) * fadeIn * fadeOut;
```

- 有人声 → BGM 压到 30%
- 空隙 → 回升到 100%
- `DUCK_FADE = 0.35s` 过渡，避免音量跳变
- 首尾各 1.5s / 2.5s 淡入淡出

### 音量怎么定：用「电平差」而不是拍脑袋

`bgmVolume` 不是固定值——它取决于你的 BGM 素材本身有多响。**先测两条轨的原始电平**：

```bash
ffmpeg -hide_banner -i public/bgm.mp3  -af volumedetect -f null /dev/null 2>&1 | grep mean_volume
ffmpeg -hide_banner -i public/voice.mp3 -af volumedetect -f null /dev/null 2>&1 | grep mean_volume
```

标准（实测经验值）：

| 场景 | BGM 相对人声 |
|---|---|
| 说话时 | 低 **12-18 dB**（听得出有音乐，但不抢词） |
| 空隙时 | 低 **6-10 dB**（音乐明显浮上来） |

换算：`bgmVolume ≈ 10^((voice_dB - bgm_dB - 目标差) / 20)`。
经验起点：BGM 原曲比配音**响**时取 `0.30-0.40`；比配音**轻**时取 `0.6-1.0`。

实测样例：BGM -18.4 dB、配音 -27.5 dB → 取 `bgmVolume = 0.34`，得到空隙 -33 dB / 说话时 -38 dB。

**别只看音量数值**——BGM 太轻（空隙低于 -40 dB）等于没加音乐，这是最常见的过度保守。

挂载方式（`MainVideo.tsx`）：

```tsx
<Sequence from={0} durationInFrames={s(TOTAL)} name="audio">
  <AudioTrack cues={cues} />
</Sequence>
```

只要字幕不想要音乐：`<AudioTrack bgmSrc={null} />`。

## 4. 验证音频真的挂上了

```bash
ffprobe -v error -show_entries stream=codec_type,codec_name -of default=noprint_wrappers=1 out/video.mp4
# 应看到 codec_type=audio, codec_name=aac

ffmpeg -hide_banner -i out/video.mp4 -af volumedetect -f null /dev/null 2>&1 | grep mean_volume
# 静音的话 mean_volume 会是 -91 dB 左右；正常配音在 -25 ~ -30 dB
```

## 5. 想用真人录音

录好后按字幕轨时间点对齐：把每段录音命名 `public/vo/c00.mp3` …（与 cue 序号一致），再跑 `make_voice.py`——脚本检测到文件已存在会跳过 TTS，直接做铺轨混音。

---

> 注：本章其余小节（TTS 参数、BGM、闪避、混音电平差）仍然适用；build_timeline.py 已内置闪避所需的连续 cue 时间码。

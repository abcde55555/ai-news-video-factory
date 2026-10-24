# 技术选型：Remotion 能做吗？

## 结论

**能，而且是最合适的选择。** 目标效果的本质是「按帧驱动的 React 布局动画」，不是后期合成——正好是 Remotion 的主场。

## 为什么是 Remotion

| 需求 | Remotion 方案 | 评价 |
|---|---|---|
| 动效信息图（卡片/数字/进度条） | React + CSS，`spring()` / `interpolate()` 驱动 | 原生擅长 |
| 产品 UI 模拟（会话窗、看板） | 直接用 div/SVG 画，比截图更可控 | 原生擅长 |
| 逐字/逐项入场 | `spring` + 逐项 delay | 原生擅长 |
| 大数字滚动 | `interpolate` + `toFixed` | 原生擅长 |
| 硬字幕轨 | 数组 + `useCurrentFrame` 查当前 cue | 几十行搞定 |
| 时间轴编排 | `<Sequence from durationInFrames>` | 原生擅长 |
| 数据驱动批量产片 | 改 JSON 就能换选题 | **决定性优势** |
| 可视化微调 | Remotion Studio 拖拽时间轴 | 原生擅长 |
| 输出 | MP4 / WebM / GIF / PNG 序列 | 够用 |

**决定性理由**：这类视频的核心资产是「结构」而不是「素材」。Remotion 让结构变成代码，换选题 = 换一个数据文件，第 2 条视频的边际成本趋近于零。

## 对照方案

| 方案 | 适合 | 为什么这里不选 |
|---|---|---|
| AE / 剪映 | 一次性精美片 | 不可复用，改字=重导出，无法批量 |
| ffmpeg + 图片序列 | 已有素材的拼接 | 动效全得预渲染，改文案极痛 |
| Python (Manim / MoviePy) | 数学动画 | 中文排版和 UI 模拟很痛苦 |
| 浏览器录屏 + 后期 | 演示真实产品 | 不可控、不可批量、画质差 |
| **Remotion** | **数据驱动的信息图视频** | **✅ 选它** |

## Remotion 的能力边界（实测）

**能做**：
- 一切 CSS/SVG 能表达的 2D 动效
- React Three Fiber（`@remotion/three`）做 3D
- Lottie（`@remotion/lottie`）
- Tailwind / Google Fonts
- 音频可视化、字幕、转场（`@remotion/transitions`）
- Remotion Studio 可视化编辑
- 官方提供 **Agent Skills**：`npx -y skills@latest add remotion-dev/skills -g -y`

**做不了或不划算**：
- 真人出镜口播（得另拍，用 `<Video>` 组件贴进去）
- 复杂粒子/流体特效（能做但吃性能）
- 需要真实产品录像的部分（只能"模拟"成 UI 图）
- **在受限沙箱内渲染**——Chrome 需要写临时 profile，见 `rendering.md`

## 环境要求

- macOS 15+（实测 macOS 26.5 正常）／ Linux libc ≥ 2.35
- Node 16+（实测 22.22 正常）
- Chrome 或 Chromium（Remotion 首次会自动下载 Headless Shell，约 85 MB）
- ffmpeg（Remotion 内置，也可复用系统的）

## 推荐的 UI 实现路线

1. **先做数据层**：`src/data/<topic>.ts` 装全部文案与数字
2. **再做组件层**：`src/components/scenes.tsx` 一次性做好 10 种版式，之后基本不改
3. **最后排时间轴**：`src/MainVideo.tsx` 里只写 `from` / `dur` 秒数

日常产片只碰第 1 步和第 3 步。

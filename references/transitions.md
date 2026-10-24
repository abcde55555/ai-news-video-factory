# 转场与视觉母题（向原版学的东西）

「生硬」的根源不是动效不够多，而是三件事：**镜头硬切、没有贯穿母题、版式是 PPT 不是产品**。
母版视频（参考博主 Claude Duet 一条）的精髓是「产品在现场」：

## ⚠️ 参考别人的风格，不复制别人的身份

拆解母版是为了学**结构、节奏、版式、动效**，不是搬它的身份标识。红线：

- ❌ 不要复用对方的名字、头像、Logo、账号名、水印
- ❌ 不要照抄文案（结构可以对齐，措辞必须自己写）
- ✅ 品牌水印用 `theme.ts` 的 `brand` 填**自己的**名字；默认为空即不渲染

## 1. 转场：画面被推走，不是切走

用 `@remotion/transitions` 的 `TransitionSeries`，**版本必须与 remotion 核心完全一致**
（如都是 4.0.410；装 latest 会 import 新版 remotion 才有的 export，运行时报 `Interactive not found`）。

```bash
npm install @remotion/transitions@<与remotion同版本>
```

结构（模板 `src/MuseWonder.tsx` 已实现）：

```tsx
<TransitionSeries>
  {SHOTS.flatMap((shot, i) => [
    i > 0 && <TransitionSeries.Transition presentation={...} timing={linearTiming({durationInFrames: 15})} />,
    <TransitionSeries.Sequence durationInFrames={s(shot.dur) + s(0.5)}>{shot.node}</TransitionSeries.Sequence>,
  ])}
</TransitionSeries>
```

**关键技巧：每个 Sequence 时长多给 0.5s（转场时长），镜头起点保持不变**——cue 时间码和配音完全不用重排，转场发生在每个镜头的"尾部补偿帧"里。

转场设计语言（有语义，不是随机）：
- 常规镜头：`slide({direction: 'from-right'})`——内容从右推入，原版主方向
- **进入重点章节**：`from-bottom`——方向突变 = "这里最重要"
- 结尾：`fade()`——回归平静

## 2. 贯穿母题：手机 + 聊天界面

一个 `PhoneMockup` 组件贯穿全片：标题卡右侧 mini 手机（气泡弹出演示卖点）、故事段整屏聊天模拟。
**故事不用卡片讲，用对话讲**：用户气泡（上传材料）→ AI 打字指示器 → AI 主动推进（任务清单卡）→ 引用历史条款（引用卡）→ 关键动作弹确认卡。
消息弹出时间（镜头内相对秒）与 cue 时间码对齐，右侧大字标注（DAY 1/2/3）随解说切换。

布局大坑：**Remotion 的 `AbsoluteFill` 默认 `flexDirection: 'column'`**——想要左右并排必须显式写 `flexDirection: 'row'`，否则子元素垂直堆叠被挤出画面（症状：元素"消失"或在画面底部露出一条）。

## 3. 版式要有「产品感」

信息卡（四宫格/对比条）适合规格与数据段；但叙事段必须回到产品 UI 模拟。判断标准：**观众觉得在"看一个 app 工作"，而不是"看幻灯片"**。UI 模拟的真实感来自细节：状态栏（9:41+电池）、对话头（头像+在线状态）、输入栏、附件条、打字指示器、按钮的点击态。

## 4. 冒烟渲染先看转场帧

转场帧（镜头起点后 0~0.5s）最容易出问题：`--frame` 取转场中间帧，确认两个画面混合时没有穿帮。

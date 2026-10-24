import type {Cue} from '../components/SubtitleTrack';

/** 所有事实均可溯源，见 script/MuseWonder_复刻脚本.md 的核验清单 */
export const content = {
  fourGrid: [
    {icon: 'memory' as const, title: '跨对话记得你', desc: '重要上下文自己留着，需要时自己取出来'},
    {icon: 'reroute' as const, title: '卡住了换路走', desc: '遇到阻碍换方法，从错误里恢复继续推进'},
    {icon: 'confirm' as const, title: '重要动作先问你', desc: '执行关键操作之前停下来等你确认'},
    {icon: 'focus' as const, title: '拿到目标不撒手', desc: '长任务持续推进，不中途丢掉目的'},
  ],

  story: {
    title: '处理一份保险理赔，跨了三天',
    steps: [
      {
        day: 'DAY 1',
        head: '你把材料丢给它',
        body: '上传保单、医疗记录和一沓邮件附件，问了一句「我能赔多少」。',
      },
      {
        day: 'DAY 2',
        head: '它自己接着查',
        body: '比对条款、标记缺一份事故证明，没有停在原地等你追问。',
        tone: 'highlight' as const,
      },
      {
        day: 'DAY 3',
        head: '带回上周的条款',
        body: '你上周随口提过的那条免赔额，它在第三天主动调出来用在计算里。',
        tone: 'highlight' as const,
      },
      {
        day: 'DAY 3 · 卡住',
        head: '换路径，先问你',
        body: '联系客服这条路走不通，它换了个办法，并先问你要不要让它发这封邮件。',
      },
    ],
  },

  statContext: {
    kicker: '规格',
    big: {value: 100, unit: '万 token', label: '上下文窗口，从上一代的量级再往上抬', decimals: 0},
    chips: [
      {label: '文本输入', value: '支持'},
      {label: '图像输入', value: '支持'},
      {label: '音频输入', value: '支持'},
      {label: '视频输入', value: '支持'},
      {label: '输出', value: '仅文本'},
    ],
    note: '提示词可以混合四种模态，但回答只以文本返回。',
  },

  statPrice: {
    kicker: '定价',
    big: {value: 4, unit: '美元 / 百万输入 token', label: '输出 20 美元；缓存命中再打 0.5 折', decimals: 0},
    chips: [
      {label: '输入', value: '$4'},
      {label: '输出', value: '$20'},
      {label: '缓存折扣', value: '95%'},
    ],
    note: 'Muse Wonder 通过 Meta Model API 与 Muse Code 提供。',
  },

  compareLegal: {
    kicker: '法律智能体基准',
    title: "Harvey LAB：只有全部达标且通过幻觉检查才算通过",
    rows: [
      {name: 'Muse Wonder Full', value: 13.1, color: '#0866FF'},
      {name: 'GPT-6 Astra', value: 8.6, color: '#9AA0AA'},
    ],
    footnote: '数据来源：Meta 模型卡。',
  },

  compareCode: {
    kicker: '长周期编程',
    title: 'SWE-Marathon：连续多步改代码直到跑通',
    rows: [
      {name: 'Muse Wonder Full', value: 57.5, color: '#0866FF'},
      {name: 'Claude Opus 5.5', value: 46.3, color: '#9AA0AA'},
    ],
    footnote: 'Meta 注明：这组数据并非在受控条件下进行的比较。',
  },

  /** 第三方独立评测：不只用对自己有利的数字 */
  compareIndex: {
    kicker: '第三方视角',
    title: 'Artificial Analysis 综合智能指数',
    rows: [
      {name: 'Claude Opus 5.5', value: 58, color: '#9AA0AA'},
      {name: 'Muse Wonder Full', value: 56, color: '#0866FF'},
      {name: 'Muse Wonder', value: 52, color: '#6EA8FF'},
    ],
    footnote: '独立评测机构 Artificial Analysis，非 Meta 自测。',
  },

  /** 平衡视角：也有落后项 */
  compareBalance: {
    kicker: '也有落后',
    title: '这两项 Claude Opus 5.5 更高',
    rows: [
      {name: 'Terminal-Bench 4.0 · Opus', value: 59.6, color: '#9AA0AA'},
      {name: 'Terminal-Bench 4.0 · Full', value: 57.1, color: '#0866FF'},
    ],
    footnote: 'HealthBench Pro 同样落后：62.3 对 65.6。',
  },

  split: {
    kicker: '两个新能力',
    left: {
      title: 'Active Memory',
      sub: '主动记忆 · 记得什么',
      color: '#0866FF',
      points: ['跨对话保留与你相关的上下文', '在细节变得重要时主动检索回来', '记忆从容量问题变成判断问题'],
    },
    right: {
      title: 'Active Focus',
      sub: '主动聚焦 · 撑到做完',
      color: '#12A87A',
      points: ['任务变难时继续朝目标推进', '尝试替代路径、从错误中恢复', '用 FocusBench 与 SWE-Marathon 验证'],
    },
  },

  access: {
    kicker: '怎么拿到',
    title: '两个入口，Full 版只走订阅',
    cards: [
      {head: 'Meta Model API', body: '开发者直接调用 Muse Wonder，按 token 计费。', tag: '今日可用', tone: 'accent' as const},
      {head: 'Muse Code', body: '订阅制编程产品，也是 Wonder Full 的唯一入口。', tag: '今日可用', tone: 'plain' as const},
      {head: '订阅档位', body: 'Power 每月 50 美元，Maximum 每月 200 美元。', tag: '$50 / $200', tone: 'plain' as const},
    ],
  },

  blueprint: {
    title: '安全设计图',
    steps: [
      {no: '01', head: '未经许可，不分享你的私人信息', body: '训练目标明确包含：不得在未经允许时透露个人数据。', tone: 'ok' as const},
      {no: '02', head: '拒绝对有害行为的协助', body: '拒绝协助执行真正会造成伤害的请求。', tone: 'warn' as const},
      {no: '03', head: '保留找漏洞的能力', body: '开发者与安全团队仍可用它审查自己的代码、加固系统。', tone: 'ok' as const},
      {no: '04', head: '按超级智能扩展框架评估', body: '训练、评估、发布均对齐 Meta 自定的扩展框架标准。', tone: undefined},
      {no: '05', head: '完整安全评估报告尚未发布', body: '官方表示更完整的安全评估报告将随后提供。', tone: 'pending' as const},
    ],
  },

  limits: {
    kicker: '先把话说满：三条局限',
    items: [
      {head: 'Full 版不开放 API', body: '能力更强的 Wonder Full 只能通过 Muse Code 订阅使用，每月 50 或 200 美元。'},
      {head: '输出只有文本', body: '可以喂给它图、音频和视频，但回答不会回图片或视频，也没有开源权重。'},
      {head: '订阅默认贡献数据', body: 'Muse Code 订阅默认开启 Contributor 模式，Meta 可用你的提示词与代码改进模型；API 版是 Standard 模式。'},
    ],
  },

  source: {
    title: '以上内容来自',
    sources: [
      'Meta 官方新闻稿：Introducing Muse Wonder and Muse Wonder Full',
      'Meta Research 博客与模型卡（含基准测试数据）',
      '第三方评测机构 Artificial Analysis 综合智能指数',
    ],
    disclaimer: '本片为公开信息整理，非 Meta 官方内容。数据截至 2026 年 10 月。',
  },
};

/** 字幕轨（单位：秒） */
export const cues: Cue[] = [
  {start: 0.4, end: 7.9, text: 'Meta 在 10 月 12 日发布 Muse Wonder。所有人都在比谁装得多，它反过来问：该记住什么。'},
  {start: 9.2, end: 14.9, text: '跨对话记得你、卡住了换路走、重要动作先问你、拿到目标不撒手。'},
  {start: 16.0, end: 20.9, text: '看一个真实场景：处理一份保险理赔，这件事跨了三天。'},
  {start: 21.4, end: 27.5, text: '第二天，它比对条款、标记缺一份事故证明，没有停在原地等你追问。'},
  {start: 28.0, end: 34.4, text: '第三天，你上周随口提过的免赔额条款，它自己调出来用在了计算里。'},
  {start: 36.5, end: 44.2, text: '规格上，上下文窗口 100 万 token，输入支持文本、图像、音频和视频，但输出只有文本。'},
  {start: 46.0, end: 52.4, text: '定价是每百万输入 token 4 美元、输出 20 美元，缓存命中打 0.5 折。'},
  {start: 54.2, end: 63.3, text: '法律智能体基准 Harvey LAB，Muse Wonder Full 通过率 13.1%，最接近的 GPT-6 Astra 是 8.6%。'},
  {start: 65.2, end: 72.0, text: '长周期编程 SWE-Marathon，57.5% 对 Claude Opus 5.5 的 46.3%。'},
  {start: 73.7, end: 79.3, text: '两个新能力：Active Memory 管记得什么，Active Focus 管撑到做完。'},
  {start: 81.7, end: 88.3, text: '模型在吉瓦级的 Prometheus 数据中心训练，延续 Muse Spark 的预训练与强化学习方法。'},
  {start: 90.1, end: 97.0, text: 'Muse Wonder 走 Meta Model API 和 Muse Code，Full 版只给订阅用户，每月 50 或 200 美元。'},
  {start: 98.9, end: 105.2, text: '接下来是安全。训练目标里明确写了：未经你的许可，不分享你的私人信息。'},
  {start: 105.7, end: 111.8, text: '它拒绝对有害行为的协助，同时保留帮安全团队找漏洞、加固系统的能力。'},
  {start: 112.3, end: 119.3, text: '评估按 Meta 超级智能扩展框架执行，但更完整的安全评估报告，官方说还要再等等。'},
  {start: 121.4, end: 126.5, text: '局限一：Full 版不开放 API，只能订阅 Muse Code。'},
  {start: 127.0, end: 131.4, text: '局限二：输出只有文本，不会回图片或视频。'},
  {start: 131.9, end: 137.2, text: '局限三：竞品对比是 Meta 自己测的，并非受控条件。'},
  {start: 139.4, end: 146.2, text: '以上内容来自 Meta 官方新闻稿、研究博客模型卡，以及第三方评测机构数据。'},
];

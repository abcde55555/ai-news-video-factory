#!/usr/bin/env python3
"""
按原版指标重建时间轴。

原版实测基准（参考博主近 10 条）：
  - 单条字幕 3.0-3.34s / 约 17 字；总字数 700-1800（中位 ~1230）
  - 语速约 5.47 汉字/秒；页数 18-30；每页 4-8s
流程：定义镜头组与文案 -> TTS -> 实测语音时长 -> 镜头时长=语音和+缓冲 -> 输出 cues 与 shots
"""
import asyncio, json, os, re, subprocess
import edge_tts

ROOT = os.path.dirname(os.path.abspath(__file__))
VOICE = "zh-CN-YunxiNeural"
RATE = "+8%"            # 目标语速 5.47 字/秒；+20% 太快，+8% 更接近原版
TAG = "s08"
OUT_DIR = os.path.join(ROOT, "public", "vo")
TRACK = os.path.join(ROOT, "public", "voice.mp3")

# 镜头组：(id, prop/chapter, 转场, 缓冲秒, [文案...])
# 缓冲含义：语音之外的呼吸时间（章节页/信息密集页给更多）
SHOTS = [
    ("title",    None,        "none",   1.4, [
        "Meta 在十月十二日，发布了新模型 Muse Wonder。",
        "所有人都在比，谁的上下文装得更多。",
        "它反过来问了另一个问题：该记住什么。",
    ]),
    ("chapter",  "四个能力",   "right",  1.0, ["先看它多了哪四种能力。"]),
    ("four",     None,        "right",  1.2, [
        "能力一：跨对话记得你，重要上下文自己留着。",
        "能力二：卡住了换路走，从错误里恢复继续推进。",
        "能力三：关键操作之前，停下来等你确认。",
        "能力四：长任务持续推进，不中途丢掉目的。",
    ]),
    ("chapter",  "一个场景",   "right",  1.0, ["看一个具体场景，会更清楚。"]),
    ("chat",     None,        "right",  1.6, [
        "假设你在处理一份保险理赔，事情跨了三天。",
        "第一天，你把保单、病历和一沓邮件附件丢给它。",
        "只问了一句：我这种情况能赔多少。",
        "第二天，它比对完条款，发现少一份事故证明。",
        "没有停在原地等你追问，它自己接着往下查。",
        "第三天，你上周随口提过的免赔额条款，",
        "它在计算里主动调了出来，用上了。",
        "联系客服这条路走不通，它就换了个办法。",
        "发邮件之前，它先问你：要不要发这封。",
    ]),
    ("chapter",  "规格",      "right",  1.0, ["再看纸面规格。"]),
    ("stat",     "statContext", "right", 1.4, [
        "上下文窗口一百万 token，比上一代再往上抬。",
        "输入支持文本、图像、音频和视频四种模态。",
        "提示词可以混着给，但回答只以文本返回。",
    ]),
    ("stat",     "statPrice", "right",  1.4, [
        "定价是每百万输入 token 四美元。",
        "输出二十美元，缓存命中再打零点五折。",
        "长对话的成本，主要就压在缓存命中率上。",
    ]),
    ("chapter",  "跑分",      "right",  1.0, ["接下来看跑分到底怎么样。"]),
    ("compare",  "compareLegal", "right", 1.5, [
        "法律智能体基准 Harvey LAB 上，",
        "Muse Wonder Full 通过率百分之十三点一，",
        "最接近的 GPT-6 Astra 是百分之八点六。",
    ]),
    ("compare",  "compareCode", "right", 1.5, [
        "长周期编程 SWE-Marathon，",
        "它拿到百分之五十七点五，",
        "Claude Opus 5.5 是百分之四十六点三。",
    ]),
    ("split",    None,        "right",  1.4, [
        "两个新能力撑起了这些表现。",
        "Active Memory 管的是：该记住什么。",
        "Active Focus 管的是：能不能撑到做完。",
        "一个管记忆取舍，一个管长跑耐力。",
    ]),
    ("cards",    "train",     "right",  1.4, [
        "模型在吉瓦级的 Prometheus 数据中心训练。",
        "延续了 Muse Spark 的预训练与强化学习方法。",
        "另有 FocusBench 专门衡量持续推进能力。",
    ]),
    ("cards",    "access",    "right",  1.4, [
        "Muse Wonder 走 Meta Model API 和 Muse Code。",
        "Full 版只给订阅用户，每月五十或两百美元。",
        "普通版开放得更早，Full 版还在排队。",
    ]),
    ("chapter",  "安全边界",   "bottom", 1.2, ["下面这段，是最该看的部分。"]),
    ("blueprint", None,       "right",  1.6, [
        "训练目标里明确写了：未经你的许可，",
        "不分享你的私人信息。",
        "它拒绝对有害行为的协助，",
        "同时保留帮安全团队找漏洞、加固系统的能力。",
        "评估按 Meta 超级智能扩展框架执行，",
        "但更完整的安全报告，官方说还要再等等。",
    ]),
    ("chapter",  "三条局限",   "right",  1.0, ["局限也一起说清楚。"]),
    ("limits",   None,        "right",  1.4, [
        "局限一：Full 版不开放 API，只能订阅 Muse Code。",
        "局限二：输出只有文本，不会回图片或视频。",
        "局限三：竞品对比是 Meta 自己测的，",
        "并非受控条件，参考价值要打个折。",
    ]),
    ("source",   None,        "fade",   1.4, [
        "以上内容来自 Meta 官方新闻稿、研究博客与模型卡，",
        "以及第三方评测机构的公开数据。",
    ]),
]

def dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=noprint_wrappers=1:nokey=1", path],
                       capture_output=True, text=True)
    return float(r.stdout.strip())

async def synth(idx, text, sem):
    p = os.path.join(OUT_DIR, f"s{idx:02d}_{TAG}.mp3")
    if not os.path.exists(p):
        async with sem:
            await edge_tts.Communicate(text, VOICE, rate=RATE).save(p)
    return p

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1) 全部 TTS
    flat = [(i, t) for _, _, _, _, cs in SHOTS for i, t in enumerate(cs)]
    flat = [(k, t) for k, (_, t) in enumerate(flat)]
    sem = asyncio.Semaphore(4)
    files = await asyncio.gather(*[synth(k, t, sem) for k, t in flat])
    durs = {k: dur(f) for (k, _), f in zip(flat, files)}
    print(f"TTS 完成 {len(files)} 条，语速 {RATE}", flush=True)

    # 2) 排时间轴
    t = 0.0
    all_cues, shots = [], []
    k = 0
    for sid, prop, enter, pad, texts in SHOTS:
        seg = []
        start0 = t
        for txt in texts:
            d = durs[k]
            # 原版字幕轨几乎无缝填满全片（64条×3.27s≈成片时长），故句间只留极小间隙
            st = round(t + 0.1, 2)
            en = round(st + d + 0.15, 2)
            all_cues.append({"start": st, "end": en, "text": txt})
            seg.append(en)
            t = en + 0.15
            k += 1
        dur_shot = round(t - start0 + (0.6 if sid == 'chapter' else 0.8), 2)
        shots.append({"id": sid, "prop": prop, "enter": enter,
                      "from": round(start0, 2), "dur": dur_shot})
        t = start0 + dur_shot
    total = round(t, 2)

    # 3) 铺配音轨
    inputs = ["-f", "lavfi", "-t", str(total), "-i", "anullsrc=r=44100:cl=stereo"]
    for k in range(len(all_cues)):
        inputs += ["-i", os.path.join(OUT_DIR, f"s{k:02d}_{TAG}.mp3")]
    parts = []
    for k, c in enumerate(all_cues):
        ms = int(c["start"] * 1000)
        parts.append(f"[{k+1}:a]adelay={ms}|{ms}[v{k}]")
    chain = ";".join(parts) + ";[0:a]" + "".join(f"[v{k}]" for k in range(len(all_cues))) \
            + f"amix=inputs={len(all_cues)+1}:duration=first:dropout_transition=0:normalize=0[aout]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain,
                    "-map", "[aout]", "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", TRACK], check=True)

    chars = sum(len(c["text"]) for c in all_cues)
    print(f"字幕 {len(all_cues)} 条 / 总字数 {chars} / 语音总长 {sum(durs.values()):.1f}s / 成片 {total}s")
    print(f"平均单条 {chars/len(all_cues):.1f} 字，语速 {chars/sum(durs.values()):.2f} 字/秒（原版 5.47）")
    print(f"镜头数 {len(shots)}（原版 18-30）")

    json.dump({"shots": shots, "cues": all_cues, "duration": total},
              open(os.path.join(ROOT, "timeline.json"), "w"), ensure_ascii=False, indent=1)

    # 输出 TS，供 Remotion 静态导入
    def j(v):
        return json.dumps(v, ensure_ascii=False)
    ts = ["// 由 build_timeline.py 自动生成，勿手改", "",
          "export type Shot = {id: string; prop: string | null; enter: string; from: number; dur: number};",
          "export type Cue = {start: number; end: number; text: string};", "",
          "export const DURATION = %s;" % total, "",
          "export const shots: Shot[] = " + j(shots) + ";", "",
          "export const cues: Cue[] = " + j(all_cues) + ";"]
    open(os.path.join(ROOT, "src", "data", "timeline.ts"), "w", encoding="utf-8").write("\n".join(ts))
    print("已写出 src/data/timeline.ts")

asyncio.run(main())

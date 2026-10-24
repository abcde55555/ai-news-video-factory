#!/usr/bin/env python3
"""从字幕轨生成配音：TTS 每条 cue -> 时间拉伸适配窗口 -> 按时间码铺轨 -> 合成 voice.mp3"""
import asyncio, json, os, re, subprocess, sys
import edge_tts

ROOT = os.path.dirname(os.path.abspath(__file__))
VOICE = "zh-CN-YunxiNeural"      # 微软神经网络中文男声，适合科技解说
RATE = "+12%"                     # 略提速，匹配信息流解说节奏
OUT_DIR = os.path.join(ROOT, "public", "vo")
TRACK = os.path.join(ROOT, "public", "voice.mp3")
TOTAL = 215.0

def parse_cues():
    src = open(os.path.join(ROOT, "src", "data", "museWonder.ts"), encoding="utf-8").read()
    body = src[src.find("export const cues"):]
    return [
        {"start": float(a), "end": float(b), "text": t}
        for a, b, t in re.findall(
            r"\{\s*start:\s*([\d.]+),\s*end:\s*([\d.]+),\s*text:\s*'([^']*)'", body
        )
    ]

def dur(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True,
    )
    return float(r.stdout.strip())

async def synth(i, text):
    p = os.path.join(OUT_DIR, f"c{i:02d}.mp3")
    if not os.path.exists(p):
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(p)
    return p

async def main():
    cues = parse_cues()
    print(f"共 {len(cues)} 条字幕", flush=True)
    os.makedirs(OUT_DIR, exist_ok=True)

    for i, c in enumerate(cues):
        p = await synth(i, c["text"])
        d = dur(p)
        win = c["end"] - c["start"]
        tag = ""
        if d > win:
            # 超出窗口：轻微加速塞进窗口（atempo 上限 1.35 避免变声）
            tempo = min(d / (win - 0.15), 1.35)
            fit = os.path.join(OUT_DIR, f"c{i:02d}_fit.mp3")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p,
                            "-filter:a", f"atempo={tempo:.4f}", "-ar", "44100", fit], check=True)
            p = fit
            tag = f" -> 加速 {tempo:.2f}x"
        c["file"], c["dur"] = p, dur(p)
        print(f"[{i:02d}] {c['start']:6.1f}-{c['end']:6.1f} (窗 {win:4.1f}s) 语音 {d:5.2f}s{tag}", flush=True)

    # 铺轨：静音底 + 按 start 混入
    inputs, parts = ["-f", "lavfi", "-t", str(TOTAL), "-i", "anullsrc=r=44100:cl=stereo"], []
    for c in cues:
        inputs += ["-i", c["file"]]
    for i, c in enumerate(cues):
        parts.append(f"[{i+1}:a]adelay={int(c['start']*1000)}|{int(c['start']*1000)},volume=1.0[v{i}]")
    chain = ";".join(parts) + ";" + "[0:a]" + "".join(f"[v{i}]" for i in range(len(cues))) \
            + f"amix=inputs={len(cues)+1}:duration=first:dropout_transition=0:normalize=0[aout]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs,
                    "-filter_complex", chain, "-map", "[aout]",
                    "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", TRACK], check=True)
    print("配音轨已生成:", TRACK, round(dur(TRACK), 2), "秒")

asyncio.run(main())

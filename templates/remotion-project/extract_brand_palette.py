#!/usr/bin/env python3
"""
从官方 logo / 官网截图 / 产品截图里提取品牌色，输出可直接填进 theme.ts 的方案。

用法：
    python3 extract_brand_palette.py logo.png
    python3 extract_brand_palette.py shot.png 6      # 指定取几个主色

输出：主色候选（按占比）、按用途分类的建议（accent / bg / surface / warn），
以及对应的 theme.ts 片段。

原则：品牌色必须从产品来，不要自己发明。
"""
import sys
from collections import Counter

from PIL import Image


def hexof(rgb):
    return '#{:02X}{:02X}{:02X}'.format(*rgb)


def hsv(rgb):
    r, g, b = [v / 255 for v in rgb]
    mx, mn = max(r, g, b), min(r, g, b)
    v = mx
    s = 0 if mx == 0 else (mx - mn) / mx
    if mx == mn:
        h = 0
    elif mx == r:
        h = (60 * ((g - b) / (mx - mn)) + 360) % 360
    elif mx == g:
        h = 60 * ((b - r) / (mx - mn)) + 120
    else:
        h = 60 * ((r - g) / (mx - mn)) + 240
    return h, s, v


def main(path, n=6):
    im = Image.open(path).convert('RGB')
    im.thumbnail((240, 240))
    q = im.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()
    counts = Counter(q.getdata())
    total = sum(counts.values())

    rows = []
    for idx, cnt in counts.most_common(n):
        rgb = tuple(pal[idx * 3 : idx * 3 + 3])
        h, s, v = hsv(rgb)
        rows.append({'hex': hexof(rgb), 'rgb': rgb, 'pct': cnt / total, 'h': h, 's': s, 'v': v})

    print(f'\n图: {path}\n')
    print('占比    颜色        H     S     V     判断')
    for r in rows:
        if r['v'] > 0.9 and r['s'] < 0.12:
            tag = '背景（近白）'
        elif r['v'] < 0.2:
            tag = '文字/深底'
        elif r['s'] > 0.35:
            tag = '★ 品牌强调色候选'
        else:
            tag = '中性'
        print(f"{r['pct']*100:5.1f}%  {r['hex']}  {r['h']:5.0f} {r['s']:5.2f} {r['v']:5.2f}   {tag}")

    accent = max(rows, key=lambda r: r['s'] * r['v'] if r['v'] > 0.25 else 0)
    bg = max((r for r in rows if r['v'] > 0.82), key=lambda r: r['pct'], default=rows[0])
    ink = min((r for r in rows if r['v'] < 0.45), key=lambda r: r['v'], default=rows[-1])

    print('\n建议写入 theme.ts：')
    print(f"  accent:  '{accent['hex']}'   // 来自官方素材，占比 {accent['pct']*100:.0f}%")
    print(f"  bg:      '{bg['hex']}'")
    print(f"  ink:     '{ink['hex']}'")
    print('\n下一步：')
    print('  1) 把 accent 填进对应 preset（或新建一个）')
    print('  2) 深色题材请把 bg 换成产品自身的深色底，不要硬套浅色')
    print('  3) 若产品本身是深色主题（如终端/编辑器），整片就该是深色，不要"浅底+深色章节"')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 6)

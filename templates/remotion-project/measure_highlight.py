#!/usr/bin/env python3
"""
测量截图中文字行的像素位置，输出可直接填进 OfficialEvidence 的百分比坐标。

用法：
    python3 measure_highlight.py public/official/seg_takeaways.jpg

输出每行文字的 y 区间与 x 区间（百分比），据此填 highlights 的 {x, y, w, h}。
教训：荧光笔坐标必须由像素测量得出，目测/按预览图比例估算会整体偏移一行。
"""
import sys

import numpy as np
from PIL import Image


def main(path: str, dark_threshold: int = 120, min_px: int = 8) -> None:
    im = Image.open(path).convert('L')
    a = np.array(im)
    H, W = a.shape
    print(f'图: {path}  尺寸 {W}x{H}  aspect = 1080 / {H}\n')

    dark = (a < dark_threshold).sum(axis=1)
    rows = [(y, int(d)) for y, d in enumerate(dark) if d > min_px]

    blocks, cur = [], None
    for y, d in rows:
        if cur and y - cur[1] <= 3:
            cur[1] = y
        else:
            if cur:
                blocks.append(tuple(cur))
            cur = [y, y]
    if cur:
        blocks.append(tuple(cur))

    for i, (y0, y1) in enumerate(blocks):
        band = a[y0 : y1 + 1]
        cols = (band < dark_threshold).sum(axis=0)
        xs = [x for x, d in enumerate(cols) if d > 0]
        if not xs:
            continue
        print(
            f'行{i:02d}  y {y0/H*100:5.1f}% - {(y1+1)/H*100:5.1f}%  (h {(y1+1-y0)/H*100:4.1f}%)   '
            f'x {xs[0]/W*100:5.1f}% - {(xs[-1]+1)/W*100:5.1f}%'
        )

    print('\n填法：高亮某行 → x 取该行起始百分比（可略减 0.5 留白），')
    print('      y 取行顶百分比，h 取行高 +1~1.5，w 取目标文字的宽度占比。')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], *(int(v) for v in sys.argv[2:]))

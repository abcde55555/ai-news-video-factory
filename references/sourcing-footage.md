# 素材采集：从哪找画面，怎么用

原则：**证据先于文案，画面先于动画。** 一条 AI 新闻片的说服力，八成来自屏幕上有多少"真东西"。
自己画的图表只能解释，不能证明。

## 素材优先级（从上到下挑）

1. **官方第一手**：官方博客/新闻稿的配图与视频、产品发布会、官方 YouTube 频道、开发者文档里的截图与图表
   - 好处：1080p、干净、无台标、可直接引用
2. **仓库资产**：开源项目的 `docs/assets`、官网 `public/assets`、README 里的截图/图解
   - 这类往往是**矢量 SVG**，比截图清晰，且是官方授权范围（MIT 等）
3. **第三方实测录屏**（B站 / YouTube / 知乎视频）：拿真实操作画面（终端输出、产品界面）
   - 这是"这玩意真的能跑"的在场证明，官方素材给不了
4. **新闻/报告原文截图**：用来证明可能被质疑的数字
5. **CC 授权素材**（Wikimedia Commons 等）：logo、人物照；要注明作者与许可
6. **AI 生成图**：只做中性纹理或演一个拍不到的比喻物；画面标明"AI 生成"

## 通道一：官方页面与仓库资产

```bash
# 1) 抓页面里的图/视频（最省事）
curl -sL -A "Mozilla/5.0" "<官方URL>" -o page.html
grep -oE 'https://[^"]+\.(png|jpg|mp4|svg|webp)' page.html | sort -u

# 2) 页面是 JS 渲染时，用 Chrome 截图（必须给独立 profile，否则被已有实例占用而静默失败）
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-sandbox \
  --hide-scrollbars --user-data-dir=/tmp/chrome-shot --virtual-time-budget=15000 \
  --window-size=1440,1800 --screenshot=assets/page.png "<官方URL>"

# 3) GitHub 仓库资产：raw 域名经常不通，改用 contents API + base64
curl -sL "https://api.github.com/repos/<owner>/<repo>/contents/docs/assets"
# 拿到 JSON 里的 content 字段，base64 解码写文件（见本次 REA 案例）
```

**坑**：`--screenshot` 路径别用中文（会静默失败）；Chrome 已开时不给 `--user-data-dir` 会失败；`window-size` 高过 2000 容易失败，改分屏截。

## 通道二：视频素材（scripts/footage.py）

依赖：`yt-dlp`（**超过 90 天会被 YouTube 403，先 `yt-dlp -U` 或 `pip install -U yt-dlp`**）、`ffmpeg`。

```bash
python3 scripts/footage.py search "关键词" -n 8        # 搜：id｜时长｜频道｜标题（优先官方频道）
python3 scripts/footage.py get <id或url>               # 1080p 下载；长视频只下需要的段 --section 01:11:40-01:12:12
python3 scripts/footage.py sheet <视频> --step 6       # 带时间码联系表 → sheets/<名>.jpg，用眼睛挑镜头
python3 scripts/footage.py scenes <视频> --from 0 --to 60   # 镜头切点，入点出点要落在同一镜头内
python3 scripts/footage.py extract clips.json         # 抽成 30fps 帧序列
python3 scripts/footage.py wave <音视频> <起> <止>      # 找原声开口/句尾（剪口以波形为准，不以字幕为准）
```

`clips.json` 里可用 `zoom / ax / ay` 裁掉台标、角标、人脸小窗：
```json
{"out":"film/assets/clips","clips":{"term":["src.mp4",110,2.4,{"zoom":1.25,"ax":0.72,"ay":0.5}]}}
```

### 网络受限时的降级路径（本机实测）

| 情况 | 处理 |
|---|---|
| YouTube 搜索报 `ProxyError: Tunnel connection failed: 502` | 走国内平台：B站/知乎/抖音 |
| B站搜索 API 返回 HTML（反爬） | 用 WebSearch 搜「关键词 + bilibili」，拿到 **BV 号**再 `yt-dlp` 下载 |
| `raw.githubusercontent.com` 或 `github.com/*/raw/*` 报 SSL 35 | 改用 `api.github.com/repos/.../contents/<path>` + base64 解码 |
| 全站 SSL 失败 | 隔几分钟重试；或让用户提供本地文件 |

## 挑镜头与裁剪

1. **先拼联系表**（`sheet`），一眼扫全片，标记"这一镜能不能让人认出它说的是什么"。
2. **入点出点都落在同一镜头内**：避开片头片尾、幻灯片、主持人镜头。
3. **必须裁掉的**：平台水印、UP 主频道名、新闻台台标、原片烧进去的字幕、人脸小窗。
4. **每段只用 1.5–3 秒**，作为"在场证明"，不整段搬运。

## 版权与标注（必须做）

- 第三方视频按**评论/解读性质的引用**使用，只取短片段。
- 画面内加角标：`B站 @UP主 · 实测录屏` / `官方博客截图`。
- 片尾统一来源页列出：平台、BV 号/URL、UP 主、日期。
- 交付时提醒用户：引用第三方画面**仍有被投诉风险**，发布前建议在简介注明来源。
- 官方素材同样标注来源与许可（MIT / CC BY / © Company）。

## 常见坑

- 抽帧的出点压在镜头切点上，最后一帧会露出下一个镜头 → 停在前一帧
- 分段下载的音轨偶发解码错误（`aac decode_band_types`）→ 单独 `get --audio` 再下
- 原片里的数字静音（<-75dB）说明原片剪过，截进去会"突然断电"
- 没有真实素材时**不要虚构截图**：用「来源卡 + 口径标注」代替，并在交付文档里写清哪些没拿到、为什么

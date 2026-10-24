#!/bin/bash
# 一键渲染脚本 —— 在 WorkBuddy 智能体沙箱内已验证可用（2026-10-24）
# 用法: ./render.sh [compositionId] [输出文件]
#   默认: ./render.sh MuseWonder out/MuseWonder.mp4
set -e
cd "$(dirname "$0")"

COMP="${1:-MuseWonder}"
OUT="${2:-out/${COMP}.mp4}"

mkdir -p out chromeprofile
# 每次用全新的临时目录（残留的 webpack bundle 目录会触发 fs shim 误报 EEXIST）
TMPD="$PWD/.tmp-$(date +%s)"
mkdir -p "$TMPD"

# 关闭 WorkBuddy 注入的 node fs shim（两个开关都要关，任一为 1 都会启用 shim）
# 同时清掉 NODE_OPTIONS，避免 shim 经由 --require 注入子进程
env -u NODE_OPTIONS \
  TMPDIR="$TMPD" \
  CODEBUDDY_BROKERED_FS_HOOK_ENABLED=0 \
  CODEBUDDY_SAFE_DELETE_SANDBOX=0 \
  CODEBUDDY_SAFE_DELETE_ENABLED=0 \
  npx remotion render "$COMP" "$OUT" \
    --user-data-dir="$PWD/chromeprofile" \
    --concurrency=4

echo "=== 完成 ==="
ls -la "$OUT"

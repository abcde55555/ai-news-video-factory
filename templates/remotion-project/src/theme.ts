import type React from 'react';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** 中文优先使用系统字体：渲染发生在本地 Chrome，无需下载字体文件 */
export const FONT_CN =
  '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif';
export const FONT_NUM =
  '"SF Pro Display", "Helvetica Neue", "Inter", Arial, sans-serif';

export const light = {
  bg: '#F3F1EC',
  surface: '#FFFFFF',
  ink: '#14131A',
  sub: '#6B6875',
  faint: '#A9A5AE',
  accent: '#0866FF',
  accentSoft: '#DCE8FF',
  warm: '#F5A623',
  ok: '#12A87A',
  warn: '#E5484D',
};

export const blueprint = {
  bg: '#0B1A31',
  panel: '#122745',
  line: '#2A4A72',
  grid: '#1C3357',
  ink: '#E9F0FA',
  sub: '#8FA6C6',
  accent: '#4EA8FF',
  ok: '#3DDC97',
  warn: '#FF7A5A',
};

/**
 * 品牌水印配置。
 * 默认关闭——请勿填入参考博主的名字/头像，那是他人的署名与肖像。
 * 想加自己的品牌层时，在下面填上自己的名字与首字即可自动启用。
 */
export const brand: {name: string; initial: string} = {
  name: '',
  initial: '',
};

/** 工程图纸网格背景（纯 CSS，无需图片资源） */
export const gridBackground = (color = blueprint.grid, size = 48) => ({
  backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});

export const shell: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: FONT_CN,
  padding: '90px 110px 150px',
  boxSizing: 'border-box',
};

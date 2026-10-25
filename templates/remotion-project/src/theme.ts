import type React from 'react';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** 中文优先使用系统字体：渲染发生在本地 Chrome，无需下载字体文件 */
export const FONT_CN =
  '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif';
export const FONT_NUM = '"SF Pro Display", "Helvetica Neue", "Inter", Arial, sans-serif';
/** 代码 / 地址 / 字节流场景用等宽字体 */
export const FONT_MONO = '"SF Mono", "JetBrains Mono", "Menlo", monospace';

/**
 * 视觉身份预设。
 *
 * 模板只给工程骨架，不给视觉身份。**每个题材必须选/改一套 preset**，
 * 不要留着默认值，更不要复制上一部片子的色板。
 * 品牌色请用 `extract_brand_palette.py <官方logo或截图>` 提取后替换。
 *
 * 切换方式：改下面的 ACTIVE_PRESET 一行。
 */
export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  sub: string;
  faint: string;
  accent: string;
  accentSoft: string;
  warn: string;
  ok: string;
  warm: string;
  /** 分隔线 / 边框（深色章节必需） */
  line: string;
};

export type Preset = {
  /** 说明这套视觉适合什么题材 */
  useFor: string;
  light: Palette;
  /** 深色章节用的色板（不是所有题材都需要） */
  dark: Palette;
  radius: number;
  fontHead: string;
  fontBody: string;
  fontMono: string;
};

const warmProduct: Preset = {
  useFor: '消费级 AI 助手 / Agent / 对话产品（暖、圆润、手绘感）',
  light: {
    bg: '#F6F2E9', surface: '#FFFFFF', ink: '#1F1B16', sub: '#6B655C', faint: '#A8A29A',
    accent: '#D97757', accentSoft: '#F8E4DA', warn: '#C4553D', ok: '#5C8A5A', warm: '#E0A15E', line: '#E6DFD2',
  },
  dark: {
    bg: '#1A1613', surface: '#241E1A', ink: '#F5EFE6', sub: '#A89E92', faint: '#6E665C',
    accent: '#E8926E', accentSoft: '#3A2A22', warn: '#E0705A', ok: '#7FB07C', warm: '#D9A063', line: '#3A322B',
  },
  radius: 22, fontHead: FONT_CN, fontBody: FONT_CN, fontMono: FONT_MONO,
};

const terminalDark: Preset = {
  useFor: '开发者工具 / CLI / 逆向 / 安全工具（深色、等宽、精确）',
  light: {
    bg: '#F4F6F8', surface: '#FFFFFF', ink: '#0D1117', sub: '#57606A', faint: '#8B949E',
    accent: '#2F81F7', accentSoft: '#DDEAFE', warn: '#D4483B', ok: '#2EA043', warm: '#BF8700', line: '#D8DEE5',
  },
  dark: {
    bg: '#0D1117', surface: '#161B22', ink: '#E6EDF3', sub: '#8B949E', faint: '#484F58',
    accent: '#58A6FF', accentSoft: '#0F2A4A', warn: '#F85149', ok: '#3FB950', warm: '#D29922', line: '#30363D',
  },
  radius: 8, fontHead: FONT_CN, fontBody: FONT_CN, fontMono: FONT_MONO,
};

const paperResearch: Preset = {
  useFor: '研究 / 模型发布 / 论文解读（白底、学术、克制）',
  light: {
    bg: '#FCFCFA', surface: '#FFFFFF', ink: '#14161A', sub: '#5B6169', faint: '#9AA1A9',
    accent: '#1B4DD8', accentSoft: '#E4EAFC', warn: '#C0392B', ok: '#1E7F4F', warm: '#B4822A', line: '#E3E5E8',
  },
  dark: {
    bg: '#101317', surface: '#181C22', ink: '#ECEFF3', sub: '#9AA1A9', faint: '#5B6169',
    accent: '#6A8FF7', accentSoft: '#1A2340', warn: '#E06C5F', ok: '#4EA87A', warm: '#C99A45', line: '#2A2F37',
  },
  radius: 6, fontHead: FONT_CN, fontBody: FONT_CN, fontMono: FONT_MONO,
};

const infraCool: Preset = {
  useFor: '开源框架 / 基础设施 / 架构（冷灰、结构、连线）',
  light: {
    bg: '#F3F5F7', surface: '#FFFFFF', ink: '#111827', sub: '#4B5563', faint: '#9CA3AF',
    accent: '#0E7490', accentSoft: '#D6F1F7', warn: '#B45309', ok: '#15803D', warm: '#A16207', line: '#DCE2E8',
  },
  dark: {
    bg: '#0B1220', surface: '#131C2E', ink: '#E5EAF3', sub: '#94A3B8', faint: '#475569',
    accent: '#22B8CF', accentSoft: '#0C2B33', warn: '#F0A15A', ok: '#4ADE80', warm: '#D6A85A', line: '#24314A',
  },
  radius: 10, fontHead: FONT_CN, fontBody: FONT_CN, fontMono: FONT_MONO,
};

const hardwareDark: Preset = {
  useFor: '硬件 / 设备 / 芯片（暗场、打光、质感）',
  light: {
    bg: '#F2F2F0', surface: '#FFFFFF', ink: '#121212', sub: '#5A5A5A', faint: '#9B9B9B',
    accent: '#C8A15A', accentSoft: '#F2E8D5', warn: '#B8452F', ok: '#3F7A4F', warm: '#C8A15A', line: '#DCDCD8',
  },
  dark: {
    bg: '#0A0A0B', surface: '#141416', ink: '#F2F2F0', sub: '#9B9B9B', faint: '#5A5A5A',
    accent: '#D9B26A', accentSoft: '#2A2216', warn: '#D65A45', ok: '#5E9C6C', warm: '#D9B26A', line: '#2A2A2C',
  },
  radius: 14, fontHead: FONT_CN, fontBody: FONT_CN, fontMono: FONT_MONO,
};

export const presets = {warmProduct, terminalDark, paperResearch, infraCool, hardwareDark};

/**
 * ⚠️ 改这里切换视觉身份。新片必须按 style-spec 选一套，并用品牌色替换 accent。
 * 不要因为是"上一部用过"就继续用它。
 */
export const ACTIVE_PRESET: keyof typeof presets = 'warmProduct';

const active = presets[ACTIVE_PRESET];

/** 浅色页色板（组件统一引用这个） */
export const light: Palette = active.light;
/** 深色章节色板 */
export const blueprint: Palette = active.dark;
export const radius = active.radius;
export const fontHead = active.fontHead;
export const fontBody = active.fontBody;
export const fontMono = active.fontMono;

/**
 * 品牌水印配置。
 * 默认关闭——请勿填入他人的名字/头像，那是他人的署名与肖像。
 * 想加自己的品牌层时，在下面填上自己的名字与首字即可自动启用。
 */
export const brand: {name: string; initial: string} = {
  name: '',
  initial: '',
};

/** 工程图纸网格背景（纯 CSS，无需图片资源） */
export const gridBackground = (color = blueprint.sub, size = 48) => ({
  backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});

export const shell: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: fontBody,
  padding: '90px 110px 150px',
  boxSizing: 'border-box',
};

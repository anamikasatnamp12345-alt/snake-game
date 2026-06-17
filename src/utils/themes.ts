import { GameTheme, ThemeId } from '../types';

export const THEMES: Record<ThemeId, GameTheme> = {
  [ThemeId.NEON_CYBER]: {
    id: ThemeId.NEON_CYBER,
    name: 'Neon Cyberpunk',
    background: 'bg-[#0a0a0c]',
    gridBg: 'bg-[#0a0a0c] border-[#1e293b]/50',
    gridLine: 'border-[#1e293b]/15',
    snakeHead: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]',
    snakeBody: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    snakeTail: 'bg-emerald-600',
    foodRegular: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.95)] animate-pulse',
    foodGolden: 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,1)] animate-ping-custom',
    textPrimary: 'text-zinc-100',
    accent: 'text-emerald-400 border-emerald-500/30',
    shadowGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  },
  [ThemeId.DEEP_FOREST]: {
    id: ThemeId.DEEP_FOREST,
    name: 'Emerald Forest',
    background: 'bg-stone-950',
    gridBg: 'bg-teal-950/40 border-stone-800',
    gridLine: 'border-stone-800/40',
    snakeHead: 'bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.7)]',
    snakeBody: 'bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.4)]',
    snakeTail: 'bg-lime-600',
    foodRegular: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse',
    foodGolden: 'bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.9)] animate-ping-custom',
    textPrimary: 'text-stone-100',
    accent: 'text-lime-400 border-lime-500/30',
    shadowGlow: 'shadow-[0_0_25px_rgba(132,204,22,0.12)]'
  },
  [ThemeId.MIDNIGHT_AMBER]: {
    id: ThemeId.MIDNIGHT_AMBER,
    name: 'Midnight Amber',
    background: 'bg-slate-950',
    gridBg: 'bg-slate-900 border-slate-800',
    gridLine: 'border-slate-800/50',
    snakeHead: 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]',
    snakeBody: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    snakeTail: 'bg-amber-600',
    foodRegular: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse',
    foodGolden: 'bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.95)] animate-ping-custom',
    textPrimary: 'text-slate-100',
    accent: 'text-amber-400 border-amber-500/30',
    shadowGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
  },
  [ThemeId.RETRO_MONO]: {
    id: ThemeId.RETRO_MONO,
    name: '1984 Macintosh',
    background: 'bg-zinc-950',
    gridBg: 'bg-black border-emerald-950',
    gridLine: 'border-emerald-950/40',
    snakeHead: 'bg-emerald-500 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]',
    snakeBody: 'bg-emerald-600 border border-emerald-700 font-mono',
    snakeTail: 'bg-emerald-700',
    foodRegular: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse',
    foodGolden: 'bg-emerald-200 shadow-[0_0_15px_rgba(167,243,208,1)] animate-ping-custom',
    textPrimary: 'text-emerald-400 font-mono',
    accent: 'text-emerald-400 border-emerald-500/40 font-mono',
    shadowGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]'
  }
};

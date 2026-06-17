export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export enum ThemeId {
  NEON_CYBER = 'NEON_CYBER',
  DEEP_FOREST = 'DEEP_FOREST',
  MIDNIGHT_AMBER = 'MIDNIGHT_AMBER',
  RETRO_MONO = 'RETRO_MONO'
}

export enum GridSize {
  SMALL = 15,
  MEDIUM = 20,
  LARGE = 25
}

export enum SpeedLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  TURBO = 'TURBO'
}

export interface Position {
  x: number;
  y: number;
}

export interface GameTheme {
  id: ThemeId;
  name: string;
  background: string;
  gridBg: string;
  gridLine: string;
  snakeHead: string;
  snakeBody: string;
  snakeTail: string;
  foodRegular: string;
  foodGolden: string;
  textPrimary: string;
  accent: string;
  shadowGlow: string;
}

export interface GameSettings {
  theme: ThemeId;
  gridSize: GridSize;
  speed: SpeedLevel;
  allowWrap: boolean;
  soundEnabled: boolean;
}

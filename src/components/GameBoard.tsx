import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTheme, GameStatus, Position } from '../types';

interface GameBoardProps {
  snake: Position[];
  foodRegular: Position;
  foodGolden: Position | null;
  theme: GameTheme;
  gridSize: number;
  gameStatus: GameStatus;
  score: number;
  highscore: number;
  onStartGame: () => void;
  onResumeGame: () => void;
  gameOverReason: string;
  snakeDirection: Position;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  foodRegular,
  foodGolden,
  theme,
  gridSize,
  gameStatus,
  score,
  highscore,
  onStartGame,
  onResumeGame,
  gameOverReason,
  snakeDirection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw whenever snake, food, status, or theme updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal coordinates for crisp scaling
    const size = 420;
    canvas.width = size;
    canvas.height = size;

    const cellSize = size / gridSize;

    // Reset background with theme colors
    ctx.fillStyle = theme.id === 'RETRO_MONO' ? '#000000' : '#0c0c0e';
    if (theme.id === 'DEEP_FOREST') ctx.fillStyle = '#08140c';
    if (theme.id === 'MIDNIGHT_AMBER') ctx.fillStyle = '#090d16';
    
    ctx.fillRect(0, 0, size, size);

    // Draw retro grid borderlines
    ctx.strokeStyle = theme.id === 'RETRO_MONO' 
      ? 'rgba(16, 185, 129, 0.05)' 
      : 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= gridSize; i++) {
      // Horizontal Lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();

      // Vertical Lines
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
    }

    // Helper: Rounded Rectangle drawing
    const drawRoundedCell = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
      c.fill();
    };

    // Draw regular cherry food
    ctx.fillStyle = theme.id === 'RETRO_MONO' ? '#34d399' : '#f43f5e';
    if (theme.id === 'DEEP_FOREST') ctx.fillStyle = '#f97316';
    if (theme.id === 'MIDNIGHT_AMBER') ctx.fillStyle = '#22d3ee';
    
    const rx = foodRegular.x * cellSize;
    const ry = foodRegular.y * cellSize;
    drawRoundedCell(ctx, rx + 2.5, ry + 2.5, cellSize - 5, cellSize - 5, 5);

    // Draw rare golden pellet
    if (foodGolden) {
      ctx.fillStyle = theme.id === 'RETRO_MONO' ? '#a7f3d0' : '#fbbf24';
      if (theme.id === 'DEEP_FOREST') ctx.fillStyle = '#fde047';
      if (theme.id === 'MIDNIGHT_AMBER') ctx.fillStyle = '#fb7185';

      const gx = foodGolden.x * cellSize;
      const gy = foodGolden.y * cellSize;
      const pulse = Math.sin(Date.now() / 120) * 0.8;
      drawRoundedCell(
        ctx,
        gx + 2 - pulse,
        gy + 2 - pulse,
        cellSize - 4 + pulse * 2,
        cellSize - 4 + pulse * 2,
        6
      );
    }

    // Colors for Snake
    let headColor = '#10b981';
    let bodyColor = '#059669';
    let tailColor = '#047857';

    if (theme.id === 'NEON_CYBER') {
      headColor = '#34d399';
      bodyColor = '#10b981';
      tailColor = '#047857';
    } else if (theme.id === 'DEEP_FOREST') {
      headColor = '#a3e635';
      bodyColor = '#84cc16';
      tailColor = '#4d7c0f';
    } else if (theme.id === 'MIDNIGHT_AMBER') {
      headColor = '#fbbf24';
      bodyColor = '#f59e0b';
      tailColor = '#b45309';
    } else if (theme.id === 'RETRO_MONO') {
      headColor = '#10b981';
      bodyColor = '#047857';
      tailColor = '#065f46';
    }

    // Draw snake segments
    snake.forEach((cell, idx) => {
      const x = cell.x * cellSize;
      const y = cell.y * cellSize;

      if (idx === 0) {
        // Snake Head
        ctx.fillStyle = headColor;
        drawRoundedCell(ctx, x + 1, y + 1, cellSize - 2, cellSize - 2, 6);

        // Render cute retro eyes depending on direction vector
        ctx.fillStyle = '#09090b';
        const eyeSize = 2;
        let leftEye = { x: 0, y: 0 };
        let rightEye = { x: 0, y: 0 };

        if (snakeDirection.x === 1) { // Moving Right
          leftEye = { x: cellSize - 5, y: 4 };
          rightEye = { x: cellSize - 5, y: cellSize - 6 };
        } else if (snakeDirection.x === -1) { // Left
          leftEye = { x: 3, y: 4 };
          rightEye = { x: 3, y: cellSize - 6 };
        } else if (snakeDirection.y === 1) { // Down
          leftEye = { x: 4, y: cellSize - 5 };
          rightEye = { x: cellSize - 6, y: cellSize - 5 };
        } else { // Up
          leftEye = { x: 4, y: 3 };
          rightEye = { x: cellSize - 6, y: 3 };
        }

        ctx.fillRect(x + leftEye.x, y + leftEye.y, eyeSize, eyeSize);
        ctx.fillRect(x + rightEye.x, y + rightEye.y, eyeSize, eyeSize);
      } else if (idx === snake.length - 1) {
        // Snake Tail
        ctx.fillStyle = tailColor;
        drawRoundedCell(ctx, x + 2.5, y + 2.5, cellSize - 5, cellSize - 5, 4);
      } else {
        // Snake Body chunk
        ctx.fillStyle = bodyColor;
        drawRoundedCell(ctx, x + 1.5, y + 1.5, cellSize - 3, cellSize - 3, 3);
      }
    });

  }, [snake, foodRegular, foodGolden, theme, gridSize, snakeDirection, gameStatus]);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0a0c] shadow-2xl select-none">
      {/* HTML Game Canvas */}
      <canvas
        ref={canvasRef}
        id="game-canvas-screen"
        className="w-full h-full block relative"
      />

      {/* Grid Fine Scanlines Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:21px_21px]"></div>

      {/* Dynamic Overlays using Framer Motion */}
      <AnimatePresence mode="wait">
        
        {/* State 1: IDLE / Play screen */}
        {gameStatus === GameStatus.IDLE && (
          <motion.div
            key="idle-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
            >
              <Play className="w-8 h-8 text-emerald-400 fill-emerald-400/20 animate-pulse" />
            </motion.div>

            <h2 className="text-4xl font-extrabold text-white mb-1.5 italic tracking-tight uppercase">
              CORE_ONLINE
            </h2>
            <p className="text-emerald-400 text-[10px] tracking-[0.25em] mb-8 font-mono">
              SYSTEM INITIALIZATION COMPLETED
            </p>

            <button
              onClick={onStartGame}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs tracking-widest uppercase rounded transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_22px_rgba(52,211,153,0.45)]"
            >
              BOOT CORE SYSTEM
            </button>
          </motion.div>
        )}

        {/* State 2: PAUSED screen */}
        {gameStatus === GameStatus.PAUSED && (
          <motion.div
            key="paused-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4"
            >
              <Pause className="w-6 h-6 text-amber-400" />
            </motion.div>
            
            <h3 className="text-3xl font-black text-white italic tracking-wider mb-1.5">
              RUN SUSPENDED
            </h3>
            <p className="text-amber-400 text-[10px] tracking-[0.2em] mb-8 font-mono">
              SNAKE SIGNAL PAUSED // KEY P
            </p>

            <button
              onClick={onResumeGame}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-widest uppercase rounded transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Resume Session
            </button>
          </motion.div>
        )}

        {/* State 3: GAME OVER / Highscore celebration */}
        {gameStatus === GameStatus.GAME_OVER && (
          <motion.div
            key="gameover-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-2 italic tracking-tight select-none">
              SYSTEM CRASHED
            </h2>
            <p className="text-emerald-400 text-sm tracking-[0.2em] mb-3 font-mono">
              SIGNAL TERMINATED // FINAL SCORE: {score}
            </p>
            <p className="text-rose-500 text-[10px] font-mono mb-8 opacity-80 uppercase tracking-wider">
              {gameOverReason || 'Impact detected on core network'}
            </p>

            <button
              onClick={onStartGame}
              className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Reboot System
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

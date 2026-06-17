import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, RefreshCw, Info, Keyboard, Volume } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { GameStatus, ThemeId, SpeedLevel, GridSize, Position, GameSettings } from './types';
import { GameBoard } from './components/GameBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { GameControls } from './components/GameControls';
import { ExportHtmlButton } from './components/ExportHtmlButton';
import { THEMES } from './utils/themes';
import {
  playClickSound,
  playEatRegularSound,
  playEatGoldenSound,
  playGameOverSound,
  setSoundEnabled
} from './utils/audio';

// Default boundaries & state metrics
const GRID_CELLS = 20; // Hard-coded grid mapping size (20x20)

const SPEED_MS: Record<SpeedLevel, number> = {
  [SpeedLevel.EASY]: 140,
  [SpeedLevel.MEDIUM]: 100,
  [SpeedLevel.HARD]: 72,
  [SpeedLevel.TURBO]: 46
};

export default function App() {
  // Settings structure
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('snake_settings_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse settings', e);
    }
    return {
      theme: ThemeId.NEON_CYBER,
      gridSize: GridSize.MEDIUM, // 20 units
      speed: SpeedLevel.MEDIUM,
      allowWrap: true,
      soundEnabled: true
    };
  });

  // Persists settings to localStorage changes
  useEffect(() => {
    localStorage.setItem('snake_settings_config', JSON.stringify(settings));
    setSoundEnabled(settings.soundEnabled);
  }, [settings]);

  // Theme configuration details
  const activeTheme = THEMES[settings.theme];

  // Game statuses
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [snake, setSnake] = useState<Position[]>([]);
  const [snakeDirection, setSnakeDirection] = useState<Position>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Position>({ x: 1, y: 0 });
  
  const [foodRegular, setFoodRegular] = useState<Position>({ x: 12, y: 10 });
  const [foodGolden, setFoodGolden] = useState<Position | null>(null);
  const [foodGoldenTicks, setFoodGoldenTicks] = useState<number>(0);
  
  const [score, setScore] = useState<number>(0);
  const currentLevel = Math.floor(score / 50) + 1;
  const [highscore, setHighscore] = useState<number>(() => {
    const saved = localStorage.getItem('snake_game_pb');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);

  // References used strictly inside game loop callbacks
  const snakeRef = useRef<Position[]>([]);
  const directionRef = useRef<Position>({ x: 1, y: 0 });
  const nextDirRef = useRef<Position>({ x: 1, y: 0 });
  
  // Keep refs synchronized to prevent stale reactive states in interval hook
  useEffect(() => {
    snakeRef.current = snake;
    directionRef.current = snakeDirection;
    nextDirRef.current = nextDirection;
  }, [snake, snakeDirection, nextDirection]);

  // Utility to generate random non-collision food coordinates
  const spawnFoodPosition = useCallback((currentSnake: Position[]): Position => {
    let position: Position = { x: 0, y: 0 };
    let isValid = false;
    
    while (!isValid) {
      position.x = Math.floor(Math.random() * GRID_CELLS);
      position.y = Math.floor(Math.random() * GRID_CELLS);
      
      // Ensure it does not overlap snake segments
      const overlaps = currentSnake.some(c => c.x === position.x && c.y === position.y);
      if (!overlaps) {
        isValid = true;
      }
    }
    return position;
  }, []);

  // Initiate a pristine run
  const handleLaunchGame = useCallback(() => {
    const initialSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    setSnake(initialSnake);
    setSnakeDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setFoodRegular(spawnFoodPosition(initialSnake));
    setFoodGolden(null);
    setFoodGoldenTicks(0);
    setGameOverReason('');
    setGameStatus(GameStatus.PLAYING);
    playClickSound();
  }, [spawnFoodPosition]);

  // Toggle pausing runs
  const handlePauseToggle = useCallback(() => {
    setGameStatus(prev => {
      if (prev === GameStatus.PLAYING) {
        playClickSound();
        return GameStatus.PAUSED;
      }
      if (prev === GameStatus.PAUSED) {
        playClickSound();
        return GameStatus.PLAYING;
      }
      return prev;
    });
  }, []);

  // Core navigation input steer handler
  const handleSteer = useCallback((key: string) => {
    const currentDir = directionRef.current;
    
    switch (key) {
      case 'ArrowUp':
      case 'KeyW':
        if (currentDir.y !== 1) setNextDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 'KeyS':
        if (currentDir.y !== -1) setNextDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'KeyA':
        if (currentDir.x !== 1) setNextDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (currentDir.x !== -1) setNextDirection({ x: 1, y: 0 });
        break;
    }
  }, []);

  // Listener for keyboard bounds
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleSteer(e.code);
      }
      
      if (e.code === 'Space') {
        if (gameStatus === GameStatus.IDLE || gameStatus === GameStatus.GAME_OVER) {
          e.preventDefault();
          handleLaunchGame();
        }
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.PAUSED) {
          e.preventDefault();
          handlePauseToggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, handleLaunchGame, handlePauseToggle, handleSteer]);

  // Standard interval Game Tick trigger
  useEffect(() => {
    if (gameStatus !== GameStatus.PLAYING) return;

    const gameIntervalTick = () => {
      const activeDir = nextDirRef.current;
      setSnakeDirection(activeDir);

      const segments = [...snakeRef.current];
      const head = {
        x: segments[0].x + activeDir.x,
        y: segments[0].y + activeDir.y
      };

      // Wrap-around bounds checker
      if (settings.allowWrap) {
        if (head.x < 0) head.x = GRID_CELLS - 1;
        if (head.x >= GRID_CELLS) head.x = 0;
        if (head.y < 0) head.y = GRID_CELLS - 1;
        if (head.y >= GRID_CELLS) head.y = 0;
      } else {
        // Solid wall crash checker
        if (head.x < 0 || head.x >= GRID_CELLS || head.y < 0 || head.y >= GRID_CELLS) {
          setGameOverReason('You crashed into the solid outer arena wall!');
          setGameStatus(GameStatus.GAME_OVER);
          playGameOverSound();
          return;
        }
      }

      // Self tail overlap checker
      const isEatRegular = (head.x === foodRegular.x && head.y === foodRegular.y);
      const isEatGolden = foodGolden && (head.x === foodGolden.x && head.y === foodGolden.y);

      // Check for body crash
      const tailCrash = segments.some((cell, idx) => {
        // If segment is the tail end, it moves away this step unless we are expanding
        if (idx === segments.length - 1 && !isEatRegular && !isEatGolden) {
          return false;
        }
        return cell.x === head.x && cell.y === head.y;
      });

      if (tailCrash) {
        setGameOverReason('You bit your own tail segment!');
        setGameStatus(GameStatus.GAME_OVER);
        playGameOverSound();
        return;
      }

      // Prepend head segment
      const nextSnake = [head, ...segments];

      if (isEatRegular) {
        setScore(prev => {
          const nextVal = prev + 10;
          if (nextVal > highscore) {
            setHighscore(nextVal);
            localStorage.setItem('snake_game_pb', String(nextVal));
          }
          return nextVal;
        });
        setFoodRegular(spawnFoodPosition(nextSnake));
        playEatRegularSound();

        // Increment Golden food ticks
        setFoodGolden(prev => {
          if (prev) {
            setFoodGoldenTicks(t => {
              if (t <= 1) return 0;
              return t - 1;
            });
            return prev;
          } else {
            // 9% chance of generating a golden pellet
            if (Math.random() < 0.09) {
              setFoodGoldenTicks(15); // moves to survive
              return spawnFoodPosition(nextSnake);
            }
          }
          return null;
        });

      } else if (isEatGolden) {
        setScore(prev => {
          const nextVal = prev + 35; // MASSIVE bonus
          if (nextVal > highscore) {
            setHighscore(nextVal);
            localStorage.setItem('snake_game_pb', String(nextVal));
          }
          return nextVal;
        });
        setFoodGolden(null);
        setFoodGoldenTicks(0);
        playEatGoldenSound();
      } else {
        // Standard tick step: pop tail end
        nextSnake.pop();

        // Expire golden ticks over time if not eaten
        if (foodGolden) {
          setFoodGoldenTicks(t => {
            if (t <= 1) {
              setFoodGolden(null);
              return 0;
            }
            return t - 1;
          });
        }
      }

      setSnake(nextSnake);
    };

    const baseSpeed = SPEED_MS[settings.speed];
    const activeSpeed = Math.max(35, baseSpeed - (currentLevel - 1) * 10);
    const runInterval = setInterval(gameStep, activeSpeed);

    function gameStep() {
      gameIntervalTick();
    }

    return () => clearInterval(runInterval);
  }, [gameStatus, foodRegular, foodGolden, settings, spawnFoodPosition, highscore, currentLevel]);

  return (
    <div className={`min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/30 transition-all duration-300 ${activeTheme.background} antialiased pb-2 overflow-x-hidden relative`}>
      {/* Immersive background radial dots pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none immersive-dots z-0"></div>
      
      {/* Header Deck Area */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-10 pb-5 flex items-end justify-between border-b border-slate-900 z-10 relative">
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-11 h-11 rounded-xl flex items-center justify-center border font-semibold text-lg bg-zinc-950/60"
            style={{
              borderColor: '#10b981',
              boxShadow: '0 0 15px rgba(52, 211, 153, 0.25)'
            }}
          >
            🐍
          </motion.div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 uppercase leading-none">
              Neon_Slither
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-1.5">
              System Core v2.04.1
            </p>
          </div>
        </div>

        {/* Global Toolbar and Standalone Downloader */}
        <div className="flex items-center gap-2.5">
          {/* Standing export action button */}
          <ExportHtmlButton settings={settings} />

          {/* Quick Help Guide */}
          <button
            onClick={() => {
              playClickSound();
              setHelpModalOpen(true);
            }}
            className="p-2.5 rounded-xl bg-zinc-950 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 cursor-pointer text-zinc-400 hover:text-zinc-100 transition duration-200"
            title="How to Play"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 items-center justify-center z-10 relative">
        
        {/* Playable Area and HUD Column */}
        <div className="flex flex-col items-center w-full max-w-[420px]">
          
          {/* HUD Scores strip */}
          <div className="w-full flex items-center justify-between py-3.5 px-4 mb-3.5 border border-slate-800 bg-black/50 backdrop-blur rounded-xl">
            <div className="flex gap-4 sm:gap-6">
              <div className="text-right sm:text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Current Score</p>
                <p className="text-2xl sm:text-3xl font-mono text-emerald-400 leading-none">
                  {String(score).padStart(4, '0')}
                </p>
              </div>
              <div className="text-right sm:text-left border-l border-slate-800 pl-4 sm:pl-6">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Level</p>
                <p className="text-2xl sm:text-3xl font-mono text-amber-400 leading-none flex items-center gap-1">
                  <span className="text-[10px] text-amber-500 font-sans font-black tracking-tighter">LV.</span>{currentLevel}
                </p>
              </div>
              <div className="text-right sm:text-left border-l border-slate-800 pl-4 sm:pl-6">
                <p className="text-[10px] text-slate-550 uppercase tracking-widest font-bold mb-1 text-slate-500">High Score</p>
                <p className="text-2xl sm:text-3xl font-mono text-cyan-400 leading-none">
                  {String(highscore).padStart(4, '0')}
                </p>
              </div>
            </div>

            {/* Dynamic Status Badges */}
            <div className="flex flex-col items-end gap-1.5 font-mono select-none">
              <span className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-[9px] uppercase font-bold tracking-wider text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.1)]">
                {settings.speed}
              </span>
              <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider ${
                settings.allowWrap 
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80'
              }`}>
                {settings.allowWrap ? 'WRAP' : 'SOLID'}
              </span>
            </div>
          </div>

          {/* Interactive Screen viewport with gradient glow */}
          <div className="relative group w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25"></div>
            <GameBoard
              snake={snake}
              foodRegular={foodRegular}
              foodGolden={foodGolden}
              theme={activeTheme}
              gridSize={GRID_CELLS}
              gameStatus={gameStatus}
              score={score}
              highscore={highscore}
              onStartGame={handleLaunchGame}
              onResumeGame={handlePauseToggle}
              gameOverReason={gameOverReason}
              snakeDirection={snakeDirection}
            />
          </div>
        </div>

        {/* Dashboard Actions and Controller Panel */}
        <div className="w-full max-w-[420px] md:max-w-xs flex flex-col gap-4">
          
          {/* Deck Settings */}
          <SettingsPanel
            settings={settings}
            onChangeSettings={setSettings}
            onPlayClickSound={playClickSound}
          />

          {/* Tactile Steuer pad D-PAD */}
          <GameControls
            onSteer={handleSteer}
            gameStatus={gameStatus}
            accentColor={activeTheme.accent}
          />

          {/* Inline Action Indicator Help Card */}
          <div className="border border-slate-800/85 bg-slate-900/40 rounded-xl p-3 flex gap-2.5 items-center">
            <Keyboard className="w-5 h-5 text-slate-500 shrink-0" />
            <p className="text-[10px] text-slate-500 font-mono tracking-tight leading-relaxed">
              Press <b className="text-zinc-300">ESC</b> / <b className="text-zinc-300">P</b> to pause runs, or click the <b className="text-emerald-400">Export</b> button to save a single self-contained HTML run file onto your disk.
            </p>
          </div>
        </div>

      </main>

      {/* Footer layout spacing exactly matching Immersive UI */}
      <footer className="w-full pb-10 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center z-10 gap-3 max-w-4xl mx-auto border-t border-slate-900 pt-6 mt-4">
        <div className="flex gap-4">
          <div className="px-3 py-1 border border-slate-800 bg-slate-900/50 rounded text-[10px] font-mono text-slate-400">ARROW KEYS / WASD</div>
          <div className="px-3 py-1 border border-slate-800 bg-slate-900/50 rounded text-[10px] font-mono text-emerald-500 animate-pulse font-bold">STATUS: ONLINE</div>
        </div>
        <div className="text-[10px] text-slate-600 font-mono italic underline decoration-slate-800">S.N.K-OS INTERFACE TERMINAL</div>
      </footer>

      {/* Retro How-to play Modal */}
      <AnimatePresence>
        {helpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelpModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full relative cursor-default"
            >
              <h4 className="text-sm font-bold font-mono text-emerald-400 mb-3 tracking-wider uppercase">
                HOW TO STEER
              </h4>
              <div className="space-y-3.5 text-xs text-zinc-400 font-sans leading-relaxed">
                <p>
                  1. <b className="text-zinc-100 font-mono uppercase">Key Steering</b>: Control the snake using standard keyboard <b className="text-emerald-400">Arrow Keys</b> or <b className="text-emerald-400">WASD</b> keys.
                </p>
                <p>
                  2. <b className="text-zinc-100 font-mono uppercase">Food Pellets</b>: Move the snake to eat the pink cherry food pellet (+10 pts) to grow and score points.
                </p>
                <p>
                  3. <b className="text-zinc-100 font-mono uppercase">Golden Perks</b>: Rapid-spark golden apples spawn occasionally. Snatch them up quick (+35 pts) before they disappear!
                </p>
                <p>
                  4. <b className="text-zinc-100 font-mono uppercase">Avoid Crashes</b>: In Solid walls mode, hitting the borders will instantly crash. Never feed the snake head straight back into its own body segment in any wall mode!
                </p>
              </div>

              <button
                onClick={() => setHelpModalOpen(false)}
                className="mt-6 w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 font-mono text-xs font-bold text-zinc-300 hover:text-zinc-100 rounded-xl transition cursor-pointer"
              >
                GOT IT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

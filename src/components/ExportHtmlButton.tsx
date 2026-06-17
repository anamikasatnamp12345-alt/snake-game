import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { GameSettings } from '../types';

interface ExportButtonProps {
  settings: GameSettings;
}

export const ExportHtmlButton: React.FC<ExportButtonProps> = ({ settings }) => {
  const [downloaded, setDownloaded] = useState(false);

  const generateHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro Snake Game</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            user-select: none;
            -webkit-user-select: none;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        /* Custom neon shadows & effects */
        .neon-shadow-green {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .neon-shadow-purple {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        /* Shake animation for screen hit */
        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 2px); }
            20%, 40%, 60%, 80% { transform: translate(4px, -2px); }
        }
        .shake-effect {
            animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        /* Hide scrollbars */
        ::-webkit-scrollbar {
            display: none;
        }
    </style>
</head>
<body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col justify-between overflow-x-hidden antialiased">

    <!-- Header Section -->
    <header class="w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center neon-shadow-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#09090b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div>
                <h1 id="app-title" class="text-xl font-bold font-mono tracking-tight text-emerald-400">SNAKE GAME</h1>
                <p class="text-[10px] text-zinc-500 font-mono">STANDALONE WEB VERSION</p>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <!-- Mute trigger -->
            <button id="mute-btn" class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 cursor-pointer transition text-zinc-400 hover:text-zinc-100">
                <svg id="sound-unmuted-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                <svg id="sound-muted-icon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
            </button>
            <!-- Help Trigger -->
            <button id="info-btn" class="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 cursor-pointer transition text-zinc-400 hover:text-zinc-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
        </div>
    </header>

    <!-- Main Container -->
    <main id="game-container" class="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center justify-center select-none">
        
        <!-- Left Side: Interactive Area -->
        <div class="relative flex flex-col items-center">
            <!-- Score Bar -->
            <div class="w-full max-w-[420px] mb-4 flex items-center justify-between px-2">
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="flex flex-col">
                        <span class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">SCORE</span>
                        <span id="score-val" class="text-2xl font-bold font-mono tracking-tight text-zinc-100">000</span>
                    </div>
                    <div class="h-8 w-[1px] bg-zinc-800/80"></div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">LEVEL</span>
                        <span id="level-val" class="text-2xl font-bold font-mono tracking-tight text-amber-400">01</span>
                    </div>
                    <div class="h-8 w-[1px] bg-zinc-800/80"></div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">HIGH SCORE</span>
                        <span id="highscore-val" class="text-xl font-bold font-mono text-zinc-400">000</span>
                    </div>
                </div>

                <!-- Status indicator -->
                <div class="flex items-center gap-2">
                    <span id="difficulty-badge" class="px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">MEDIUM</span>
                    <span id="wrap-badge" class="px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-300">WRAP</span>
                </div>
            </div>

            <!-- Screen Area with Canvas & Overlays -->
            <div class="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 neon-shadow-purple">
                
                <!-- Game Canvas -->
                <canvas id="game-canvas" width="400" height="400" class="w-full h-full block bg-[#0c0c0e]"></canvas>

                <!-- Grid Background Texture Lines -->
                <div class="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <!-- OVERLAY: Initial Idle Screen -->
                <div id="idle-overlay" class="absolute inset-0 bg-[#09090b]/95 flex flex-col items-center justify-center p-6 text-center z-10 transition duration-300">
                    <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 neon-shadow-green">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-emerald-400 animate-pulse" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"/><path d="m10 8 6 4-6 4V8z"/></svg>
                    </div>
                    <h2 class="text-2xl font-extrabold tracking-tight font-mono text-zinc-100 mb-2">NEO SNAKE</h2>
                    <p class="text-xs text-zinc-400 max-w-[280px] mb-6">Press <span class="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded font-mono text-[10px]">SPACEBAR</span> or tap the button below to start your run.</p>
                    <button id="start-btn" class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono tracking-tight text-sm shadow-lg hover:shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer">
                        PLAY GAME
                    </button>
                </div>

                <!-- OVERLAY: Pause Screen -->
                <div id="paused-overlay" class="absolute inset-0 bg-[#09090b]/80 flex flex-col items-center justify-center p-6 text-center z-10 hidden transition duration-150">
                    <div class="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
                    </div>
                    <h3 class="text-xl font-bold font-mono text-amber-400 tracking-tight">GAME PAUSED</h3>
                    <p class="text-xs text-zinc-400 mb-4">You are currently taking a breather</p>
                    <button id="resume-btn" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs rounded-xl tracking-tight transition shadow-lg shrink-0">
                        RESUME (ESC)
                    </button>
                </div>

                <!-- OVERLAY: Game Over Screen -->
                <div id="gameover-overlay" class="absolute inset-0 bg-red-950/20 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 hidden transition duration-300">
                    <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-rose-500" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <h3 class="text-2xl font-extrabold tracking-tight font-mono text-rose-500 mb-1">RUN CRASHED</h3>
                    <p id="gameover-reason" class="text-xs text-zinc-400 mb-4">You hit the arena boundaries!</p>
                    
                    <div class="bg-[#09090b]/90 border border-zinc-800/80 rounded-xl px-6 py-3.5 flex gap-6 items-center justify-center mb-6">
                        <div class="text-center">
                            <span class="block text-[8px] tracking-widest text-zinc-500 font-mono">SCORE</span>
                            <span id="final-score" class="text-xl font-bold font-mono text-zinc-200">0</span>
                        </div>
                        <div class="w-[1px] h-6 bg-zinc-800"></div>
                        <div id="new-record-indicator" class="text-center">
                            <span class="block text-[8px] tracking-widest text-amber-500 font-mono">RECORD</span>
                            <span id="final-record" class="text-lg font-bold font-mono text-amber-400">0</span>
                        </div>
                    </div>

                    <button id="restart-btn" class="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold font-mono tracking-tight text-sm shadow-lg hover:shadow-rose-500/20 transition transform active:scale-95 cursor-pointer">
                        RUN AGAIN
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Side: Controller & Dashboard Settings -->
        <div class="w-full max-w-[420px] flex flex-col gap-5">
            <!-- Section Tab Control / Customizers -->
            <div class="bg-[#0f0f11] border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                
                <h3 class="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-800/80">Settings</h3>

                <!-- Theme customizer selection -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Visual Deck</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button class="theme-selector-btn text-xs py-2 px-3 border rounded-xl font-mono text-zinc-300 font-medium bg-zinc-900 border-zinc-800 focus:outline-none transition active:scale-95 text-left flex items-center justify-between" data-theme="NEON_CYBER">
                            <span>Neon Cyber</span>
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        </button>
                        <button class="theme-selector-btn text-xs py-2 px-3 border rounded-xl font-mono text-zinc-400 font-medium bg-[#0f0f12]/50 border-zinc-800/40 focus:outline-none transition active:scale-95 text-left flex items-center justify-between" data-theme="DEEP_FOREST">
                            <span>Deep Emerald</span>
                            <span class="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
                        </button>
                        <button class="theme-selector-btn text-xs py-2 px-3 border rounded-xl font-mono text-zinc-400 font-medium bg-[#0f0f12]/50 border-zinc-800/40 focus:outline-none transition active:scale-95 text-left flex items-center justify-between" data-theme="MIDNIGHT_AMBER">
                            <span>Gold Slate</span>
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        </button>
                        <button class="theme-selector-btn text-xs py-2 px-3 border rounded-xl font-mono text-zinc-400 font-medium bg-[#0f0f12]/50 border-zinc-800/40 focus:outline-none transition active:scale-95 text-left flex items-center justify-between" data-theme="RETRO_MONO">
                            <span>1984 Mono</span>
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black"></span>
                        </button>
                    </div>
                </div>

                <!-- Customizer: Grid size, wrap border list -->
                <div class="grid grid-cols-2 gap-3 pb-1">
                    <!-- Boundary Wrapping Option -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Wall Behavior</label>
                        <div class="relative flex rounded-xl bg-zinc-900 border border-zinc-800/80 p-1">
                            <button id="boundary-solid-btn" class="flex-1 py-1.5 text-[10px] font-mono rounded-lg transition font-bold select-none cursor-pointer text-zinc-500 hover:text-zinc-300">SOLID</button>
                            <button id="boundary-wrap-btn" class="flex-1 py-1.5 text-[10px] font-mono rounded-lg bg-emerald-500 text-zinc-950 font-bold select-none cursor-pointer">WRAP</button>
                        </div>
                    </div>

                    <!-- Speed Option -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Level Speed</label>
                        <select id="speed-selector" class="h-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 rounded-xl px-3 outline-none cursor-pointer">
                            <option value="EASY">EASY</option>
                            <option value="MEDIUM" selected>MEDIUM</option>
                            <option value="HARD">HARD</option>
                            <option value="TURBO">HYPER</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Virtual Controller (Tactile D-PAD for standard and mobile frames) -->
            <div id="virtual-dpad" class="bg-[#0f0f11] border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-center items-center">
                <span class="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-3 select-none">Tactile D-PAD Controllers</span>
                
                <div class="relative w-36 h-36">
                    <!-- UP Button -->
                    <button id="btn-up" class="absolute top-0 left-12 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition cursor-pointer select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <!-- LEFT Button -->
                    <button id="btn-left" class="absolute top-12 left-0 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition cursor-pointer select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <!-- Center deadzone -->
                    <div class="absolute top-12 left-12 w-12 h-12 flex items-center justify-center">
                        <span id="center-status-dot" class="w-3 h-3 rounded-full bg-emerald-500/80 animate-ping"></span>
                    </div>
                    <!-- RIGHT Button -->
                    <button id="btn-right" class="absolute top-12 right-0 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition cursor-pointer select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    <!-- DOWN Button -->
                    <button id="btn-down" class="absolute bottom-0 left-12 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition cursor-pointer select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer Disclaimer Info -->
    <footer class="w-full text-center py-4 text-[10px] text-zinc-600 font-mono tracking-wide selection:bg-none">
        USE ARROWS / WASD TO MOVE • ESC / P TO PAUSE • MADE BY GOOGLE AI STUDIO
    </footer>

    <!-- Help Modal -->
    <div id="help-modal" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 relative">
            <button id="close-modal-btn" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h4 class="text-base font-bold font-mono text-emerald-400 mb-2">HOW TO PLAY</h4>
            <div class="space-y-3 text-xs text-zinc-400">
                <p>1. **Navigate**: Use keyboard <span class="text-zinc-200 font-semibold font-mono">Arrow Keys</span> or <span class="text-zinc-200 font-semibold font-mono">WASD</span> to steer. Touch the D-PAD buttons on a mobile screen.</p>
                <p>2. **Growth**: Eat regular glowing pellets (<span class="text-rose-400 font-semibold">Rose colors</span>) for size & score increases (+10 points).</p>
                <p>3. **Golden Boosts**: Rare golden pixels spark occasionally! Eat them quick before they expire to gain massive score points (+35 points) and instant powerups.</p>
                <p>4. **Avoid Collisions**: Keep away from wall borders (under Solid walls) and avoid running the snake head straight into its own tail!</p>
            </div>
        </div>
    </div>

    <!-- MAIN SOUND SYNTH & GAME LOGIC -->
    <script>
        // Themes Configuration
        const THEMES = {
            NEON_CYBER: {
                title: 'Neon Cyberpunk',
                accent: '#34d399',
                glow: 'rgba(52, 211, 153, 0.4)',
                bg: '#0c0c0e',
                snakeHead: '#34d399',
                snakeBody: '#10b981',
                snakeTail: '#047857',
                foodRegular: '#f43f5e',
                foodGolden: '#fbbf24',
                gridLine: 'rgba(255, 255, 255, 0.02)'
            },
            DEEP_FOREST: {
                title: 'Emerald Forest',
                accent: '#a3e635',
                glow: 'rgba(163, 230, 53, 0.3)',
                bg: '#0c1a12',
                snakeHead: '#a3e635',
                snakeBody: '#84cc16',
                snakeTail: '#4d7c0f',
                foodRegular: '#f97316',
                foodGolden: '#fde047',
                gridLine: 'rgba(163, 230, 53, 0.03)'
            },
            MIDNIGHT_AMBER: {
                title: 'Gold Slate',
                accent: '#fbbf24',
                glow: 'rgba(251, 191, 36, 0.3)',
                bg: '#0b132b',
                snakeHead: '#fbbf24',
                snakeBody: '#f59e0b',
                snakeTail: '#b45309',
                foodRegular: '#22d3ee',
                foodGolden: '#fb7185',
                gridLine: 'rgba(251, 191, 36, 0.02)'
            },
            RETRO_MONO: {
                title: '1984 Macintosh',
                accent: '#10b981',
                glow: 'rgba(16, 185, 129, 0.2)',
                bg: '#000000',
                snakeHead: '#10b981',
                snakeBody: '#059669',
                snakeTail: '#047857',
                foodRegular: '#34d399',
                foodGolden: '#a7f3d0',
                gridLine: 'rgba(16, 185, 129, 0.04)'
            }
        };

        const SPEEDS = {
            EASY: 140,
            MEDIUM: 100,
            HARD: 75,
            TURBO: 50
        };

        // Persistent settings loading
        let currentTheme = 'NEON_CYBER';
        let allowWrap = true;
        let selectedSpeed = 'MEDIUM';
        let soundEnabled = true;

        // Core Game Constants
        const GRID_CELL_COUNT = 20; // 20x20 Grid always
        
        // Audio Synthesizer
        let audioCtx = null;
        function getAudioContext() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        function playSound(type) {
            if (!soundEnabled) return;
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                
                if (type === 'click') {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.08);
                } 
                else if (type === 'eat') {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.setValueAtTime(630, now + 0.04);
                    osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(now + 0.12);
                } 
                else if (type === 'goldEat') {
                    const notes = [523.25, 659.25, 783.99, 1046.50];
                    notes.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
                        gain.gain.setValueAtTime(0, now);
                        gain.gain.setValueAtTime(0.06, now + idx * 0.04);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now + idx * 0.04);
                        osc.stop(now + idx * 0.04 + 0.15);
                    });
                } 
                else if (type === 'gameover') {
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc1.type = 'sawtooth';
                    osc1.frequency.setValueAtTime(170, now);
                    osc1.frequency.linearRampToValueAtTime(50, now + 0.5);
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(110, now);
                    osc2.frequency.linearRampToValueAtTime(40, now + 0.5);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    osc1.start();
                    osc2.start();
                    osc1.stop(now + 0.5);
                    osc2.stop(now + 0.5);
                }
            } catch (e) {
                console.error(e);
            }
        }

        // DOM nodes cached
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        const scoreVal = document.getElementById('score-val');
        const levelVal = document.getElementById('level-val');
        const highscoreVal = document.getElementById('highscore-val');
        const speedSelector = document.getElementById('speed-selector');
        const boundaryWrapBtn = document.getElementById('boundary-wrap-btn');
        const boundarySolidBtn = document.getElementById('boundary-solid-btn');
        const muteBtn = document.getElementById('mute-btn');
        const infoBtn = document.getElementById('info-btn');
        const helpModal = document.getElementById('help-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const themeBtns = document.querySelectorAll('.theme-selector-btn');

        const idleOverlay = document.getElementById('idle-overlay');
        const pausedOverlay = document.getElementById('paused-overlay');
        const gameoverOverlay = document.getElementById('gameover-overlay');
        const gameoverReason = document.getElementById('gameover-reason');
        const finalScoreLabel = document.getElementById('final-score');
        const finalRecordLabel = document.getElementById('final-record');
        const centerStatusDot = document.getElementById('center-status-dot');

        const startBtn = document.getElementById('start-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const restartBtn = document.getElementById('restart-btn');

        // Virtual Touch control elements
        const btnUp = document.getElementById('btn-up');
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnDown = document.getElementById('btn-down');

        // Game state variables
        let snake = [];
        let snakeDirection = { x: 1, y: 0 };
        let nextDirection = { x: 1, y: 0 };
        let foodRegular = { x: 0, y: 0 };
        let foodGolden = null; // Powerup apple is rare
        let foodGoldenTicks = 0; // Expires over time
        let score = 0;
        let currentLevel = 1;
        let highscore = parseInt(localStorage.getItem('snake_highscore') || '0', 10);
        let gameStatus = 'IDLE'; // 'IDLE', 'PLAYING', 'PAUSED', 'GAME_OVER'
        let gameInterval = null;

        // Initialize display
        highscoreVal.textContent = String(highscore).padStart(3, '0');

        // Set dynamic dimensions to adapt high DPI displays
        function setupCanvasSize() {
            const size = 400;
            canvas.width = size;
            canvas.height = size;
        }
        setupCanvasSize();

        // Spawn food helper
        function generateFoodPosition() {
            let spaceFound = false;
            let target = { x: 0, y: 0 };
            while (!spaceFound) {
                target.x = Math.floor(Math.random() * GRID_CELL_COUNT);
                target.y = Math.floor(Math.random() * GRID_CELL_COUNT);
                // Check if it overlaps with snake body
                const overlapsSnake = snake.some(cell => cell.x === target.x && cell.y === target.y);
                if (!overlapsSnake) {
                    spaceFound = true;
                }
            }
            return target;
        }

        // Spawn golden apple logic
        function tickGoldenApple() {
            if (foodGolden) {
                foodGoldenTicks--;
                if (foodGoldenTicks <= 0) {
                    foodGolden = null;
                }
            } else if (Math.random() < 0.08) { // 8% chance per game eating step
                foodGolden = generateFoodPosition();
                foodGoldenTicks = 35; // moves to survive
            }
        }

        // Dynamic styling sync
        function applyStyling() {
            const th = THEMES[currentTheme];
            
            // Adjust body border glow class
            const isRetro = currentTheme === 'RETRO_MONO';
            const primaryAccent = th.accent;
            const containerGlowColor = th.glow;

            // Change badge coloring dynamically
            document.getElementById('app-title').style.color = primaryAccent;
            centerStatusDot.style.backgroundColor = primaryAccent;

            if (isRetro) {
                document.getElementById('app-title').classList.add('font-mono');
            } else {
                document.getElementById('app-title').classList.remove('font-mono');
            }

            // Sync visual button borders active selection
            themeBtns.forEach(btn => {
                const btnTheme = btn.getAttribute('data-theme');
                if (btnTheme === currentTheme) {
                    btn.className = "theme-selector-btn text-xs py-2 px-3 border rounded-xl font-mono text-zinc-100 font-bold bg-zinc-900 focus:outline-none transition active:scale-95 text-left flex items-center justify-between border-emerald-500/50";
                    btn.classList.remove('text-zinc-400');
                    // Style glow selector based on the active themes color
                    btn.style.borderColor = primaryAccent;
                } else {
                    btn.className = "theme-selector-btn text-xs py-2 px-3 border border-zinc-800/40 rounded-xl font-mono text-zinc-400 font-medium bg-[#0f0f12]/50 hover:bg-zinc-900/50 hover:text-zinc-200 focus:outline-none transition active:scale-95 text-left flex items-center justify-between";
                    btn.style.borderColor = '';
                }
            });

            // Re-render
            draw();
        }

        // Score padding helper
        function formatScore(num) {
            return String(num).padStart(3, '0');
        }

        // Initial Game Reset
        function resetGame() {
            snake = [
                { x: 5, y: 10 },
                { x: 4, y: 10 },
                { x: 3, y: 10 }
            ];
            snakeDirection = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            score = 0;
            currentLevel = 1;
            scoreVal.textContent = "000";
            levelVal.textContent = "01";
            foodRegular = generateFoodPosition();
            foodGolden = null;
            foodGoldenTicks = 0;
            applyThemeBadges();
            draw();
        }

        function playRun() {
            if (gameInterval) clearInterval(gameInterval);
            resetGame();
            gameStatus = 'PLAYING';
            idleOverlay.classList.add('hidden');
            gameoverOverlay.classList.add('hidden');
            pausedOverlay.classList.add('hidden');
            
            const speedTime = SPEEDS[selectedSpeed];
            gameInterval = setInterval(gameStep, speedTime);
            playSound('click');
        }

        function gameStep() {
            if (gameStatus !== 'PLAYING') return;

            // Apply direction update safely
            snakeDirection = nextDirection;

            // Compute head position
            const head = { 
                x: snake[0].x + snakeDirection.x, 
                y: snake[0].y + snakeDirection.y 
            };

            // Bounds control checks
            if (allowWrap) {
                if (head.x < 0) head.x = GRID_CELL_COUNT - 1;
                if (head.x >= GRID_CELL_COUNT) head.x = 0;
                if (head.y < 0) head.y = GRID_CELL_COUNT - 1;
                if (head.y >= GRID_CELL_COUNT) head.y = 0;
            } else {
                if (head.x < 0 || head.x >= GRID_CELL_COUNT || head.y < 0 || head.y >= GRID_CELL_COUNT) {
                    triggerGameOver('You crashed into the solid outer wall!');
                    return;
                }
            }

            // Self-injury check (exclude check for tail item if it moves out)
            const eatAppleCheck = (head.x === foodRegular.x && head.y === foodRegular.y);
            const eatGoldCheck = (foodGolden && head.x === foodGolden.x && head.y === foodGolden.y);

            // If we run into own tail (excluding tail segment that will move)
            const tailOverlap = snake.some((cell, i) => {
                if (i === snake.length - 1 && !eatAppleCheck && !eatGoldCheck) return false;
                return cell.x === head.x && cell.y === head.y;
            });

            if (tailOverlap) {
                triggerGameOver('You bit your own tail segment!');
                return;
            }

            // Prepend new head to snake body
            snake.unshift(head);

            // Eat regular food
            if (eatAppleCheck) {
                score += 10;
                scoreVal.textContent = formatScore(score);
                foodRegular = generateFoodPosition();
                playSound('eat');
                tickGoldenApple();
            } 
            // Eat dynamic golden food
            else if (eatGoldCheck) {
                score += 35;
                scoreVal.textContent = formatScore(score);
                foodGolden = null;
                playSound('goldEat');
            } 
            // standard move without food
            else {
                snake.pop();
            }

            // Dynamic progression speed update
            let nextLevel = Math.floor(score / 50) + 1;
            if (nextLevel !== currentLevel) {
                currentLevel = nextLevel;
                levelVal.textContent = String(currentLevel).padStart(2, '0');
                
                clearInterval(gameInterval);
                const baseSpeed = SPEEDS[selectedSpeed];
                const activeSpeed = Math.max(35, baseSpeed - (currentLevel - 1) * 10);
                gameInterval = setInterval(gameStep, activeSpeed);
            }

            // Draw game changes
            draw();
        }

        function triggerGameOver(reason) {
            gameStatus = 'GAME_OVER';
            if (gameInterval) clearInterval(gameInterval);
            
            playSound('gameover');
            
            // Toggle container shake effect
            canvas.parentElement.classList.add('shake-effect');
            setTimeout(() => {
                canvas.parentElement.classList.remove('shake-effect');
            }, 300);

            // Display overlay
            gameoverOverlay.classList.remove('hidden');
            gameoverReason.textContent = reason;
            finalScoreLabel.textContent = score;

            if (score > highscore) {
                highscore = score;
                localStorage.setItem('snake_highscore', highscore);
                highscoreVal.textContent = formatScore(highscore);
            }
            finalRecordLabel.textContent = highscore;
        }

        function togglePause() {
            if (gameStatus === 'PLAYING') {
                gameStatus = 'PAUSED';
                pausedOverlay.classList.remove('hidden');
                playSound('click');
            } else if (gameStatus === 'PAUSED') {
                gameStatus = 'PLAYING';
                pausedOverlay.classList.add('hidden');
                playSound('click');
            }
        }

        // Draw Canvas Handler
        function draw() {
            const th = THEMES[currentTheme];
            
            // Clear Background
            ctx.fillStyle = th.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cellSize = canvas.width / GRID_CELL_COUNT;

            // Draw Grid Lines gently
            ctx.strokeStyle = th.gridLine;
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= GRID_CELL_COUNT; i++) {
                // Horizontal
                ctx.beginPath();
                ctx.moveTo(0, i * cellSize);
                ctx.lineTo(canvas.width, i * cellSize);
                ctx.stroke();

                // Vertical
                ctx.beginPath();
                ctx.moveTo(i * cellSize, 0);
                ctx.lineTo(i * cellSize, canvas.height);
                ctx.stroke();
            }

            // Draw Regular Food (Apple)
            ctx.fillStyle = th.foodRegular;
            const rx = foodRegular.x * cellSize;
            const ry = foodRegular.y * cellSize;
            fillRoundedRect(ctx, rx + 2, ry + 2, cellSize - 4, cellSize - 4, 4);

            // Draw Golden dynamic Powerup
            if (foodGolden) {
                ctx.fillStyle = th.foodGolden;
                const gx = foodGolden.x * cellSize;
                const gy = foodGolden.y * cellSize;
                // pulsing size glow effect
                const pulseOffset = Math.sin(Date.now() / 80) * 1;
                fillRoundedRect(ctx, gx + 1.5 - pulseOffset, gy + 1.5 - pulseOffset, cellSize - 3 + pulseOffset * 2, cellSize - 3 + pulseOffset * 2, 6);
            }

            // Draw Snake
            snake.forEach((cell, index) => {
                const x = cell.x * cellSize;
                const y = cell.y * cellSize;
                
                if (index === 0) {
                    // Head
                    ctx.fillStyle = th.snakeHead;
                    fillRoundedRect(ctx, x + 1, y + 1, cellSize - 2, cellSize - 2, 5);

                    // Tiny Retro Snake Eyes!
                    ctx.fillStyle = '#09090b';
                    const eyeSize = 2;
                    let eyeOffsetL = { x: 0, y: 0 };
                    let eyeOffsetR = { x: 0, y: 0 };

                    // Adjust eye position depending on movement direction
                    if (snakeDirection.x === 1) { // Moving Right
                        eyeOffsetL = { x: cellSize - 5, y: 4 };
                        eyeOffsetR = { x: cellSize - 5, y: cellSize - 6 };
                    } else if (snakeDirection.x === -1) { // Left
                        eyeOffsetL = { x: 3, y: 4 };
                        eyeOffsetR = { x: 3, y: cellSize - 6 };
                    } else if (snakeDirection.y === 1) { // Down
                        eyeOffsetL = { x: 4, y: cellSize - 5 };
                        eyeOffsetR = { x: cellSize - 6, y: cellSize - 5 };
                    } else { // Up
                        eyeOffsetL = { x: 4, y: 3 };
                        eyeOffsetR = { x: cellSize - 6, y: 3 };
                    }
                    ctx.fillRect(x + eyeOffsetL.x, y + eyeOffsetL.y, eyeSize, eyeSize);
                    ctx.fillRect(x + eyeOffsetR.x, y + eyeOffsetR.y, eyeSize, eyeSize);
                } 
                else if (index === snake.length - 1) {
                    // Tail segment
                    ctx.fillStyle = th.snakeTail;
                    fillRoundedRect(ctx, x + 2.5, y + 2.5, cellSize - 5, cellSize - 5, 4);
                } 
                else {
                    // Body Blocks
                    ctx.fillStyle = th.snakeBody;
                    fillRoundedRect(ctx, x + 1.5, y + 1.5, cellSize - 3, cellSize - 3, 3);
                }
            });
        }

        // Custom canvas draw round helper
        function fillRoundedRect(c, x, y, width, height, radius) {
            c.beginPath();
            c.moveTo(x + radius, y);
            c.lineTo(x + width - radius, y);
            c.quadraticCurveTo(x + width, y, x + width, y + radius);
            c.lineTo(x + width, y + height - radius);
            c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            c.lineTo(x + radius, y + height);
            c.quadraticCurveTo(x, y + height, x, y + height - radius);
            c.lineTo(x, y + radius);
            c.quadraticCurveTo(x, y, x + radius, y);
            c.closePath();
            c.fill();
        }

        function applyThemeBadges() {
            document.getElementById('difficulty-badge').textContent = selectedSpeed;
            const wrapBadge = document.getElementById('wrap-badge');
            if (allowWrap) {
                wrapBadge.textContent = "WRAP";
                wrapBadge.className = "px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
                boundaryWrapBtn.className = "flex-1 py-1.5 text-[10px] font-mono rounded-lg bg-emerald-500 text-zinc-950 font-bold select-none cursor-pointer";
                boundarySolidBtn.className = "flex-1 py-1.5 text-[10px] font-mono rounded-lg transition font-bold select-none cursor-pointer text-zinc-500 hover:text-zinc-300";
            } else {
                wrapBadge.textContent = "SOLID";
                wrapBadge.className = "px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-400";
                boundaryWrapBtn.className = "flex-1 py-1.5 text-[10px] font-mono rounded-lg transition font-bold select-none cursor-pointer text-zinc-500 hover:text-zinc-300";
                boundarySolidBtn.className = "flex-1 py-1.5 text-[10px] font-mono rounded-lg bg-amber-500 text-zinc-950 font-bold select-none cursor-pointer";
            }
        }

        // Steer navigation listener safely
        function handleInput(key) {
            if (gameStatus !== 'PLAYING') return;
            
            switch (key) {
                case 'ArrowUp':
                case 'KeyW':
                    if (snakeDirection.y !== 1) nextDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    if (snakeDirection.y !== -1) nextDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    if (snakeDirection.x !== 1) nextDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    if (snakeDirection.x !== -1) nextDirection = { x: 1, y: 0 };
                    break;
            }
        }

        // EVENT LISTENERS: Keyboard steer
        window.addEventListener('keydown', (e) => {
            // Steering keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                e.preventDefault();
                handleInput(e.code);
            }
            
            // Pausing logic
            if (e.code === 'Escape' || e.code === 'KeyP') {
                e.preventDefault();
                togglePause();
            }

            // Start logic
            if (e.code === 'Space' && gameStatus === 'IDLE') {
                e.preventDefault();
                playRun();
            }
        });

        // UI trigger handlers
        startBtn.onclick = () => playRun();
        resumeBtn.onclick = () => togglePause();
        restartBtn.onclick = () => playRun();

        // Theme selects
        themeBtns.forEach(btn => {
            btn.onclick = () => {
                currentTheme = btn.getAttribute('data-theme');
                applyStyling();
                playSound('click');
            };
        });

        // Speed changes list
        speedSelector.onchange = (e) => {
            selectedSpeed = e.target.value;
            applyThemeBadges();
            playSound('click');
            if (gameStatus === 'PLAYING') {
                playRun(); // restart instantly under the new speed setting
            }
        };

        // Solid Border toggle triggers
        boundaryWrapBtn.onclick = () => {
            allowWrap = true;
            applyThemeBadges();
            playSound('click');
        };
        boundarySolidBtn.onclick = () => {
            allowWrap = false;
            applyThemeBadges();
            playSound('click');
        };

        // Audio switcher
        muteBtn.onclick = () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                document.getElementById('sound-unmuted-icon').classList.remove('hidden');
                document.getElementById('sound-muted-icon').classList.add('hidden');
                playSound('click');
            } else {
                document.getElementById('sound-unmuted-icon').classList.add('hidden');
                document.getElementById('sound-muted-icon').classList.remove('hidden');
            }
        };

        // Tactile Control Buttons
        btnUp.onclick = () => handleInput('ArrowUp');
        btnLeft.onclick = () => handleInput('ArrowLeft');
        btnRight.onclick = () => handleInput('ArrowRight');
        btnDown.onclick = () => handleInput('ArrowDown');

        // Help Modal handling
        infoBtn.onclick = () => {
            helpModal.classList.remove('hidden');
            playSound('click');
        };
        closeModalBtn.onclick = () => {
            helpModal.classList.add('hidden');
            playSound('click');
        };
        helpModal.onclick = (e) => {
            if (e.target === helpModal) {
                helpModal.classList.add('hidden');
            }
        };

        // Window resize listeners
        window.onresize = () => setupCanvasSize();

        // Initial setup run
        applyStyling();
        applyThemeBadges();

    </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    const htmlContent = generateHtml();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'snake_game.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <button
      onClick={handleDownload}
      className={`relative group flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-semibold select-none cursor-pointer transition-all duration-300 ${
        downloaded
          ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800'
      }`}
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 animate-scale-up" />
          <span>EXPORTED SINGLE RUNTIME!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>EXPORT SINGLE HTML CARD</span>
        </>
      )}
    </button>
  );
};

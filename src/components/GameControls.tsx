import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { GameStatus } from '../types';

interface GameControlsProps {
  onSteer: (key: string) => void;
  gameStatus: GameStatus;
  accentColor: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onSteer,
  gameStatus,
  accentColor
}) => {
  const isPlaying = gameStatus === GameStatus.PLAYING;

  // Extracts hex/color codes for active border/glow decoration
  const colorMatch = accentColor.split(' ').find(c => c.startsWith('text-'))?.replace('text-', '') || 'emerald-400';

  return (
    <div className="bg-[#0f0f11] border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm select-none">
      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-3">
        Tactile Steuer controllers
      </span>

      <div className="relative w-36 h-36">
        {/* UP BUTTON */}
        <button
          onClick={() => onSteer('ArrowUp')}
          className="absolute top-0 left-12 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 border border-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition active:scale-90 cursor-pointer"
          title="Move Up"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* LEFT BUTTON */}
        <button
          onClick={() => onSteer('ArrowLeft')}
          className="absolute top-12 left-0 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 border border-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition active:scale-90 cursor-pointer"
          title="Move Left"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Indicator */}
        <div className="absolute top-12 left-12 w-12 h-12 flex items-center justify-center">
          <span
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-ping opacity-80' : 'opacity-40'
            }`}
            style={{ backgroundColor: isPlaying ? `var(--${colorMatch}, #10b981)` : '#4b5563' }}
          />
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => onSteer('ArrowRight')}
          className="absolute top-12 right-0 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 border border-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition active:scale-90 cursor-pointer"
          title="Move Right"
        >
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* DOWN BUTTON */}
        <button
          onClick={() => onSteer('ArrowDown')}
          className="absolute bottom-0 left-12 w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-750 border border-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition active:scale-90 cursor-pointer"
          title="Move Down"
        >
          <ArrowDown className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

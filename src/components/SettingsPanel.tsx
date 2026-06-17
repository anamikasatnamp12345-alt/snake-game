import React from 'react';
import { Volume2, VolumeX, Shield, RefreshCw } from 'lucide-react';
import { THEMES } from '../utils/themes';
import { GameSettings, ThemeId, SpeedLevel, GridSize } from '../types';

interface SettingsPanelProps {
  settings: GameSettings;
  onChangeSettings: (updater: (prev: GameSettings) => GameSettings) => void;
  onPlayClickSound: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChangeSettings,
  onPlayClickSound
}) => {
  const activeTheme = THEMES[settings.theme];

  const handleThemeChange = (tid: ThemeId) => {
    onChangeSettings(prev => ({ ...prev, theme: tid }));
    onPlayClickSound();
  };

  const handleWrapToggle = (wrap: boolean) => {
    onChangeSettings(prev => ({ ...prev, allowWrap: wrap }));
    onPlayClickSound();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeSettings(prev => ({ ...prev, speed: e.target.value as SpeedLevel }));
    onPlayClickSound();
  };

  const handleSoundToggle = () => {
    onChangeSettings(prev => {
      const nextSound = !prev.soundEnabled;
      return { ...prev, soundEnabled: nextSound };
    });
    // Wait for state to change to play click
    setTimeout(onPlayClickSound, 50);
  };

  return (
    <div className="bg-[#0f0f11] border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4 shadow-md select-none">
      
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/85">
        <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
          Deck Configuration
        </h3>
        
        {/* Audio Mute Switcher */}
        <button
          onClick={handleSoundToggle}
          className="p-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-100 transition duration-200 cursor-pointer"
          title={settings.soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
        </button>
      </div>

      {/* Theme Deck Grid */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          Visual Deck
        </span>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(THEMES) as ThemeId[]).map((tid) => {
            const th = THEMES[tid];
            const isSelected = settings.theme === tid;
            
            // Extracts the theme dot color
            let dotColor = 'bg-emerald-400';
            if (tid === ThemeId.DEEP_FOREST) dotColor = 'bg-lime-400';
            if (tid === ThemeId.MIDNIGHT_AMBER) dotColor = 'bg-amber-400';
            if (tid === ThemeId.RETRO_MONO) dotColor = 'bg-emerald-500 border border-emerald-400';

            return (
              <button
                key={tid}
                onClick={() => handleThemeChange(tid)}
                className={`text-xs py-2 px-3 border rounded-xl font-mono font-medium transition duration-200 active:scale-95 text-left flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'text-zinc-100 font-semibold bg-zinc-900 border-emerald-500/50'
                    : 'text-zinc-400 bg-[#0f0f12]/50 border-zinc-800/40 hover:bg-zinc-900/40 hover:text-zinc-300'
                }`}
                style={{ borderColor: isSelected ? activeTheme.accent.split(' ').find(c => c.startsWith('text-'))?.replace('text-', '') : undefined }}
              >
                <span>{th.name.replace('Emerald ', '').replace('Cyan ', '')}</span>
                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Solid vs Wrap-Around toggle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            Wall Boundary
          </span>
          <div className="flex rounded-xl bg-zinc-900/90 border border-zinc-805/80 p-0.5 relative h-9">
            <button
              onClick={() => handleWrapToggle(false)}
              className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-mono rounded-lg transition-all font-bold select-none cursor-pointer ${
                !settings.allowWrap
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>SOLID</span>
            </button>
            <button
              onClick={() => handleWrapToggle(true)}
              className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-mono rounded-lg transition-all font-bold select-none cursor-pointer ${
                settings.allowWrap
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              <span>WRAP</span>
            </button>
          </div>
        </div>

        {/* Speed Option */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            Tick Speed
          </span>
          <select
            value={settings.speed}
            onChange={handleSpeedChange}
            className="w-full h-9 bg-zinc-900 text-xs font-mono text-zinc-300 rounded-xl px-2 border border-zinc-800 focus:border-zinc-700 outline-none cursor-pointer"
          >
            <option value={SpeedLevel.EASY}>EASY (WARM)</option>
            <option value={SpeedLevel.MEDIUM}>MEDIUM</option>
            <option value={SpeedLevel.HARD}>HARD (ACID)</option>
            <option value={SpeedLevel.TURBO}>HYPER TENSION</option>
          </select>
        </div>

      </div>

    </div>
  );
};

// Web Audio Synth for Retro Aracde Sound Effects

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    // Standard audio context initialization
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const playEatRegularSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    // Double blip style
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const playEatGoldenSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Quick sparking arpeggio using two oscillators
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.08, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.1);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const playGameOverSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const oscNoise = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.6);

    oscNoise.type = 'sawtooth';
    oscNoise.frequency.setValueAtTime(110, ctx.currentTime);
    oscNoise.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    oscNoise.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    oscNoise.start();
    osc.stop(ctx.currentTime + 0.6);
    oscNoise.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

// Sound effects using Web Audio API

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

const initAudio = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Create a simple beep sound
const createOscillator = (frequency, duration, type = 'sine') => {
  const ctx = initAudio();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

export const playCorrectSound = () => {
  createOscillator(800, 0.2, 'sine');
  setTimeout(() => createOscillator(1000, 0.2, 'sine'), 100);
};

export const playWrongSound = () => {
  createOscillator(200, 0.5, 'sawtooth');
};

export const playClickSound = () => {
  createOscillator(400, 0.1, 'square');
};

export const playBonusSound = () => {
  createOscillator(600, 0.15, 'sine');
  setTimeout(() => createOscillator(800, 0.15, 'sine'), 100);
  setTimeout(() => createOscillator(1000, 0.15, 'sine'), 200);
};

export const playLevelUpSound = () => {
  createOscillator(500, 0.1, 'sine');
  setTimeout(() => createOscillator(700, 0.1, 'sine'), 80);
};

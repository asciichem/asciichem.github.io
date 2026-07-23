/**
 * AsciiChem Sound Engine — Web Audio API.
 *
 * Maps chemical elements to musical tones based on atomic number,
 * with different waveforms per element family so molecules sound
 * distinctive. Water (H₂O) sounds different from methane (CH₄)
 * because hydrogen is a triangle wave and carbon is a sine.
 *
 * The engine lazily initialises the AudioContext on the first user
 * gesture (browser autoplay policy). Mute state persists to
 * localStorage so the site remembers your preference.
 */

const STORAGE_KEY = "asciichem-sound-enabled";

const PERIODIC_TABLE: Record<string, number> = {
  H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
  Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18,
  K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26,
  Co: 27, Ni: 28, Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34,
  Br: 35, Kr: 36, Rb: 37, Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42,
  Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48, In: 49, Sn: 50,
  Sb: 51, Te: 52, I: 53, Xe: 54, Cs: 55, Ba: 56, La: 57, Ce: 58,
  Pr: 59, Nd: 60, Pm: 61, Sm: 62, Eu: 63, Gd: 64, Tb: 65, Dy: 66,
  Ho: 67, Er: 68, Tm: 69, Yb: 70, Lu: 71, Hf: 72, Ta: 73, W: 74,
  Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80, Tl: 81, Pb: 82,
  Bi: 83, Po: 84, At: 85, Rn: 86, Fr: 87, Ra: 88, Ac: 89, Th: 90,
  Pa: 91, U: 92, Np: 93, Pu: 94, Am: 95, Cm: 96, Bk: 97, Cf: 98,
  Es: 99, Fm: 100, Md: 101, No: 102, Lr: 103, Rf: 104, Db: 105,
  Sg: 106, Bh: 107, Hs: 108, Mt: 109, Ds: 110, Rg: 111, Cn: 112,
  Nh: 113, Fl: 114, Mc: 115, Lv: 116, Ts: 117, Og: 118,
};

type Waveform = "sine" | "triangle" | "square" | "sawtooth";

const NOBLE_GASES = new Set(["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"]);
const ALKALI = new Set(["Li", "Na", "K", "Rb", "Cs", "Fr"]);
const HALOGENS = new Set(["F", "Cl", "Br", "I", "At", "Ts"]);
const ALKALINE_EARTH = new Set(["Be", "Mg", "Ca", "Sr", "Ba", "Ra"]);
const TRANSITION = new Set([
  "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd",
  "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
]);

function waveformFor(element: string): Waveform {
  if (NOBLE_GASES.has(element)) return "sine";
  if (ALKALI.has(element)) return "square";
  if (HALOGENS.has(element)) return "sawtooth";
  if (ALKALINE_EARTH.has(element)) return "triangle";
  if (TRANSITION.has(element)) return "triangle";
  return "sine";
}

const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0];

function frequencyFor(element: string): number {
  const num = PERIODIC_TABLE[element] ?? 1;
  const octaveShift = Math.floor((num - 1) / 5);
  const noteIndex = (num - 1) % 5;
  const baseFreq = PENTATONIC[noteIndex];
  return baseFreq * Math.pow(2, octaveShift);
}

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function isEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function setEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // localStorage unavailable — in-memory only
  }
  if (!enabled && masterGain && ctx) {
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
  } else if (enabled && masterGain && ctx) {
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
  }
}

export interface PlayOptions {
  startTime?: number;
  duration?: number;
  gain?: number;
}

function playTone(
  freq: number,
  waveform: Waveform,
  opts: PlayOptions = {},
): number {
  const audioCtx = ensureContext();
  if (!audioCtx || !masterGain) return 0;

  const start = opts.startTime ?? audioCtx.currentTime;
  const duration = opts.duration ?? 0.35;
  const peak = opts.gain ?? 1;

  const osc = audioCtx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = freq;

  const envelope = audioCtx.createGain();
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(peak, start + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);

  osc.connect(envelope);
  envelope.connect(masterGain);
  osc.start(start);
  osc.stop(start + duration + 0.05);

  return start + duration;
}

export interface AtomNote {
  element: string;
  count: number;
}

export interface SequenceCallbacks {
  onAtomPlay?: (index: number, element: string) => void;
  onComplete?: () => void;
}

function playAtom(element: string, opts: PlayOptions = {}): number {
  const freq = frequencyFor(element);
  const waveform = waveformFor(element);
  const duration = opts.duration ?? 0.3;
  const endTime = playTone(freq, waveform, { ...opts, duration });

  if (waveform === "sine" || waveform === "triangle") {
    playTone(freq * 2, "sine", { ...opts, duration: duration * 0.6, gain: 0.15 });
  }
  return endTime;
}

function playSequence(
  atoms: AtomNote[],
  callbacks?: SequenceCallbacks,
): void {
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  let time = audioCtx.currentTime + 0.05;
  const noteDuration = 0.22;
  const gap = 0.03;

  atoms.forEach((atom, index) => {
    const count = Math.max(1, atom.count);
    for (let i = 0; i < count; i++) {
      const endTime = playAtom(atom.element, {
        startTime: time,
        duration: noteDuration,
        gain: 0.7,
      });
      time = endTime + gap;
    }
    if (callbacks?.onAtomPlay) {
      const delay = (time - audioCtx.currentTime - noteDuration) * 1000;
      setTimeout(() => callbacks.onAtomPlay!(index, atom.element), Math.max(0, delay - 50));
    }
  });

  if (callbacks?.onComplete) {
    const totalDelay = (time - audioCtx.currentTime) * 1000;
    setTimeout(() => callbacks.onComplete!(), totalDelay + 100);
  }
}

function playJingle(): void {
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  const melody: Array<[number, number]> = [
    [523.25, 0.15],
    [659.25, 0.15],
    [783.99, 0.15],
    [1046.5, 0.3],
    [783.99, 0.15],
    [1046.5, 0.4],
  ];

  let time = audioCtx.currentTime + 0.05;
  melody.forEach(([freq, dur]) => {
    playTone(freq, "triangle", { startTime: time, duration: dur, gain: 0.6 });
    playTone(freq * 2, "sine", { startTime: time, duration: dur * 0.7, gain: 0.2 });
    time += dur;
  });
}

function playExplosion(): void {
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  const noise = audioCtx.createBufferSource();
  const bufferSize = audioCtx.sampleRate * 0.5;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain!);
  noise.start();
  noise.stop(audioCtx.currentTime + 0.5);
}

const REGISTRY = {
  elementFrequency: frequencyFor,
  waveformFor,
  atomicNumber: (el: string) => PERIODIC_TABLE[el],
  isEnabled,
  setEnabled,
  playAtom,
  playSequence,
  playJingle,
  playExplosion,
  ensureContext,
};

export type SoundEngine = typeof REGISTRY;

declare global {
  interface Window {
    asciichemSound?: SoundEngine;
  }
}

if (typeof window !== "undefined" && !window.asciichemSound) {
  window.asciichemSound = REGISTRY;
}

export default REGISTRY;

"use client";

/** Synthetic Web Audio electronic demo loop — no copyrighted music. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: OscillatorNode[] = [];
let playing = false;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function isDemoAudioPlaying() {
  return playing;
}

export async function startDemoAudio(volume = 0.12) {
  const audio = ensureCtx();
  if (!audio || !master || playing) return;
  if (audio.state === "suspended") await audio.resume();
  master.gain.value = volume;

  const kick = audio.createOscillator();
  const kickGain = audio.createGain();
  kick.type = "sine";
  kick.frequency.value = 55;
  kickGain.gain.value = 0;
  kick.connect(kickGain);
  kickGain.connect(master);
  kick.start();

  const bass = audio.createOscillator();
  const bassGain = audio.createGain();
  bass.type = "triangle";
  bass.frequency.value = 110;
  bassGain.gain.value = 0.05;
  bass.connect(bassGain);
  bassGain.connect(master);
  bass.start();

  const pad = audio.createOscillator();
  const padGain = audio.createGain();
  pad.type = "sawtooth";
  pad.frequency.value = 220;
  padGain.gain.value = 0.02;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  pad.connect(filter);
  filter.connect(padGain);
  padGain.connect(master);
  pad.start();

  const hat = audio.createOscillator();
  const hatGain = audio.createGain();
  hat.type = "square";
  hat.frequency.value = 6000;
  hatGain.gain.value = 0;
  hat.connect(hatGain);
  hatGain.connect(master);
  hat.start();

  nodes = [kick, bass, pad, hat];

  let t = 0;
  const tick = () => {
    if (!playing || !audio) return;
    t += 0.05;
    const beat = Math.floor(t * 2) % 4;
    kickGain.gain.setTargetAtTime(beat === 0 ? 0.18 : 0.02, audio.currentTime, 0.02);
    hatGain.gain.setTargetAtTime(beat === 2 ? 0.03 : 0.005, audio.currentTime, 0.01);
    bass.frequency.setTargetAtTime(
      110 * (beat === 1 || beat === 3 ? 1.25 : 1),
      audio.currentTime,
      0.05
    );
    requestAnimationFrame(tick);
  };
  playing = true;
  tick();
}

export function stopDemoAudio() {
  playing = false;
  nodes.forEach((n) => {
    try {
      n.stop();
      n.disconnect();
    } catch {
      /* noop */
    }
  });
  nodes = [];
}

export function setDemoVolume(v: number) {
  if (master) master.gain.value = Math.max(0, Math.min(1, v));
}

export async function playUploadedFile(file: File, volume = 0.4) {
  stopDemoAudio();
  const audio = ensureCtx();
  if (!audio || !master) return null;
  if (audio.state === "suspended") await audio.resume();
  master.gain.value = volume;
  const buffer = await file.arrayBuffer();
  const decoded = await audio.decodeAudioData(buffer.slice(0));
  const src = audio.createBufferSource();
  src.buffer = decoded;
  src.loop = true;
  src.connect(master);
  src.start();
  playing = true;
  return () => {
    try {
      src.stop();
    } catch {
      /* noop */
    }
    playing = false;
  };
}

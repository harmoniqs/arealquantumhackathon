// Shared scroll timeline for the hero. Progress p runs 0→1 across the full
// hero section; the 3D scene and the DOM captions both key off these ranges
// so the story stays in sync.

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Linear ramp from 0→1 as p crosses [a, b]. */
export const phase = (p: number, a: number, b: number) =>
  clamp01((p - a) / (b - a));

/** Smoothstep version of phase(). */
export const sphase = (p: number, a: number, b: number) => {
  const t = phase(p, a, b);
  return t * t * (3 - 2 * t);
};

/** 0→1→0 window: fades in over `f` after `a`, out over `f` before `b`. */
export const window01 = (p: number, a: number, b: number, f = 0.03) =>
  clamp01((p - a) / f) * clamp01((b - p) / f);

export const T = {
  // stage captions
  title: { start: 0.0, end: 0.13 },
  hardware: { start: 0.16, end: 0.32 },
  control: { start: 0.35, end: 0.52 },
  real: { start: 0.55, end: 0.74 },
  cta: { start: 0.8, end: 1.0 },

  // scene beats
  tweezersIn: [0.02, 0.12],
  atomsIn: [0.04, 0.18],
  pulseSweep: [0.34, 0.47],
  bondsIn: [0.37, 0.53],
  // a few atoms flare warm and get healed — ambience, not a lecture
  errors: [
    [0.55, 0.64],
    [0.585, 0.675],
    [0.62, 0.71],
  ],
} as const;

export const STAGE_COPY = [
  {
    key: "title",
    ...T.title,
    kicker: "wednesday, july 29, 2026 · microsoft garage, nyc",
    heading: "a real quantum hackathon",
    body: "Pulse-level access, analog hardware, and open problems in QEC.",
  },
  {
    key: "hardware",
    ...T.hardware,
    kicker: "",
    heading: "Most quantum hackathons run on simulators or gate-level abstractions.",
    body: "",
  },
  {
    key: "control",
    ...T.control,
    kicker: "",
    heading: "This one doesn't.",
    body: "",
  },
  {
    key: "real",
    ...T.real,
    kicker: "",
    heading: "Directly at the pulse level.",
    body: "Drive parameters, hardware noise, no gate layer between you and the physics — on Pasqal's analog Rydberg processor via Pasqal Cloud.",
  },
  {
    key: "cta",
    ...T.cta,
    kicker: "co-hosted by harmoniqs · pasqal · microsoft",
    heading: "Spots are limited.",
    body: "Teams are admitted by selection. Applications are open now.",
  },
] as const;

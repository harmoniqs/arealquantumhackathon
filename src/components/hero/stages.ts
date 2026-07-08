// Shared scroll timeline for the hero. Progress p runs 0→1 across the full
// hero section; the 3D scene and the DOM captions both key off these ranges
// so the story stays in sync.
//
// The story: neutral-atom hardware (tweezers hold atoms) → analog control
// (global pulses, entanglement) → real machines make real errors (a few
// atoms flare and heal) → the event CTA.

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
    kicker: "jul 29 2026 · new york city · real neutral-atom hardware",
    heading: "a real quantum hackathon",
    body: "",
  },
  {
    key: "hardware",
    ...T.hardware,
    kicker: "01 / the hardware",
    heading: "Atoms, held by light.",
    body: "Single neutral atoms, pinned mid-vacuum in an array of optical tweezers. No fabrication, no wiring — a quantum processor assembled from lasers, one atom at a time.",
  },
  {
    key: "control",
    ...T.control,
    kicker: "02 / the control",
    heading: "Programmed with pulses, not gates.",
    body: "In analog mode you shape global drives and let the physics do the computing. On July 29 you'll send yours to a real machine, straight from your editor.",
  },
  {
    key: "real",
    ...T.real,
    kicker: "03 / the catch",
    heading: "Real atoms make real errors.",
    body: "Noise ships with every shot — taming it is the whole game. The challenges are about keeping quantum information alive on live hardware.",
  },
  {
    key: "cta",
    ...T.cta,
    kicker: "one day · real hardware · compute-credit prizes",
    heading: "Come hack the real thing.",
    body: "July 29, New York City. Bring a team or find one there.",
  },
] as const;

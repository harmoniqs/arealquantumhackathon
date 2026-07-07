// Shared scroll timeline for the QEC hero. Progress p runs 0→1 across the
// full hero section; the 3D scene and the DOM captions both key off these
// ranges so the story stays in sync.
//
// Physics depicted (textbook cluster-chain error correction on 5 atoms):
//   stabilizers  S_j = Z_{j-1} X_j Z_{j+1}   for j = 2, 3, 4 (1-indexed)
//   an X error on atom 3 anticommutes with the Z_3 factors in S_2 and S_4,
//   so the flanking syndromes flip while S_3 stays quiet — the decoder
//   triangulates the middle atom and applies X to undo it.

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
  title: { start: 0.0, end: 0.15 },
  encode: { start: 0.18, end: 0.34 },
  error: { start: 0.37, end: 0.5 },
  syndrome: { start: 0.53, end: 0.7 },
  correct: { start: 0.73, end: 0.86 },
  cta: { start: 0.895, end: 1.0 },

  // scene beats
  tweezersIn: [0.02, 0.1],
  atomsIn: [0.03, 0.14],
  pulseSweep: [0.18, 0.27],
  bondsIn: [0.22, 0.33],
  bracketsIn: [0.28, 0.35],
  errorHit: [0.37, 0.43],
  measure1: [0.53, 0.585],
  measure2: [0.585, 0.64],
  measure3: [0.64, 0.695],
  decodeLines: [0.73, 0.78],
  correctionRing: [0.78, 0.84],
  restore: [0.82, 0.875],
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
    key: "encode",
    ...T.encode,
    kicker: "01 / encode",
    heading: "Five atoms. One protected state.",
    body: "Global pulses weave a cluster state across the chain. Z·X·Z stabilizers stand guard over every neighborhood.",
  },
  {
    key: "error",
    ...T.error,
    kicker: "02 / error",
    heading: "Reality intervenes.",
    body: "A stray X flips atom 3. On real hardware, errors aren't a homework assumption — they're the weather.",
  },
  {
    key: "syndrome",
    ...T.syndrome,
    kicker: "03 / syndrome",
    heading: "The array talks back.",
    body: "Stabilizer measurements flag the damage: the two syndromes flanking the fault flip sign. The error left fingerprints.",
  },
  {
    key: "correct",
    ...T.correct,
    kicker: "04 / correct",
    heading: "Decode. Correct. Continue.",
    body: "The decoder triangulates atom 3 and applies the inverse. Syndromes clear. The state never knew.",
  },
  {
    key: "cta",
    ...T.cta,
    kicker: "this is the whole event, in one scroll",
    heading: "Errors happen. Come correct them — for real.",
    body: "One day. Five atoms. Real analog hardware, driven from your editor.",
  },
] as const;

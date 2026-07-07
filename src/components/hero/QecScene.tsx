"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { T, phase, sphase, window01 } from "./stages";

// 5 atoms on a line, ZXZ cluster-chain stabilizers S_j = Z_{j-1} X_j Z_{j+1}.
// The X error lands on the middle atom (index 2, "atom 3"), so the flanking
// stabilizers S2 and S4 flip while S3 stays quiet.
const ATOM_X = [-4, -2, 0, 2, 4];
const ERROR_IDX = 2;
const STABS = [
  { label: "S₂", center: 1, flips: true },
  { label: "S₃", center: 2, flips: false },
  { label: "S₄", center: 3, flips: true },
];
const MEASURE_WINDOWS = [T.measure1, T.measure2, T.measure3] as const;

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.35, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function QecScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const { size } = useThree();

  const glowTex = useMemo(() => makeGlowTexture(), []);
  const colors = useMemo(
    () => ({
      atom: new THREE.Color("#7dd3fc"),
      probe: new THREE.Color("#22d3ee"),
      entangle: new THREE.Color("#8b7cf6"),
      error: new THREE.Color("#ff5c3d"),
      tmp: new THREE.Color(),
      tmp2: new THREE.Color(),
    }),
    []
  );

  // scattered entry positions — deterministic so SSR/dev stay stable
  const scatter = useMemo(
    () =>
      ATOM_X.map((_, i) => [
        Math.sin(i * 2.3 + 1) * 6,
        Math.cos(i * 1.7) * 3.5,
        Math.sin(i * 1.3) * 2.5,
      ]),
    []
  );

  const starPositions = useMemo(() => {
    const n = 1200;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // deterministic spherical-ish shell
      const a = i * 2.39996; // golden angle
      const r = 16 + 18 * ((i * 7919) % 1000) / 1000;
      const y = ((i * 104729) % 2000) / 1000 - 1;
      const s = Math.sqrt(1 - y * y);
      arr[i * 3] = Math.cos(a) * s * r;
      arr[i * 3 + 1] = y * r * 0.7;
      arr[i * 3 + 2] = Math.sin(a) * s * r - 8;
    }
    return arr;
  }, []);

  const root = useRef<THREE.Group>(null!);
  const stars = useRef<THREE.Points>(null!);
  const atomRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glowRefs = useRef<(THREE.Sprite | null)[]>([]);
  const tweezerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bracketRefs = useRef<(THREE.Mesh | null)[]>([]);
  const encodeSweep = useRef<THREE.Mesh>(null!);
  const measureBeam = useRef<THREE.Mesh>(null!);
  const shockRing = useRef<THREE.Mesh>(null!);
  const correctRing = useRef<THREE.Mesh>(null!);
  const decodeBeamRefs = useRef<(THREE.Mesh | null)[]>([]);

  // discrete readout state — updated only when a threshold is crossed
  const [measured, setMeasured] = useState(0);
  const [corrected, setCorrected] = useState(false);
  const [stabilized, setStabilized] = useState(false); // brackets formed → labels visible

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const t = state.clock.elapsedTime;

    // responsive framing: shrink the stage on narrow screens
    const aspect = size.width / size.height;
    const s = THREE.MathUtils.clamp(aspect / 1.35, 0.34, 1);
    root.current.scale.setScalar(s);

    // camera: drift in, lean toward the readout during syndrome, pull back for CTA
    const cam = state.camera;
    const z =
      15 -
      4 * sphase(p, 0.03, 0.15) -
      1.4 * sphase(p, 0.5, 0.58) +
      1.4 * sphase(p, 0.7, 0.76) +
      2.2 * sphase(p, 0.88, 0.97);
    cam.position.x += (state.pointer.x * 0.7 - cam.position.x) * 0.05;
    cam.position.y += (state.pointer.y * 0.35 - 0.25 - cam.position.y) * 0.05;
    cam.position.z += (z - cam.position.z) * 0.08;
    cam.lookAt(0, -0.35, 0);

    stars.current.rotation.y = t * 0.008;
    const starMat = stars.current.material as THREE.PointsMaterial;
    starMat.opacity = 0.35 + 0.25 * sphase(p, 0, 0.08);

    const errAmt =
      sphase(p, T.errorHit[0], T.errorHit[1]) *
      (1 - sphase(p, T.restore[0], T.restore[1]));

    // atoms
    ATOM_X.forEach((x, i) => {
      const mesh = atomRefs.current[i];
      const glow = glowRefs.current[i];
      if (!mesh || !glow) return;
      const arrive = sphase(p, T.atomsIn[0], T.atomsIn[1] + i * 0.012);
      const [sx, sy, sz] = scatter[i];
      mesh.position.set(
        THREE.MathUtils.lerp(sx, x, arrive),
        THREE.MathUtils.lerp(sy, 0, arrive),
        THREE.MathUtils.lerp(sz, 0, arrive)
      );
      const isErr = i === ERROR_IDX;
      const wobble = isErr ? errAmt : 0;
      mesh.position.x += Math.sin(t * 13 + i) * 0.05 * wobble;
      mesh.position.y += Math.cos(t * 17 + i * 2) * 0.05 * wobble;
      const breathe = 1 + 0.05 * Math.sin(t * 1.8 + i * 1.1);
      mesh.scale.setScalar(breathe * (1 + 0.25 * wobble));

      const mat = mesh.material as THREE.MeshStandardMaterial;
      colors.tmp.copy(colors.atom).lerp(colors.error, wobble);
      mat.color.copy(colors.tmp);
      mat.emissive.copy(colors.tmp);
      mat.emissiveIntensity = 0.55 + 0.9 * wobble;
      mat.opacity = arrive;

      glow.position.copy(mesh.position);
      glow.scale.setScalar(1.7 * breathe * (1 + 0.5 * wobble));
      const gmat = glow.material as THREE.SpriteMaterial;
      gmat.color.copy(colors.tmp);
      gmat.opacity = arrive * (0.35 + 0.35 * wobble);
    });

    // tweezer beams
    tweezerRefs.current.forEach((tw, i) => {
      if (!tw) return;
      const mat = tw.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 * sphase(p, T.tweezersIn[0], T.tweezersIn[1] + i * 0.01);
    });

    // entangling bonds
    bondRefs.current.forEach((bond, i) => {
      if (!bond) return;
      const mat = bond.material as THREE.MeshBasicMaterial;
      const inAmt = sphase(p, T.bondsIn[0] + i * 0.02, T.bondsIn[0] + i * 0.02 + 0.06);
      const nearError = i === ERROR_IDX - 1 || i === ERROR_IDX;
      colors.tmp2.copy(colors.entangle).lerp(colors.error, nearError ? errAmt * 0.6 : 0);
      mat.color.copy(colors.tmp2);
      mat.opacity = inAmt * (0.5 + 0.15 * Math.sin(t * 2.4 + i));
    });

    // encode pulse sweeping the chain (global drive)
    {
      const w = window01(p, T.pulseSweep[0], T.pulseSweep[1], 0.02);
      const sweepT = phase(p, T.pulseSweep[0], T.pulseSweep[1]);
      encodeSweep.current.position.x = THREE.MathUtils.lerp(-7, 7, sweepT);
      (encodeSweep.current.material as THREE.MeshBasicMaterial).opacity = w * 0.5;
    }

    // stabilizer brackets, with a highlight while being measured
    bracketRefs.current.forEach((br, i) => {
      if (!br) return;
      const mat = br.material as THREE.MeshBasicMaterial;
      const inAmt = sphase(p, T.bracketsIn[0] + i * 0.015, T.bracketsIn[1] + i * 0.015);
      const [m0, m1] = MEASURE_WINDOWS[i];
      const hl = window01(p, m0, m1, 0.015);
      colors.tmp2.copy(colors.entangle).lerp(colors.probe, hl);
      mat.color.copy(colors.tmp2);
      mat.opacity = inAmt * (0.35 + 0.65 * hl);
    });

    // one shared measurement beam scans each triplet in turn
    {
      let active = -1;
      let local = 0;
      MEASURE_WINDOWS.forEach(([a, b], i) => {
        if (p >= a && p <= b) {
          active = i;
          local = phase(p, a, b);
        }
      });
      const mat = measureBeam.current.material as THREE.MeshBasicMaterial;
      if (active >= 0) {
        const cx = ATOM_X[STABS[active].center];
        measureBeam.current.position.x = cx - 2.4 + 4.8 * local;
        mat.opacity = window01(local, 0, 1, 0.25) * 0.7;
      } else {
        mat.opacity = 0;
      }
    }

    // error shockwave
    {
      const w = window01(p, T.errorHit[0], T.errorHit[1] + 0.04, 0.02);
      const grow = phase(p, T.errorHit[0], T.errorHit[1] + 0.04);
      shockRing.current.scale.setScalar(0.4 + grow * 3);
      (shockRing.current.material as THREE.MeshBasicMaterial).opacity = w * (1 - grow) * 0.9;
    }

    // decode beams from the flipped syndromes converge on the culprit
    decodeBeamRefs.current.forEach((beam) => {
      if (!beam) return;
      (beam.material as THREE.MeshBasicMaterial).opacity =
        window01(p, T.decodeLines[0], T.correctionRing[1], 0.02) * 0.6;
    });

    // correction ring contracts onto the atom
    {
      const w = window01(p, T.correctionRing[0], T.correctionRing[1] + 0.02, 0.02);
      const contract = sphase(p, T.correctionRing[0], T.correctionRing[1]);
      correctRing.current.scale.setScalar(THREE.MathUtils.lerp(3.4, 0.45, contract));
      (correctRing.current.material as THREE.MeshBasicMaterial).opacity = w * 0.9;
    }

    // discrete readout state
    const wantMeasured = MEASURE_WINDOWS.filter(([, b]) => p >= b - 0.012).length;
    if (wantMeasured !== measured) setMeasured(wantMeasured);
    const wantCorrected = p >= T.restore[1] - 0.01;
    if (wantCorrected !== corrected) setCorrected(wantCorrected);
    const wantStabilized = p >= T.bracketsIn[0] + 0.02;
    if (wantStabilized !== stabilized) setStabilized(wantStabilized);
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 8]} intensity={0.6} />

      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.5}
          color="#a5b4fc"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={root}>
        {/* optical tweezers */}
        {ATOM_X.map((x, i) => (
          <mesh
            key={`tw-${i}`}
            position={[x, 0, -0.4]}
            ref={(m) => {
              tweezerRefs.current[i] = m;
            }}
          >
            <planeGeometry args={[0.16, 8]} />
            <meshBasicMaterial
              color="#3b4a7a"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* entangling bonds */}
        {ATOM_X.slice(0, -1).map((x, i) => (
          <mesh
            key={`bond-${i}`}
            position={[x + 1, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            ref={(m) => {
              bondRefs.current[i] = m;
            }}
          >
            <cylinderGeometry args={[0.025, 0.025, 1.5, 8]} />
            <meshBasicMaterial
              color="#8b7cf6"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* atoms + glows */}
        {ATOM_X.map((_, i) => (
          <group key={`atom-${i}`}>
            <mesh
              ref={(m) => {
                atomRefs.current[i] = m;
              }}
            >
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial
                color="#7dd3fc"
                emissive="#7dd3fc"
                emissiveIntensity={0.55}
                roughness={0.3}
                transparent
              />
            </mesh>
            <sprite
              ref={(sp) => {
                glowRefs.current[i] = sp;
              }}
              scale={1.7}
            >
              <spriteMaterial
                map={glowTex}
                color="#7dd3fc"
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          </group>
        ))}

        {/* encode pulse — glow texture keeps the wavefront soft-edged */}
        <mesh ref={encodeSweep} position={[-7, 0, 0.2]}>
          <planeGeometry args={[2.6, 7.5]} />
          <meshBasicMaterial
            color="#22d3ee"
            map={glowTex}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* measurement beam (gate-zone probe) */}
        <mesh ref={measureBeam} position={[0, 0, 0.3]}>
          <planeGeometry args={[0.12, 3.4]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* stabilizer brackets + labels */}
        {STABS.map((stab, i) => (
          <group key={stab.label}>
            <mesh
              position={[ATOM_X[stab.center], -1.15, 0]}
              ref={(m) => {
                bracketRefs.current[i] = m;
              }}
            >
              <planeGeometry args={[4.4, 0.045]} />
              <meshBasicMaterial
                color="#8b7cf6"
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <Html
              center
              position={[ATOM_X[stab.center], -1.6, 0]}
              zIndexRange={[30, 0]}
              wrapperClass="pointer-events-none select-none"
            >
              <div
                className="readout whitespace-nowrap transition-opacity duration-700"
                style={{
                  color: "var(--entangle)",
                  opacity: stabilized ? (measured > 0 || corrected ? 0.9 : 0.55) : 0,
                }}
              >
                Z·X·Z
              </div>
            </Html>
          </group>
        ))}

        {/* syndrome readout chips */}
        {STABS.map((stab, i) => {
          const visible = measured > i;
          const tripped = stab.flips && !corrected;
          return (
            <Html
              key={`chip-${stab.label}`}
              center
              position={[ATOM_X[stab.center], -2.35, 0]}
              zIndexRange={[30, 0]}
              wrapperClass="pointer-events-none select-none"
            >
              <div
                className={`readout whitespace-nowrap rounded border px-2.5 py-1.5 backdrop-blur-sm transition-all duration-500 ${
                  tripped
                    ? "border-error/60 bg-error/10 text-error"
                    : "border-line bg-panel/70 text-fg-muted"
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {stab.label} {visible ? (tripped ? "−1" : "+1") : "·"}
              </div>
            </Html>
          );
        })}

        {/* error shockwave + correction ring around the middle atom */}
        <mesh ref={shockRing} position={[ATOM_X[ERROR_IDX], 0, 0.1]}>
          <ringGeometry args={[0.9, 1, 48]} />
          <meshBasicMaterial
            color="#ff5c3d"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={correctRing} position={[ATOM_X[ERROR_IDX], 0, 0.1]}>
          <ringGeometry args={[0.9, 1, 48]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* decode beams: flipped syndromes point at the culprit */}
        {[STABS[0], STABS[2]].map((stab, i) => {
          const from = new THREE.Vector2(ATOM_X[stab.center], -2.1);
          const to = new THREE.Vector2(ATOM_X[ERROR_IDX], -0.15);
          const mid = from.clone().add(to).multiplyScalar(0.5);
          const len = from.distanceTo(to);
          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          return (
            <mesh
              key={`decode-${stab.label}`}
              position={[mid.x, mid.y, 0.15]}
              rotation={[0, 0, angle]}
              ref={(m) => {
                decodeBeamRefs.current[i] = m;
              }}
            >
              <planeGeometry args={[len, 0.03]} />
              <meshBasicMaterial
                color="#22d3ee"
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

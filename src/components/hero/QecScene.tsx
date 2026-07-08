"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { T, phase, sphase, window01 } from "./stages";

// A neutral-atom tweezer array: a 6×3 grid of atoms held in vertical beams
// of light, entangled by a sweeping global pulse. During the "real" stage a
// few atoms flare warm (errors) and a brand-yellow repair flash heals them.
const COLS = 6;
const ROWS = 3;
const SPACING = 2;
const GRID: [number, number][] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    GRID.push([(c - (COLS - 1) / 2) * SPACING, (r - (ROWS - 1) / 2) * SPACING]);
  }
}
const ERROR_ATOMS = [4, 9, 14]; // spread across the array
const ERROR_WINDOWS = T.errors;

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
      brand: new THREE.Color("#fff676"),
      entangle: new THREE.Color("#8b7cf6"),
      error: new THREE.Color("#ff5c3d"),
      tmp: new THREE.Color(),
    }),
    []
  );

  // scattered entry positions — deterministic so SSR/dev stay stable
  const scatter = useMemo(
    () =>
      GRID.map((_, i) => [
        Math.sin(i * 2.3 + 1) * 9,
        Math.cos(i * 1.7) * 5,
        Math.sin(i * 3.1) * 4,
      ]),
    []
  );

  // nearest-neighbour bonds: along rows and along columns
  const bonds = useMemo(() => {
    const list: { mid: [number, number]; horizontal: boolean }[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS - 1; c++) {
        const [x, z] = GRID[r * COLS + c];
        list.push({ mid: [x + SPACING / 2, z], horizontal: true });
      }
    for (let r = 0; r < ROWS - 1; r++)
      for (let c = 0; c < COLS; c++) {
        const [x, z] = GRID[r * COLS + c];
        list.push({ mid: [x, z + SPACING / 2], horizontal: false });
      }
    return list;
  }, []);

  const starPositions = useMemo(() => {
    const n = 1200;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
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
  const healRingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseSweep = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const t = state.clock.elapsedTime;

    // responsive framing: shrink the stage on narrow screens
    const aspect = size.width / size.height;
    const s = THREE.MathUtils.clamp(aspect / 1.45, 0.42, 1);
    root.current.scale.setScalar(s);

    // camera: drift down toward the array, pull back for the CTA
    const cam = state.camera;
    const camY = 7 - 2.6 * sphase(p, 0.02, 0.16) + 1.6 * sphase(p, 0.76, 0.9);
    const camZ = 16.5 - 4 * sphase(p, 0.02, 0.16) + 3 * sphase(p, 0.76, 0.9);
    cam.position.x += (state.pointer.x * 0.9 - cam.position.x) * 0.05;
    cam.position.y += (camY + state.pointer.y * 0.4 - cam.position.y) * 0.06;
    cam.position.z += (camZ - cam.position.z) * 0.08;
    cam.lookAt(0, -0.4, 0);

    stars.current.rotation.y = t * 0.008;
    const starMat = stars.current.material as THREE.PointsMaterial;
    starMat.opacity = 0.35 + 0.25 * sphase(p, 0, 0.08);

    // per-atom error amount (0 for most atoms)
    const errAmtFor = (i: number) => {
      const slot = ERROR_ATOMS.indexOf(i);
      if (slot < 0) return 0;
      const [a, b] = ERROR_WINDOWS[slot];
      return window01(p, a, b, 0.03);
    };

    GRID.forEach(([gx, gz], i) => {
      const mesh = atomRefs.current[i];
      const glow = glowRefs.current[i];
      if (!mesh || !glow) return;
      const arrive = sphase(p, T.atomsIn[0], T.atomsIn[1] + (i % COLS) * 0.008);
      const [sx, sy, sz] = scatter[i];
      mesh.position.set(
        THREE.MathUtils.lerp(sx, gx, arrive),
        THREE.MathUtils.lerp(sy, 0, arrive),
        THREE.MathUtils.lerp(sz, gz, arrive)
      );
      const err = errAmtFor(i);
      mesh.position.x += Math.sin(t * 13 + i) * 0.05 * err;
      mesh.position.y += Math.cos(t * 17 + i * 2) * 0.05 * err;
      const breathe = 1 + 0.05 * Math.sin(t * 1.8 + i * 1.1);
      mesh.scale.setScalar(breathe * (1 + 0.3 * err));

      const mat = mesh.material as THREE.MeshStandardMaterial;
      colors.tmp.copy(colors.atom).lerp(colors.error, err);
      mat.color.copy(colors.tmp);
      mat.emissive.copy(colors.tmp);
      mat.emissiveIntensity = 0.55 + 0.9 * err;
      mat.opacity = arrive;

      glow.position.copy(mesh.position);
      glow.scale.setScalar(1.7 * breathe * (1 + 0.6 * err));
      const gmat = glow.material as THREE.SpriteMaterial;
      gmat.color.copy(colors.tmp);
      gmat.opacity = arrive * (0.32 + 0.38 * err);
    });

    // tweezer beams — columns of light holding each atom
    tweezerRefs.current.forEach((tw, i) => {
      if (!tw) return;
      const mat = tw.material as THREE.MeshBasicMaterial;
      mat.opacity =
        0.09 * sphase(p, T.tweezersIn[0], T.tweezersIn[1] + (i % COLS) * 0.008);
    });

    // entangling bonds ripple in with the pulse
    bondRefs.current.forEach((bond, i) => {
      if (!bond) return;
      const mat = bond.material as THREE.MeshBasicMaterial;
      const inAmt = sphase(
        p,
        T.bondsIn[0] + (i % COLS) * 0.015,
        T.bondsIn[0] + (i % COLS) * 0.015 + 0.07
      );
      mat.opacity = inAmt * (0.4 + 0.15 * Math.sin(t * 2.4 + i));
    });

    // the global drive: a wall of brand-yellow light washing the array
    {
      const w = window01(p, T.pulseSweep[0], T.pulseSweep[1], 0.025);
      const sweepT = phase(p, T.pulseSweep[0], T.pulseSweep[1]);
      pulseSweep.current.position.x = THREE.MathUtils.lerp(-9, 9, sweepT);
      (pulseSweep.current.material as THREE.MeshBasicMaterial).opacity = w * 0.55;
    }

    // repair flash: a yellow ring blooms over each healed atom
    ERROR_ATOMS.forEach((atomIdx, slot) => {
      const ring = healRingRefs.current[slot];
      if (!ring) return;
      const [, b] = ERROR_WINDOWS[slot];
      const healT = phase(p, b - 0.035, b);
      const w = window01(p, b - 0.035, b + 0.02, 0.012);
      const mesh = atomRefs.current[atomIdx];
      if (mesh) ring.position.copy(mesh.position);
      ring.scale.setScalar(0.5 + healT * 2.2);
      (ring.material as THREE.MeshBasicMaterial).opacity = w * 0.85;
    });
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 6]} intensity={0.6} />

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
        {/* optical tweezers — vertical light columns */}
        {GRID.map(([x, z], i) => (
          <mesh
            key={`tw-${i}`}
            position={[x, 0.4, z]}
            ref={(m) => {
              tweezerRefs.current[i] = m;
            }}
          >
            <planeGeometry args={[0.14, 7]} />
            <meshBasicMaterial
              color="#fff676"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* nearest-neighbour entangling bonds */}
        {bonds.map(({ mid, horizontal }, i) => (
          <mesh
            key={`bond-${i}`}
            position={[mid[0], 0, mid[1]]}
            rotation={horizontal ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]}
            ref={(m) => {
              bondRefs.current[i] = m;
            }}
          >
            <cylinderGeometry args={[0.02, 0.02, SPACING - 0.6, 8]} />
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
        {GRID.map((_, i) => (
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

        {/* the drive pulse — glow texture keeps the wavefront soft */}
        <mesh ref={pulseSweep} position={[-9, 0.4, 0]}>
          <planeGeometry args={[3, 8.5]} />
          <meshBasicMaterial
            color="#fff676"
            map={glowTex}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* repair flashes */}
        {ERROR_ATOMS.map((atomIdx, slot) => (
          <mesh
            key={`heal-${atomIdx}`}
            rotation={[-Math.PI / 2, 0, 0]}
            ref={(m) => {
              healRingRefs.current[slot] = m;
            }}
          >
            <ringGeometry args={[0.85, 1, 48]} />
            <meshBasicMaterial
              color="#fff676"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

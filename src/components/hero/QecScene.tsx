"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { T, phase, sphase, window01 } from "./stages";

// A neutral-atom tweezer array: a 6×3 grid of atoms held in beams of light,
// entangled by a sweeping drive pulse that the atoms physically ride. During
// the "real" stage a few atoms glitch warm (errors) and brand-yellow repair
// flashes heal them. The camera walks a keyframed path through the scene.
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

// camera keyframes over scroll progress: low edge-on reveal → assembly arc →
// ride the pulse → hover the error zone → hero wide shot
const CAM = [
  { p: 0.0, pos: [0, 1.0, 14.5], look: [0, 0.8, 0] },
  { p: 0.16, pos: [-6.5, 4.2, 11.5], look: [0, 0, 0] },
  { p: 0.35, pos: [5.5, 1.6, 10.5], look: [-1.5, 0.2, 0] },
  { p: 0.55, pos: [2.2, 4.8, 8.2], look: [1.2, 0, 0.2] },
  { p: 0.74, pos: [-1.5, 3.0, 10.5], look: [0.5, 0, 0] },
  { p: 1.0, pos: [0, 5.8, 15.0], look: [0, 0.4, 0] },
] as const;

// quantized noise — glitchy pixel jumps instead of smooth wobble
const q = (v: number, steps: number) => Math.round(v * steps) / steps;

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

function makeGridTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "rgba(139,124,246,1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 62, 62);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(36, 36);
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

export default function QecScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const { size } = useThree();

  const glowTex = useMemo(() => makeGlowTexture(), []);
  const gridTex = useMemo(() => makeGridTexture(), []);
  const colors = useMemo(
    () => ({
      atom: new THREE.Color("#7dd3fc"),
      brand: new THREE.Color("#fff676"),
      error: new THREE.Color("#ff5c3d"),
      tmp: new THREE.Color(),
    }),
    []
  );
  const camWork = useMemo(
    () => ({
      pos: new THREE.Vector3(...CAM[0].pos),
      look: new THREE.Vector3(...CAM[0].look),
      smoothLook: new THREE.Vector3(...CAM[0].look),
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

  // near dust layer — parallax between camera and array
  const dustPositions = useMemo(() => {
    const n = 160;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996;
      const r = 6 + 8 * ((i * 6151) % 1000) / 1000;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (((i * 3571) % 1000) / 1000) * 6 - 2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  const root = useRef<THREE.Group>(null!);
  const stars = useRef<THREE.Points>(null!);
  const dust = useRef<THREE.Points>(null!);
  const floor = useRef<THREE.Mesh>(null!);
  const atomRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glowRefs = useRef<(THREE.Sprite | null)[]>([]);
  const tweezerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const healRingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseSweep = useRef<THREE.Mesh>(null!);
  const pulseLight = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const t = state.clock.elapsedTime;

    // responsive framing: shrink the stage on narrow screens
    const aspect = size.width / size.height;
    const s = THREE.MathUtils.clamp(aspect / 1.45, 0.42, 1);
    root.current.scale.setScalar(s);

    // camera: interpolate along the keyframe path, then add pointer + sway
    {
      let seg = 0;
      while (seg < CAM.length - 2 && p > CAM[seg + 1].p) seg++;
      const a = CAM[seg];
      const b = CAM[seg + 1];
      const k = sphase(p, a.p, b.p);
      camWork.pos.set(
        THREE.MathUtils.lerp(a.pos[0], b.pos[0], k) + state.pointer.x * 0.8 + Math.sin(t * 0.24) * 0.35,
        THREE.MathUtils.lerp(a.pos[1], b.pos[1], k) + state.pointer.y * 0.45 + Math.sin(t * 0.31) * 0.2,
        THREE.MathUtils.lerp(a.pos[2], b.pos[2], k)
      );
      camWork.look.set(
        THREE.MathUtils.lerp(a.look[0], b.look[0], k),
        THREE.MathUtils.lerp(a.look[1], b.look[1], k),
        THREE.MathUtils.lerp(a.look[2], b.look[2], k)
      );
      state.camera.position.lerp(camWork.pos, 0.12);
      camWork.smoothLook.lerp(camWork.look, 0.1);
      state.camera.lookAt(camWork.smoothLook);
    }

    stars.current.rotation.y = t * 0.008;
    (stars.current.material as THREE.PointsMaterial).opacity =
      0.35 + 0.25 * sphase(p, 0, 0.08);
    dust.current.rotation.y = -t * 0.012;

    {
      const floorMat = floor.current.material as THREE.MeshBasicMaterial;
      floorMat.opacity = 0.11 * sphase(p, 0.02, 0.12);
      floorMat.map?.offset.set(0, t * 0.006);
    }

    // the drive pulse: position, glow wall, and a travelling light
    const pulseW = window01(p, T.pulseSweep[0], T.pulseSweep[1], 0.025);
    const sweepX = THREE.MathUtils.lerp(
      -9,
      9,
      phase(p, T.pulseSweep[0], T.pulseSweep[1])
    );
    pulseSweep.current.position.x = sweepX;
    (pulseSweep.current.material as THREE.MeshBasicMaterial).opacity =
      pulseW * 0.55;
    pulseLight.current.position.set(sweepX, 1.6, 0);
    pulseLight.current.intensity = pulseW * 26;

    // per-atom error amount (0 for most atoms)
    const errAmtFor = (i: number) => {
      const slot = ERROR_ATOMS.indexOf(i);
      if (slot < 0) return 0;
      const [a, b] = ERROR_WINDOWS[slot];
      return window01(p, a, b, 0.03);
    };

    const ctaRipple = sphase(p, 0.78, 0.88);

    GRID.forEach(([gx, gz], i) => {
      const mesh = atomRefs.current[i];
      const glow = glowRefs.current[i];
      if (!mesh || !glow) return;
      const arrive = sphase(p, T.atomsIn[0], T.atomsIn[1] + (i % COLS) * 0.008);
      const [sx, sy, sz] = scatter[i];

      // ride the drive pulse: a travelling lift wave centred on the sweep
      const lift =
        pulseW * 0.8 * Math.exp(-((gx - sweepX) * (gx - sweepX)) / 2.2);
      // idle float + CTA celebration ripple
      const bob =
        0.12 * Math.sin(t * 1.1 + i * 1.7) * arrive +
        0.16 * Math.sin(t * 2.2 + (gx + gz) * 0.8) * ctaRipple;

      mesh.position.set(
        THREE.MathUtils.lerp(sx, gx, arrive),
        THREE.MathUtils.lerp(sy, 0, arrive) + lift + bob,
        THREE.MathUtils.lerp(sz, gz, arrive)
      );

      const err = errAmtFor(i);
      // glitchy quantized jumps, not smooth wobble
      mesh.position.x += q(Math.sin(t * 19 + i * 3), 3) * 0.14 * err;
      mesh.position.y += q(Math.cos(t * 23 + i * 5), 3) * 0.12 * err;

      const breathe = 1 + 0.05 * Math.sin(t * 1.8 + i * 1.1);
      mesh.scale.setScalar(breathe * (1 + 0.3 * err));

      const mat = mesh.material as THREE.MeshStandardMaterial;
      colors.tmp.copy(colors.atom).lerp(colors.error, err);
      // atoms glint yellow as the pulse washes over them
      colors.tmp.lerp(colors.brand, Math.min(1, lift * 1.4));
      mat.color.copy(colors.tmp);
      mat.emissive.copy(colors.tmp);
      mat.emissiveIntensity = 0.55 + 0.9 * err + 1.1 * lift;
      mat.opacity = arrive;

      glow.position.copy(mesh.position);
      // occasional twinkle keeps the idle array alive
      const twinkle = Math.pow(Math.max(0, Math.sin(t * 0.7 + i * 2.9)), 8);
      glow.scale.setScalar(1.7 * breathe * (1 + 0.6 * err + 0.5 * lift));
      const gmat = glow.material as THREE.SpriteMaterial;
      gmat.color.copy(colors.tmp);
      gmat.opacity = arrive * (0.3 + 0.38 * err + 0.4 * lift + 0.18 * twinkle);
    });

    // tweezer beams
    tweezerRefs.current.forEach((tw, i) => {
      if (!tw) return;
      (tw.material as THREE.MeshBasicMaterial).opacity =
        0.1 * sphase(p, T.tweezersIn[0], T.tweezersIn[1] + (i % COLS) * 0.008);
    });

    // entangling bonds ripple in behind the pulse
    bondRefs.current.forEach((bond, i) => {
      if (!bond) return;
      const inAmt = sphase(
        p,
        T.bondsIn[0] + (i % COLS) * 0.015,
        T.bondsIn[0] + (i % COLS) * 0.015 + 0.07
      );
      (bond.material as THREE.MeshBasicMaterial).opacity =
        inAmt * (0.4 + 0.15 * Math.sin(t * 2.4 + i));
    });

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
      <fog attach="fog" args={["#050510", 11, 32]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 6]} intensity={0.6} />
      <pointLight
        ref={pulseLight}
        color="#fff676"
        intensity={0}
        distance={12}
        decay={2}
      />

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

      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.22}
          color="#8b7cf6"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={root}>
        {/* retro grid floor, fading into the fog */}
        <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
          <planeGeometry args={[90, 90]} />
          <meshBasicMaterial
            map={gridTex}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* optical tweezers — beams visible from every camera angle */}
        {GRID.map(([x, z], i) => (
          <mesh
            key={`tw-${i}`}
            position={[x, 0.4, z]}
            ref={(m) => {
              tweezerRefs.current[i] = m;
            }}
          >
            <cylinderGeometry args={[0.05, 0.05, 7, 6]} />
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

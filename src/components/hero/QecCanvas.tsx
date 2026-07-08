"use client";

import { Canvas } from "@react-three/fiber";
import QecScene from "./QecScene";

export default function QecCanvas({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1, 14.5], fov: 42 }}
      // low-res + pixelated upscale = the retro-game render style
      dpr={0.4}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.style.imageRendering = "pixelated";
      }}
    >
      <QecScene progressRef={progressRef} />
    </Canvas>
  );
}

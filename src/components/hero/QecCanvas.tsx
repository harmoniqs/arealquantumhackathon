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
      camera={{ position: [0, 0, 15], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <QecScene progressRef={progressRef} />
    </Canvas>
  );
}

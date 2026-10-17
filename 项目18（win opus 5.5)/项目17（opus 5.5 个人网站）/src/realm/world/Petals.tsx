"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createRandom } from "@/lib/math/random";
import { useRealmStore } from "@/store/useRealmStore";
export function Petals() {
  const ref = useRef<THREE.Points>(null);
  const reduced = useRealmStore((s) => s.reducedMotion),
    quality = useRealmStore((s) => s.quality);
  const count = quality === "lite" ? 100 : 480;
  const { positions, speeds } = useMemo(() => {
    const r = createRandom(8);
    const positions = new Float32Array(count * 3),
      speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions.set(
        [r.range(-48, 48), r.range(1, 24), r.range(-40, 40)],
        i * 3,
      );
      speeds[i] = r.range(0.25, 0.65);
    }
    return { positions, speeds };
  }, [count]);
  useFrame((_s, d) => {
    if (!ref.current || reduced) return;
    const p = ref.current.geometry.attributes.position;
    const dt = Math.min(d, 0.05);
    for (let i = 0; i < count; i++) {
      p.setY(i, p.getY(i) - speeds[i] * dt);
      p.setX(i, p.getX(i) + dt * 0.08);
      if (p.getY(i) < 0) p.setY(i, 24);
    }
    p.needsUpdate = true;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#E5B4A4"
        size={0.12}
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

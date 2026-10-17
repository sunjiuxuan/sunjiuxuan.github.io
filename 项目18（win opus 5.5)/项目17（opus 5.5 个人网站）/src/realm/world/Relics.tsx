"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ZONES } from "@/config/realm.config";
import { getTerrainHeight } from "@/lib/math/placeNodes";
import { useRealmStore } from "@/store/useRealmStore";
import { createToonRamp } from "../art/toon";

function Waypoint({ x, z, id }: { x: number; z: number; id: string }) {
  const setZone = useRealmStore((s) => s.setZone),
    reduced = useRealmStore((s) => s.reducedMotion);
  const crystal = useRef<THREE.Mesh>(null);
  const y = Math.max(getTerrainHeight(x, z), -0.6);
  useFrame((s) => {
    if (crystal.current && !reduced) {
      crystal.current.rotation.y = s.clock.elapsedTime * 0.4;
      crystal.current.position.y =
        2.6 + Math.sin(s.clock.elapsedTime * 1.4) * 0.15;
    }
  });
  return (
    <group
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        setZone(id);
        window.dispatchEvent(new CustomEvent("fly-to-zone", { detail: id }));
      }}
    >
      <mesh receiveShadow>
        <cylinderGeometry args={[1.1, 1.4, 0.32, 8]} />
        <meshToonMaterial color="#c9d8c9" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.5, 1.6, 6]} />
        <meshToonMaterial color="#7b9e99" />
      </mesh>
      <mesh ref={crystal} position={[0, 2.6, 0]} scale={[0.45, 1.1, 0.45]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#86ffff"
          emissive="#42e0fa"
          emissiveIntensity={1.6}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.78, 48]} />
        <meshBasicMaterial color="#9ffaff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 4, 8]} />
        <meshBasicMaterial
          color="#8ee8ff"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
export function Relics() {
  const ramp = useMemo(createToonRamp, []);
  return (
    <group>
      {Object.values(ZONES).map((z) => (
        <Waypoint
          key={z.id}
          id={z.id}
          x={z.center[0] + 5}
          z={z.center[2] - 3}
        />
      ))}
      <group
        position={[-37, getTerrainHeight(-37, -23), -23]}
        rotation={[0, 0.4, 0]}
      >
        {[-3, 3].map((x, i) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 2.7, 0]} castShadow>
              <cylinderGeometry args={[0.65, 0.9, i ? 5.4 : 7, 6]} />
              <meshToonMaterial color="#bac9b9" gradientMap={ramp} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[2, 0.4, 2]} />
              <meshToonMaterial color="#bdcdbc" gradientMap={ramp} />
            </mesh>
            <mesh
              position={[0, i ? 5.6 : 6.3, 0]}
              rotation={[0, 0, 0.12]}
              castShadow
            >
              <boxGeometry args={[1.9, 0.5, 1.6]} />
              <meshToonMaterial color="#d7dec8" gradientMap={ramp} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 6.1, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[5.2, 0.7, 1.4]} />
          <meshToonMaterial color="#c1ceba" gradientMap={ramp} />
        </mesh>
      </group>
      <group position={[42, 9, -51]}>
        <mesh castShadow>
          <dodecahedronGeometry args={[5, 0]} />
          <meshToonMaterial color="#689c8b" gradientMap={ramp} />
        </mesh>
        <mesh position={[0, 3.3, 0]} scale={[1, 0.2, 1]}>
          <dodecahedronGeometry args={[4.8, 0]} />
          <meshToonMaterial color="#83b85b" gradientMap={ramp} />
        </mesh>
        <mesh position={[7, -4, 1]}>
          <octahedronGeometry args={[1.7, 0]} />
          <meshToonMaterial color="#73a6a0" gradientMap={ramp} />
        </mesh>
      </group>
    </group>
  );
}

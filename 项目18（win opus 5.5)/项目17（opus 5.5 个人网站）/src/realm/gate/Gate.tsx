"use client";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
export const Gate = forwardRef(function Gate(_props, ref) {
  const doorL = useRef<THREE.Group>(null),
    doorR = useRef<THREE.Group>(null);
  useImperativeHandle(ref, () => ({
    doorL: doorL.current,
    doorR: doorR.current,
    runes: { uGlow: 0 },
  }));
  const roof = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-5.8, 0);
    shape.lineTo(-4.7, 0.7);
    shape.lineTo(4.7, 0.7);
    shape.lineTo(5.8, 0);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 2.3,
      bevelEnabled: false,
    });
    geo.translate(0, 0, -1.15);
    return geo;
  }, []);
  const label = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#335C6D";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '42px \"Songti SC\", serif';
    ctx.fillText("桃 源", 128, 34);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  return (
    <group>
      {[-4.4, 4.4].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow receiveShadow position={[0, 3.9, 0]}>
            <boxGeometry args={[0.65, 7.8, 0.7]} />
            <meshToonMaterial color="#D1DBC9" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[1, 0.5, 1.1]} />
            <meshToonMaterial color="#A9C3B7" />
          </mesh>
        </group>
      ))}
      <mesh castShadow receiveShadow position={[0, 7.8, 0]}>
        <boxGeometry args={[10.4, 0.7, 1.5]} />
        <meshToonMaterial color="#416A80" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 8.15, 0]} geometry={roof}>
        <meshToonMaterial color="#4D8895" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 7.15, 0.4]}>
        <boxGeometry args={[2.6, 0.8, 0.12]} />
        <meshToonMaterial color="#C7B89C" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 7.15, 0.47]}>
        <planeGeometry args={[2.3, 0.6]} />
        <meshBasicMaterial map={label} transparent />
      </mesh>
      <group ref={doorL} position={[-4, 0, 0]}>
        <Door x={2} />
      </group>
      <group ref={doorR} position={[4, 0, 0]}>
        <Door x={-2} />
      </group>
      <mesh
        castShadow
        receiveShadow
        position={[0, -0.38, 0]}
        scale={[1, 1, 0.66]}
      >
        <cylinderGeometry args={[7.8, 8.1, 0.48, 48]} />
        <meshToonMaterial color="#CBD8C7" />
      </mesh>
      <mesh
        position={[0, -0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, 0.66, 1]}
      >
        <ringGeometry args={[6.9, 7.02, 64]} />
        <meshBasicMaterial color="#EDE7BA" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[11, 0.25, 3]} />
        <meshToonMaterial color="#C6D6C3" />
      </mesh>
    </group>
  );
});
function Door({ x }: { x: number }) {
  return (
    <group position={[x, 3.4, 0]}>
      <mesh>
        <boxGeometry args={[3.95, 6.7, 0.18]} />
        <meshToonMaterial color="#3B6D7A" />
      </mesh>
      {[-1.3, -0.65, 0, 0.65, 1.3].map((v) => (
        <mesh castShadow receiveShadow position={[v, 0, 0.12]} key={v}>
          <boxGeometry args={[0.035, 6.2, 0.025]} />
          <meshToonMaterial color="#D8D9AF" />
        </mesh>
      ))}
      <group position={[0, 0.1, 0.18]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.45, 1.45, 0.07]} />
          <meshToonMaterial color="#BDD7C8" />
        </mesh>
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.17, 1.17, 0.04]} />
          <meshToonMaterial color="#456F81" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <torusGeometry args={[0.43, 0.025, 8, 32]} />
          <meshBasicMaterial color="#F9E6A6" />
        </mesh>
        <mesh position={[0, 0, 0.15]} scale={[0.16, 0.34, 0.12]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#B6F8FF"
            emissive="#54DDFA"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
      {[-2.6, 2.6].map((v) => (
        <mesh castShadow receiveShadow position={[0, v, 0.12]} key={v}>
          <boxGeometry args={[3.6, 0.12, 0.04]} />
          <meshToonMaterial color="#C8B594" />
        </mesh>
      ))}
      <mesh
        position={[x > 0 ? 1.5 : -1.5, -0.2, 0.21]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.16, 0.035, 6, 20]} />
        <meshToonMaterial color="#D3BD87" />
      </mesh>
    </group>
  );
}

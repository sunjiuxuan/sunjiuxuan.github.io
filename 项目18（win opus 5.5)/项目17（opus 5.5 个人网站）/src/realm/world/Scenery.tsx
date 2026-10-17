"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createToonRamp } from "../art/toon";
import { createRandom } from "@/lib/math/random";
import { getTerrainHeight } from "@/lib/math/placeNodes";
export function Scenery() {
  const ramp = useMemo(createToonRamp, []);
  const bamboo = useRef<THREE.InstancedMesh>(null),
    leaves = useRef<THREE.InstancedMesh>(null),
    rocks = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const r = createRandom(45),
      d = new THREE.Object3D();
    for (let i = 0; i < 80; i++) {
      const x = r.range(2, 26),
        z = r.range(-36, -16),
        y = getTerrainHeight(x, z),
        s = r.range(0.7, 1.3);
      d.position.set(x, y + 3 * s, z);
      d.scale.set(1, s, 1);
      d.rotation.set(0, 0, r.range(-0.06, 0.06));
      d.updateMatrix();
      bamboo.current?.setMatrixAt(i, d.matrix);
      for (let j = 0; j < 5; j++) {
        const a = j * 1.256 + r.value() * 0.4;
        d.position.set(
          x + Math.cos(a) * s * 0.5,
          y + (3.7 + (j % 3) * 0.55) * s,
          z + Math.sin(a) * s * 0.5,
        );
        d.scale.set(s * 0.85, 0.11, s * 0.3);
        d.rotation.set(0.18, a, j * 0.08);
        d.updateMatrix();
        leaves.current?.setMatrixAt(i * 5 + j, d.matrix);
      }
    }
    for (let i = 0; i < 45; i++) {
      const a = r.range(0, 6.28),
        radius = r.range(18, 60),
        x = Math.cos(a) * radius,
        z = Math.sin(a) * radius;
      d.position.set(x, Math.max(getTerrainHeight(x, z), -0.6), z);
      d.scale.set(r.range(0.6, 2), r.range(0.4, 1.3), r.range(0.6, 1.7));
      d.rotation.set(r.value(), r.value() * 5, r.value());
      d.updateMatrix();
      rocks.current?.setMatrixAt(i, d.matrix);
    }
    for (const mesh of [bamboo.current, leaves.current, rocks.current]) {
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
    }
  }, []);
  const mountains = useMemo(() => {
    const r = createRandom(4);
    return Array.from({ length: 18 }, (_, i) => ({
      x: -170 + i * 20,
      z: -90 - r.value() * 45,
      h: 22 + r.value() * 31,
      s: 15 + r.value() * 16,
      seed: r.value(),
    }));
  }, []);
  return (
    <group>
      <instancedMesh ref={bamboo} args={[undefined, undefined, 80]}>
        <cylinderGeometry args={[0.07, 0.1, 6, 5]} />
        <meshToonMaterial color="#507E40" />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, 400]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshToonMaterial color="#569A59" />
      </instancedMesh>
      <instancedMesh ref={rocks} args={[undefined, undefined, 45]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshToonMaterial color="#95AC9F" />
      </instancedMesh>
      {mountains.map((m, i) => (
        <Mountain key={i} {...m} index={i} />
      ))}
      <Bridge />
      <Pavilion />
    </group>
  );
}
function Bridge() {
  return (
    <group position={[-12, -0.45, 1]}>
      {Array.from({ length: 20 }, (_, i) => {
        const x = -5 + i * 0.53,
          y = Math.sin((i / 19) * Math.PI) * 1.1;
        return (
          <mesh key={i} position={[x, y, 0]}>
            <boxGeometry args={[0.48, 0.14, 2.6]} />
            <meshToonMaterial color={i % 2 ? "#BCAD8A" : "#C8B995"} />
          </mesh>
        );
      })}
      {[-1.25, 1.25].map((z) => (
        <group key={z}>
          {[-4, -2, 0, 2, 4].map((x) => (
            <mesh
              key={x}
              position={[x, Math.cos(((x / 5) * Math.PI) / 2) * 1.1 + 0.5, z]}
            >
              <boxGeometry args={[0.1, 1, 0.1]} />
              <meshToonMaterial color="#897B61" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
function Pavilion() {
  const ramp = useMemo(createToonRamp, []);
  const y = getTerrainHeight(0, 0);
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[3, 3.3, 0.3, 6]} />
        <meshToonMaterial color="#D4CEB6" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.1, 1.7, Math.sin(a) * 2.1]}>
            <cylinderGeometry args={[0.12, 0.15, 3.3, 6]} />
            <meshToonMaterial color="#8B765C" />
          </mesh>
        );
      })}
      <mesh position={[0, 3.65, 0]}>
        <cylinderGeometry args={[2.8, 3.3, 0.25, 6]} />
        <meshToonMaterial color="#3B6575" />
      </mesh>
      <mesh position={[0, 4.25, 0]}>
        <coneGeometry args={[3.2, 1.4, 6]} />
        <meshToonMaterial color="#477E8B" />
      </mesh>
      <mesh position={[0, 5.05, 0]}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshToonMaterial color="#BA9D73" />
      </mesh>
    </group>
  );
}

function Mountain({
  x,
  z,
  h,
  s,
  seed,
  index,
}: {
  x: number;
  z: number;
  h: number;
  s: number;
  seed: number;
  index: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(s * 0.06, s, h, 9, 7);
    const p = g.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const stone = new THREE.Color(index % 2 ? "#7EA9B5" : "#6799A6"),
      moss = new THREE.Color("#72A494");
    for (let i = 0; i < p.count; i++) {
      const t = (p.getY(i) + h / 2) / h,
        a = Math.atan2(p.getZ(i), p.getX(i));
      const bulge =
        1 + Math.sin(a * 3 + seed * 6) * 0.18 + Math.sin(t * 11 + a * 2) * 0.13;
      p.setXYZ(
        i,
        p.getX(i) * bulge + Math.sin(t * 2 + seed * 5) * s * 0.2,
        p.getY(i) + Math.sin(a * 3 + seed * 5) * t * s * 0.16,
        p.getZ(i) * bulge * 0.7,
      );
      stone
        .clone()
        .lerp(moss, Math.max(0, t - 0.65) * 1.7)
        .toArray(colors, i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [s, h, seed, index]);
  return (
    <mesh position={[x, h / 2 - 2, z]} geometry={geometry}>
      <meshLambertMaterial vertexColors flatShading />
    </mesh>
  );
}

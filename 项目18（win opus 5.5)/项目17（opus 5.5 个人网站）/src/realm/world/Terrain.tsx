"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { createToonRamp } from "../art/toon";
import { getTerrainHeight } from "@/lib/math/placeNodes";
export function Terrain() {
  const ramp = useMemo(createToonRamp, []);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 220, 160, 160);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const low = new THREE.Color("#8AC34B"),
      high = new THREE.Color("#47946B"),
      sand = new THREE.Color("#EADCB0");
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i),
        h = getTerrainHeight(x, z);
      p.setY(i, h);
      const c =
        h < 0.3
          ? sand.clone().lerp(low, THREE.MathUtils.smoothstep(h, -0.5, 0.3))
          : low.clone().lerp(high, THREE.MathUtils.smoothstep(h, 2, 13));
      const path = Math.abs(x - (5 + Math.sin(z * 0.11) * 3));
      if (z > -8 && z < 35 && h > -0.2 && path < 2.4)
        c.lerp(sand, 1 - THREE.MathUtils.smoothstep(path, 1.5, 2.4));
      c.multiplyScalar(0.96 + Math.sin(x * 0.17 + z * 0.11) * 0.04);
      c.toArray(colors, i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshToonMaterial vertexColors gradientMap={ramp} />
    </mesh>
  );
}

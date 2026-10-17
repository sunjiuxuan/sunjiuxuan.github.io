"use client";
import { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createRandom } from "@/lib/math/random";
import { getTerrainHeight, riverX } from "@/lib/math/placeNodes";
import { useRealmStore } from "@/store/useRealmStore";
import { createToonRamp } from "../art/toon";

export function Meadow() {
  const { quality, reducedMotion } = useRealmStore();
  const count = quality === "lite" ? 1800 : 6500;
  const grass = useRef<THREE.InstancedMesh>(null);
  const flowers = useRef<THREE.InstancedMesh>(null);
  const ramp = useMemo(createToonRamp, []);
  const wind = useMemo(() => ({ value: 0 }), []);
  useEffect(() => () => ramp.dispose(), [ramp]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          -0.13, 0, 0, 0.13, 0, 0, 0.05, 0.75, 0, 0, 0, -0.13, 0, 0, 0.13, 0.05,
          0.65, 0, -0.2, 0, -0.1, 0.04, 0, 0.1, -0.15, 0.5, -0.08,
        ],
        3,
      ),
    );
    g.computeVertexNormals();
    return g;
  }, []);
  useLayoutEffect(() => {
    const r = createRandom(954),
      d = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      let x = 0,
        z = 0,
        y = 0;
      for (let t = 0; t < 80; t++) {
        x = r.range(-63, 64);
        z = r.range(-57, 60);
        y = getTerrainHeight(x, z);
        const path =
          Math.abs(x - (5 + Math.sin(z * 0.11) * 3)) < 2.1 && z > -8 && z < 30;
        if (
          y > -0.1 &&
          Math.abs(x - riverX(z)) > 6 &&
          Math.hypot(x, z) > 4 &&
          !path
        )
          break;
      }
      const s = r.range(0.5, 1.4);
      d.position.set(x, y + 0.02, z);
      d.rotation.set(0, r.range(0, 6.28), 0);
      d.scale.set(s, s, s);
      d.updateMatrix();
      grass.current?.setMatrixAt(i, d.matrix);
      grass.current?.setColorAt(
        i,
        new THREE.Color(r.choose(["#6aab36", "#8fc34c", "#b5d963", "#4f9c42"])),
      );
      if (i < 320) {
        d.position.y += 0.4 * s;
        d.scale.set(0.12, 0.08, 0.12);
        d.updateMatrix();
        flowers.current?.setMatrixAt(i, d.matrix);
        flowers.current?.setColorAt(
          i,
          new THREE.Color(
            r.choose(["#fff1af", "#eef4ff", "#9f9fe4", "#ffe6e9"]),
          ),
        );
      }
    }
    for (const m of [grass.current, flowers.current])
      if (m) {
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        m.computeBoundingSphere();
      }
  }, [count]);
  useFrame((s) => {
    wind.value = reducedMotion ? 0 : s.clock.elapsedTime;
  });
  return (
    <group>
      <instancedMesh
        ref={grass}
        args={[geometry, undefined, count]}
        frustumCulled={false}
      >
        <meshToonMaterial
          side={THREE.DoubleSide}
          gradientMap={ramp}
          onBeforeCompile={(shader) => {
            shader.uniforms.uWind = wind;
            shader.vertexShader =
              "uniform float uWind;\n" +
              shader.vertexShader.replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>\n transformed.x += sin(uWind*1.3 + instanceMatrix[3].x*.4 + instanceMatrix[3].z*.3)*position.y*.18;`,
              );
          }}
        />
      </instancedMesh>
      <instancedMesh ref={flowers} args={[undefined, undefined, 320]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}

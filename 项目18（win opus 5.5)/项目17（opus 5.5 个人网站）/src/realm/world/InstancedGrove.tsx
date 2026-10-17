"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ZONES } from "@/config/realm.config";
import { createToonRamp } from "../art/toon";
import { createRandom } from "@/lib/math/random";
import { getTerrainHeight, riverX } from "@/lib/math/placeNodes";
import { useRealmStore } from "@/store/useRealmStore";
export function InstancedGrove() {
  const ramp = useMemo(createToonRamp, []);
  const quality = useRealmStore((s) => s.quality),
    count = quality === "lite" ? 140 : 300;
  const trunk = useRef<THREE.InstancedMesh>(null),
    leaves = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => {
    const r = createRandom(71);
    const items = [];
    for (let i = 0; i < count; i++) {
      let x = 0,
        z = 0;
      for (let t = 0; t < 100; t++) {
        x = r.range(-65, 65);
        z = r.range(-60, 58);
        const h = getTerrainHeight(x, z);
        const sightline = Object.values(ZONES).some((zone) => {
          const dx = x - zone.center[0],
            dz = z - zone.center[2];
          const t = THREE.MathUtils.clamp(
            (dx * 17 + dz * 22) / (17 * 17 + 22 * 22),
            0,
            1.25,
          );
          return (
            Math.hypot(dx - 17 * t, dz - 22 * t) < 9 ||
            Math.hypot(dx, dz) < zone.radius * 0.7 + 7
          );
        });
        if (
          !sightline &&
          Math.hypot(x, z) > 12 &&
          Math.hypot(x - 28, z - 43) > 21 &&
          !(z > 22 && x > -4 && x < 32) &&
          h > 0 &&
          Math.abs(x - riverX(z)) > 7 &&
          !(x > 0 && x < 23 && z < -14 && z > -36) &&
          !(x > 8 && x < 33 && z > -8 && z < 12)
        )
          break;
      }
      items.push({
        x,
        z,
        y: getTerrainHeight(x, z),
        scale: r.range(0.75, 1.5),
        rotation: r.range(0, Math.PI * 2),
        color:
          x > 10 && z > -12 && z < 20
            ? r.choose(["#EDADC3", "#E5AAC4", "#F0CBD4"])
            : r.choose(["#29835F", "#5CA83E", "#89BC43", "#448A50"]),
      });
    }
    return items;
  }, [count]);
  useLayoutEffect(() => {
    if (!trunk.current || !leaves.current) return;
    const d = new THREE.Object3D();
    data.forEach((v, i) => {
      d.position.set(v.x, v.y + 1.6 * v.scale, v.z);
      d.scale.set(v.scale * 0.9, v.scale, v.scale * 0.9);
      d.rotation.set(0.05, v.rotation, 0.05);
      d.updateMatrix();
      trunk.current!.setMatrixAt(i, d.matrix);
      for (let j = 0; j < 4; j++) {
        const a = j * 2.39996;
        d.position.set(
          v.x + Math.cos(a) * v.scale * 0.7,
          v.y + (3.1 + (j % 2) * 0.6) * v.scale,
          v.z + Math.sin(a) * v.scale * 0.7,
        );
        d.scale.set(v.scale * (1.2 + j * 0.1), v.scale * 1.05, v.scale * 1.12);
        d.rotation.set(j * 0.2, v.rotation, 0);
        d.updateMatrix();
        leaves.current!.setMatrixAt(i * 4 + j, d.matrix);
        leaves.current!.setColorAt(
          i * 4 + j,
          new THREE.Color(v.color).multiplyScalar(0.95 + j * 0.025),
        );
      }
    });
    trunk.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceMatrix.needsUpdate = true;
    if (leaves.current.instanceColor)
      leaves.current.instanceColor.needsUpdate = true;
    trunk.current.computeBoundingSphere();
    leaves.current.computeBoundingSphere();
  }, [data]);
  return (
    <group>
      <instancedMesh
        ref={trunk}
        args={[undefined, undefined, count]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.1, 0.28, 3.2, 6]} />
        <meshToonMaterial color="#806544" gradientMap={ramp} />
      </instancedMesh>
      <instancedMesh
        ref={leaves}
        args={[undefined, undefined, count * 4]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[1.5, 2]} />
        <meshToonMaterial gradientMap={ramp} />
      </instancedMesh>
    </group>
  );
}

"use client";
import { Atmosphere } from "./Atmosphere";
import { Meadow } from "./Meadow";
import { Relics } from "./Relics";
import { useRealmStore } from "@/store/useRealmStore";
import { Terrain } from "./Terrain";
import { Water } from "./Water";
import { InstancedGrove } from "./InstancedGrove";
import { Petals } from "./Petals";
import { Scenery } from "./Scenery";
import { NodeLayer } from "../nodes/NodeLayer";
import { HEMI_SKY, HEMI_GROUND, SUN_DIR, SUN_COLOR } from "../art/palette";
export function World() {
  const quality = useRealmStore((s) => s.quality);
  return (
    <group>
      <Atmosphere />
      <Terrain />
      <Meadow />
      <Relics />
      <Water />
      <InstancedGrove />
      <Petals />
      <Scenery />
      <NodeLayer />
      <hemisphereLight
        color={HEMI_SKY}
        groundColor={HEMI_GROUND}
        intensity={0.9}
      />
      <directionalLight
        position={SUN_DIR.clone().multiplyScalar(70)}
        intensity={1.8}
        castShadow={quality !== "lite"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-camera-far={220}
        shadow-normalBias={0.15}
        shadow-bias={-0.0005}
        color={SUN_COLOR}
      />
    </group>
  );
}

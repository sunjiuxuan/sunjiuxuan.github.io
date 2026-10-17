"use client";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRealmStore } from "@/store/useRealmStore";
import { introLook, introPath } from "./introTimeline";
import { REALM, ZONES } from "@/config/realm.config";
import { getTerrainHeight } from "@/lib/math/placeNodes";
export function ExploreControls() {
  const { phase, activeId, nodes, reducedMotion, view } = useRealmStore();
  const controls = useRef<any>(null);
  const mapTick = useRef(0);
  const keys = useRef(new Set<string>());
  const vectors = useRef({
    p: new THREE.Vector3(),
    t: new THREE.Vector3(),
    forward: new THREE.Vector3(),
    right: new THREE.Vector3(),
    delta: new THREE.Vector3(),
  });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        document.querySelector('[role="dialog"]') ||
        (e.target instanceof HTMLElement &&
          e.target.closest(
            "input,textarea,select,button,a,[contenteditable=true]",
          ))
      )
        return;
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase()))
        keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);
  useFrame((_, dt) => {
    if (
      phase !== "exploring" ||
      view !== "explore" ||
      !controls.current ||
      !keys.current.size ||
      document.querySelector('[role="dialog"]')
    )
      return;
    const { p, t, forward, right, delta } = vectors.current;
    const c = controls.current;
    c.getPosition(p);
    c.getTarget(t);
    forward.subVectors(t, p).setY(0).normalize();
    right.crossVectors(forward, THREE.Object3D.DEFAULT_UP).normalize();
    delta.set(0, 0, 0);
    if (keys.current.has("w")) delta.add(forward);
    if (keys.current.has("s")) delta.sub(forward);
    if (keys.current.has("d")) delta.add(right);
    if (keys.current.has("a")) delta.sub(right);
    delta.normalize().multiplyScalar(Math.min(dt, 0.05) * 11);
    if (Math.hypot(t.x + delta.x, t.z + delta.z) > 75) return;
    p.add(delta);
    t.add(delta);
    c.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false);
  });
  useFrame((s) => {
    if (
      !controls.current ||
      view !== "explore" ||
      s.clock.elapsedTime - mapTick.current < 0.2
    )
      return;
    mapTick.current = s.clock.elapsedTime;
    const { p, t } = vectors.current;
    controls.current.getPosition(p);
    controls.current.getTarget(t);
    window.dispatchEvent(
      new CustomEvent("realm-viewpoint", {
        detail: {
          x: t.x,
          z: t.z,
          heading: (Math.atan2(t.x - p.x, -(t.z - p.z)) * 180) / Math.PI - 45,
        },
      }),
    );
  });
  useEffect(() => {
    const fly = (e: Event) => {
      const z = ZONES[(e as CustomEvent).detail];
      if (!z || !controls.current) return;
      const [x, , v] = z.center,
        y = Math.max(getTerrainHeight(x, v), 0);
      controls.current.setLookAt(
        x + 17,
        y + 9,
        v + 22,
        x,
        y + 2,
        v,
        !reducedMotion,
      );
    };
    const reset = () => {
      const p = introPath.getPointAt(1),
        t = introLook.getPointAt(1);
      controls.current?.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, !reducedMotion);
    };
    window.addEventListener("fly-to-zone", fly);
    window.addEventListener("realm-reset", reset);
    return () => {
      window.removeEventListener("fly-to-zone", fly);
      window.removeEventListener("realm-reset", reset);
    };
  }, [reducedMotion]);
  useEffect(() => {
    if (
      phase === "focusing" &&
      activeId &&
      controls.current &&
      view === "explore"
    ) {
      const n = nodes.find((n) => n.id === activeId);
      if (n?.position) {
        const [x, y, z] = n.position;
        controls.current.setLookAt(
          x + 12,
          y + 8,
          z + 12,
          x,
          y + 1,
          z,
          !reducedMotion,
        );
      }
    }
  }, [phase, activeId, nodes, reducedMotion, view]);
  if (!["exploring", "focusing"].includes(phase)) return null;
  return (
    <CameraControls
      makeDefault
      ref={(c) => {
        controls.current = c;
        if (!c || (c as any).__synced) return;
        const p = introPath.getPointAt(1),
          t = introLook.getPointAt(1);
        c.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false);
        (c as any).__synced = true;
      }}
      minDistance={REALM.explore.minDistance}
      maxDistance={REALM.explore.maxDistance}
      minPolarAngle={REALM.explore.minPolar}
      maxPolarAngle={REALM.explore.maxPolar}
      smoothTime={reducedMotion ? 0 : 0.6}
      enabled={view === "explore" && phase !== "focusing"}
    />
  );
}

"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { camProxy, fx } from "../effects/fxProxy";
import { introPath, introLook } from "./introTimeline";
import { useRealmStore } from "@/store/useRealmStore";
import { useEffect } from "react";

const tmp = new THREE.Vector3();

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const phase = useRealmStore((s) => s.phase);

  useEffect(() => {
    // 初始位置设置
    if (phase === "loading" || phase === "gate") {
      camera.position.copy(introPath.getPointAt(0));
      camera.lookAt(introLook.getPointAt(0, tmp));
    }
  }, [camera, phase]);

  useFrame(() => {
    if (scene.fog instanceof THREE.FogExp2) scene.fog.density = fx.fogDensity;
    if (!camProxy.active) return; // 探索阶段交给 CameraControls
    camera.position.copy(introPath.getPointAt(camProxy.t));
    camera.lookAt(introLook.getPointAt(camProxy.t, tmp));
    if (camera.fov !== camProxy.fov) {
      camera.fov = camProxy.fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

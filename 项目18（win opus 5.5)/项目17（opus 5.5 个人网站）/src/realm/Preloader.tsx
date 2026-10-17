"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useRealmStore } from "@/store/useRealmStore";
export function Preloader() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      try {
        gl.compile(scene, camera);
      } finally {
        if (!cancelled && useRealmStore.getState().phase === "loading")
          useRealmStore.getState().setPhase("gate");
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [gl, scene, camera]);
  return null;
}

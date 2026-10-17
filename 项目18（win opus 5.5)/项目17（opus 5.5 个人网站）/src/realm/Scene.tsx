"use client";
import { Component, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { Preloader } from "./Preloader";
import { useRealmStore } from "@/store/useRealmStore";
import * as THREE from "three";
import { MIST } from "./art/palette";
class SceneBoundary extends Component<
  { children: React.ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onUnavailable();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function Scene({
  onUnavailable,
}: {
  onUnavailable: () => void;
}) {
  const quality = useRealmStore((s) => s.quality),
    view = useRealmStore((s) => s.view);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) onUnavailable();
    } catch {
      onUnavailable();
    }
  }, []);
  return (
    <SceneBoundary onUnavailable={onUnavailable}>
      <Canvas
        shadows={quality !== "lite"}
        frameloop={view === "journal" ? "never" : "always"}
        dpr={quality === "lite" ? 1 : [1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 5, 43], fov: 48, near: 0.1, far: 400 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onUnavailable, {
            once: true,
          });
        }}
      >
        <color attach="background" args={[MIST]} />
        <fogExp2 attach="fog" color={MIST} density={0.0035} />
        <Preloader />
        <Experience />
      </Canvas>
    </SceneBoundary>
  );
}

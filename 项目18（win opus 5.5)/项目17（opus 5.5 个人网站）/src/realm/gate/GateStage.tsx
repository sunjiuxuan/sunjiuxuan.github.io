"use client";
import { useEffect, useRef } from "react";
import { useRealmStore } from "@/store/useRealmStore";
import { Gate } from "./Gate";
import { buildIntroTimeline, IntroRefs } from "../camera/introTimeline";
import { fx, camProxy } from "../effects/fxProxy";
import * as THREE from "three";
import type gsap from "gsap";
export function GateStage() {
  const phase = useRealmStore((s) => s.phase),
    reduced = useRealmStore((s) => s.reducedMotion);
  const gate = useRef<any>(null),
    root = useRef<THREE.Group>(null),
    timeline = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    if (gate.current && root.current) {
      timeline.current = buildIntroTimeline({
        ...gate.current,
        gateRoot: root.current,
        cloudSea: root.current,
      } as IntroRefs);
    }
    return () => {
      timeline.current?.kill();
      timeline.current = null;
      camProxy.active = false;
      fx.veil = 0;
    };
  }, []);
  useEffect(() => {
    if (phase === "entering") {
      if (reduced) {
        timeline.current?.progress(1);
      } else timeline.current?.play(0);
    }
    if (phase === "exploring" || phase === "focusing") {
      if (root.current) root.current.visible = false;
      if (timeline.current?.isActive()) {
        timeline.current.pause();
        fx.veil = 0;
        camProxy.active = false;
      }
    }
  }, [phase, reduced]);
  return (
    <group ref={root} position={[0, 0, 22]}>
      <Gate ref={gate} />
    </group>
  );
}

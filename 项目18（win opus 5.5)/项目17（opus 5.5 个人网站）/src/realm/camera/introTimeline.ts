import gsap from "gsap";
import * as THREE from "three";
import { REALM } from "@/config/realm.config";
import { fx, camProxy } from "../effects/fxProxy";
import { useRealmStore } from "@/store/useRealmStore";
export interface IntroRefs {
  doorL: THREE.Object3D;
  doorR: THREE.Object3D;
  runes: { uGlow: number };
  gateRoot: THREE.Object3D;
  cloudSea: THREE.Object3D;
}
export const introPath = new THREE.CatmullRomCurve3(
  REALM.intro.cameraPath.map((v) => new THREE.Vector3(...v)),
  false,
  "centripetal",
);
export const introLook = new THREE.CatmullRomCurve3(
  REALM.intro.lookPath.map((v) => new THREE.Vector3(...v)),
  false,
  "centripetal",
);
export function buildIntroTimeline(r: IntroRefs) {
  const tl = gsap.timeline({ paused: true });
  tl.add(() => {
    camProxy.active = true;
    camProxy.t = 0;
  }, 0)
    .to(r.doorL.rotation, { y: -1.65, duration: 1.4, ease: "power2.inOut" }, 0)
    .to(r.doorR.rotation, { y: 1.65, duration: 1.4, ease: "power2.inOut" }, 0)
    .to(camProxy, { t: 1, duration: 4, ease: "power2.inOut" }, 0.3)
    .to(fx, { veil: 1, duration: 0.4 }, 1.35)
    .add(() => {
      r.gateRoot.visible = false;
      useRealmStore.getState().setPhase("descending");
    }, 1.75)
    .to(fx, { veil: 0, duration: 1.1 }, 1.8)
    .add(() => {
      camProxy.active = false;
      useRealmStore.getState().setPhase("exploring");
    }, 4.3);
  return tl;
}

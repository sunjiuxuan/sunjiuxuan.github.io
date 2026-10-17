"use client";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
  HueSaturation,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.28} luminanceThreshold={1.15} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <HueSaturation saturation={0.12} />
      <Vignette eskil={false} offset={0.25} darkness={0.12} />
    </EffectComposer>
  );
}

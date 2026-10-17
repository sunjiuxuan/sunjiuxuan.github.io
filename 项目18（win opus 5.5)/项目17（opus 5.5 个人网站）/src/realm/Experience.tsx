"use client";
import { GateStage } from "./gate/GateStage";
import { World } from "./world/World";
import { CameraRig } from "./camera/CameraRig";
import { ExploreControls } from "./camera/ExploreControls";
import { PostFX } from "./effects/PostFX";

export function Experience() {
  return (
    <>
      <CameraRig />
      <ExploreControls />
      <PostFX />

      <GateStage />
      <World />
    </>
  );
}

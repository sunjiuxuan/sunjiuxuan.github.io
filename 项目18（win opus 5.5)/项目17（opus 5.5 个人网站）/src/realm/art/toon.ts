import * as THREE from "three";

// Three broad light bands give every object the same painted lighting language.
export function createToonRamp() {
  const ramp = new THREE.DataTexture(
    new Uint8Array([105, 178, 242]),
    3,
    1,
    THREE.RedFormat,
  );
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.generateMipmaps = false;
  ramp.needsUpdate = true;
  return ramp;
}

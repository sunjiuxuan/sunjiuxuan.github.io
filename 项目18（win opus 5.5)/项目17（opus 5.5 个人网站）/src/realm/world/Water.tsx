"use client";
import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { REALM } from "@/config/realm.config";
import { getTerrainHeight } from "@/lib/math/placeNodes";
import { useRealmStore } from "@/store/useRealmStore";

export function Water() {
  const reduced = useRealmStore((s) => s.reducedMotion);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(220, 220, 160, 160);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position,
      depth = new Float32Array(p.count);
    for (let i = 0; i < p.count; i++)
      depth[i] = REALM.waterLevel - getTerrainHeight(p.getX(i), p.getZ(i));
    g.setAttribute("waterDepth", new THREE.BufferAttribute(depth, 1));
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          shallow: { value: new THREE.Color("#69ddd2") },
          deep: { value: new THREE.Color("#1c91b1") },
        },
        vertexShader: `attribute float waterDepth; varying float vDepth; varying vec3 vWorld; void main(){ vDepth=waterDepth; vec4 world=modelMatrix*vec4(position,1.); vWorld=world.xyz; gl_Position=projectionMatrix*viewMatrix*world; }`,
        fragmentShader: `uniform float uTime; uniform vec3 shallow; uniform vec3 deep; varying float vDepth; varying vec3 vWorld;
    void main(){
      vec2 p=vWorld.xz;
      float wave=sin(p.x*1.4 + sin(p.y*.8 + uTime*.4) + uTime*.55)*sin(p.y*1.1-uTime*.3);
      float glint=smoothstep(.91,.99,wave)*.35;
      float coast=(1.-smoothstep(.03,.38,vDepth))*.6;
      float ripple=smoothstep(.96,1.,sin(vDepth*24.-uTime*1.5))*(1.-smoothstep(.2,.8,vDepth))*.28;
      vec3 color=mix(shallow,deep,smoothstep(0.,1.3,vDepth));
      color=mix(color,vec3(.87,.99,1.),glint+coast+ripple);
      gl_FragColor=vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame((s) => {
    material.uniforms.uTime.value = reduced ? 0 : s.clock.elapsedTime;
  });
  return (
    <mesh
      position={[0, REALM.waterLevel, 0]}
      geometry={geometry}
      material={material}
    />
  );
}

"use client";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createRandom } from "@/lib/math/random";
import { useRealmStore } from "@/store/useRealmStore";

export function Atmosphere() {
  const reduced = useRealmStore((s) => s.reducedMotion);
  const clouds = useRef<THREE.Group>(null);
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color("#268ed2") },
          horizon: { value: new THREE.Color("#95d9f4") },
        },
        vertexShader: `varying vec3 vDirection; void main(){vDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `uniform vec3 top; uniform vec3 horizon; varying vec3 vDirection; void main(){float h=normalize(vDirection).y; vec3 c=mix(horizon,top,pow(clamp(h*2.5,0.,1.),.42)); gl_FragColor=vec4(c,1.);\n #include <tonemapping_fragment>\n #include <colorspace_fragment>}`,
      }),
    [],
  );
  useEffect(() => () => sky.dispose(), [sky]);
  const data = useMemo(() => {
    const r = createRandom(623);
    return Array.from({ length: 15 }, (_, i) => ({
      x: r.range(-175, 175),
      y: r.range(37, 65),
      z: r.range(-170, 20),
      size: r.range(3, 6),
      puffs: Array.from({ length: 5 }, (_, j) => ({
        x: (j - 2) * 1.5,
        y: r.range(-0.4, 0.7),
        s: r.range(0.9, 1.7),
      })),
    }));
  }, []);
  useFrame((_, dt) => {
    if (clouds.current && !reduced)
      clouds.current.position.x = Math.sin(performance.now() * 0.000018) * 3;
  });
  return (
    <group>
      <mesh material={sky} renderOrder={-10}>
        <sphereGeometry args={[350, 32, 20]} />
      </mesh>
      <group ref={clouds}>
        {data.map((c, i) => (
          <group key={i} position={[c.x, c.y, c.z]} scale={c.size}>
            {c.puffs.map((p, j) => (
              <mesh
                key={j}
                position={[p.x, p.y, 0]}
                scale={[p.s, p.s * 0.6, p.s * 0.65]}
              >
                <sphereGeometry args={[1, 12, 8]} />
                <meshBasicMaterial
                  color={j % 2 ? "#f8ffff" : "#ecf7fa"}
                  fog={false}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <mesh position={[-85, 100, -150]}>
        <sphereGeometry args={[7, 24, 16]} />
        <meshBasicMaterial color="#fff8cf" fog={false} />
      </mesh>
    </group>
  );
}

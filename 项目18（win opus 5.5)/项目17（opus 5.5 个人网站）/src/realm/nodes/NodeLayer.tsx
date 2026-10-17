"use client";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useRealmStore } from "@/store/useRealmStore";
import type { RealmNode } from "@/lib/types";
import { TYPE_TO_ZONE } from "@/config/realm.config";
const colors = {
  profile: "#A2F3FF",
  experience: "#FDE5A1",
  project: "#9EEFFF",
  article: "#A8F2B5",
  moment: "#FFDF8A",
};
function NodeMesh({ node }: { node: RealmNode }) {
  const { hoveredId, activeId, hover, focus, zone, phase, reducedMotion } =
    useRealmStore();
  const floating = useRef<THREE.Group>(null);
  const selected = hoveredId === node.id || activeId === node.id;
  const current = zone === (node.zone || TYPE_TO_ZONE[node.type]);
  const color = node.visual.color || colors[node.type];
  useFrame((s) => {
    if (
      floating.current &&
      !reducedMotion &&
      node.type !== "profile" &&
      node.type !== "experience"
    )
      floating.current.position.y =
        Math.sin(s.clock.elapsedTime * 0.8 + node.date.length) * 0.12;
  });
  if (!node.position || !["exploring", "focusing"].includes(phase)) return null;
  return (
    <group position={node.position}>
      <group ref={floating}>
        <mesh
          position={[0, 0.8, 0]}
          onClick={(e) => {
            e.stopPropagation();
            focus(node.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            hover(node.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hover(null);
            document.body.style.cursor = "";
          }}
        >
          {node.type === "experience" ? (
            <boxGeometry args={[0.8, 1.6, 0.3]} />
          ) : node.type === "article" ? (
            <cylinderGeometry args={[0.28, 0.28, 1.3, 10]} />
          ) : node.type === "profile" ? (
            <sphereGeometry args={[0.3, 12, 12]} />
          ) : (
            <octahedronGeometry
              args={[node.type === "moment" ? 0.45 : 0.65, 0]}
            />
          )}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 1.4 : 0.65}
            roughness={0.7}
          />
        </mesh>
        {node.type === "project" && (
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.09, 1.1, 6]} />
            <meshStandardMaterial color="#9D896B" />
          </mesh>
        )}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[selected ? 1.1 : 0.65, selected ? 1.16 : 0.7, 40]}
          />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.8 : 0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {(selected || current || node.type === "profile") && (
        <Html
          center
          position={[0, node.type === "profile" ? 5.8 : 2.1, 0]}
          zIndexRange={[8, 0]}
        >
          <button
            className={`node-label ${selected ? "active" : ""}`}
            onClick={() => focus(node.id)}
          >
            <i style={{ background: color }} />
            {node.title || "生活的一页"}
            <span>↗</span>
          </button>
        </Html>
      )}
    </group>
  );
}
export function NodeLayer() {
  const nodes = useRealmStore((s) => s.nodes);
  return (
    <group>
      {nodes.map((n) => (
        <NodeMesh key={n.id} node={n} />
      ))}
    </group>
  );
}

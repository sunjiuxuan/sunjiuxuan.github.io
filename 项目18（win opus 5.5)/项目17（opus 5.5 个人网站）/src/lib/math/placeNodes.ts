import * as THREE from "three";
import type { RealmNode } from "../types";
import { ZONES, TYPE_TO_ZONE, REALM } from "@/config/realm.config";
import { createRandom } from "./random";

export function riverX(z: number) {
  return -13 + Math.sin(z * 0.06) * 10;
}
export function getTerrainHeight(x: number, z: number): number {
  const d = Math.hypot(x, z);
  const base =
    0.8 +
    Math.sin(x * 0.09) * Math.cos(z * 0.07) * 1.25 +
    Math.sin(x * 0.23 + z * 0.12) * 0.22;
  const river = Math.abs(x - riverX(z));
  const lake = Math.sqrt(((x + 5) / 20) ** 2 + ((z - 27) / 15) ** 2);
  const cut = Math.min(
    THREE.MathUtils.smoothstep(river, 2.5, 7),
    THREE.MathUtils.smoothstep(lake, 0.7, 1.3),
  );
  const shore = THREE.MathUtils.lerp(-1.8, base, cut);
  const hill =
    THREE.MathUtils.smoothstep(d, 47, 92) *
    (9 + Math.sin(x * 0.055) * Math.cos(z * 0.047) * 5);
  return shore + hill;
}
export function placeNodes(nodes: RealmNode[]): RealmNode[] {
  const rng = createRandom(1337);
  const byZone: Record<string, RealmNode[]> = {};
  const placed = nodes.map((n) => ({
    ...n,
    position: n.position ? ([...n.position] as [number, number, number]) : null,
  }));
  for (const node of placed) {
    const id = node.zone || TYPE_TO_ZONE[node.type];
    (byZone[id] ||= []).push(node);
  }
  for (const [id, group] of Object.entries(byZone)) {
    const zone = ZONES[id];
    if (!zone) continue;
    const positions: [number, number][] = [];
    const curve = zone.path
      ? new THREE.CatmullRomCurve3(
          zone.path.map((p) => new THREE.Vector3(...p)),
        )
      : null;
    group
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((node, i) => {
        if (node.position) return;
        let x = zone.center[0],
          z = zone.center[2];
        if (zone.layout === "scatter") {
          for (let attempt = 0; attempt < 80; attempt++) {
            const r = Math.sqrt(rng.value()) * zone.radius,
              theta = rng.value() * Math.PI * 2;
            x = zone.center[0] + r * Math.cos(theta);
            z = zone.center[2] + r * Math.sin(theta);
            if (
              positions.every(
                (p) => Math.hypot(p[0] - x, p[1] - z) >= (zone.minDist || 3),
              )
            )
              break;
          }
        } else if (zone.layout === "spiral") {
          const t = i * 2.39996,
            r = 3 + Math.sqrt(i / group.length) * zone.radius;
          x += Math.cos(t) * r;
          z += Math.sin(t) * r;
        } else if (curve) {
          const p = curve.getPoint(
            group.length > 1 ? i / (group.length - 1) : 0.5,
          );
          x = p.x;
          z = p.z;
        }
        positions.push([x, z]);
        node.position = [
          x,
          (zone.yMode === "water"
            ? REALM.waterLevel
            : Math.max(getTerrainHeight(x, z), REALM.waterLevel + 0.15)) +
            zone.yOffset,
          z,
        ];
      });
  }
  return placed;
}

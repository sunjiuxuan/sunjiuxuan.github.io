import type { NodeType, Vec3 } from "@/lib/types";
export type LayoutKind = "anchor" | "path" | "scatter" | "spiral";
export interface ZoneDef {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  number: string;
  layout: LayoutKind;
  center: Vec3;
  radius: number;
  path?: Vec3[];
  lateral?: number;
  minDist?: number;
  yMode: "terrain" | "water";
  yOffset: number;
  defaultVariant: string;
}
export const TYPE_TO_ZONE: Record<NodeType, string> = {
  profile: "shrine",
  experience: "river",
  project: "grove",
  article: "bamboo",
  moment: "lake",
};
export const TYPE_LABELS: Record<NodeType, string> = {
  profile: "关于我",
  experience: "来时路",
  project: "作品集",
  article: "文字手记",
  moment: "生活碎片",
};
export const ZONES: Record<string, ZoneDef> = {
  shrine: {
    id: "shrine",
    label: "问心亭",
    subtitle: "关于我",
    description: "在一座小亭里，认识造园的人。",
    number: "01",
    layout: "anchor",
    center: [0, 0, 0],
    radius: 0,
    yMode: "terrain",
    yOffset: 0,
    defaultVariant: "shrine",
  },
  river: {
    id: "river",
    label: "时光溪",
    subtitle: "来时路",
    description: "沿着溪流，拾起一路走来的故事。",
    number: "02",
    layout: "path",
    center: [-22, 0, 8],
    radius: 25,
    path: [
      [-25, 0, 21],
      [-20, 0, 10],
      [-26, 0, -3],
    ],
    lateral: 2,
    yMode: "terrain",
    yOffset: 0.2,
    defaultVariant: "stele",
  },
  grove: {
    id: "grove",
    label: "造物林",
    subtitle: "作品集",
    description: "每一个想法，都在这里长成一盏灯。",
    number: "03",
    layout: "scatter",
    center: [21, 0, 1],
    radius: 10,
    minDist: 6,
    yMode: "terrain",
    yOffset: 0.3,
    defaultVariant: "lantern",
  },
  bamboo: {
    id: "bamboo",
    label: "藏书篁",
    subtitle: "文字手记",
    description: "风经过竹林，有些念头留在了纸上。",
    number: "04",
    layout: "scatter",
    center: [10, 0, -24],
    radius: 9,
    minDist: 5,
    yMode: "terrain",
    yOffset: 0.4,
    defaultVariant: "scroll",
  },
  lake: {
    id: "lake",
    label: "浮生湖",
    subtitle: "生活碎片",
    description: "把平凡日子的微光，放进水里。",
    number: "05",
    layout: "spiral",
    center: [-5, 0, 26],
    radius: 9,
    yMode: "water",
    yOffset: 0.35,
    defaultVariant: "riverLamp",
  },
};
export const REALM = {
  waterLevel: -0.65,
  intro: {
    cameraPath: [
      [-6, 5, 43],
      [-2, 5, 32],
      [0, 6, 21],
      [10, 12, 30],
      [28, 15, 43],
    ] as Vec3[],
    lookPath: [
      [-6, 3, 22],
      [-2, 3, 18],
      [0, 2, 8],
      [0, 1, 0],
      [0, 4, -12],
    ] as Vec3[],
  },
  explore: { minDistance: 8, maxDistance: 100, minPolar: 0.3, maxPolar: 1.48 },
  focus: { distance: 8, height: 5, duration: 1.2 },
} as const;

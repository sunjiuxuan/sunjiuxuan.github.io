export type NodeType =
  "profile" | "experience" | "project" | "article" | "moment";
export type Vec3 = [number, number, number];

export interface MediaItem {
  url: string;
  w: number;
  h: number;
  blurhash?: string;
  alt?: string;
}

export interface RealmNode {
  id: string;
  slug: string;
  type: NodeType;
  title: string | null; // 动态可以为空
  summary: string | null;
  body: string | null; // Markdown
  cover: MediaItem | null;
  images: MediaItem[];
  date: string; // ISO 日期，决定时间线顺序
  tags: string[];
  zone: string | null; // null = 按 type 自动分区
  visual: { variant?: string; color?: string; scale?: number };
  position: Vec3 | null; // null = 自动布局
  importance: 1 | 2 | 3; // 影响体积 / 光强
  meta: Record<string, unknown>; // experience:{org,role,end} project:{stack,links}
  createdAt: string;
  published?: boolean;
}

export interface PlacedNode extends RealmNode {
  worldPos: Vec3;
  rotationY: number;
}

export interface SiteSettings {
  name: string;
  role: string;
  intro: string;
  email: string;
  github: string;
  location: string;
  demo: boolean;
}

export interface SiteContent {
  version: 1;
  settings: SiteSettings;
  nodes: RealmNode[];
}

import { create } from "zustand";
import type { RealmNode } from "@/lib/types";

export type Phase =
  "loading" | "gate" | "entering" | "descending" | "exploring" | "focusing";
export type View = "explore" | "journal";
interface RealmState {
  phase: Phase;
  nodes: RealmNode[];
  hoveredId: string | null;
  activeId: string | null;
  gpuTier: 0 | 1 | 2 | 3;
  audioOn: boolean;
  view: View;
  zone: string | null;
  reducedMotion: boolean;
  quality: "auto" | "lite";
  setPhase: (phase: Phase) => void;
  setNodes: (nodes: RealmNode[]) => void;
  hover: (id: string | null) => void;
  focus: (id: string) => void;
  unfocus: () => void;
  setGpuTier: (gpuTier: 0 | 1 | 2 | 3) => void;
  setAudioOn: (audioOn: boolean) => void;
  setView: (view: View) => void;
  setZone: (zone: string | null) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setQuality: (quality: "auto" | "lite") => void;
}
export const useRealmStore = create<RealmState>((set, get) => ({
  phase: "loading",
  nodes: [],
  hoveredId: null,
  activeId: null,
  gpuTier: 2,
  audioOn: false,
  view: "explore",
  zone: null,
  reducedMotion: false,
  quality: "auto",
  setPhase: (phase) => set({ phase }),
  setNodes: (nodes) => set({ nodes }),
  hover: (hoveredId) => set({ hoveredId }),
  focus: (id) => {
    if (!get().nodes.some((n) => n.id === id)) return;
    set({ activeId: id, phase: "focusing" });
  },
  unfocus: () => set({ activeId: null, phase: "exploring" }),
  setGpuTier: (gpuTier) => set({ gpuTier }),
  setAudioOn: (audioOn) => set({ audioOn }),
  setView: (view) =>
    set({
      view,
      activeId: null,
      phase: get().phase === "loading" ? "loading" : "exploring",
    }),
  setZone: (zone) => set({ zone, activeId: null, phase: "exploring" }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setQuality: (quality) => set({ quality }),
}));

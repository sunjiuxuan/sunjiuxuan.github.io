"use client";
import { useRealmStore } from "@/store/useRealmStore";
import { Blossom } from "./Brand";
export function Loader() {
  const phase = useRealmStore((s) => s.phase);
  if (phase !== "loading") return null;
  return (
    <div className="loading-screen" role="status">
      <Blossom size={45} />
      <p>一隅山水，正在醒来</p>
      <span className="loading-line" />
      <small>桃源境 · DIGITAL GARDEN</small>
    </div>
  );
}

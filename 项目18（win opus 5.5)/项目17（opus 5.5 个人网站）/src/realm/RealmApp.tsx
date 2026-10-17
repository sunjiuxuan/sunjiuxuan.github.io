"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { RealmNode, SiteSettings } from "@/lib/types";
import { useRealmStore } from "@/store/useRealmStore";
import { Shell } from "@/ui/Shell";
import { ContentPanel } from "@/ui/ContentPanel";
import { Loader } from "@/ui/Loader";
import { Veil } from "@/ui/Veil";
import { placeNodes } from "@/lib/math/placeNodes";
import { camProxy } from "./effects/fxProxy";
const Scene = dynamic(() => import("./Scene"), { ssr: false });
export function RealmApp({
  initialNodes,
  settings,
}: {
  initialNodes: RealmNode[];
  settings: SiteSettings;
}) {
  const view = useRealmStore((s) => s.view);
  const [fallback, setFallback] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(settings);
  const { setNodes, setPhase, setReducedMotion, setView, setQuality, focus } =
    useRealmStore();
  useEffect(() => {
    setNodes(initialNodes);
    if (
      window.matchMedia("(max-width: 600px)").matches ||
      navigator.hardwareConcurrency <= 4
    )
      setQuality("lite");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    const hash = () => {
      const value = new URLSearchParams(window.location.hash.slice(1)).get(
        "node",
      );
      if (value && useRealmStore.getState().nodes.some((n) => n.id === value)) {
        camProxy.active = false;
        focus(value);
      }
    };
    const refresh = async () => {
      try {
        const r = await fetch("/api/content");
        if (!r.ok) return;
        const content = await r.json();
        setNodes(placeNodes(content.nodes));
        setCurrentSettings(content.settings);
      } catch {
        /* Keep the current content if offline. */
      }
    };
    hash();
    window.addEventListener("hashchange", hash);
    window.addEventListener("focus", refresh);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("focus", refresh);
    };
  }, [initialNodes, setNodes, setReducedMotion, focus]);
  const fail = () => {
    setFallback(true);
    setPhase("exploring");
    setView("journal");
  };
  return (
    <div className="realm-app" data-view={view}>
      <div className="landscape-layer" aria-hidden="true">
        {!fallback && <Scene onUnavailable={fail} />}
      </div>
      <div className="paper-grain" aria-hidden="true" />
      <Shell settings={currentSettings} fallback={fallback} />
      <Veil />
      <ContentPanel />
      <Loader />
    </div>
  );
}

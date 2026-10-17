"use client";
import { useEffect, useRef } from "react";
import { fx } from "@/realm/effects/fxProxy";

export function Veil() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0;
    const loop = () => {
      if (ref.current) ref.current.style.opacity = String(fx.veil);
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        opacity: 0,
        background:
          "radial-gradient(circle,#fffaf0 0%,#f7e7c6 60%,#f4b6c2 100%)",
        zIndex: 40,
      }}
    />
  );
}

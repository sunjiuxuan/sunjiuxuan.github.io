"use client";
import { useEffect, useState } from "react";
import { Navigation, Maximize2 } from "lucide-react";
import { ZONES } from "@/config/realm.config";
import { useRealmStore } from "@/store/useRealmStore";
export function RealmMap() {
  const { zone, setZone } = useRealmStore();
  const [viewpoint, setViewpoint] = useState({ x: 51, z: 33, heading: -22 });
  useEffect(() => {
    const sync = (e: Event) => {
      const { x, z, heading } = (
        e as CustomEvent<{ x: number; z: number; heading: number }>
      ).detail;
      const dx = x * 1.2,
        dz = z * 1.1,
        limit = Math.min(1, 40 / Math.max(1, Math.hypot(dx, dz)));
      setViewpoint((previous) => {
        const next = { x: 51 + dx * limit, z: 47 + dz * limit, heading };
        return Math.abs(next.x - previous.x) +
          Math.abs(next.z - previous.z) +
          Math.abs(next.heading - previous.heading) <
          0.1
          ? previous
          : next;
      });
    };
    window.addEventListener("realm-viewpoint", sync);
    return () => window.removeEventListener("realm-viewpoint", sync);
  }, []);
  const points: Record<string, [number, number]> = {
    shrine: [51, 47],
    river: [24, 55],
    grove: [76, 48],
    bamboo: [63, 22],
    lake: [45, 77],
  };
  return (
    <div className="realm-map">
      <div className="map-dial">
        <span className="map-north">N</span>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="map-grass">
              <stop stopColor="#b1ce8e" />
              <stop offset="1" stopColor="#55866d" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#map-grass)" />
          <path
            d="M8 45Q40 6 80 25T154 17M-4 72Q25 35 65 46T190 53M5 160Q33 135 56 155T172 151M133 67Q157 80 195 73"
            stroke="#d4e1aa"
            opacity=".5"
            fill="none"
            strokeWidth="2"
          />
          <path
            d="M29 -10Q68 20 48 58T60 103Q81 122 68 145T69 210"
            stroke="#e2ebba"
            strokeWidth="16"
            fill="none"
          />
          <path
            d="M29 -10Q68 20 48 58T60 103Q81 122 68 145T69 210"
            stroke="#68c7d9"
            strokeWidth="11"
            fill="none"
          />
          <ellipse
            cx="90"
            cy="155"
            rx="32"
            ry="22"
            fill="#69c4d4"
            stroke="#e1e6b1"
            strokeWidth="3"
          />
          <path
            d="M104 190Q128 151 117 121T112 83L126 43"
            stroke="#e5d9ad"
            strokeWidth="4"
            fill="none"
          />
          <g fill="#467c57" opacity=".6">
            <path d="M133 26l10-15 10 15zM153 33l11-17 11 17zM149 52l9-14 9 14zM15 115l10-15 10 15zM24 132l10-15 10 15zM156 114l12-18 12 18z" />
          </g>
          <circle
            cx="103"
            cy="94"
            r="7"
            fill="#eef3dc"
            stroke="#557f69"
            strokeWidth="2"
          />
        </svg>
        {Object.values(ZONES).map((z) => (
          <button
            key={z.id}
            className={`map-point ${zone === z.id ? "active" : ""}`}
            style={{ left: `${points[z.id][0]}%`, top: `${points[z.id][1]}%` }}
            aria-label={`传送至${z.label}`}
            title={z.label}
            aria-pressed={zone === z.id}
            onClick={() => {
              setZone(z.id);
              window.dispatchEvent(
                new CustomEvent("fly-to-zone", { detail: z.id }),
              );
            }}
          >
            <span />
          </button>
        ))}
        <Navigation
          className="map-player"
          size={17}
          fill="currentColor"
          aria-label="当前探索视角"
          style={{
            left: `${viewpoint.x}%`,
            top: `${viewpoint.z}%`,
            transform: `translate(-50%,-50%) rotate(${viewpoint.heading}deg)`,
          }}
        />
      </div>
      <div className="map-caption">
        <span>桃源谷地</span>
        <button
          aria-label="查看全部手记"
          title="查看全部手记"
          onClick={() => useRealmStore.getState().setView("journal")}
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
}

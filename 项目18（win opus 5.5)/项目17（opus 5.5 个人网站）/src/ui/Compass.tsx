"use client";
import { ZONES, TYPE_TO_ZONE } from "@/config/realm.config";
import { useRealmStore } from "@/store/useRealmStore";
import {
  Flower2,
  Waves,
  Trees,
  BookOpen,
  House,
  ArrowUpRight,
} from "lucide-react";
const icons = [House, Waves, Flower2, BookOpen, Trees];
export function Compass() {
  const { phase, zone, nodes, setZone, view } = useRealmStore();
  if (!["exploring", "focusing"].includes(phase) || view !== "explore")
    return null;
  return (
    <nav className="realm-nav" aria-label="桃源分区">
      <div className="nav-caption">
        循景而行 <span>EXPLORE THE REALM</span>
      </div>
      {Object.values(ZONES).map((z, i) => {
        const Icon = icons[i];
        const count = nodes.filter(
          (n) => (n.zone || TYPE_TO_ZONE[n.type]) === z.id,
        ).length;
        return (
          <button
            className={`zone-button ${zone === z.id ? "active" : ""}`}
            key={z.id}
            onClick={() => {
              setZone(z.id);
              window.dispatchEvent(
                new CustomEvent("fly-to-zone", { detail: z.id }),
              );
            }}
            aria-pressed={zone === z.id}
          >
            <span className="zone-number">{z.number}</span>
            <Icon size={18} strokeWidth={1.35} />
            <span className="zone-name">
              {z.label}
              <small>{z.subtitle}</small>
            </span>
            <span className="zone-count">{String(count).padStart(2, "0")}</span>
            <ArrowUpRight className="zone-arrow" size={15} />
          </button>
        );
      })}
    </nav>
  );
}

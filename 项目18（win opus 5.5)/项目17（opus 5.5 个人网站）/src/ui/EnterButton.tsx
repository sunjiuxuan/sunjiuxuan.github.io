"use client";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useRealmStore } from "@/store/useRealmStore";
export function EnterButton() {
  const phase = useRealmStore((s) => s.phase);
  const setPhase = useRealmStore((s) => s.setPhase);
  const setView = useRealmStore((s) => s.setView);
  if (phase !== "gate") return null;
  return (
    <div className="entrance-copy" id="main-content">
      <span className="eyebrow">
        <i /> AN OPEN WORLD OF LITTLE WONDERS
      </span>
      <h1>
        风起桃源，
        <br />
        即刻<span>启程。</span>
      </h1>
      <p>
        穿过山间的风，寻找生活的微光。
        <br />
        你的下一页故事，就在这片天地里。
      </p>
      <button className="primary-button" onClick={() => setPhase("entering")}>
        启程，探索桃源 <ArrowUpRight size={18} />
      </button>
      <button className="quiet-button" onClick={() => setView("journal")}>
        <BookOpen size={15} /> 或者，直接读一页手记
      </button>
      <div className="entrance-sign">
        <span>愿每一次出发，都有新的相遇。</span>
        <b>
          桃<br />源
        </b>
      </div>
    </div>
  );
}

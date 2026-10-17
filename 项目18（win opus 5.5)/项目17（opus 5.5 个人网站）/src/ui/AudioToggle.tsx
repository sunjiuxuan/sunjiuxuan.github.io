"use client";
import { Volume2, VolumeX } from "lucide-react";
import { useRealmStore } from "@/store/useRealmStore";
import { useEffect, useRef, useState } from "react";
export function AudioToggle() {
  const audioOn = useRealmStore((s) => s.audioOn),
    setAudioOn = useRealmStore((s) => s.setAudioOn);
  const engine = useRef<AudioContext | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!audioOn) return;
    let context: AudioContext;
    try {
      context = new AudioContext();
      engine.current = context;
      const master = context.createGain();
      master.gain.value = 0.035;
      master.connect(context.destination);
      // A quiet, generated wind bed. No remote audio or autoplay.
      const buffer = context.createBuffer(
        1,
        context.sampleRate * 6,
        context.sampleRate,
      );
      const values = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < values.length; i++) {
        last = (last + 0.015 * (Math.random() * 2 - 1)) / 1.015;
        values[i] = last * 6;
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 700;
      source.connect(filter);
      filter.connect(master);
      source.start();
      [174.61, 261.63, 349.23].forEach((frequency, i) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.value = 0.06 / (i + 1);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
      });
      void context.resume().catch(() => {
        setError("浏览器暂不支持环境音");
        setAudioOn(false);
      });
    } catch {
      setError("浏览器暂不支持环境音");
      setAudioOn(false);
    }
    return () => {
      void context?.close();
      engine.current = null;
    };
  }, [audioOn, setAudioOn]);
  return (
    <button
      className={`icon-button ${audioOn ? "selected" : ""}`}
      onClick={() => {
        setError("");
        setAudioOn(!audioOn);
      }}
      title={error || (audioOn ? "关闭环境音" : "开启环境音")}
      aria-label={audioOn ? "关闭环境音" : "开启环境音"}
      aria-pressed={audioOn}
    >
      {audioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}

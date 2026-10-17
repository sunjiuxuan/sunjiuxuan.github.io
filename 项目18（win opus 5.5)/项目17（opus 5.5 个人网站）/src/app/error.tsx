"use client";
import { Blossom } from "@/ui/Brand";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="status-page">
      <Blossom size={45} />
      <span className="eyebrow">A LITTLE PAUSE</span>
      <h1>风景暂时走失了。</h1>
      <p>内容暂时没能打开。稍等片刻，再试一次。</p>
      <button className="primary-button" onClick={() => retry()}>
        重新打开 ↗
      </button>
    </main>
  );
}

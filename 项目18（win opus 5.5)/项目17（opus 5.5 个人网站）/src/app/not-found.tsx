import { Blossom } from "@/ui/Brand";
export default function NotFound() {
  return (
    <main className="status-page">
      <Blossom size={45} />
      <span className="eyebrow">404 · A PATH LESS TRAVELED</span>
      <h1>这条小径，还没有通向远方。</h1>
      <p>你寻找的故事可能已被移走，回小院看看别的风景吧。</p>
      <a className="primary-button" href="/">
        回到桃源 ↗
      </a>
    </main>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Link2,
  Check,
  ExternalLink,
} from "lucide-react";
import { useRealmStore } from "@/store/useRealmStore";
import { TYPE_LABELS } from "@/config/realm.config";
import { Markdown } from "../Markdown";
import { safeUrl } from "@/lib/data/validate";
export function ContentPanel() {
  const { activeId, nodes, unfocus, focus } = useRealmStore();
  const node = nodes.find((n) => n.id === activeId);
  const panel = useRef<HTMLElement>(null),
    scroll = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState("");
  useEffect(() => {
    if (!node) return;
    document.body.style.cursor = "";
    const previous = document.activeElement as HTMLElement;
    scroll.current?.scrollTo(0, 0);
    setProgress(0);
    setCopied(false);
    setCopyError("");
    window.history.replaceState(
      null,
      "",
      `#node=${encodeURIComponent(node.id)}`,
    );
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        unfocus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = Array.from(
          panel.current.querySelectorAll<HTMLElement>(
            "button:not(:disabled),a[href]",
          ),
        );
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      previous?.focus?.();
    };
  }, [node?.id, unfocus]);
  if (!node) return null;
  const siblings = nodes
    .filter((n) => n.type === node.type)
    .sort((a, b) => b.date.localeCompare(a.date));
  const at = siblings.findIndex((n) => n.id === node.id);
  return (
    <div className="reader-overlay">
      <button
        className="reader-backdrop"
        onClick={unfocus}
        aria-label="关闭阅读"
        tabIndex={-1}
      />
      <aside
        ref={panel}
        className="reader"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reader-title"
      >
        <div className="reading-progress" style={{ width: `${progress}%` }} />
        <div className="reader-toolbar">
          <button className="text-button" onClick={unfocus}>
            <ArrowLeft size={16} /> 回到桃源
          </button>
          <div>
            <a
              className="icon-button"
              href={`/read/${encodeURIComponent(node.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="独立阅读"
              title="独立阅读"
            >
              <ExternalLink size={16} />
            </a>
            <button
              className="icon-button"
              aria-label="复制文章链接"
              title={copyError || "复制文章链接"}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/read/${encodeURIComponent(node.id)}`,
                  );
                  setCopied(true);
                } catch {
                  setCopyError("复制失败，可从地址栏复制链接");
                }
              }}
            >
              {copied ? <Check size={17} /> : <Link2 size={17} />}
            </button>
            <button
              className="icon-button"
              onClick={unfocus}
              aria-label="关闭阅读"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div
          className="reader-scroll"
          ref={scroll}
          onScroll={(e) => {
            const el = e.currentTarget;
            setProgress(
              el.scrollHeight > el.clientHeight
                ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
                : 100,
            );
          }}
        >
          <div className="reader-meta">
            <span>{TYPE_LABELS[node.type]}</span>
            <time>{node.date.replaceAll("-", ".")} </time>
            <span>
              约 {Math.max(1, Math.ceil((node.body?.length || 0) / 450))} 分钟
            </span>
          </div>
          <h1 id="reader-title">{node.title || "生活的一页"}</h1>
          {node.summary && <p className="reader-summary">{node.summary}</p>}
          {node.cover && (
            <img
              className="reader-cover"
              src={node.cover.url}
              alt={node.cover.alt || node.title || ""}
            />
          )}
          <div className="reader-tags">
            {node.tags.map((t) => (
              <span key={t}># {t}</span>
            ))}
          </div>
          <Markdown>{node.body || "这一页的故事，还在慢慢生长。"}</Markdown>
          {Array.isArray(node.meta?.stack) && node.meta.stack.length > 0 && (
            <div className="project-stack">
              <span>使用工具</span>
              {(node.meta.stack as string[]).map((s) => (
                <b key={s}>{s}</b>
              ))}
            </div>
          )}
          {Array.isArray(node.meta?.links) &&
            (node.meta.links as { label: string; url: string }[])
              .filter((l) => safeUrl(l.url))
              .map((l) => (
                <a
                  className="project-link"
                  key={l.url}
                  href={safeUrl(l.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label || "查看项目"}
                  <ExternalLink size={16} />
                </a>
              ))}
          <div className="reader-end">
            <span>— 谢谢你读到这里 —</span>
            <p>愿你也有一隅自己的桃花源。</p>
          </div>
          <div className="reader-pagination">
            <button
              disabled={at <= 0}
              onClick={() => focus(siblings[at - 1].id)}
            >
              <ArrowLeft size={16} />
              <span>
                <small>上一篇</small>
                {at > 0 ? siblings[at - 1].title : "已经是第一篇"}
              </span>
            </button>
            <button
              disabled={at >= siblings.length - 1}
              onClick={() => focus(siblings[at + 1].id)}
            >
              <span>
                <small>下一篇</small>
                {at < siblings.length - 1
                  ? siblings[at + 1].title
                  : "已经是最后一篇"}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

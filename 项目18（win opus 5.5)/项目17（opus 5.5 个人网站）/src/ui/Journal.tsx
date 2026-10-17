"use client";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight, ArrowRight, X } from "lucide-react";
import { useRealmStore } from "@/store/useRealmStore";
import { TYPE_LABELS } from "@/config/realm.config";
import type { NodeType } from "@/lib/types";
import { Artwork } from "./Artwork";
const filters: ("all" | NodeType)[] = [
  "all",
  "project",
  "article",
  "experience",
  "moment",
  "profile",
];
export function Journal() {
  const nodes = useRealmStore((s) => s.nodes),
    focus = useRealmStore((s) => s.focus);
  const [filter, setFilter] = useState<"all" | NodeType>("all"),
    [query, setQuery] = useState(""),
    [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");
  const visible = useMemo(
    () =>
      nodes
        .filter(
          (n) =>
            (filter === "all" || n.type === filter) &&
            (!tag || n.tags.includes(tag)) &&
            `${n.title} ${n.summary} ${n.body} ${n.tags.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "newest"
            ? b.date.localeCompare(a.date)
            : a.date.localeCompare(b.date),
        ),
    [nodes, filter, query, tag, sort],
  );
  const tags = Array.from(
    new Set(
      nodes
        .filter((n) => filter === "all" || n.type === filter)
        .flatMap((n) => n.tags),
    ),
  )
    .filter((t) => t !== "示例")
    .slice(0, 10);
  return (
    <main className="journal" id="main-content">
      <div className="journal-heading">
        <div>
          <span className="eyebrow">NOTES FROM MY LITTLE WORLD</span>
          <h1>
            留下来的，
            <br className="mobile-break" />
            都是生活。
          </h1>
          <p>作品、文字和一路拾来的片刻，都在这里。</p>
        </div>
        <span className="journal-seal">
          见字
          <br />
          如晤
        </span>
      </div>
      <div className="journal-toolbar">
        <div className="filter-tabs" role="group" aria-label="内容类型">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setTag("");
              }}
              className={filter === f ? "active" : ""}
              aria-pressed={filter === f}
            >
              {f === "all" ? "全部" : TYPE_LABELS[f]}{" "}
              <small>
                {nodes.filter((n) => f === "all" || n.type === f).length}
              </small>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            placeholder="找一篇文字、一个想法…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="搜索内容"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="清空搜索">
              <X size={15} />
            </button>
          )}
        </label>
      </div>
      <div className="journal-meta">
        <div className="tag-filter">
          {tags.map((t) => (
            <button
              key={t}
              className={tag === t ? "active" : ""}
              onClick={() => setTag(tag === t ? "" : t)}
            >
              # {t}
            </button>
          ))}
        </div>
        <label className="sort-label">
          <span className="sr-only">排序</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">最近在前</option>
            <option value="oldest">最早在前</option>
          </select>
        </label>
      </div>
      <div className="journal-grid">
        {visible.map((n, i) => (
          <button
            key={n.id}
            className={`journal-card card-${n.type}`}
            onClick={() => focus(n.id)}
          >
            {n.cover ? (
              <img
                className="card-cover"
                src={n.cover.url}
                alt={n.cover.alt || n.title || ""}
                loading="lazy"
              />
            ) : (
              <Artwork kind={n.type} index={i} />
            )}
            <div className="card-body">
              <div className="card-meta">
                <span>{TYPE_LABELS[n.type]}</span>
                <time>{n.date.replaceAll("-", ".")} </time>
              </div>
              <h2>
                {n.title || "生活的一页"}
                <ArrowUpRight size={18} />
              </h2>
              <p>{n.summary || n.body?.slice(0, 72)}</p>
              <div className="card-tags">
                {n.tags
                  .filter((t) => t !== "示例")
                  .slice(0, 3)
                  .map((t) => (
                    <span key={t}>{t}</span>
                  ))}
              </div>
            </div>
          </button>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <Search size={32} strokeWidth={1} />
          <h2>这里暂时很安静</h2>
          <p>换个关键词，或看看别处的风景。</p>
          <button
            className="text-button"
            onClick={() => {
              setQuery("");
              setFilter("all");
              setTag("");
            }}
          >
            查看全部 <ArrowRight size={16} />
          </button>
        </div>
      )}
      <footer className="journal-footer">
        <span>一页一页，慢慢生长。</span>
        <span>桃源境 · {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

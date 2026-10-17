import { notFound } from "next/navigation";
import { readContent } from "@/lib/data/repository";
import { TYPE_LABELS } from "@/config/realm.config";
import { Markdown } from "@/ui/Markdown";
import { Blossom } from "@/ui/Brand";
import { safeUrl } from "@/lib/data/validate";
export async function generateStaticParams() {
  const { nodes } = await readContent();
  return nodes
    .filter((n) => n.published !== false)
    .map((n) => ({ id: n.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await readContent();
  const node = content.nodes.find((n) => n.id === id && n.published !== false);
  return node
    ? {
        title: node.title || "生活的一页",
        description: node.summary || node.body?.slice(0, 150),
      }
    : { title: "故事未找到", robots: { index: false } };
}
export default async function ReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { nodes, settings } = await readContent();
  const node = nodes.find((n) => n.id === id && n.published !== false);
  if (!node) notFound();
  const siblings = nodes
      .filter((n) => n.type === node.type && n.published !== false)
      .sort((a, b) => b.date.localeCompare(a.date)),
    at = siblings.findIndex((n) => n.id === id);
  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <a className="brand" href="/">
          <Blossom size={30} />
          <span>
            桃源境<small>A PERSONAL REALM</small>
          </span>
        </a>
        <a className="text-button" href="/">
          回到小院 ↗
        </a>
      </header>
      <main className="standalone-reader">
        <div className="reader-meta">
          <span>{TYPE_LABELS[node.type]}</span>
          <time>{node.date.replaceAll("-", ".")}</time>
          <span>{settings.name}</span>
        </div>
        <h1>{node.title || "生活的一页"}</h1>
        {node.summary && <p className="reader-summary">{node.summary}</p>}
        <div className="reader-tags">
          {node.tags.map((t) => (
            <span key={t}># {t}</span>
          ))}
        </div>
        {node.cover && (
          <img
            className="reader-cover"
            src={node.cover.url}
            alt={node.cover.alt || node.title || ""}
          />
        )}
        <Markdown>{node.body || "这一页的故事，还在慢慢生长。"}</Markdown>
        {Array.isArray(node.meta?.links) &&
          (node.meta.links as { url: string; label: string }[])
            .filter((l) => safeUrl(l.url))
            .map((l) => (
              <a
                className="project-link"
                key={l.url}
                href={safeUrl(l.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label || "查看项目"} ↗
              </a>
            ))}
        <div className="reader-end">
          <span>— 谢谢你读到这里 —</span>
          <p>愿你也有一隅自己的桃花源。</p>
        </div>
        <nav className="standalone-pagination" aria-label="相邻内容">
          {at > 0 ? (
            <a href={`/read/${encodeURIComponent(siblings[at - 1].id)}`}>
              ← {siblings[at - 1].title}
            </a>
          ) : (
            <span />
          )}
          {at < siblings.length - 1 && (
            <a href={`/read/${encodeURIComponent(siblings[at + 1].id)}`}>
              {siblings[at + 1].title} →
            </a>
          )}
        </nav>
      </main>
      <footer className="standalone-footer">
        © {new Date().getFullYear()} 桃源境 ·{" "}
        {settings.demo ? "示例小院" : "一处慢慢生长的数字小院"}
      </footer>
    </div>
  );
}

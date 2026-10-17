import { Markdown } from "@/ui/Markdown";
import { RealmApp } from "@/realm/RealmApp";
import { readContent } from "@/lib/data/repository";
import { placeNodes } from "@/lib/math/placeNodes";
export async function generateMetadata() {
  const { settings } = await readContent();
  return {
    title: `桃源境 · ${settings.name}的数字小院`,
    description: settings.intro.replace(/\n/g, " "),
  };
}
export default async function Home() {
  const { settings, nodes } = await readContent();
  return (
    <>
      <RealmApp
        initialNodes={placeNodes(nodes.filter((n) => n.published !== false))}
        settings={settings}
      />
      <noscript>
        <style>{".realm-app{display:none}"}</style>
        <main className="nojs-content">
          <h1>桃源境 · {settings.name}的数字小院</h1>
          <p>{settings.intro}</p>
          {nodes
            .filter((n) => n.published !== false)
            .map((n) => (
              <article key={n.id}>
                <h2>
                  <a href={`/read/${encodeURIComponent(n.id)}`}>
                    {n.title || "生活的一页"}
                  </a>
                </h2>
                <p>{n.summary}</p>
                <Markdown>{n.body || ""}</Markdown>
              </article>
            ))}
        </main>
      </noscript>
    </>
  );
}

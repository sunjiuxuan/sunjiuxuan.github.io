import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { readContent, updateContent } from "@/lib/data/repository";
import { authorized, mutationGuard } from "@/lib/server/auth";
import {
  validateContent,
  validateNode,
  validateSettings,
} from "@/lib/data/validate";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  try {
    const content = await readContent();
    if (request.nextUrl.searchParams.has("admin")) {
      if (!authorized(request))
        return Response.json({ error: "请先登录" }, { status: 401 });
      return Response.json(content, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    return Response.json(
      { ...content, nodes: content.nodes.filter((n) => n.published !== false) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "读取内容失败，请检查数据文件" },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  const denied = mutationGuard(request);
  if (denied) return denied;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 2_000_000)
      return Response.json(
        { error: "内容过大，请缩减至 2 MB 以内" },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    const content = await updateContent((current) => {
      if (body.action === "settings")
        return { ...current, settings: validateSettings(body.settings) };
      if (body.action === "import") return validateContent(body.content);
      if (body.action === "delete") {
        if (!current.nodes.some((n) => n.id === body.id))
          throw new Error("内容不存在");
        return {
          ...current,
          nodes: current.nodes.filter((n) => n.id !== body.id),
        };
      }
      if (body.action === "save") {
        const existing = current.nodes.find((n) => n.id === body.node?.id);
        if (!existing && current.nodes.length >= 500)
          throw new Error("最多保存 500 条内容");
        const node = validateNode({
          ...body.node,
          id: existing?.id || randomUUID(),
          createdAt: existing?.createdAt || new Date().toISOString(),
        });
        node.slug = node.id;
        return {
          ...current,
          nodes: existing
            ? current.nodes.map((n) => (n.id === node.id ? node : n))
            : [node, ...current.nodes],
        };
      }
      throw new Error("未知操作");
    });
    return Response.json(content);
  } catch (error) {
    console.error("Content mutation failed:", error);
    return Response.json(
      {
        error:
          error instanceof SyntaxError
            ? "JSON 格式不正确"
            : error instanceof Error && !("code" in error)
              ? error.message
              : "保存失败，请检查目录写入权限",
      },
      { status: 400 },
    );
  }
}

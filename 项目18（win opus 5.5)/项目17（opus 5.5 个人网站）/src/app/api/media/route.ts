import { NextRequest } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mutationGuard } from "@/lib/server/auth";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const denied = mutationGuard(request);
  if (denied) return denied;
  try {
    const form = await request.formData(),
      file = form.get("file");
    if (!(file instanceof File))
      return Response.json({ error: "请选择图片" }, { status: 400 });
    if (file.size > 3 * 1024 * 1024)
      return Response.json({ error: "图片不能超过 3 MB" }, { status: 413 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      ? "png"
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        ? "jpg"
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          ? "webp"
          : null;
    if (!type)
      return Response.json(
        { error: "仅支持 PNG、JPEG 和 WebP 图片" },
        { status: 400 },
      );
    const name = `${randomUUID()}.${type}`,
      dir = path.join(
        process.env.REALM_DATA_DIR || path.join(process.cwd(), "data"),
        "uploads",
      );
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes, { mode: 0o600 });
    return Response.json({ url: `/api/media/${name}` });
  } catch {
    return Response.json(
      { error: "上传失败，请检查图片和存储目录" },
      { status: 400 },
    );
  }
}

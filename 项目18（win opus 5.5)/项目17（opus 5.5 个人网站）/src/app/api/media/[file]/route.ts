import { readFile } from "node:fs/promises";
import path from "node:path";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[0-9a-f-]{36}\.(png|jpg|webp)$/.test(file))
    return new Response("Not found", { status: 404 });
  try {
    const bytes = await readFile(
      path.join(
        process.env.REALM_DATA_DIR || path.join(process.cwd(), "data"),
        "uploads",
        file,
      ),
    );
    const extension = file.split(".").at(-1);
    return new Response(bytes, {
      headers: {
        "Content-Type":
          extension === "jpg" ? "image/jpeg" : `image/${extension}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

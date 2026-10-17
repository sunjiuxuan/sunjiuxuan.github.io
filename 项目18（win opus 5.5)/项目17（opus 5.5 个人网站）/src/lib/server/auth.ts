import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function localMode(request: Request) {
  return (
    process.env.NODE_ENV === "development" &&
    !process.env.ADMIN_PASSWORD &&
    ["localhost", "127.0.0.1", "[::1]"].includes(
      new URL(
        `http://${request.headers.get("host") || new URL(request.url).host}`,
      ).hostname,
    )
  );
}
export function sameOrigin(request: Request) {
  try {
    const raw = request.headers.get("origin") || "";
    const origin = new URL(raw);
    const host = request.headers.get("host") || new URL(request.url).host;
    return (
      raw === origin.origin &&
      ["http:", "https:"].includes(origin.protocol) &&
      origin.host === host &&
      !["cross-site", "none"].includes(
        request.headers.get("sec-fetch-site") || "",
      )
    );
  } catch {
    return false;
  }
}
export function passwordMatches(value: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  const a = Buffer.from(value),
    b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
function sign(value: string) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD || "")
    .update(`realm-admin:${value}`)
    .digest("hex");
}
export function createSession() {
  const expiry = String(Date.now() + 12 * 60 * 60 * 1000);
  return `${expiry}.${sign(expiry)}`;
}
export function authorized(request: NextRequest) {
  if (localMode(request)) return true;
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12)
    return false;
  const [expiry, signature = ""] = (
    request.cookies.get("realm_session")?.value || ""
  ).split(".");
  if (
    !expiry ||
    !Number.isFinite(Number(expiry)) ||
    Number(expiry) < Date.now()
  )
    return false;
  const expected = sign(expiry);
  return (
    /^[0-9a-f]{64}$/.test(signature) &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}
export function mutationGuard(request: NextRequest) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "请求来源不受信任，请从网站页面操作" },
      { status: 403 },
    );
  if (!authorized(request))
    return Response.json({ error: "请先登录内容管理" }, { status: 401 });
  return null;
}

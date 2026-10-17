import { NextRequest, NextResponse } from "next/server";
import {
  authorized,
  createSession,
  localMode,
  passwordMatches,
  sameOrigin,
} from "@/lib/server/auth";

const attempts = new Map<string, { count: number; until: number }>();
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      authenticated: authorized(request),
      local: localMode(request),
      configured:
        !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "请求来源不受信任" }, { status: 403 });
  const key = "admin";
  const entry = attempts.get(key);
  if (entry && entry.until > Date.now() && entry.count >= 8)
    return NextResponse.json(
      { error: "尝试过于频繁，请 15 分钟后重试" },
      { status: 429 },
    );
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式不正确" }, { status: 400 });
  }
  if (
    !passwordMatches(typeof body.password === "string" ? body.password : "")
  ) {
    attempts.set(key, {
      count: entry && entry.until > Date.now() ? entry.count + 1 : 1,
      until: Date.now() + 900000,
    });
    return NextResponse.json(
      { error: "管理密码不正确，或尚未配置有效密码" },
      { status: 401 },
    );
  }
  attempts.delete(key);
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set("realm_session", createSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure:
      new URL(request.headers.get("origin") || request.url).protocol ===
      "https:",
    path: "/",
    maxAge: 43200,
  });
  return response;
}
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "请求来源不受信任" }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set("realm_session", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

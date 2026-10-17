"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Download,
  Edit3,
  FileText,
  Flower2,
  ImagePlus,
  Leaf,
  LogOut,
  Plus,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import type {
  RealmNode,
  SiteContent,
  SiteSettings,
  NodeType,
} from "@/lib/types";
import { TYPE_LABELS } from "@/config/realm.config";
import { Blossom } from "@/ui/Brand";
import { Markdown } from "@/ui/Markdown";

type Session = { authenticated: boolean; local: boolean; configured: boolean };
type Confirm = {
  title: string;
  body: string;
  label: string;
  action: () => void;
};
const dateToday = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
const freshNode = (): RealmNode => ({
  id: "",
  slug: "",
  type: "article",
  title: "",
  summary: "",
  body: "",
  date: dateToday(),
  tags: [],
  meta: { stack: [], links: [] },
  visual: {},
  cover: null,
  images: [],
  zone: null,
  position: null,
  importance: 2,
  createdAt: "",
  published: true,
});
const draftKey = "realm-editor-draft-v1";
export function Composer() {
  const [session, setSession] = useState<Session | null>(null),
    [data, setData] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<"all" | "draft" | "settings">("all");
  const [editing, setEditing] = useState<RealmNode | null>(null),
    [settings, setSettings] = useState<SiteSettings | null>(null);
  const [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState("");
  const [preview, setPreview] = useState(false),
    [dirty, setDirty] = useState(false),
    [confirm, setConfirm] = useState<Confirm | null>(null),
    [draft, setDraft] = useState<RealmNode | null>(null);
  const importRef = useRef<HTMLInputElement>(null),
    coverRef = useRef<HTMLInputElement>(null),
    confirmRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/admin/session");
        if (!r.ok) throw new Error("无法连接内容管理");
        const s = await r.json();
        if (alive) setSession(s);
        if (s.authenticated) {
          const c = await fetch("/api/content?admin=1");
          if (!c.ok) throw new Error("读取内容失败");
          const d = await c.json();
          if (alive) {
            setData(d);
            setSettings(d.settings);
          }
        }
      } catch (e) {
        if (alive) setError((e as Error).message);
      }
    })();
    try {
      const d = localStorage.getItem(draftKey);
      if (d) setDraft(JSON.parse(d));
    } catch {}
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!dirty) return;
    const before = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [dirty]);
  useEffect(() => {
    if (!editing || !dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(editing));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [editing, dirty]);
  useEffect(() => {
    if (!confirm) return;
    const prev = document.activeElement as HTMLElement;
    confirmRef.current?.querySelector("button")?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirm(null);
      if (e.key === "Tab") {
        const btns = Array.from(
          confirmRef.current?.querySelectorAll<HTMLButtonElement>("button") ||
            [],
        );
        if (e.shiftKey && document.activeElement === btns[0]) {
          e.preventDefault();
          btns.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === btns.at(-1)) {
          e.preventDefault();
          btns[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      prev?.focus();
    };
  }, [confirm]);
  const notify = (message: string) => {
    setToast(message);
    setError("");
  };
  const mutate = async (body: unknown) => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 401)
          setSession((s) => (s ? { ...s, authenticated: false } : s));
        throw new Error(d.error || "保存失败");
      }
      setData(d);
      return d as SiteContent;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  };
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      const c = await fetch("/api/content?admin=1");
      if (!c.ok) throw new Error("读取内容失败");
      const content = await c.json();
      setData(content);
      setSettings(content.settings);
      setSession({ authenticated: true, local: false, configured: true });
      setPassword("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const navigate = (action: () => void) => {
    if (dirty)
      setConfirm({
        title: "离开这一页？",
        body: "还有尚未保存的修改。正文编辑会在当前浏览器保留一份草稿，个人资料修改需要先保存。",
        label: "暂时离开",
        action: () => {
          setDirty(false);
          setEditing(null);
          setError("");
          action();
        },
      });
    else {
      setError("");
      action();
    }
  };
  const edit = (node: RealmNode) =>
    navigate(() => {
      setEditing(structuredClone(node));
      setPreview(false);
      setDirty(false);
      setError("");
    });
  const patch = (values: Partial<RealmNode>) => {
    setEditing((n) => (n ? { ...n, ...values } : n));
    setDirty(true);
  };
  const save = async () => {
    if (!editing) return;
    const result = await mutate({ action: "save", node: editing });
    if (result) {
      setEditing(null);
      setDirty(false);
      setDraft(null);
      localStorage.removeItem(draftKey);
      notify(
        editing.published === false
          ? "草稿已保存，仅自己可见"
          : "已发布，桃源里又多了一个故事",
      );
    }
  };
  const remove = (node: RealmNode) =>
    setConfirm({
      title: "移走这个故事？",
      body: `「${node.title || "生活的一页"}」将从小院中移除。服务器会保存修改前的数据备份；你也可以先导出当前内容。`,
      label: "确认移除",
      action: async () => {
        if (await mutate({ action: "delete", id: node.id }))
          notify("内容已移除，修改前的数据已备份");
      },
    });
  const exportContent = () => {
    if (!data) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `桃源境-${dateToday()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("内容与个人资料已导出");
  };
  const importContent = async (file: File) => {
    try {
      if (file.size > 2_000_000) throw new Error("导入文件不能超过 2 MB");
      const value = JSON.parse(await file.text());
      if (!Array.isArray(value.nodes))
        throw new Error("请选择桃源境导出的 JSON 文件");
      setConfirm({
        title: "用备份恢复小院？",
        body: `将导入 ${value.nodes.length} 条内容和个人资料，并替换当前数据。修改前的数据会自动备份。`,
        label: "确认导入",
        action: async () => {
          const result = await mutate({ action: "import", content: value });
          if (result) {
            setSettings(result.settings);
            notify("小院已从备份恢复");
          }
        },
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const uploadCover = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/media", { method: "POST", body: form });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      patch({
        cover: {
          url: result.url,
          w: 1200,
          h: 800,
          alt: editing?.title || "封面",
        },
      });
      notify("封面已上传，保存内容后生效");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const errorBox = error && (
    <div className="admin-notice admin-error" role="alert">
      <AlertCircle size={15} />
      <span>{error}</span>
    </div>
  );
  if (!session)
    return (
      <div className="admin-loading">
        {error ? (
          <div>
            {error}
            <a className="text-button" href="/admin">
              重试
            </a>
          </div>
        ) : (
          "正在打开小院…"
        )}
      </div>
    );
  if (!session.authenticated)
    return (
      <main className="admin-login">
        <form className="login-card" onSubmit={login}>
          <a className="brand" href="/">
            <Blossom size={34} />
            <span>
              桃源境<small>THE GARDENER’S ROOM</small>
            </span>
          </a>
          <span className="eyebrow">WELCOME BACK</span>
          <h1>欢迎回来，造园的人。</h1>
          <p>这里管理小院的文字、作品和个人资料。</p>
          {!session.configured && (
            <div className="admin-notice">
              请在服务器环境变量中设置至少 12 位的 ADMIN_PASSWORD。开发时通过
              localhost 打开，可直接管理内容。
            </div>
          )}
          <label className="field">
            <span>管理密码</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="输入管理密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!session.configured}
            />
          </label>
          {errorBox}
          <button
            className="primary-button"
            type="submit"
            disabled={busy || !session.configured}
          >
            {busy ? "正在进入…" : "进入小院"}
            <ArrowUpRight size={16} />
          </button>
          <a className="text-button" href="/" style={{ marginTop: 20 }}>
            <ArrowLeft size={13} /> 返回桃源
          </a>
        </form>
      </main>
    );
  if (!data || !settings)
    return <div className="admin-loading">{error || "正在整理内容…"}</div>;
  const filtered = data.nodes
    .filter(
      (n) =>
        (section !== "draft" || n.published === false) &&
        `${n.title} ${n.summary} ${TYPE_LABELS[n.type]}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <a className="brand" href="/">
          <Blossom size={32} />
          <span>
            桃源境<small>THE GARDENER’S ROOM</small>
          </span>
        </a>
        <p className="admin-kicker">打理这一隅山水</p>
        <nav aria-label="管理导航">
          <button
            className={section === "all" ? "active" : ""}
            onClick={() =>
              navigate(() => {
                setSection("all");
                setEditing(null);
              })
            }
          >
            <BookOpen size={17} /> 全部内容 <small>{data.nodes.length}</small>
          </button>
          <button
            className={section === "draft" ? "active" : ""}
            onClick={() =>
              navigate(() => {
                setSection("draft");
                setEditing(null);
              })
            }
          >
            <FileText size={17} /> 尚在生长{" "}
            <small>
              {data.nodes.filter((n) => n.published === false).length}
            </small>
          </button>
          <button
            className={section === "settings" ? "active" : ""}
            onClick={() =>
              navigate(() => {
                setSection("settings");
                setSettings(data.settings);
                setEditing(null);
              })
            }
          >
            <Settings2 size={17} /> 个人资料
          </button>
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank">
            <ArrowUpRight size={15} /> 看看我的小院
          </a>
          <small>
            把日常写下来。
            <br />
            让想法慢慢生长。
          </small>
          <span>{session.local ? "本地管理模式" : "管理会话已保护"}</span>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <span>
            <i className="status-dot" />
            {session.local
              ? "本地小院 · 内容保存至项目数据文件"
              : "私密书房 · 管理会话有效"}
          </span>
          <div>
            {!session.local && (
              <button
                className="text-button"
                disabled={busy}
                onClick={() =>
                  navigate(async () => {
                    await fetch("/api/admin/session", { method: "DELETE" });
                    setSession({ ...session, authenticated: false });
                  })
                }
              >
                <LogOut size={13} /> 退出
              </button>
            )}
            <a className="text-button" href="/" target="_blank">
              查看网站 <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        {errorBox}
        {editing ? (
          <section className="editor">
            <div className="editor-header">
              <h1>{editing.id ? "再打磨一页故事" : "种下一个新想法"}</h1>
              <div>
                <button
                  className="secondary-button"
                  disabled={busy}
                  onClick={() => navigate(() => setEditing(null))}
                >
                  返回
                </button>
                <button
                  className="primary-button"
                  disabled={busy}
                  onClick={save}
                >
                  {busy ? <LoaderCircle size={14} /> : <Save size={14} />}{" "}
                  {busy
                    ? "保存中…"
                    : editing.published === false
                      ? "保存草稿"
                      : "保存并发布"}
                </button>
              </div>
            </div>
            <div className="type-picker" role="group" aria-label="内容类型">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => patch({ type: type as NodeType })}
                  className={editing.type === type ? "active" : ""}
                  aria-pressed={editing.type === type}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="field">
              <span className="sr-only">标题</span>
              <input
                className="title-input"
                placeholder={
                  editing.type === "moment"
                    ? "给这一刻取个名字（可选）"
                    : "给这页故事一个标题"
                }
                value={editing.title || ""}
                maxLength={120}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </label>
            <label className="field">
              <span>一句话简介</span>
              <textarea
                rows={2}
                style={{ minHeight: 68 }}
                placeholder="用一句话，让人想走近一点。"
                maxLength={500}
                value={editing.summary || ""}
                onChange={(e) => patch({ summary: e.target.value })}
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>日期</span>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => patch({ date: e.target.value })}
                />
              </label>
              <label className="field">
                <span>
                  标签 <small>用逗号分隔</small>
                </span>
                <input
                  placeholder="设计, 日常, 灵感"
                  value={editing.tags.join(", ")}
                  onChange={(e) =>
                    patch({
                      tags: e.target.value
                        .split(/[,，]/)
                        .map((t) => t.trimStart()),
                    })
                  }
                  onBlur={() =>
                    patch({
                      tags: editing.tags.map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </label>
            </div>
            <div className="markdown-heading">
              <span>
                正文{" "}
                <small style={{ fontSize: 9, color: "#a0ac90", marginLeft: 8 }}>
                  支持 Markdown
                </small>
              </span>
              <div className="markdown-tabs">
                <button
                  className={!preview ? "active" : ""}
                  onClick={() => setPreview(false)}
                >
                  编辑
                </button>
                <button
                  className={preview ? "active" : ""}
                  onClick={() => setPreview(true)}
                >
                  预览
                </button>
              </div>
            </div>
            {preview ? (
              <div className="markdown-preview">
                <Markdown>{editing.body || "还没有写下正文。"}</Markdown>
              </div>
            ) : (
              <textarea
                className="markdown-input"
                aria-label="正文"
                placeholder={
                  "## 从这里开始\n\n写下你的故事…\n\n> 值得记住的话\n\n- 一个想法\n- 一点发现"
                }
                value={editing.body || ""}
                maxLength={100000}
                onChange={(e) => patch({ body: e.target.value })}
              />
            )}
            <label className="field">
              <span>
                封面图片 <small>PNG / JPEG / WebP，最大 3 MB</small>
              </span>
              <div className="admin-cover">
                {editing.cover?.url && (
                  <img src={editing.cover.url} alt="封面预览" />
                )}
                <input
                  placeholder="https://… 或上传本地图片"
                  aria-label="封面图片链接"
                  value={editing.cover?.url || ""}
                  onChange={(e) =>
                    patch({
                      cover: e.target.value
                        ? {
                            url: e.target.value,
                            w: 1200,
                            h: 800,
                            alt: editing.title || "",
                          }
                        : null,
                    })
                  }
                />
                <button
                  className="secondary-button"
                  disabled={busy}
                  onClick={() => coverRef.current?.click()}
                >
                  <ImagePlus size={14} /> 上传
                </button>
              </div>
            </label>
            <input
              ref={coverRef}
              type="file"
              className="file-input"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadCover(f);
                e.target.value = "";
              }}
            />
            {editing.type === "project" && (
              <div className="field-row">
                <label className="field">
                  <span>
                    技术 / 工具 <small>用逗号分隔</small>
                  </span>
                  <input
                    placeholder="React, Figma…"
                    value={
                      Array.isArray(editing.meta.stack)
                        ? (editing.meta.stack as string[]).join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      patch({
                        meta: {
                          ...editing.meta,
                          stack: e.target.value
                            .split(/[,，]/)
                            .map((s) => s.trimStart()),
                        },
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span>项目链接</span>
                  <input
                    placeholder="https://…"
                    value={
                      Array.isArray(editing.meta.links)
                        ? (editing.meta.links as { url: string }[])[0]?.url ||
                          ""
                        : ""
                    }
                    onChange={(e) =>
                      patch({
                        meta: {
                          ...editing.meta,
                          links: e.target.value
                            ? [{ label: "查看项目", url: e.target.value }]
                            : [],
                        },
                      })
                    }
                  />
                </label>
              </div>
            )}
            {editing.type === "experience" && (
              <div className="field-row">
                <label className="field">
                  <span>组织 / 学校</span>
                  <input
                    value={String(editing.meta.org || "")}
                    onChange={(e) =>
                      patch({ meta: { ...editing.meta, org: e.target.value } })
                    }
                  />
                </label>
                <label className="field">
                  <span>角色</span>
                  <input
                    value={String(editing.meta.role || "")}
                    onChange={(e) =>
                      patch({ meta: { ...editing.meta, role: e.target.value } })
                    }
                  />
                </label>
              </div>
            )}
            <div className="editor-bottom">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={editing.published !== false}
                  onChange={(e) => patch({ published: e.target.checked })}
                />{" "}
                发布到小院 <small>取消勾选则保存为草稿</small>
              </label>
              <span>
                {(editing.body || "").length} 字 ·{" "}
                {dirty ? "修改会暂存于此浏览器" : "内容已载入"}
              </span>
            </div>
          </section>
        ) : section === "settings" ? (
          <>
            <div className="admin-title-row">
              <div>
                <h1>造园的人</h1>
                <p>让来访的人，多认识你一点。</p>
              </div>
            </div>
            <form
              className="editor settings-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const result = await mutate({ action: "settings", settings });
                if (result) {
                  setSettings(result.settings);
                  setDirty(false);
                  notify("个人资料已更新");
                }
              }}
            >
              <div className="field-row">
                <label className="field">
                  <span>名字 / 昵称</span>
                  <input
                    required
                    maxLength={60}
                    value={settings.name}
                    onChange={(e) => {
                      setSettings({ ...settings, name: e.target.value });
                      setDirty(true);
                    }}
                  />
                </label>
                <label className="field">
                  <span>身份 / 关注领域</span>
                  <input
                    maxLength={120}
                    value={settings.role}
                    onChange={(e) => {
                      setSettings({ ...settings, role: e.target.value });
                      setDirty(true);
                    }}
                  />
                </label>
              </div>
              <label className="field">
                <span>首页简介</span>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={settings.intro}
                  onChange={(e) => {
                    setSettings({ ...settings, intro: e.target.value });
                    setDirty(true);
                  }}
                />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>
                    邮箱 <small>选填</small>
                  </span>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    value={settings.email}
                    onChange={(e) => {
                      setSettings({ ...settings, email: e.target.value });
                      setDirty(true);
                    }}
                  />
                </label>
                <label className="field">
                  <span>
                    个人主页 <small>选填</small>
                  </span>
                  <input
                    type="url"
                    placeholder="https://github.com/…"
                    value={settings.github}
                    onChange={(e) => {
                      setSettings({ ...settings, github: e.target.value });
                      setDirty(true);
                    }}
                  />
                </label>
              </div>
              <label className="field">
                <span>地点 / 一句状态</span>
                <input
                  maxLength={60}
                  value={settings.location}
                  onChange={(e) => {
                    setSettings({ ...settings, location: e.target.value });
                    setDirty(true);
                  }}
                />
              </label>
              <label className="checkbox-field" style={{ margin: "24px 0" }}>
                <input
                  type="checkbox"
                  checked={settings.demo}
                  onChange={(e) => {
                    setSettings({ ...settings, demo: e.target.checked });
                    setDirty(true);
                  }}
                />{" "}
                在网站标记「示例小院」
              </label>
              <button className="primary-button" disabled={busy} type="submit">
                <Save size={15} />
                {busy ? "保存中…" : "保存个人资料"}
              </button>
              <div className="admin-notice">
                <Leaf size={15} />
                <span>
                  个人资料用于首页简介与联系方式；完整的自我介绍可在「关于我」内容中编辑。替换示例后，可取消示例标记。
                </span>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="admin-title-row">
              <div>
                <span className="eyebrow" style={{ marginBottom: 10 }}>
                  A GARDEN THAT KEEPS GROWING
                </span>
                <h1>
                  {section === "draft" ? "尚在生长的想法" : "小院里的故事"}
                </h1>
                <p>
                  {section === "draft"
                    ? "这些文字只有你能看见。等准备好了，再与人分享。"
                    : "写一页文字，点一盏灯。让小院慢慢丰盛起来。"}
                </p>
              </div>
              <button
                className="primary-button"
                onClick={() => edit(freshNode())}
              >
                <Plus size={16} /> 写一页
              </button>
            </div>
            <div className="admin-stats">
              <div className="admin-stat">
                <span>所有故事</span>
                <strong>{String(data.nodes.length).padStart(2, "0")}</strong>
              </div>
              <div className="admin-stat">
                <span>已在小院绽放</span>
                <strong>
                  {String(
                    data.nodes.filter((n) => n.published !== false).length,
                  ).padStart(2, "0")}
                </strong>
              </div>
              <div className="admin-stat">
                <span>尚在生长</span>
                <strong>
                  {String(
                    data.nodes.filter((n) => n.published === false).length,
                  ).padStart(2, "0")}
                </strong>
              </div>
            </div>
            {draft && (
              <div className="admin-notice">
                <FileText size={15} />
                <span>
                  浏览器里留着一页未保存的草稿：「{draft.title || "未命名"}」。
                  <button
                    className="text-button"
                    style={{ marginLeft: 12 }}
                    onClick={() => {
                      setEditing(draft);
                      setDirty(true);
                      setDraft(null);
                    }}
                  >
                    继续写
                  </button>
                  <button
                    className="text-button"
                    style={{ marginLeft: 12 }}
                    onClick={() => {
                      setDraft(null);
                      localStorage.removeItem(draftKey);
                    }}
                  >
                    放下这页
                  </button>
                </span>
              </div>
            )}
            <div className="admin-tools">
              <label className="search-field admin-search">
                <Search size={15} />
                <input
                  placeholder="搜索标题、简介或分类…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="搜索管理内容"
                />
              </label>
              <div>
                <button className="secondary-button" onClick={exportContent}>
                  <Download size={14} /> 导出备份
                </button>
                <button
                  className="secondary-button"
                  disabled={busy}
                  onClick={() => importRef.current?.click()}
                >
                  <Upload size={14} /> 从备份恢复
                </button>
              </div>
            </div>
            <input
              type="file"
              className="file-input"
              ref={importRef}
              accept="application/json,.json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importContent(file);
                e.target.value = "";
              }}
            />
            <table className="admin-table">
              <thead>
                <tr>
                  <th>故事</th>
                  <th>归处</th>
                  <th>状态</th>
                  <th>日期</th>
                  <th>
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <button onClick={() => edit(n)}>
                        {n.title || "生活的一页"}
                      </button>
                      <small>{n.summary || n.body?.slice(0, 50)}</small>
                    </td>
                    <td>{TYPE_LABELS[n.type]}</td>
                    <td>
                      <span
                        className={`status-badge ${n.published === false ? "draft" : ""}`}
                      >
                        {n.published === false ? "草稿" : "已发布"}
                      </span>
                    </td>
                    <td>{n.date.replaceAll("-", ".")}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => edit(n)}
                        aria-label={`编辑 ${n.title || "生活的一页"}`}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="icon-button"
                        disabled={busy}
                        onClick={() => remove(n)}
                        aria-label={`移除 ${n.title || "生活的一页"}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="empty-state">
                <Flower2 size={35} />
                <h2>留一块空地，等想法发芽。</h2>
                <p>
                  {query
                    ? "没有找到相关内容。"
                    : "写下第一句话，就已经开始了。"}
                </p>
              </div>
            )}
            {data.settings.demo && (
              <div className="admin-notice">
                <Leaf size={15} />
                <span>
                  目前使用示例资料和内容。你可以逐条修改，也可以新写自己的故事；改好之后，在「个人资料」里关闭示例标记。
                </span>
              </div>
            )}
          </>
        )}
      </main>
      {toast && (
        <div className="admin-toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {confirm && (
        <div className="help-overlay" style={{ position: "fixed" }}>
          <div
            className="help-dialog confirm-dialog"
            ref={confirmRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <button
              className="icon-button help-close"
              onClick={() => setConfirm(null)}
              aria-label="关闭确认"
            >
              <X size={19} />
            </button>
            <span className="eyebrow">A MOMENT BEFORE YOU GO</span>
            <h2 id="confirm-title">{confirm.title}</h2>
            <p>{confirm.body}</p>
            <div className="confirm-actions">
              <button
                className="secondary-button"
                onClick={() => setConfirm(null)}
              >
                再想一下
              </button>
              <button
                className="primary-button danger-button"
                onClick={() => {
                  const fn = confirm.action;
                  setConfirm(null);
                  fn();
                }}
              >
                {confirm.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

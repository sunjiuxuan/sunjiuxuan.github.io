"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Compass as CompassIcon,
  Link as Github,
  Mail,
  MapPin,
  RotateCcw,
  HelpCircle,
  Feather,
  X,
  Move,
  Mouse,
  Leaf,
  Settings2,
  Menu,
} from "lucide-react";
import { useRealmStore } from "@/store/useRealmStore";
import type { SiteSettings } from "@/lib/types";
import { TYPE_TO_ZONE, ZONES } from "@/config/realm.config";
import { Blossom } from "./Brand";
import { RealmMap } from "./RealmMap";
import { Compass } from "./Compass";
import { AudioToggle } from "./AudioToggle";
import { Journal } from "./Journal";
import { EnterButton } from "./EnterButton";
export function Shell({
  settings,
  fallback = false,
}: {
  settings: SiteSettings;
  fallback?: boolean;
}) {
  const {
    phase,
    view,
    setView,
    nodes,
    zone,
    setZone,
    focus,
    quality,
    setQuality,
    activeId,
  } = useRealmStore();
  const [help, setHelp] = useState(false),
    [menu, setMenu] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const ready = ["exploring", "focusing"].includes(phase);
  const current = zone ? ZONES[zone] : null;
  const selected = nodes
    .filter((n) => !zone || (n.zone || TYPE_TO_ZONE[n.type]) === zone)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  useEffect(() => {
    if (!help) return;
    const previous = document.activeElement as HTMLElement;
    helpRef.current?.querySelector("button")?.focus();
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHelp(false);
      if (e.key === "Tab") {
        const items = Array.from(
          helpRef.current?.querySelectorAll<HTMLElement>("button") || [],
        );
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", fn);
    return () => {
      document.removeEventListener("keydown", fn);
      previous?.focus();
    };
  }, [help]);
  return (
    <div className="site-chrome" inert={!!activeId}>
      <a className="skip-link" href="#main-content">
        跳至主要内容
      </a>
      <header className="site-header">
        <button
          className="brand"
          aria-label="桃源境首页"
          onClick={() => {
            setView("explore");
            setZone(null);
            window.dispatchEvent(new Event("realm-reset"));
          }}
        >
          <Blossom size={35} />
          <span>
            桃源境<small>A PERSONAL REALM</small>
          </span>
        </button>
        <nav className="view-switch" aria-label="浏览方式">
          <button
            className={view === "explore" ? "active" : ""}
            onClick={() => {
              setView("explore");
              window.dispatchEvent(new Event("realm-reset"));
            }}
          >
            <CompassIcon size={15} /> 漫游
          </button>
          <button
            className={view === "journal" ? "active" : ""}
            onClick={() => setView("journal")}
          >
            <BookOpen size={15} /> 手记
          </button>
        </nav>
        <div className="header-actions">
          <span className="header-note">
            <i /> 自由探索 · 风起桃源
          </span>
          <AudioToggle />
          <button
            className="icon-button"
            onClick={() => setHelp(true)}
            aria-label="漫游指南"
          >
            <HelpCircle size={18} />
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() =>
              view === "journal" ? setHelp(true) : setMenu(!menu)
            }
            aria-label={view === "journal" ? "漫游指南" : "打开导航"}
          >
            {view === "journal" ? (
              <HelpCircle size={19} />
            ) : menu ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}{" "}
          </button>
        </div>
      </header>
      {fallback && (
        <div className="fallback-note">
          当前设备暂不支持三维漫游，仍可完整阅读全部内容。
        </div>
      )}
      {view === "journal" ? (
        <Journal />
      ) : (
        <>
          <EnterButton />
          {ready && (
            <>
              <aside
                className={`explore-sidebar ${menu ? "mobile-open" : ""}`}
                inert={!!activeId}
              >
                <RealmMap />
                <div className="sidebar-intro">
                  <span className="eyebrow">THE JOURNEY BEGINS</span>
                  <h1>
                    风与故事，
                    <br />
                    皆在<span>旅途。</span>
                  </h1>
                  <p>{settings.intro}</p>
                </div>
                <Compass />
                <div className="sidebar-profile">
                  <span className="profile-avatar">
                    <Blossom size={25} />
                  </span>
                  <div>
                    <strong>{settings.name}</strong>
                    <small>{settings.role}</small>
                  </div>
                  <button
                    className="icon-button"
                    aria-label="查看个人介绍"
                    onClick={() => {
                      const n = nodes.find((n) => n.type === "profile");
                      if (n) focus(n.id);
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </aside>
              <div className="landscape-note" aria-hidden="true">
                <span>{current?.label || "桃源初见"}</span>
                <small>{current?.description || "芳草鲜美，落英缤纷。"}</small>
              </div>
              <div className="scene-tools">
                <button
                  className="icon-button"
                  onClick={() => {
                    setZone(null);
                    window.dispatchEvent(new Event("realm-reset"));
                  }}
                  aria-label="回到全景"
                  title="回到全景"
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  className={`icon-button ${quality === "lite" ? "selected" : ""}`}
                  onClick={() =>
                    setQuality(quality === "lite" ? "auto" : "lite")
                  }
                  title={quality === "lite" ? "恢复完整画质" : "切换轻量画质"}
                  aria-label={
                    quality === "lite" ? "恢复完整画质" : "切换轻量画质"
                  }
                  aria-pressed={quality === "lite"}
                >
                  <Leaf size={17} />
                </button>
              </div>
              <section
                className="discovery-tray"
                id="main-content"
                aria-label="当前区域内容"
                inert={!!activeId}
              >
                <div className="tray-heading">
                  <div>
                    <Feather size={16} />
                    <span>
                      {current
                        ? `${current.label} · ${current.subtitle}`
                        : "旅途见闻"}
                    </span>
                    <small>
                      {current ? "此处的故事" : "STORIES TO DISCOVER"}
                    </small>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setView("journal")}
                  >
                    浏览全部 <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="tray-items">
                  {selected.length ? (
                    selected.map((n, i) => (
                      <button key={n.id} onClick={() => focus(n.id)}>
                        <span className="tray-index">0{i + 1}</span>
                        <span>
                          <strong>{n.title || "生活的一页"}</strong>
                          <small>{n.summary || n.date}</small>
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    ))
                  ) : (
                    <p className="tray-empty">这里的故事，还在生长。</p>
                  )}
                </div>
              </section>
              <div className="adventure-status">
                <span>✦</span>
                <strong>{settings.name}</strong>
                <small>自由探索</small>
                <i>
                  <b />
                </i>
                <span>桃源 · 晴</span>
              </div>
              <div className="scene-hint">
                <Move size={12} />
                <span>拖动环顾 · WASD 移动</span>
                <i />
                <Mouse size={12} />
                <span>滚轮缩放</span>
                <i />
                <span>点击光点，读一页故事</span>
              </div>
            </>
          )}
          {!ready && phase !== "gate" && phase !== "loading" && (
            <div className="entering-caption">循着花香，往山水深处去。</div>
          )}
        </>
      )}
      <footer className="site-footer">
        <span>
          <MapPin size={12} />
          {settings.location}
        </span>
        <span className="footer-links">
          {settings.email && (
            <a href={`mailto:${settings.email}`} aria-label="发送邮件">
              <Mail size={14} />
            </a>
          )}
          {settings.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="个人主页"
            >
              <Github size={14} />
            </a>
          )}
          <a href="/admin" title="内容管理" aria-label="内容管理">
            <Settings2 size={14} />
          </a>
          {settings.demo && <small>示例小院</small>}
          <span>© {new Date().getFullYear()} 桃源境</span>
        </span>
      </footer>
      {help && (
        <div className="help-overlay" onClick={() => setHelp(false)}>
          <div
            className="help-dialog"
            ref={helpRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon-button help-close"
              onClick={() => setHelp(false)}
              aria-label="关闭指南"
            >
              <X size={20} />
            </button>
            <Blossom size={40} />
            <span className="eyebrow">MAKE YOURSELF AT HOME</span>
            <h2 id="help-title">桃源漫游指南</h2>
            <p>不必急着走完，挑一处喜欢的风景就好。</p>
            <ul>
              <li>
                <Move size={20} />
                <div>
                  <strong>随意环顾</strong>
                  <span>
                    拖动旋转视角，滚轮或双指缩放；电脑端可用 W A S D 平移。
                  </span>
                </div>
              </li>
              <li>
                <CompassIcon size={20} />
                <div>
                  <strong>循景而行</strong>
                  <span>点击小地图传送点或左侧分区，镜头会带你前往。</span>
                </div>
              </li>
              <li>
                <Feather size={20} />
                <div>
                  <strong>打开一个故事</strong>
                  <span>点击场景光点或下方内容，按 Esc 返回。</span>
                </div>
              </li>
              <li>
                <BookOpen size={20} />
                <div>
                  <strong>安静地读</strong>
                  <span>切换「手记」，按分类、标签或关键词查找。</span>
                </div>
              </li>
            </ul>
            <button className="primary-button" onClick={() => setHelp(false)}>
              知道了，去走走 <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

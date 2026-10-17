import test from "node:test";
import assert from "node:assert/strict";
import {
  validateNode,
  validateContent,
  validateSettings,
  safeUrl,
} from "../src/lib/data/validate.ts";
import { defaultContent } from "../src/lib/data/seed.ts";
const sample = () => structuredClone(defaultContent.nodes[1]);
test("all seed content survives validation and keeps its publication state", () => {
  const result = validateContent(defaultContent);
  assert.equal(result.nodes.length, 12);
  assert.ok(result.nodes.every((n) => n.published));
  assert.equal(result.settings.name, "桃源旅人");
});
test("rejects script URLs and protocol-relative URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.example/x",
    "/api/media/../../secret",
  ])
    assert.equal(safeUrl(url), "");
  assert.equal(
    safeUrl("https://example.com/project"),
    "https://example.com/project",
  );
});
test("valid uploaded media URLs are allowed", () => {
  const url = "/api/media/12345678-1234-1234-1234-123456789abc.png";
  assert.equal(safeUrl(url), url);
});
test("drafts stay drafts and input objects are not changed", () => {
  const n = sample();
  n.published = false;
  const before = JSON.stringify(n);
  const result = validateNode(n);
  assert.equal(result.published, false);
  assert.equal(JSON.stringify(n), before);
});
test("invalid dates, types and empty required titles are rejected", () => {
  for (const patch of [
    { date: "2026-02-31" },
    { date: "today" },
    { type: "unknown" },
    { title: "" },
  ])
    assert.throws(() => validateNode({ ...sample(), ...patch }));
});
test("moments may be untitled but require some content", () => {
  assert.equal(
    validateNode({ ...sample(), type: "moment", title: "" }).title,
    null,
  );
  assert.throws(() =>
    validateNode({
      ...sample(),
      type: "moment",
      title: "",
      summary: "",
      body: "",
    }),
  );
});
test("tags are deduplicated and unrecognized fields do not enter storage", () => {
  const n = validateNode({
    ...sample(),
    tags: ["a", "a", "b"],
    admin: true,
    meta: { script: "x" },
  });
  assert.deepEqual(n.tags, ["a", "b"]);
  assert.equal("admin" in n, false);
  assert.equal("script" in n.meta, false);
});
test("unsafe links and cover images produce an actionable error", () => {
  assert.throws(
    () => validateNode({ ...sample(), cover: { url: "javascript:alert(1)" } }),
    /封面/,
  );
  assert.throws(
    () =>
      validateNode({
        ...sample(),
        meta: { links: [{ url: "javascript:alert(1)" }] },
      }),
    /项目链接/,
  );
});
test("imports reject duplicate IDs and unversioned data", () => {
  assert.throws(
    () => validateContent({ ...defaultContent, nodes: [sample(), sample()] }),
    /重复/,
  );
  assert.throws(() => validateContent({ ...defaultContent, version: 2 }));
});
test("settings validate contact fields and preserve the demo flag", () => {
  assert.throws(() =>
    validateSettings({ ...defaultContent.settings, email: "invalid" }),
  );
  assert.throws(() =>
    validateSettings({
      ...defaultContent.settings,
      github: "javascript:alert(1)",
    }),
  );
  assert.equal(
    validateSettings({ ...defaultContent.settings, demo: false }).demo,
    false,
  );
});

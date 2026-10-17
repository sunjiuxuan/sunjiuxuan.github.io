import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import net from "node:net";
const probe = net.createServer();
await new Promise((r) => probe.listen(0, "127.0.0.1", r));
const port = probe.address().port;
await new Promise((r) => probe.close(r));
const data = await mkdtemp(join(tmpdir(), "realm-test-")),
  password = randomBytes(24).toString("hex");
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: { ...process.env, ADMIN_PASSWORD: password, REALM_DATA_DIR: data },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
for (const stream of [server.stdout, server.stderr])
  stream.on("data", (d) => {
    logs = (logs + d).slice(-10000);
  });
const base = `http://127.0.0.1:${port}`;
let cookie = "";
const headers = () => ({
  "Content-Type": "application/json",
  Origin: base,
  ...(cookie ? { Cookie: cookie } : {}),
});
const post = async (body, origin = base) => {
  const r = await fetch(base + "/api/content", {
    method: "POST",
    headers: { ...headers(), Origin: origin },
    body: JSON.stringify(body),
  });
  return [r, await r.json()];
};
try {
  const deadline = Date.now() + 30000;
  while (true) {
    try {
      const r = await fetch(base + "/api/admin/session");
      if (r.ok) break;
    } catch {}
    if (Date.now() > deadline) throw new Error("Test server failed to start");
    await new Promise((r) => setTimeout(r, 150));
  }
  const publicBefore = await (await fetch(base + "/api/content")).json();
  assert.equal(publicBefore.nodes.length, 12);
  const reading = await fetch(base + "/read/realm");
  assert.equal(reading.status, 200);
  assert.match(await reading.text(), /为自己造一座桃花源/);
  assert.equal((await fetch(base + "/read/missing-story")).status, 404);
  assert.equal((await fetch(base + "/not-a-page")).status, 404);
  const session = await (await fetch(base + "/api/admin/session")).json();
  assert.equal(session.authenticated, false);
  assert.equal(session.local, false);
  assert.equal((await fetch(base + "/api/content?admin=1")).status, 401);
  assert.equal(
    (await post({ action: "save", node: publicBefore.nodes[0] }))[0].status,
    401,
  );
  let login = await fetch(base + "/api/admin/session", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ password: "wrong" }),
  });
  assert.equal(login.status, 401);
  login = await fetch(base + "/api/admin/session", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ password }),
  });
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (
      await fetch(base + "/api/content?admin=1", {
        headers: { Cookie: cookie },
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await post(
        { action: "settings", settings: publicBefore.settings },
        "https://other.example",
      )
    )[0].status,
    403,
  );
  const draft = {
    ...publicBefore.nodes[1],
    id: "",
    title: "Integration test draft",
    published: false,
  };
  let [r, c] = await post({ action: "save", node: draft });
  assert.equal(r.status, 200);
  const created = c.nodes.find((n) => n.title === draft.title);
  assert.ok(created.id);
  assert.equal(created.published, false);
  assert.equal((await fetch(base + "/read/" + created.id)).status, 404);
  let visible = await (await fetch(base + "/api/content")).json();
  assert.ok(!visible.nodes.some((n) => n.id === created.id));
  const admin = await (
    await fetch(base + "/api/content?admin=1", { headers: { Cookie: cookie } })
  ).json();
  assert.ok(admin.nodes.some((n) => n.id === created.id));
  [r, c] = await post({
    action: "save",
    node: {
      ...created,
      published: true,
      body: "## Persisted markdown\n\nIt works.",
    },
  });
  assert.equal(r.status, 200);
  visible = await (await fetch(base + "/api/content")).json();
  assert.match(
    visible.nodes.find((n) => n.id === created.id).body,
    /Persisted markdown/,
  );
  assert.equal(
    (
      await post({ action: "save", node: { ...created, date: "2026-02-31" } })
    )[0].status,
    400,
  );
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB4kAAAAASUVORK5CYII=",
    "base64",
  );
  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "pixel.png");
  r = await fetch(base + "/api/media", {
    method: "POST",
    headers: { Origin: base, Cookie: cookie },
    body: form,
  });
  assert.equal(r.status, 200);
  const media = await r.json();
  const image = await fetch(base + media.url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
  const badForm = new FormData();
  badForm.append(
    "file",
    new Blob(['<svg onload="alert(1)"></svg>'], { type: "image/svg+xml" }),
    "bad.svg",
  );
  assert.equal(
    (
      await fetch(base + "/api/media", {
        method: "POST",
        headers: { Origin: base, Cookie: cookie },
        body: badForm,
      })
    ).status,
    400,
  );
  [r, c] = await post({
    action: "settings",
    settings: { ...publicBefore.settings, name: "Test gardener" },
  });
  assert.equal(r.status, 200);
  assert.equal(
    (await (await fetch(base + "/api/content")).json()).settings.name,
    "Test gardener",
  );
  [r, c] = await post({ action: "delete", id: created.id });
  assert.equal(r.status, 200);
  assert.ok(!c.nodes.some((n) => n.id === created.id));
  [r, c] = await post({ action: "import", content: publicBefore });
  assert.equal(r.status, 200);
  assert.equal(c.nodes.length, 12);
  assert.equal(c.settings.name, publicBefore.settings.name);
  assert.ok((await readdir(join(data, "backups"))).length >= 5);
  const logout = await fetch(base + "/api/admin/session", {
    method: "DELETE",
    headers: headers(),
  });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/i);
  console.log(
    "PASS: production authentication, origin protection, draft visibility, CRUD persistence, upload validation, settings, import, backups and logout.",
  );
} catch (error) {
  console.error(error);
  console.error(logs);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
  await new Promise((resolve) => {
    server.once("exit", resolve);
    setTimeout(resolve, 4000).unref();
  });
  await rm(data, { recursive: true, force: true });
}

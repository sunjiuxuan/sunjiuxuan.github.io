import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(projectRoot, "../.."); // /Users/shanchahuadubudongbaimeigui/Documents/Antigravity IDE

const apiDir = path.join(projectRoot, "src/app/api");
const hiddenApiDir = path.join(projectRoot, "src/app/_api");
const outDir = path.join(projectRoot, "out");

console.log("🌸 开始导出桃源境静态版本用于 GitHub Pages 部署...");

let apiRenamed = false;
try {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, hiddenApiDir);
    apiRenamed = true;
  }

  // 运行构建导出
  execSync("node node_modules/next/dist/bin/next build", {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_EXPORT: "true",
    },
  });

  // 创建 .nojekyll，确保 GitHub Pages 不忽略 _next 目录
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
  console.log("✓ 已生成 .nojekyll 文件");

  console.log("✓ 静态构建成功导出至: " + outDir);

  // 同步到仓库根目录用于 GitHub Pages 托管
  console.log("📦 正在同步静态站点到仓库根目录:", repoRoot);
  const items = fs.readdirSync(outDir);
  for (const item of items) {
    const src = path.join(outDir, item);
    const dest = path.join(repoRoot, item);
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
  console.log("🎉 已成功同步所有文件到仓库根目录！");
} finally {
  if (apiRenamed && fs.existsSync(hiddenApiDir)) {
    fs.renameSync(hiddenApiDir, apiDir);
    console.log("✓ 已恢复本地开发 API 路由");
  }
}

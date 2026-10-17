import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

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
  console.log("✓ 静态构建成功保留在当前项目 out 目录中: " + outDir);
} finally {
  if (apiRenamed && fs.existsSync(hiddenApiDir)) {
    fs.renameSync(hiddenApiDir, apiDir);
    console.log("✓ 已恢复本地开发 API 路由");
  }
}

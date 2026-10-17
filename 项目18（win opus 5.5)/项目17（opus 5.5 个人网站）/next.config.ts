import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const config: NextConfig = {
  devIndicators: false,
  ...(isExport ? { output: "export" } : {}),
  images: { unoptimized: true },
};

export default config;



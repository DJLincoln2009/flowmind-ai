import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@flowmind/shared"],
  output: "standalone",
};

export default nextConfig;
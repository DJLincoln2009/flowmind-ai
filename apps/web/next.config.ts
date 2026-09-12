import type { NextConfig } from "next";

// output "standalone" requis par le Dockerfile web (déploiement Railway/Vercel).
const nextConfig: NextConfig = {
  transpilePackages: ["@flowmind/shared"],
  output: "standalone",
};

export default nextConfig;
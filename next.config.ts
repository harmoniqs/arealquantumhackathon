import type { NextConfig } from "next";

// Deployed as a GitHub Pages project site at harmoniqs.github.io/arealquantumhackathon
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/arealquantumhackathon" : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

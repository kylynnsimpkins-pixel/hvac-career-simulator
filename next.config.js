/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages build: static export served from /<repo-name>
  ...(process.env.GITHUB_PAGES ? { output: "export", basePath: process.env.NEXT_PUBLIC_BASE_PATH, images: { unoptimized: true }, trailingSlash: true } : {}),
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

module.exports = nextConfig;

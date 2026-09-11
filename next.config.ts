import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep Turbopack rooted on this app even if a lockfile exists in the home folder.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

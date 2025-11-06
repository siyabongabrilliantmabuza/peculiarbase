/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ (Optional) Allow production builds even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  experimental: {
    // ✅ Enable Turbopack and modern features
    turbo: true,
  },
};

module.exports = nextConfig;

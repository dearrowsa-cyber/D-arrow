/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Pin the workspace root to this project so Next.js doesn't mis-detect it
  // when a stray package-lock.json exists in a parent directory (C:\Users\omara).
  outputFileTracingRoot: path.join(__dirname),

  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  allowedDevOrigins: ['*.trycloudflare.com', 'localhost:3000'],

  serverExternalPackages: ['@prisma/client', 'prisma'],

  // async redirects() { ... },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'coresg-normal.trae.ai',
        port: '',
        pathname: '/**',
      },
    ],

    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },

  // async headers() { ... },
};

module.exports = nextConfig;
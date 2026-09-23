/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,


  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  serverExternalPackages: ['@prisma/client', 'prisma'],

  // redirects() not supported with output: 'export'
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

  // headers() not supported with output: 'export'
  // async headers() { ... },
};

module.exports = nextConfig;
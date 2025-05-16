import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    SPECIAL_EMAIL: process.env.SPECIAL_EMAIL,
    SPECIAL_PASSWORD: process.env.SPECIAL_PASSWORD,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  reactStrictMode: false
};

export default nextConfig;
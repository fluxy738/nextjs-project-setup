import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
  // Allow cross-origin requests from the specified development domain
  allowedDevOrigins: ['zjnyw3-8000.csb.app'],
}

export default nextConfig

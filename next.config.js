/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  serverExternalPackages: ['mongoose'],
}

module.exports = nextConfig

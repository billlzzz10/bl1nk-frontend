/** @type {import('next').NextConfig} */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8000'
const defaultAllowedOrigins = ['127.0.0.1', 'localhost']
const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
  ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : defaultAllowedOrigins

const nextConfig = {
  allowedDevOrigins,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${API_PROXY_TARGET}/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Add hydration mismatch prevention
    optimizeCss: true,
  },
  // Ensure proper client-side rendering for components that need it
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Add React strict mode to catch potential issues
  reactStrictMode: true,
}

export default nextConfig

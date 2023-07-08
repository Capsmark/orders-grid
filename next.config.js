/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;

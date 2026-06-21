/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The reference Vite prototype lives under /design and must never be compiled.
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;

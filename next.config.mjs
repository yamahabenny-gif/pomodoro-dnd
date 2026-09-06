/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_BASE_PATH ?? '',
  },
}

export default nextConfig

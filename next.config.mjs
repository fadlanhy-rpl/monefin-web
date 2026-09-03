/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * 'standalone' output digunakan saat deployment Docker.
   * Saat pengujian lokal dengan `next start`, output default digunakan agar aset statis termuat sempurna.
   */
  ...(process.env.NEXT_STANDALONE === "true" ? { output: "standalone" } : {}),


  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * 'standalone' output digunakan saat deployment Docker.
   * Saat pengujian lokal dengan `next start`, output default digunakan agar aset statis termuat sempurna.
   */
  ...(process.env.NEXT_STANDALONE === "true" ? { output: "standalone" } : {}),

  // Aktifkan gzip/brotli compression pada semua response
  compress: true,

  // Hapus header X-Powered-By: Next.js dari response (minor security + byte saving)
  poweredByHeader: false,

  // Tree-shake lucide-react: hanya bundle ikon yang benar-benar di-import
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

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
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "monefin.web.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.monefin.web.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sk0010uoic.skipper.my.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },

  // Security Headers & Cache-Control headers
  async headers() {
    return [
      {
        // Global Security Headers untuk semua route di Vercel
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Gambar di folder public/ — cache 7 hari
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Favicon, manifest, dll — cache 1 hari
        source: "/:file(favicon.ico|icon.svg|apple-icon.png|manifest.json|robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

export default function manifest() {
  return {
    id: "/",
    name: "MoneFin — Platform Manajemen Keuangan Pribadi Gratis & AI Advisor",
    short_name: "MoneFin",
    description:
      "Kelola keuangan pribadi otomatis dengan aturan 50/30/20, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja 1–8 Foto, dan Split Bill cerdas.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f7f6",
    theme_color: "#00685F",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo-monefin-app-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo-monefin-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo-monefin-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard Keuangan",
        short_name: "Dashboard",
        description: "Lihat ringkasan saldo dan arus kas harian",
        url: "/dashboard",
        icons: [{ src: "/images/logo-monefin-app-icon.png", sizes: "192x192" }],
      },
      {
        name: "Catat & Scan Struk AI",
        short_name: "Transaksi",
        description: "Catat transaksi atau scan 1–8 foto struk belanja",
        url: "/transactions",
        icons: [{ src: "/images/logo-monefin-app-icon.png", sizes: "192x192" }],
      },
      {
        name: "Smart Split Bill",
        short_name: "Split Bill",
        description: "Hitung patungan makan & tagihan grup",
        url: "/split-bill",
        icons: [{ src: "/images/logo-monefin-app-icon.png", sizes: "192x192" }],
      },
    ],
  };
}

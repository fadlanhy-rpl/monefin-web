export default function manifest() {
  return {
    name: "MoneFin — Aplikasi Manajemen Keuangan Pribadi, 50/30/20 & AI Scan Struk",
    short_name: "MoneFin",
    description:
      "Kelola keuangan pribadi otomatis dengan aturan 50/30/20, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja 1–8 Foto, dan Split Bill cerdas.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f6",
    theme_color: "#00685F",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo-monefin-app-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

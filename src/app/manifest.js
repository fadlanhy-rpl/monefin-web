export default function manifest() {
  return {
    name: "MoneFin - Platform Manajemen Keuangan Pribadi & AI Advisor",
    short_name: "MoneFin",
    description: "Kelola keuangan pribadi cerdas, lacak arus kas, anggaran, dan raih tujuan finansial bersama MoneFin.",
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
    ],
  };
}

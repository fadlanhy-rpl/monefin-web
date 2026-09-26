import LoginIllustration from "../../../components/auth/LoginIllustration";
import LoginForm from "../../../components/auth/LoginForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Masuk ke Akun Anda (Login)",
  description:
    "Masuk ke dashboard MoneFin Anda untuk mencatat transaksi harian, memantau anggaran 50/30/20, scan struk belanja dengan AI, dan mengelola kekayaan bersih.",
  alternates: {
    canonical: "https://www.monefin.web.id/login",
  },
  openGraph: {
    title: "Masuk ke Akun MoneFin | Dashboard Keuangan Pribadi",
    description:
      "Akses dashboard manajemen keuangan pribadi MoneFin Anda dengan aman menggunakan email, Google OAuth, dan proteksi 2FA.",
    url: "https://www.monefin.web.id/login",
    type: "website",
  },
};

const loginJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Beranda",
      item: "https://www.monefin.web.id",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Masuk (Login)",
      item: "https://www.monefin.web.id/login",
    },
  ],
};

export default function LoginPage() {
  return (
    <main
      className={`${inter.className} flex min-h-screen bg-[#f8faf9] overflow-hidden w-full text-slate-900 selection:bg-brand-500/20 selection:text-brand-900`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loginJsonLd) }}
      />
      {/* Kiri: Studio Finansial Interaktif */}
      <LoginIllustration />

      {/* Kanan: Formulir Masuk MoneFin */}
      <LoginForm />
    </main>
  );
}

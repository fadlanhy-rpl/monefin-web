import RegisterIllustration from "../../../components/auth/RegisterIllustration";
import RegisterForm from "../../../components/auth/RegisterForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Daftar Akun Gratis — Mulai Kelola Keuangan 50/30/20",
  description:
    "Buat akun MoneFin gratis dalam 30 detik. Nikmati alokasi anggaran 50/30/20 otomatis, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk 1–8 foto, dan Split Bill.",
  alternates: {
    canonical: "https://www.monefin.web.id/register",
  },
  openGraph: {
    title: "Daftar Akun Gratis | MoneFin Personal Finance",
    description:
      "Mulai kelola keuangan pribadi otomatis dengan aturan 50/30/20, AI Scan Struk Belanja, dan multi-mata uang bersama MoneFin. 100% Gratis.",
    url: "https://www.monefin.web.id/register",
    type: "website",
  },
};

const registerJsonLd = {
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
      name: "Daftar Akun Gratis",
      item: "https://www.monefin.web.id/register",
    },
  ],
};

export default function RegisterPage() {
  return (
    <main
      className={`${inter.className} flex min-h-screen bg-[#f8faf9] overflow-hidden w-full text-slate-900 selection:bg-brand-500/20 selection:text-brand-900`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(registerJsonLd) }}
      />
      {/* Kiri: Studio Finansial Interaktif */}
      <RegisterIllustration />

      {/* Kanan: Formulir Pendaftaran MoneFin */}
      <RegisterForm />
    </main>
  );
}

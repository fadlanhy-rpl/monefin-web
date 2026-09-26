import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import { BalancePrivacyProvider } from "../context/BalancePrivacyContext";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.monefin.web.id"),
  title: {
    default: "MoneFin — Aplikasi Manajemen Keuangan Pribadi, 50/30/20 & AI Scan Struk",
    template: "%s | MoneFin",
  },
  description:
    "Kelola keuangan pribadi otomatis dengan aturan 50/30/20, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja Panjang (1–8 Foto), Split Bill cerdas, dan AI Financial Advisor BYOK gratis.",
  applicationName: "MoneFin",
  keywords: [
    "monefin",
    "aplikasi keuangan pribadi",
    "catat keuangan harian",
    "manajemen keuangan pribadi",
    "aturan 50/30/20",
    "scan struk belanja ai",
    "aplikasi split bill",
    "multi currency finance tracker",
    "financial tracker indonesia",
    "ai financial advisor",
    "catat pemasukan dan pengeluaran",
    "budgeting indonesia",
  ],
  authors: [{ name: "MoneFin Team", url: "https://www.monefin.web.id" }],
  creator: "MoneFin",
  publisher: "MoneFin",
  category: "finance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
    languages: {
      "id-ID": "https://www.monefin.web.id",
      "en-US": "https://www.monefin.web.id",
      "x-default": "https://www.monefin.web.id",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://www.monefin.web.id",
    title: "MoneFin — Platform Manajemen Keuangan Pribadi, 50/30/20 & AI Vision",
    description:
      "Otomatisasi alokasi gaji 50/30/20, pantau kekayaan bersih di 4 mata uang (IDR, USD, EUR, SGD), scan struk belanja panjang 1–8 foto dengan Gemini 3.6 Vision, dan Split Bill instan.",
    siteName: "MoneFin",
    images: [
      {
        url: "/images/logo-monefin-app-icon.png",
        width: 800,
        height: 800,
        alt: "MoneFin — Platform Manajemen Keuangan Pribadi Cerdas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneFin — Manajemen Keuangan Pribadi, 50/30/20 & AI Scan Struk",
    description:
      "Kelola keuangan pribadi lebih terarah: Alokasi 50/30/20 otomatis, Multi-Mata Uang (IDR/USD/EUR/SGD), AI Scan Struk 1–8 Foto, dan Split Bill. 100% Gratis & Aman.",
    images: ["/images/logo-monefin-app-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.monefin.web.id/#website",
      url: "https://www.monefin.web.id",
      name: "MoneFin",
      alternateName: ["MoneFin Indonesia", "MoneFin Personal Finance"],
      description:
        "Platform Manajemen Keuangan Pribadi dengan Alokasi 50/30/20 Otomatis, Multi-Mata Uang (IDR, USD, EUR, SGD), AI Scan Struk 1–8 Foto, dan Smart Split Bill.",
      inLanguage: ["id-ID", "en-US"],
      publisher: {
        "@id": "https://www.monefin.web.id/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.monefin.web.id/#organization",
      name: "MoneFin",
      url: "https://www.monefin.web.id",
      email: "monefin.techapp@gmail.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.monefin.web.id/images/logo-monefin-app-icon.png",
        width: 800,
        height: 800,
      },
      sameAs: [],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.monefin.web.id/#app",
      name: "MoneFin",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, Android, iOS",
      url: "https://www.monefin.web.id",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      description:
        "Aplikasi pencatatan dan manajemen keuangan pribadi cerdas dengan alokasi 50/30/20 otomatis, konversi kurs 4 mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja Panjang (1–8 Foto), dan Smart Split Bill.",
      featureList: [
        "Alokasi Anggaran 50/30/20 Otomatis & Kustom",
        "Multi-Akun & Konversi Kurs 4 Mata Uang (IDR, USD, EUR, SGD)",
        "AI Scan Struk Belanja Panjang & Gabungan (1–8 Foto sekaligus dengan Gemini 3.6 Vision BYOK)",
        "Smart Split Bill & Tagihan Grup WhatsApp",
        "Target Tabungan (Sinking Funds) & Pelacak Tagihan Rutin",
        "Ekspor Laporan Keuangan CSV & Kepatuhan Privasi UU PDP No. 27/2022",
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans bg-[#f4f7f6] text-slate-800 min-h-screen antialiased`}>

        <AuthProvider>
          <LanguageProvider>
            <BalancePrivacyProvider>
              {children}
              <Toaster
              position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                style: {
                  background: "#f0faf9",
                  color: "#00685F",
                  border: "1px solid #00685F20",
                },
                iconTheme: { primary: "#00685F", secondary: "#fff" },
              },
              error: {
                style: {
                  background: "#fff5f5",
                  color: "#dc2626",
                  border: "1px solid #dc262620",
                },
              },
            }}
          />
            </BalancePrivacyProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

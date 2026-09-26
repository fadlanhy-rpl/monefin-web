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
    default:
      "MoneFin — Platform Manajemen Keuangan Pribadi Gratis & AI Advisor",
    template: "%s | MoneFin — Platform Manajemen Keuangan Pribadi Gratis",
  },
  description:
    "MoneFin adalah platform manajemen keuangan pribadi gratis di Indonesia. Catat pemasukan & pengeluaran harian, alokasi gaji 50/30/20 otomatis, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja (1–8 Foto), dan Split Bill cerdas.",
  applicationName: "MoneFin",
  keywords: [
    "platform manajemen keuangan pribadi gratis",
    "aplikasi manajemen keuangan pribadi gratis",
    "aplikasi keuangan pribadi gratis",
    "manajemen keuangan pribadi",
    "catat keuangan harian gratis",
    "aplikasi pengatur keuangan pribadi",
    "aturan 50/30/20",
    "scan struk belanja ai",
    "aplikasi split bill gratis",
    "multi currency finance tracker",
    "financial tracker indonesia gratis",
    "ai financial advisor indonesia",
    "monefin",
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
    title:
      "MoneFin — Platform Manajemen Keuangan Pribadi Gratis & AI Financial Advisor",
    description:
      "Platform manajemen keuangan pribadi gratis untuk mencatat arus kas harian, otomatisasi alokasi gaji 50/30/20, konversi 4 mata uang (IDR, USD, EUR, SGD), AI Scan Struk 1–8 foto, dan Split Bill.",
    siteName: "MoneFin",
    images: [
      {
        url: "/images/logo-monefin-app-icon.png",
        width: 800,
        height: 800,
        alt: "MoneFin — Platform Manajemen Keuangan Pribadi Gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "MoneFin — Platform Manajemen Keuangan Pribadi Gratis & AI Scan Struk",
    description:
      "Platform manajemen keuangan pribadi gratis dengan Alokasi 50/30/20 otomatis, Multi-Mata Uang (IDR/USD/EUR/SGD), AI Scan Struk 1–8 Foto, dan Split Bill.",
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
      name: "MoneFin — Platform Manajemen Keuangan Pribadi Gratis",
      alternateName: [
        "MoneFin",
        "MoneFin Indonesia",
        "Platform Manajemen Keuangan Pribadi Gratis MoneFin",
      ],
      description:
        "MoneFin adalah platform manajemen keuangan pribadi gratis di Indonesia dengan Alokasi 50/30/20 Otomatis, Multi-Mata Uang (IDR, USD, EUR, SGD), AI Scan Struk 1–8 Foto, dan Smart Split Bill.",
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
      name: "MoneFin — Platform Manajemen Keuangan Pribadi Gratis",
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Personal Finance Management",
      operatingSystem: "Web, Android, iOS",
      url: "https://www.monefin.web.id",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
        description: "100% Gratis Selamanya Tanpa Iklan",
      },
      description:
        "Platform manajemen keuangan pribadi gratis untuk mencatat pemasukan & pengeluaran, alokasi 50/30/20 otomatis, konversi kurs 4 mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja Panjang (1–8 Foto), dan Smart Split Bill.",
      featureList: [
        "Platform Manajemen Keuangan Pribadi Gratis 100% Tanpa Iklan",
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

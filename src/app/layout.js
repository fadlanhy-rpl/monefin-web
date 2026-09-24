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
    default: "MoneFin - Platform Manajemen Keuangan Pribadi & AI Advisor",
    template: "%s | MoneFin",
  },
  description:
    "Kelola keuangan pribadi dengan cerdas: catat pemasukan dan pengeluaran harian, pantau arus kas, rancang anggaran, kelola hutang piutang, dan raih kebebasan finansial bersama MoneFin.",
  keywords: [
    "aplikasi keuangan pribadi",
    "catat keuangan harian",
    "manajemen keuangan",
    "aplikasi pengatur uang",
    "financial tracker indonesia",
    "monefin",
    "ai financial advisor",
    "catat pemasukan dan pengeluaran",
    "budgeting indonesia",
    "split bill",
  ],
  authors: [{ name: "MoneFin Team", url: "https://www.monefin.web.id" }],
  creator: "MoneFin",
  publisher: "MoneFin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.monefin.web.id",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.monefin.web.id",
    title: "MoneFin - Platform Manajemen Keuangan Pribadi Cerdas",
    description:
      "Aplikasi pencatatan keuangan harian, analisis arus kas otomatis, dan asisten finansial AI cerdas untuk merencanakan masa depan keuangan Anda.",
    siteName: "MoneFin",
    images: [
      {
        url: "/images/logo-monefin-app-icon.png",
        width: 800,
        height: 800,
        alt: "Logo MoneFin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneFin - Manajemen Keuangan Pribadi & AI Financial Advisor",
    description:
      "Kelola keuangan pribadi lebih mudah dan terarah dengan MoneFin. Gratis dan aman.",
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
      "@type": "SoftwareApplication",
      name: "MoneFin",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://www.monefin.web.id",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      description:
        "Platform pencatatan dan pengelolaan keuangan pribadi pintar dengan analisis arus kas, budgeting cerdas, dan AI financial advisor.",
      featureList: [
        "Pencatatan Pemasukan & Pengeluaran",
        "Kategori Dinamis & Anggaran Realistis",
        "AI Financial Advisor BYOK",
        "Pelacak Hutang & Tabungan Target",
        "Multi-Wallet & Rekonsiliasi Saldo",
      ],
    },
    {
      "@type": "Organization",
      name: "MoneFin",
      url: "https://www.monefin.web.id",
      logo: "https://www.monefin.web.id/images/logo-monefin-app-icon.png",
      sameAs: [],
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

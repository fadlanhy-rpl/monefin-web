import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Syarat & Ketentuan Penggunaan Layanan (v3.0.0)",
  description:
    "Syarat dan Ketentuan resmi penggunaan platform manajemen keuangan pribadi MoneFin berlandaskan UU Perlindungan Konsumen No. 8/1999, UU ITE, dan UU PDP No. 27/2022.",
  alternates: {
    canonical: "https://www.monefin.web.id/terms",
  },
  openGraph: {
    title: "Syarat & Ketentuan Layanan | MoneFin Trust Center",
    description:
      "Ketentuan penggunaan platform pencatatan keuangan pribadi, AI Scan Struk BYOK, Split Bill, Safe Harbor peneliti keamanan, dan mekanisme banding akun.",
    url: "https://www.monefin.web.id/terms",
    type: "website",
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.monefin.web.id/terms#webpage",
      url: "https://www.monefin.web.id/terms",
      name: "Syarat & Ketentuan Penggunaan Layanan | MoneFin",
      description:
        "Syarat dan ketentuan resmi penggunaan platform manajemen keuangan pribadi MoneFin (v3.0.0).",
      isPartOf: { "@id": "https://www.monefin.web.id/#website" },
      inLanguage: "id-ID",
    },
    {
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
          name: "Syarat & Ketentuan",
          item: "https://www.monefin.web.id/terms",
        },
      ],
    },
  ],
};

export default function TermsPage() {
  const relatedDocs = [
    {
      href: "/privacy",
      title: "Kebijakan Privasi",
      titleEn: "Privacy Policy",
      desc: "Pemberitahuan pemrosesan data pribadi berlandaskan UU PDP No. 27/2022, daftar sub-prosesor, masa retensi, dan hak Subjek Data.",
      descEn: "Personal data processing notice aligned with UU PDP No. 27/2022, sub-processor registry, retention schedules, and Data Subject Rights.",
    },
    {
      href: "/security",
      title: "Standar Keamanan",
      titleEn: "Security Standards",
      desc: "Dokumentasi kontrol keamanan berlapis: Bcrypt, SHA-256, enkripsi BYOK AES-256-CBC, HTTP security headers, dan pengungkapan kerentanan.",
      descEn: "Defense-in-depth security documentation: Bcrypt, SHA-256, AES-256-CBC BYOK encryption, HTTP security headers, and vulnerability disclosure.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      <LegalPageLayout
        docKey="terms"
        data={legalData}
        category="Syarat & Ketentuan"
        categoryEn="Terms of Service"
        badge="UU PK No. 8/1999 · UU ITE · UU PDP"
        badgeEn="Consumer Protection · Electronic Systems · PDP Law"
        relatedDocs={relatedDocs}
      />
    </>
  );
}

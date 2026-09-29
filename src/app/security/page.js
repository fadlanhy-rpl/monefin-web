import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Standar Keamanan & Pelindungan Data (v3.0.0)",
  description:
    "Dokumentasi kontrol keamanan berlapis MoneFin: hashing kata sandi Bcrypt, enkripsi kunci API BYOK AES-256-CBC, 2FA OTP, validasi kepemilikan data tingkat baris, dan kebijakan pengungkapan kerentanan (RFC 9116).",
  alternates: {
    canonical: "https://www.monefin.web.id/security",
  },
  openGraph: {
    title: "Standar Keamanan & Pelindungan Data | MoneFin Trust Center",
    description:
      "Dokumentasi kontrol keamanan berlapis MoneFin berlandaskan acuan OWASP ASVS, NIST SP 800-63B, ISO/IEC 27002, dan ISO/IEC 29147.",
    url: "https://www.monefin.web.id/security",
    type: "website",
  },
};

const securityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.monefin.web.id/security#webpage",
      url: "https://www.monefin.web.id/security",
      name: "Standar Keamanan & Pelindungan Data | MoneFin",
      description:
        "Dokumentasi kontrol keamanan berlapis MoneFin: Bcrypt, SHA-256, AES-256-CBC untuk kunci API BYOK, 2FA OTP, dan validasi kepemilikan data tingkat baris.",
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
          name: "Standar Keamanan",
          item: "https://www.monefin.web.id/security",
        },
      ],
    },
  ],
};

export default function SecurityPage() {
  const relatedDocs = [
    {
      href: "/terms",
      title: "Syarat & Ketentuan",
      titleEn: "Terms of Service",
      desc: "Perjanjian penggunaan layanan pencatatan keuangan, batas usia 18+, pengecualian peneliti keamanan (Safe Harbor), dan penyelesaian sengketa.",
      descEn: "Service agreement governing personal finance tracking, 18+ eligibility, security researcher Safe Harbor, and dispute resolution.",
    },
    {
      href: "/privacy",
      title: "Kebijakan Privasi",
      titleEn: "Privacy Policy",
      desc: "Pemberitahuan pemrosesan data pribadi berlandaskan UU PDP No. 27/2022, daftar sub-prosesor, masa retensi, dan hak Subjek Data.",
      descEn: "Personal data processing notice aligned with UU PDP No. 27/2022, sub-processor registry, retention schedules, and Data Subject Rights.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securityJsonLd) }}
      />
      <LegalPageLayout
        docKey="security"
        data={legalData}
        category="Standar Keamanan"
        categoryEn="Security Standards"
        badge="Acuan OWASP ASVS · NIST SP 800-63B · ISO 27002"
        badgeEn="OWASP ASVS · NIST SP 800-63B · ISO 27002 Aligned"
        relatedDocs={relatedDocs}
      />
    </>
  );
}

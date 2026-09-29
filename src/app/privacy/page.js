import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Kebijakan Privasi & Pelindungan Data Pribadi (UU PDP)",
  description:
    "Kebijakan Privasi MoneFin (v3.0.0) berlandaskan UU PDP No. 27/2022: rincian kategori data, dasar hukum pemrosesan, transparansi AI BYOK, daftar sub-prosesor, masa retensi, dan hak Subjek Data.",
  alternates: {
    canonical: "https://www.monefin.web.id/privacy",
  },
  openGraph: {
    title: "Kebijakan Privasi & Pelindungan Data | MoneFin Trust Center",
    description:
      "Transparansi pemrosesan data pribadi berlandaskan UU PDP No. 27/2022, pemisahan penyimpanan AI BYOK, dan pemenuhan hak Subjek Data.",
    url: "https://www.monefin.web.id/privacy",
    type: "website",
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.monefin.web.id/privacy#webpage",
      url: "https://www.monefin.web.id/privacy",
      name: "Kebijakan Privasi & Pelindungan Data Pribadi | MoneFin",
      description:
        "Kebijakan Privasi MoneFin berlandaskan UU PDP No. 27/2022, daftar sub-prosesor, jadwal retensi data, dan hak Subjek Data.",
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
          name: "Kebijakan Privasi",
          item: "https://www.monefin.web.id/privacy",
        },
      ],
    },
  ],
};

export default function PrivacyPage() {
  const relatedDocs = [
    {
      href: "/terms",
      title: "Syarat & Ketentuan",
      titleEn: "Terms of Service",
      desc: "Perjanjian penggunaan layanan pencatatan keuangan, batas usia 18+, pengecualian peneliti keamanan (Safe Harbor), dan penyelesaian sengketa.",
      descEn: "Service agreement governing personal finance tracking, 18+ eligibility, security researcher Safe Harbor, and dispute resolution.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <LegalPageLayout
        docKey="privacy"
        data={legalData}
        category="Kebijakan Privasi"
        categoryEn="Privacy Policy"
        badge="Kepatuhan UU PDP No. 27/2022 · ISO 27701"
        badgeEn="UU PDP No. 27/2022 · ISO 27701 Aligned"
        relatedDocs={relatedDocs}
      />
    </>
  );
}

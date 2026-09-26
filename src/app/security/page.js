import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Standar Keamanan & Enkripsi Data Finansial",
  description:
    "Pelajari arsitektur keamanan berlapis MoneFin: enkripsi AES-256, autentikasi 2FA TOTP, perlindungan IDOR tingkat baris, isolasi API Key BYOK, dan audit keamanan.",
  alternates: {
    canonical: "https://www.monefin.web.id/security",
  },
  openGraph: {
    title: "Standar Keamanan Tingkat Enterprise | MoneFin Trust Center",
    description:
      "Eksplorasi arsitektur keamanan berlapis MoneFin: enkripsi AES-256, 2FA, perlindungan IDOR, dan isolasi kunci API BYOK.",
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
      name: "Standar Keamanan & Enkripsi Data Finansial | MoneFin",
      description:
        "Pelajari arsitektur keamanan berlapis MoneFin: enkripsi AES-256, autentikasi 2FA TOTP, perlindungan IDOR, dan isolasi API Key BYOK.",
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
      desc: "Ketentuan penggunaan platform pencatatan keuangan, split bill administratif, dan batasan tanggung jawab.",
      descEn: "Terms of use governing personal finance logging, split bill, and platform liability parameters.",
    },
    {
      href: "/privacy",
      title: "Kebijakan Privasi",
      titleEn: "Privacy Policy",
      desc: "Pelajari komitmen perlindungan data finansial Anda berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
      descEn: "Learn how we safeguard your financial data in strict compliance with UU PDP No. 27/2022 and Zero Data Brokering.",
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
        badge="Keamanan Tingkat Enterprise · Level A"
        badgeEn="Enterprise Grade Security · Level A"
        relatedDocs={relatedDocs}
      />
    </>
  );
}


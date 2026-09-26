import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Syarat & Ketentuan Penggunaan Layanan",
  description:
    "Syarat dan ketentuan resmi penggunaan platform manajemen keuangan pribadi MoneFin, alokasi anggaran 50/30/20, AI Scan Struk BYOK, dan Split Bill.",
  alternates: {
    canonical: "https://www.monefin.web.id/terms",
  },
  openGraph: {
    title: "Syarat & Ketentuan Layanan | MoneFin Trust Center",
    description:
      "Ketentuan penggunaan platform pencatatan keuangan pribadi, AI Scan Struk BYOK, dan Split Bill di MoneFin.",
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
        "Syarat dan ketentuan resmi penggunaan platform manajemen keuangan pribadi MoneFin.",
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
      desc: "Pelajari komitmen perlindungan data finansial Anda berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
      descEn: "Learn how we safeguard your financial data in strict compliance with UU PDP No. 27/2022 and Zero Data Brokering.",
    },
    {
      href: "/security",
      title: "Standar Keamanan",
      titleEn: "Security Standards",
      desc: "Eksplorasi arsitektur pertahanan berlapis, row-level IDOR shield, mitigasi race condition, dan HTTP security headers.",
      descEn: "Explore our defense-in-depth architecture, row-level IDOR shield, race condition mitigations, and HTTP security headers.",
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
        badge="Perjanjian Layanan Digital"
        badgeEn="Digital Service Agreement"
        relatedDocs={relatedDocs}
      />
    </>
  );
}


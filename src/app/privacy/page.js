import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";

export const metadata = {
  title: "Kebijakan Privasi & Perlindungan Data (UU PDP)",
  description:
    "Pelajari komitmen perlindungan data finansial pribadi Anda di MoneFin berlandaskan UU PDP No. 27/2022, enkripsi AES-256, BYOK AI, dan prinsip Zero Data Brokering.",
  alternates: {
    canonical: "https://www.monefin.web.id/privacy",
  },
  openGraph: {
    title: "Kebijakan Privasi & Perlindungan Data | MoneFin Trust Center",
    description:
      "Komitmen perlindungan data finansial pribadi berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
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
      name: "Kebijakan Privasi & Perlindungan Data | MoneFin",
      description:
        "Pelajari komitmen perlindungan data finansial pribadi Anda di MoneFin berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
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
      desc: "Ketentuan penggunaan platform pencatatan keuangan, split bill administratif, dan batasan tanggung jawab.",
      descEn: "Terms of use governing personal finance logging, split bill, and platform liability parameters.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <LegalPageLayout
        docKey="privacy"
        data={legalData}
        category="Kebijakan Privasi"
        categoryEn="Privacy Policy"
        badge="Kepatuhan UU PDP No. 27/2022"
        badgeEn="UU PDP No. 27/2022 Compliant"
        relatedDocs={relatedDocs}
      />
    </>
  );
}


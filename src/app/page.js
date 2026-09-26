import { LandingClient } from "@/components/landing/LandingClient";
import idLocale from "@/locales/id.json";

export const metadata = {
  title:
    "MoneFin — Platform Manajemen Keuangan Pribadi Gratis & AI Advisor",
  description:
    "MoneFin adalah platform manajemen keuangan pribadi gratis di Indonesia untuk mencatat pemasukan & pengeluaran harian, alokasi gaji 50/30/20 otomatis, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja (1–8 Foto), dan Split Bill cerdas.",
  alternates: {
    canonical: "https://www.monefin.web.id",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [1, 2, 3, 4, 5, 6].map((idx) => ({
    "@type": "Question",
    name: idLocale.faq[`q${idx}`],
    acceptedAnswer: {
      "@type": "Answer",
      text: idLocale.faq[`a${idx}`],
    },
  })),
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingClient />
    </>
  );
}

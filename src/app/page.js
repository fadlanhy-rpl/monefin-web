import { LandingClient } from "@/components/landing/LandingClient";
import idLocale from "@/locales/id.json";

export const metadata = {
  title:
    "MoneFin — Aplikasi Manajemen Keuangan Pribadi, 50/30/20 & AI Scan Struk",
  description:
    "Kelola keuangan pribadi otomatis dengan aturan 50/30/20, multi-mata uang (IDR, USD, EUR, SGD), AI Scan Struk Belanja Panjang (1–8 Foto), Split Bill cerdas, dan AI Financial Advisor BYOK gratis.",
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

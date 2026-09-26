import { DownloadClient } from "@/components/download/DownloadClient";

export const metadata = {
  title: "Download Aplikasi MoneFin (APK Android & Panduan Install iOS)",
  description:
    "Unduh file APK resmi MoneFin untuk Android atau pasang aplikasi MoneFin di iPhone & iPad (iOS). Terhubung langsung dengan database cloud, AI Scan Struk, dan anggaran 50/30/20.",
  alternates: {
    canonical: "https://www.monefin.web.id/download",
  },
  openGraph: {
    title: "Download Aplikasi MoneFin — Android (.APK) & iOS (iPhone/iPad)",
    description:
      "Unduh APK Android resmi MoneFin dan panduan instalasi lengkap untuk Android serta iOS (iPhone & iPad).",
    url: "https://www.monefin.web.id/download",
    type: "website",
  },
};

const downloadJsonLd = {
  "@context": "https://schema.org",
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
      name: "Download Aplikasi (Android APK & iOS)",
      item: "https://www.monefin.web.id/download",
    },
  ],
};

export default function DownloadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadJsonLd) }}
      />
      <DownloadClient />
    </>
  );
}

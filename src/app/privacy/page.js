"use client";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";
import { Lock, FileText, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  const relatedDocs = [
    {
      href: "/terms",
      title: "Syarat & Ketentuan",
      titleEn: "Terms of Service",
      desc: "Ketentuan penggunaan platform pencatatan keuangan, split bill administratif, dan batasan tanggung jawab.",
      descEn: "Terms of use governing personal finance logging, split bill, and platform liability parameters.",
      icon: FileText,
    },
    {
      href: "/security",
      title: "Standar Keamanan",
      titleEn: "Security Standards",
      desc: "Eksplorasi arsitektur pertahanan berlapis, row-level IDOR shield, mitigasi race condition, dan HTTP security headers.",
      descEn: "Explore our defense-in-depth architecture, row-level IDOR shield, race condition mitigations, and HTTP security headers.",
      icon: ShieldCheck,
    },
  ];

  return (
    <LegalPageLayout
      docKey="privacy"
      data={legalData}
      category="Kebijakan Privasi"
      categoryEn="Privacy Policy"
      badge="Kepatuhan UU PDP No. 27/2022"
      badgeEn="UU PDP No. 27/2022 Compliant"
      icon={Lock}
      relatedDocs={relatedDocs}
    />
  );
}


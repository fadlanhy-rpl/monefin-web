"use client";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";
import { FileText, Lock, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  const relatedDocs = [
    {
      href: "/privacy",
      title: "Kebijakan Privasi",
      titleEn: "Privacy Policy",
      desc: "Pelajari komitmen perlindungan data finansial Anda berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
      descEn: "Learn how we safeguard your financial data in strict compliance with UU PDP No. 27/2022 and Zero Data Brokering.",
      icon: Lock,
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
      docKey="terms"
      data={legalData}
      category="Syarat & Ketentuan"
      categoryEn="Terms of Service"
      badge="Perjanjian Layanan Digital"
      badgeEn="Digital Service Agreement"
      icon={FileText}
      relatedDocs={relatedDocs}
    />
  );
}


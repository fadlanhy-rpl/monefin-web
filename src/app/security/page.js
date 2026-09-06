"use client";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { legalData } from "@/data/legalData";
import { ShieldCheck, FileText, Lock } from "lucide-react";

export default function SecurityPage() {
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
      href: "/privacy",
      title: "Kebijakan Privasi",
      titleEn: "Privacy Policy",
      desc: "Pelajari komitmen perlindungan data finansial Anda berlandaskan UU PDP No. 27/2022 dan prinsip Zero Data Brokering.",
      descEn: "Learn how we safeguard your financial data in strict compliance with UU PDP No. 27/2022 and Zero Data Brokering.",
      icon: Lock,
    },
  ];

  return (
    <LegalPageLayout
      docKey="security"
      data={legalData}
      category="Standar Keamanan"
      categoryEn="Security Standards"
      badge="Keamanan Tingkat Enterprise · Level A"
      badgeEn="Enterprise Grade Security · Level A"
      icon={ShieldCheck}
      relatedDocs={relatedDocs}
    />
  );
}


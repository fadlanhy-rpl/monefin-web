"use client";

import RegisterIllustration from "../../../components/auth/RegisterIllustration";
import RegisterForm from "../../../components/auth/RegisterForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RegisterPage() {
  return (
    <div
      className={`${inter.className} flex min-h-screen bg-[#f8faf9] overflow-hidden w-full text-slate-900 selection:bg-brand-500/20 selection:text-brand-900`}
    >
      {/* Kiri: Studio Finansial Interaktif */}
      <RegisterIllustration />

      {/* Kanan: Formulir Pendaftaran MoneFin */}
      <RegisterForm />
    </div>
  );
}

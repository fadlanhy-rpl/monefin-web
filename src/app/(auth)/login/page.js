"use client";

import LoginIllustration from "../../../components/auth/LoginIllustration";
import LoginForm from "../../../components/auth/LoginForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  return (
    <div
      className={`${inter.className} flex min-h-screen bg-[#f8faf9] overflow-hidden w-full text-slate-900 selection:bg-brand-500/20 selection:text-brand-900`}
    >
      {/* Kiri: Studio Finansial Interaktif */}
      <LoginIllustration />

      {/* Kanan: Formulir Masuk MoneFin */}
      <LoginForm />
    </div>
  );
}

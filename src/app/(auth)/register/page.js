"use client";

import RegisterIllustration from "../../../components/auth/RegisterIllustration";
import RegisterForm from "../../../components/auth/RegisterForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RegisterPage() {
  return (
    <div className={`${inter.className} flex min-h-screen bg-white overflow-hidden w-full text-slate-700`}>
      {/* Kiri: Ilustrasi & Branding */}
      <RegisterIllustration />

      {/* Kanan: Form Sign Up */}
      <RegisterForm />
    </div>
  );
}

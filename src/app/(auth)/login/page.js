"use client";

import LoginIllustration from "../../../components/auth/LoginIllustration";
import LoginForm from "../../../components/auth/LoginForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  return (
    <div className={`${inter.className} flex min-h-screen bg-white overflow-hidden w-full text-slate-700`}>
      {/* Kiri: Ilustrasi & Branding */}
      <LoginIllustration />

      {/* Kanan: Form Sign In */}
      <LoginForm />
    </div>
  );
}

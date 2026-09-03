"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "../../../lib/api";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const { language } = useLanguage();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      processedRef.current = true;
      toast.error(decodeURIComponent(error), { id: "google-auth-toast" });
      router.replace("/login");
      return;
    }

    if (token) {
      processedRef.current = true;
      // Simpan token (30 hari — Google login selalu ingat)
      setAuthToken(token, 30);

      // Verifikasi ke backend dan hydrate user state
      checkAuth().then(() => {
        const activeLang = typeof window !== "undefined" ? (localStorage.getItem("language") || language) : language;
        toast.success(
          activeLang === "en" ? "Google login successful!" : "Login dengan Google berhasil!",
          { id: "google-auth-toast" }
        );
        router.replace("/dashboard");
      });
    } else {
      processedRef.current = true;
      router.replace("/login?error=callback_failed");
    }
  }, [searchParams, router, checkAuth, language]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 font-semibold">
          {language === "en" ? "Completing sign in..." : "Menyelesaikan login..."}
        </p>
        <p className="text-gray-400 text-sm">
          {language === "en" ? "Please wait a moment" : "Harap tunggu sebentar"}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

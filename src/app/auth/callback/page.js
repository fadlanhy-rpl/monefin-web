"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";

function decodeBase64UrlJson(encoded) {
  if (!encoded || typeof window === "undefined") return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth, hydrateAuthSession } = useAuth();
  const { language } = useLanguage();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const urlParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const token = searchParams.get("token") || urlParams?.get("token");
    const userParam = searchParams.get("user") || urlParams?.get("user");
    const error = searchParams.get("error") || urlParams?.get("error");

    if (error) {
      processedRef.current = true;
      toast.error(decodeURIComponent(error), { id: "google-auth-toast" });
      router.replace("/login");
      return;
    }

    if (token) {
      processedRef.current = true;
      const decodedUser = decodeBase64UrlJson(userParam);

      // Hidrasi token + state autentikasi (dan user jika dikirim di query param) secara sinkron
      hydrateAuthSession(token, decodedUser, 30);

      const finishRedirect = () => {
        const activeLang =
          typeof window !== "undefined" ? localStorage.getItem("language") || language : language;
        toast.success(
          activeLang === "en" ? "Google login successful!" : "Login dengan Google berhasil!",
          { id: "google-auth-toast" }
        );
        router.replace("/dashboard");

        // Pengaman tambahan: jika router transisi Next.js tertahan di /auth/callback,
        // paksa navigasi penuh agar tidak pernah stuck.
        if (typeof window !== "undefined") {
          setTimeout(() => {
            if (window.location.pathname.startsWith("/auth/callback")) {
              window.location.replace("/dashboard");
            }
          }, 700);
        }
      };

      // Jika data user sudah terhidrasi dari parameter callback backend,
      // jalankan checkAuth(true) di background untuk mem-prime cache & langsung masuk dashboard!
      if (decodedUser) {
        checkAuth(true).catch(() => {});
        finishRedirect();
      } else {
        // Fallback jika backend belum mengirim &user=: tunggu checkAuth(true) (maks 8 detik)
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 8000));
        Promise.race([checkAuth(true), timeoutPromise])
          .then(() => {
            finishRedirect();
          })
          .catch(() => {
            finishRedirect();
          });
      }
    } else {
      processedRef.current = true;
      router.replace("/login?error=callback_failed");
    }
  }, [searchParams, router, checkAuth, hydrateAuthSession, language]);


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

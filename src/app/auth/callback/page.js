"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "../../../lib/api";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace("/login");
      return;
    }

    if (token) {
      // Simpan token (30 hari — Google login selalu ingat)
      setAuthToken(token, 30);

      // Verifikasi ke backend dan hydrate user state
      checkAuth().then(() => {
        toast.success("Login dengan Google berhasil!");
        router.replace("/dashboard");
      });
    } else {
      router.replace("/login?error=callback_failed");
    }
  }, [searchParams, router, checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 font-semibold">Menyelesaikan login...</p>
        <p className="text-gray-400 text-sm">Harap tunggu sebentar</p>
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

"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";
import { Mail, ArrowRight, ArrowLeft, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { forgotPassword, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isEn = language === "en";

  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [oauthInfo, setOauthInfo] = useState(null);

  const [googleUrl, setGoogleUrl] = useState(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/google`
  );

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      navigator?.brave &&
      typeof navigator.brave.isBrave === "function"
    ) {
      navigator.brave
        .isBrave()
        .then((isBrave) => {
          if (isBrave) {
            const base =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
            setGoogleUrl(`${base}/auth/google?client_browser=Brave`);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOauthInfo(null);

    const result = await forgotPassword(email);

    if (result.success) {
      if (result.oauth_only) {
        setOauthInfo({
          email,
          message: result.message,
        });
        setIsSubmitting(false);
        return;
      }

      setSent(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `otp_expiry_reset_${email}`,
          (Date.now() + 300 * 1000).toString()
        );
      }
      toast.success(
        result.message ||
          (isEn
            ? "If your email is registered, an OTP code has been sent!"
            : "Jika email terdaftar, kode OTP telah dikirimkan ke email Anda!")
      );
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1800);
    } else {
      toast.error(
        result.error ||
          (isEn
            ? "Failed to send OTP. Make sure your email is registered."
            : "Gagal mengirim OTP. Pastikan email Anda terdaftar.")
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00685F]/10 border border-[#00685F]/5 p-8 sm:p-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00685F] transition-colors group mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{isEn ? "Go Back" : "Kembali"}</span>
          </button>

          {oauthInfo ? (
            /* Tampilan jika akun terdaftar via Google OAuth */
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-center justify-center shadow-xs">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-8 h-8"
                  />
                </div>
              </div>

              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 bg-amber-100/80 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider rounded-full">
                  {isEn ? "Google Account Detected" : "Akun Google Terdeteksi"}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {isEn ? "Registered via Google" : "Akun Terdaftar via Google"}
                </h1>
                <p className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl py-1.5 px-3 inline-block max-w-full truncate">
                  {oauthInfo.email}
                </p>
              </div>

              {/* Informative Box */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed text-amber-900">
                    {isEn
                      ? "This account was created with Google Sign-In, so there is no manual password to reset via OTP."
                      : "Akun ini didaftarkan via Google, sehingga tidak memiliki password manual untuk di-reset."}
                  </p>
                </div>

                <div className="border-t border-amber-200/60 pt-2.5 space-y-2 text-xs text-amber-800/90 font-medium">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "1. Please sign in directly using the Google button below."
                        : "1. Silakan login langsung menggunakan tombol Google di bawah."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <KeyRound className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
                    <span>
                      {isEn
                        ? "2. Once logged in, you can set a password in Settings > Security so you can also log in with email & password."
                        : "2. Setelah login, Anda bisa membuat password di menu Pengaturan > Keamanan agar ke depan bisa login menggunakan email & password."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <a
                  href={googleUrl}
                  className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#00685F]/40 py-3.5 px-4 rounded-2xl font-bold text-slate-700 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-98 cursor-pointer group"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-5 h-5 group-hover:scale-105 transition-transform"
                    alt="Google"
                  />
                  <span className="text-sm font-extrabold text-slate-800">
                    {isEn ? "Sign in with Google" : "Masuk dengan Google"}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setOauthInfo(null);
                    setEmail("");
                  }}
                  className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {isEn ? "Try another email" : "Gunakan email lain"}
                </button>
              </div>
            </div>
          ) : !sent ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#00685F]" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {isEn ? "Forgot Password?" : "Lupa Password?"}
                </h1>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {isEn
                    ? "Enter your account email. We will send an OTP verification code to reset your password."
                    : "Masukkan email akun Anda. Kami akan mengirimkan kode OTP untuk mereset password."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {isEn ? "Email Address" : "Alamat Email"}
                  </label>
                  <div className="relative mt-2 group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {isEn ? "Sending OTP..." : "Mengirim OTP..."}
                    </>
                  ) : (
                    <>
                      {isEn ? "Send OTP Code" : "Kirim Kode OTP"} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {isEn ? "If your email is registered, the OTP code will be sent to" : "Jika email terdaftar, kode OTP akan dikirim ke"}{" "}
                <span className="font-bold text-[#00685F]">{email}</span>
              </p>
              <p className="text-xs text-gray-400">
                {isEn ? "Redirecting to reset password page..." : "Mengarahkan ke halaman reset password..."}
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href={isAuthenticated ? "/settings" : "/login"}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00685F] transition-colors font-medium"
            >
              <ArrowLeft className="w-3 h-3" />
              {isAuthenticated
                ? (isEn ? "Back to Settings" : "Kembali ke Pengaturan")
                : (isEn ? "Back to Login" : "Kembali ke Login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}

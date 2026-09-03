"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";
import { ShieldCheck, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verify2fa, resendOtp } = useAuth();
  const { t, language } = useLanguage();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every((d) => d !== "") && value) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) handleVerify(pasted);
  };

  const handleVerify = async (otpString) => {
    if (isSubmitting) return;
    if (timeLeft <= 0) {
      toast.error(language === "en" ? "OTP code has expired. Please resend." : "Kode OTP telah kadaluarsa. Silakan kirim ulang.");
      return;
    }
    setIsSubmitting(true);
    const result = await verify2fa(email, otpString);
    if (result.success) {
      toast.success(language === "en" ? "Verification successful! Welcome." : "Verifikasi berhasil! Selamat datang.");
      router.push("/dashboard");
    } else {
      toast.error(result.error || (language === "en" ? "Invalid or expired OTP code." : "Kode OTP tidak valid atau sudah kadaluarsa."));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setIsSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error(language === "en" ? "Please enter the 6-digit OTP code." : "Masukkan 6 digit kode OTP.");
      return;
    }
    handleVerify(otpString);
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    const result = await resendOtp(email, "2fa");
    if (result.success) {
      toast.success(language === "en" ? "New 2FA code sent to your email." : "Kode 2FA baru telah dikirim ke email Anda.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeLeft(300);
      setCanResend(false);
    } else {
      toast.error(result.error || (language === "en" ? "Failed to resend OTP." : "Gagal mengirim ulang OTP."));
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00685F]/10 border border-[#00685F]/5 p-8 sm:p-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#00685F]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verifikasi Dua Faktor</h1>
            <p className="text-gray-500 text-sm mt-2">
              Kode OTP dikirim ke <span className="font-bold text-[#00685F]">{email}</span>
            </p>

            {/* Countdown */}
            {timeLeft > 0 ? (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs font-bold text-orange-700">Waktu tersisa: {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="mt-3 inline-flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-red-500">Kode OTP telah kadaluarsa.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-2xl outline-none transition-all
                    ${digit ? "border-[#00685F] bg-[#e6f2f0] text-[#00685F]" : "border-gray-200 bg-gray-50 text-gray-900"}
                    focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 focus:bg-white
                    disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  disabled={isSubmitting || timeLeft <= 0}
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || timeLeft <= 0}
              className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verifikasi
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">Tidak menerima kode?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#00685F] hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <span className="w-3 h-3 border-2 border-[#00685F]/40 border-t-[#00685F] rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Kirim ulang OTP
              </button>
            ) : (
              <p className="text-sm font-semibold text-gray-400">
                Kirim ulang dalam <span className="text-[#00685F]">{formatTime(timeLeft)}</span>
              </p>
            )}

            <div>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00685F] transition-colors font-medium">
                <ArrowLeft className="w-3 h-3" />
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" /></div>}>
      <Verify2FAContent />
    </Suspense>
  );
}

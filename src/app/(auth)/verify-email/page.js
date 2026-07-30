"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendOtp } = useAuth();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer untuk resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    // Hanya terima angka
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus ke kotak berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit jika semua kotak terisi
    if (newOtp.every(d => d !== "") && value) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpString) => {
    if (isVerifying) return;
    setIsVerifying(true);
    const result = await verifyEmail(email, otpString);

    if (result.success) {
      toast.success("Email berhasil diverifikasi! Selamat datang di MoneFin.");
      router.push("/");
    } else {
      toast.error(result.error || "Kode OTP tidak valid atau sudah kadaluarsa.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setIsVerifying(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Masukkan 6 digit kode OTP.");
      return;
    }
    handleVerify(otpString);
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    const result = await resendOtp(email, "verification");

    if (result.success) {
      toast.success("Kode OTP baru telah dikirim ke email Anda.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setCountdown(60);
      setCanResend(false);
    } else {
      toast.error(result.error || "Gagal mengirim ulang OTP.");
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00685F]/10 border border-[#00685F]/5 p-8 sm:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#00685F]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verifikasi Email</h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Kami mengirim kode 6 digit ke
              <span className="font-bold text-[#00685F] block mt-1">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-2xl outline-none transition-all
                    ${digit ? "border-[#00685F] bg-[#e6f2f0] text-[#00685F]" : "border-gray-200 bg-gray-50 text-gray-900"}
                    focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 focus:bg-white`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otp.join("").length < 6}
              className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verifikasi Email
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Tidak menerima kode?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#00685F] hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <span className="w-3 h-3 border-2 border-[#00685F]/40 border-t-[#00685F] rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Kirim ulang OTP
              </button>
            ) : (
              <p className="mt-2 text-sm font-semibold text-gray-400">
                Kirim ulang dalam <span className="text-[#00685F]">{countdown}s</span>
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <a href="/login" className="text-xs text-gray-400 hover:text-[#00685F] transition-colors">
              ← Kembali ke halaman Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

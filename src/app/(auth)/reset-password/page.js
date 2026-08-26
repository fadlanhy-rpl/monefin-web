"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
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
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (step === 1) {
      if (timeLeft <= 0) {
        toast.error("Kode OTP telah kadaluarsa. Silakan kirim ulang.");
        return;
      }
      if (otpString.length !== 6) {
        toast.error("Masukkan 6 digit kode OTP.");
        return;
      }
      setStep(2);
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword({
      email,
      otp: otpString,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (result.success) {
      toast.success("Password berhasil diperbarui! Silakan login kembali.");
      router.push("/login");
    } else {
      toast.error(result.error || "Gagal mereset password. Kode OTP mungkin sudah kadaluarsa.");
      setOtp(["", "", "", "", "", ""]);
      setStep(1);
      inputRefs.current[0]?.focus();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00685F]/10 border border-[#00685F]/5 p-8 sm:p-10">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#00685F]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-2">
              Kode OTP dikirim ke <span className="font-bold text-[#00685F]">{email}</span>
            </p>
            {step === 1 && timeLeft > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-xs font-bold text-orange-700">Waktu tersisa: {formatTime(timeLeft)}</span>
              </div>
            )}
            {step === 1 && timeLeft <= 0 && (
              <div className="mt-3 inline-flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-red-500">Kode OTP telah kadaluarsa.</span>
                <Link href="/forgot-password" className="text-xs font-extrabold text-[#00685F] hover:underline">
                  Kirim ulang OTP &rarr;
                </Link>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: OTP Input */}
            {step === 1 && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3 text-center">Kode OTP</label>
                <div className="flex justify-center gap-2.5">
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
                      className={`w-11 h-13 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
                        ${digit ? "border-[#00685F] bg-[#e6f2f0] text-[#00685F]" : "border-gray-200 bg-gray-50"}
                        focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      disabled={isSubmitting || (step === 1 && timeLeft <= 0)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: New Password */}
            {step === 2 && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password Baru</label>
                  <div className="relative mt-2 group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 karakter"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-gray-400 hover:text-[#00685F] hover:bg-gray-100/70 transition-all outline-none focus:outline-none focus:ring-0">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Konfirmasi Password</label>
                  <div className="relative mt-2 group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      required
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 transition-all text-sm
                        ${passwordConfirmation && password !== passwordConfirmation ? "border-red-300 focus:border-red-400" : "border-gray-100 focus:border-[#00685F]"}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-gray-400 hover:text-[#00685F] hover:bg-gray-100/70 transition-all outline-none focus:outline-none focus:ring-0">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordConfirmation && password !== passwordConfirmation && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">Password tidak cocok</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || (step === 1 && timeLeft <= 0)}
              className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {step === 1 ? "Verifikasi OTP" : "Reset Password"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {step === 2 ? (
              <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00685F] transition-colors font-medium cursor-pointer">
                <ArrowLeft className="w-3 h-3" />
                Kembali
              </button>
            ) : (
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00685F] transition-colors font-medium">
                <ArrowLeft className="w-3 h-3" />
                Kembali ke Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-4 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

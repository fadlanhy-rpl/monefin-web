"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSent(true);
      toast.success(language === "en" ? "OTP code has been sent to your email!" : "Kode OTP telah dikirim ke email Anda!");
      // Redirect ke reset password setelah 1.5 detik
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } else {
      toast.error(result.error || (language === "en" ? "Failed to send OTP. Make sure your email is registered." : "Gagal mengirim OTP. Pastikan email Anda terdaftar."));
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2f0] via-white to-[#f0faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00685F]/10 border border-[#00685F]/5 p-8 sm:p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00685F] transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00685F]/10 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#00685F]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Lupa Password?</h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Masukkan email akun Anda. Kami akan mengirimkan kode OTP untuk mereset password.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
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
                className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Mengirim OTP...
                  </>
                ) : (
                  <>Kirim Kode OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                OTP dikirim ke <span className="font-bold text-[#00685F]">{email}</span>
              </p>
              <p className="text-xs text-gray-400">Mengarahkan ke halaman reset password...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00685F] transition-colors font-medium">
              <ArrowLeft className="w-3 h-3" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

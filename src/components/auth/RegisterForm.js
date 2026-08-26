"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleUrl, setGoogleUrl] = useState(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/google`);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator?.brave && typeof navigator.brave.isBrave === "function") {
      navigator.brave.isBrave().then((isBrave) => {
        if (isBrave) {
          const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
          setGoogleUrl(`${base}/auth/google?client_browser=Brave`);
        }
      }).catch(() => {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Anda harus menyetujui Syarat dan Ketentuan!");
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, password);

    if (result.success) {
      toast.success("Registrasi berhasil! Silakan cek email Anda untuk kode OTP.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      toast.error(result.error || "Registrasi gagal. Silakan coba lagi.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
      
      <div className="hidden lg:block h-2"></div>
      
      <div className="w-full max-w-md mx-auto my-auto space-y-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00685F] transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t("auth.back_home")}</span>
        </Link>
        <div>
          <h1 className="text-[21px] sm:text-3xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">{t("auth.register_title")}</h1>
          <p className="text-gray-400 mt-2 text-sm">{t("auth.register_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("auth.fullname")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <User className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder={t("auth.fullname_placeholder")} 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("auth.email")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <Mail className="w-5 h-5" />
              </span>
              <input 
                type="email" 
                placeholder={t("auth.email_placeholder")} 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">{t("auth.password")}</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#00685F] transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                id="passwordInput" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-gray-400 hover:text-[#00685F] hover:bg-gray-100/70 transition-all outline-none focus:outline-none focus:ring-0 border-none select-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-[#00685F]" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium ml-1">{t("auth.pwd_min")}</p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <div className="flex items-center h-5">
              <input 
                id="terms" 
                type="checkbox" 
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-200 text-[#00685F] focus:ring-[#00685F] transition-all cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-xs text-gray-500 leading-normal">
              {t("auth.agree_1")} <a href="#" className="text-[#00685F] font-bold hover:underline">{t("auth.agree_2")}</a> {t("auth.agree_3")} <a href="#" className="text-[#00685F] font-bold hover:underline">{t("auth.agree_4")}</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#004D46] transition-all shadow-xl shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                {t("auth.creating_account")}
              </>
            ) : (
              <>{t("auth.register_btn")} <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">{t("auth.or_signup_with")}</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Google Button */}
        <a
          href={googleUrl}
          className="w-full border border-gray-100 py-4 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google Logo" />
          Google
        </a>

        {/* Bottom Link */}
        <p className="text-center text-sm font-medium text-gray-500">
          {t("auth.have_account")} 
          <Link href="/login" className="text-[#00685F] font-bold hover:underline ml-1">{t("auth.sign_in")}</Link>
        </p>
      </div>

      {/* Footer Links */}
      <div className="w-full flex flex-col sm:flex-row justify-center lg:justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-6 border-t border-gray-50 lg:border-t-0">
        <p>{t("auth.copyright")}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-[#00685F] transition-colors">{t("auth.privacy")}</Link>
          <Link href="/terms" className="hover:text-[#00685F] transition-colors">{t("auth.terms")}</Link>
          <Link href="/security" className="hover:text-[#00685F] transition-colors">{t("auth.security")}</Link>
        </div>
      </div>
    </div>
  );
}

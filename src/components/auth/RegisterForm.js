"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Simple, Responsive Password Strength Evaluation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || (/[A-Z]/.test(pwd) && pwd.length >= 10))
      score += 1;

    if (score <= 1) {
      return {
        score: 1,
        label:
          language === "en"
            ? "Weak (min. 8 characters needed)"
            : "Lemah (min. 8 karakter)",
        color: "bg-rose-500",
      };
    }
    if (score === 2) {
      return {
        score: 2,
        label:
          language === "en"
            ? "Moderate (add numbers or symbols)"
            : "Cukup (tambahkan simbol atau angka)",
        color: "bg-amber-500",
      };
    }
    return {
      score: 3,
      label:
        language === "en"
          ? "Strong & secure password"
          : "Sangat kuat & terlindungi",
      color: "bg-emerald-500",
    };
  };

  const pwdStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error(
        language === "en"
          ? "You must agree to the Terms and Conditions!"
          : "Anda harus menyetujui Syarat dan Ketentuan!"
      );
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, password);

    if (result.success) {
      toast.success(
        language === "en"
          ? "Registration successful! Please check your email for the OTP code."
          : "Registrasi berhasil! Silakan cek email Anda untuk kode OTP."
      );
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      toast.error(
        result.error ||
          (language === "en"
            ? "Registration failed. Please try again."
            : "Registrasi gagal. Silakan coba lagi.")
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-[50%] h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white/95 relative z-10">
      {/* Top Navigation Row: Back Link & Language Switcher */}
      <div className="w-full flex items-center justify-between pb-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors group px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 hover:bg-brand-50/60"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-brand-600" />
          <span>{t("auth.back_home")}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Form Center Box */}
      <div className="w-full max-w-[390px] mx-auto my-auto space-y-5 py-3">
        {/* Monolithic Heading */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <img
                src="/images/LogoMonefinWhite.svg"
                alt="MoneFin Logo"
                className="w-4 h-4"
              />
            </div>
            <span className="font-black text-lg text-slate-950">MoneFin</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {t("auth.register_title")}
          </h1>
          <p className="text-slate-500 text-sm font-normal leading-relaxed">
            {t("auth.register_subtitle")}
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 tracking-wide">
              {t("auth.fullname")}
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={t("auth.fullname_placeholder")}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-600 transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 tracking-wide">
              {t("auth.email")}
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder={t("auth.email_placeholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-600 transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Password with Strength Meter */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 tracking-wide">
              {t("auth.password")}
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-600 transition-all text-sm text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-all cursor-pointer"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-brand-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            {/* Clean Password Strength Bar */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1">
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pwdStrength.score >= 1 ? pwdStrength.color : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pwdStrength.score >= 2 ? pwdStrength.color : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pwdStrength.score >= 3 ? pwdStrength.color : "bg-slate-200"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">
                    {pwdStrength.label}
                  </span>
                  {pwdStrength.score === 3 && (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Aman
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-500 leading-normal select-none cursor-pointer"
            >
              {t("auth.agree_1")}{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-brand-600 font-extrabold hover:underline"
              >
                {t("auth.agree_2")}
              </Link>{" "}
              {t("auth.agree_3")}{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-brand-600 font-extrabold hover:underline"
              >
                {t("auth.agree_4")}
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{t("auth.creating_account")}</span>
              </>
            ) : (
              <>
                <span>{t("auth.register_btn")}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {t("auth.or_signup_with")}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google OAuth Button */}
        <a
          href={googleUrl}
          className="w-full border border-slate-200 hover:border-slate-300 py-3 rounded-2xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-2xs group"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-4 h-4 group-hover:scale-105 transition-transform"
            alt="Google Logo"
          />
          <span className="text-sm">Google</span>
        </a>

        {/* Sign In Redirect */}
        <p className="text-center text-xs sm:text-sm font-medium text-slate-500 pt-1">
          {t("auth.have_account")}
          <Link
            href="/login"
            className="text-brand-600 font-black hover:text-brand-700 hover:underline ml-1.5"
          >
            {t("auth.sign_in")}
          </Link>
        </p>
      </div>

      {/* Footer Links & Copyright */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400 font-semibold pt-3 border-t border-slate-100">
        <p>{t("auth.copyright")}</p>
        <div className="flex gap-5">
          <Link
            href="/privacy"
            className="hover:text-brand-600 transition-colors"
          >
            {t("auth.privacy")}
          </Link>
          <Link href="/terms" className="hover:text-brand-600 transition-colors">
            {t("auth.terms")}
          </Link>
          <Link
            href="/security"
            className="hover:text-brand-600 transition-colors"
          >
            {t("auth.security")}
          </Link>
        </div>
      </div>
    </div>
  );
}

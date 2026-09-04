"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Laptop,
  Globe,
  Clock,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleUrl, setGoogleUrl] = useState(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/google`
  );
  const hasAlertTriggered = useRef(false);

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

  useEffect(() => {
    if (typeof window === "undefined" || hasAlertTriggered.current) return;

    const showRevocationAlert = (device, ip, time) => {
      hasAlertTriggered.current = true;
      toast.custom(
        (toastItem) => (
          <div
            className={`transition-all duration-300 ease-out ${
              toastItem.visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            } max-w-sm sm:max-w-md w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl pointer-events-auto border border-amber-200/90 overflow-hidden ring-1 ring-amber-400/20`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
                      {language === "en" ? "Session Revoked" : "Sesi Dikeluarkan"}
                    </span>
                    <button
                      onClick={() => toast.dismiss(toastItem.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 font-medium">
                    {language === "en"
                      ? "Your account was signed out from another session:"
                      : "Akun Anda baru saja dikeluarkan dari sesi lain:"}
                  </p>
                  <div className="mt-2.5 space-y-1.5 bg-slate-50/90 rounded-xl p-3 border border-slate-200/70 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {device ||
                          (language === "en"
                            ? "Unknown Device"
                            : "Perangkat Tidak Diketahui")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        IP:{" "}
                        <span className="font-mono text-slate-700 font-medium">
                          {ip || "-"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{time || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 px-4 py-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800 font-medium">
              <span>
                {language === "en"
                  ? "Please sign in again to continue."
                  : "Silakan masuk kembali untuk melanjutkan."}
              </span>
            </div>
          </div>
        ),
        { id: "session-revoked-alert", duration: 4500 }
      );
    };

    const showGenericExpired = () => {
      hasAlertTriggered.current = true;
      toast(
        language === "en"
          ? "Your session has expired. Please sign in again."
          : "Sesi Anda telah berakhir. Silakan login kembali.",
        {
          id: "session-revoked-alert",
          duration: 4000,
        }
      );
    };

    const storedInfo = sessionStorage.getItem("session_revoked_info");
    if (storedInfo) {
      try {
        const info = JSON.parse(storedInfo);
        sessionStorage.removeItem("session_revoked_info");
        window.history.replaceState({}, document.title, window.location.pathname);

        if (info.device && info.ip && info.time) {
          showRevocationAlert(info.device, info.ip, info.time);
          return;
        } else {
          showGenericExpired();
          return;
        }
      } catch (e) {
        sessionStorage.removeItem("session_revoked_info");
      }
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("message") === "session_expired") {
      const rDevice = params.get("r_device");
      const rIp = params.get("r_ip");
      const rTime = params.get("r_time");
      window.history.replaceState({}, document.title, window.location.pathname);

      if (rDevice && rIp && rTime) {
        showRevocationAlert(rDevice, rIp, rTime);
      } else {
        showGenericExpired();
      }
    }
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      toast.success(
        language === "en"
          ? "Sign in successful! Welcome back."
          : "Login berhasil! Selamat datang kembali.",
        { id: "auth-login-toast" }
      );
      router.push("/dashboard");
    } else if (result.require2fa) {
      toast(
        language === "en"
          ? "Two-factor authentication required. Please check your email."
          : "Verifikasi dua faktor diperlukan. Silakan cek email Anda.",
        { id: "auth-login-toast" }
      );
      router.push(`/verify-2fa?email=${encodeURIComponent(result.email)}`);
    } else if (result.requireVerification) {
      toast(
        language === "en"
          ? "Email is not verified yet. Please check your email inbox."
          : "Email belum diverifikasi. Silakan cek inbox email Anda.",
        { id: "auth-login-toast" }
      );
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } else {
      toast.error(
        result.error ||
          (language === "en"
            ? "Sign in failed. Check your email and password."
            : "Login gagal. Periksa email dan password Anda."),
        { id: "auth-login-toast" }
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-[50%] h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white/95 relative z-10">
      {/* Top Navigation Row: Back Link & Language Switcher */}
      <div className="w-full flex items-center justify-between pb-4">
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
      <div className="w-full max-w-[380px] mx-auto my-auto space-y-6 py-4">
        {/* Monolithic Heading */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 lg:hidden mb-3">
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
            {t("auth.login_title")}
          </h1>
          <p className="text-slate-500 text-sm font-normal leading-relaxed">
            {t("auth.login_subtitle")}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 tracking-wide">
                {t("auth.password")}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                {t("auth.forgot_password")}
              </Link>
            </div>
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
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-600">
                {t("auth.remember_me")}
              </span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{t("auth.signing_in")}</span>
              </>
            ) : (
              <>
                <span>{t("auth.login_btn")}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {t("auth.or_continue")}
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
            alt="Google"
          />
          <span className="text-sm">Google</span>
        </a>

        {/* Sign Up Redirect */}
        <p className="text-center text-xs sm:text-sm font-medium text-slate-500 pt-1">
          {t("auth.no_account")}
          <Link
            href="/register"
            className="text-brand-600 font-black hover:text-brand-700 hover:underline ml-1.5"
          >
            {t("auth.sign_up")}
          </Link>
        </p>
      </div>

      {/* Footer Links & Copyright */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400 font-semibold pt-4 border-t border-slate-100">
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

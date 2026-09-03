"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert, Laptop, Globe, Clock, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleUrl, setGoogleUrl] = useState(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/google`);
  const hasAlertTriggered = useRef(false);

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

  useEffect(() => {
    if (typeof window === "undefined" || hasAlertTriggered.current) return;

    const showRevocationAlert = (device, ip, time) => {
      hasAlertTriggered.current = true;
      toast.custom(
        (t) => (
          <div
            className={`transition-all duration-300 ease-out ${
              t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
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
                      onClick={() => toast.dismiss(t.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
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
                      <span className="truncate">{device || (language === "en" ? "Unknown Device" : "Perangkat Tidak Diketahui")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>IP: <span className="font-mono text-slate-700 font-medium">{ip || "-"}</span></span>
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
              <span>{language === "en" ? "Please sign in again to continue." : "Silakan masuk kembali untuk melanjutkan."}</span>
            </div>
          </div>
        ),
        { id: "session-revoked-alert", duration: 4500 }
      );
    };

    const showGenericExpired = () => {
      hasAlertTriggered.current = true;
      toast(language === "en" ? "Your session has expired. Please sign in again." : "Sesi Anda telah berakhir. Silakan login kembali.", {
        id: "session-revoked-alert",
        duration: 4000,
      });
    };

    // 1. Prioritas utama: Cek dari sessionStorage
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

    // 2. Fallback: Cek dari URL search params
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
        language === "en" ? "Sign in successful! Welcome back." : "Login berhasil! Selamat datang kembali.",
        { id: "auth-login-toast" }
      );
      router.push("/dashboard");
    } else if (result.require2fa) {
      toast(
        language === "en" ? "Two-factor authentication required. Please check your email." : "Verifikasi dua faktor diperlukan. Silakan cek email Anda.",
        { id: "auth-login-toast" }
      );
      router.push(`/verify-2fa?email=${encodeURIComponent(result.email)}`);
    } else if (result.requireVerification) {
      toast(
        language === "en" ? "Email is not verified yet. Please check your email inbox." : "Email belum diverifikasi. Silakan cek inbox email Anda.",
        { id: "auth-login-toast" }
      );
      router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } else {
      toast.error(
        result.error || (language === "en" ? "Sign in failed. Check your email and password." : "Login gagal. Periksa email dan password Anda."),
        { id: "auth-login-toast" }
      );
    }


    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-[45%] h-screen overflow-y-auto flex flex-col justify-between p-6 xl:p-8 bg-white">
      
      <div className="hidden lg:block h-2"></div>
      
      <div className="w-full max-w-[360px] mx-auto my-auto space-y-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00685F] transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{t("auth.back_home")}</span>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t("auth.login_title")}</h1>
          <p className="text-gray-400 mt-2 text-sm">{t("auth.login_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t("auth.email")}</label>
            <div className="relative mt-1.5 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
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

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t("auth.password")}</label>
            <div className="relative mt-1.5 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 group-focus-within:text-[#00685F] transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-200 text-[#00685F] focus:ring-[#00685F]"
              />
              <span className="text-xs font-semibold text-gray-500">{t("auth.remember_me")}</span>
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-[#00685F] hover:underline">{t("auth.forgot_password")}</Link>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00685F] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all shadow-lg shadow-[#00685F]/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                {t("auth.signing_in")}
              </>
            ) : (
              <>{t("auth.login_btn")} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-black uppercase tracking-widest">{t("auth.or_continue")}</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <a
          href={googleUrl}
          className="w-full border border-gray-100 py-3.5 rounded-2xl font-bold text-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="text-sm">Google</span>
        </a>

        <p className="text-center text-sm font-medium text-gray-400">
          {t("auth.no_account")} 
          <Link href="/register" className="text-[#00685F] font-bold hover:underline ml-1">{t("auth.sign_up")}</Link>
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

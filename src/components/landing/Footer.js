import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export const Footer = ({ isLoggedIn }) => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  return (
    <footer className="relative z-10 bg-[#eaf4f2] text-slate-600 py-8 sm:py-10 border-t border-slate-200/80 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-4 text-center lg:text-left">
        <div className="flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-600 p-0.5 flex items-center justify-center shadow-sm shrink-0">
            <img src="/images/logo-monefin-white.svg" alt="MoneFin — Platform Manajemen Keuangan Pribadi Gratis" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight">MoneFin</span>
          <span className="text-slate-500 font-medium ml-1">© 2026 MoneFin. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-end gap-3 xl:gap-4 font-semibold text-slate-600 whitespace-nowrap">
          <Link href="/#features" className="hover:text-brand-600 transition-colors">{t("nav.features")}</Link>
          <Link href="/#simulator" className="hover:text-brand-600 transition-colors">{t("nav.simulator")}</Link>
          <Link href="/#comparison" className="hover:text-brand-600 transition-colors">{t("nav.comparison")}</Link>
          <Link href="/#testimonials" className="hover:text-brand-600 transition-colors">{t("nav.testimonials")}</Link>
          <Link href="/#faq" className="hover:text-brand-600 transition-colors">{t("nav.faq")}</Link>
          <Link href="/download" className="text-brand-700 hover:text-brand-800 font-bold transition-colors">
            {isEn ? "Download App" : "Unduh Aplikasi"}
          </Link>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-brand-600 transition-colors">{t("auth.terms") || "Terms"}</Link>
          <Link href="/privacy" className="hover:text-brand-600 transition-colors">{t("auth.privacy") || "Privacy"}</Link>
          <Link href="/security" className="hover:text-brand-600 transition-colors">{t("auth.security") || "Security"}</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="hover:text-brand-600 transition-colors text-brand-600 font-bold">{t("nav.dashboard")}</Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-600 transition-colors">{t("nav.login")}</Link>
              <Link href="/register" className="hover:text-brand-600 transition-colors text-brand-700 font-bold">{t("nav.register")}</Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

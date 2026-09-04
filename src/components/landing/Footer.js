import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export const Footer = ({ isLoggedIn }) => {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 bg-[#eaf4f2] text-slate-600 py-8 sm:py-10 border-t border-slate-200/80 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
        
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-600 p-0.5 flex items-center justify-center shadow-sm shrink-0">
            <img src="/images/LogoMonefinWhite.svg" alt="MoneFin Logo" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight">MoneFin</span>
          <span className="text-slate-500 font-medium ml-1">© 2026 MoneFin. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 font-semibold text-slate-600">
          <a href="#features" className="hover:text-brand-600 transition-colors">{t("nav.features")}</a>
          <a href="#simulator" className="hover:text-brand-600 transition-colors">{t("nav.simulator")}</a>
          <a href="#comparison" className="hover:text-brand-600 transition-colors">{t("nav.comparison")}</a>
          <a href="#testimonials" className="hover:text-brand-600 transition-colors">{t("nav.testimonials")}</a>
          <a href="#faq" className="hover:text-brand-600 transition-colors">{t("nav.faq")}</a>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-brand-600 transition-colors">{t("auth.terms") || "Terms"}</Link>
          <Link href="/privacy" className="hover:text-brand-600 transition-colors">{t("auth.privacy") || "Privacy"}</Link>
          <Link href="/security" className="hover:text-brand-600 transition-colors">{t("auth.security") || "Security"}</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="hover:text-brand-600 transition-colors text-brand-600 font-bold">{t("nav.dashboard")}</Link>
          ) : (
            <Link href="/login" className="hover:text-brand-600 transition-colors">{t("nav.login")}</Link>
          )}
        </div>

      </div>
    </footer>
  );
};

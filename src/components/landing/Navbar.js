"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CatalisButton } from "../ui/CatalisButton";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";

export const Navbar = ({ isLoggedIn }) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-2 sm:top-4 inset-x-0 z-50 px-2 sm:px-4 max-w-7xl mx-auto pointer-events-none">
      <nav
        className={`pointer-events-auto rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10"
            : "bg-white/50 backdrop-blur-xl border border-white/60 shadow-sm hover:bg-white/80"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-brand-600 p-0.5 shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            <img src="/images/LogoMonefinWhite.svg" alt="MoneFin Logo" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-black text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
            MoneFin
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-slate-800">
          <a href="#features" className="hover:text-brand-600 transition-colors">{t("nav.features")}</a>
          <a href="#simulator" className="hover:text-brand-600 transition-colors">{t("nav.simulator")}</a>
          <a href="#comparison" className="hover:text-brand-600 transition-colors">{t("nav.comparison")}</a>
          <a href="#testimonials" className="hover:text-brand-600 transition-colors">{t("nav.testimonials")}</a>
          <a href="#faq" className="hover:text-brand-600 transition-colors">{t("nav.faq")}</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <CatalisButton href="/dashboard" variant="primary">
              <span>{t("nav.dashboard")}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </CatalisButton>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-800 hover:text-brand-600 px-3.5 py-2 rounded-full transition-colors"
              >
                {t("nav.login")}
              </Link>
              <CatalisButton href="/register" variant="primary">
                <span>{t("nav.register")}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </CatalisButton>
            </>
          )}
        </div>

        {/* Mobile Right Actions & Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-xs font-extrabold text-slate-800 hover:text-brand-600 px-2.5 py-1.5 rounded-full border border-slate-200/80 bg-white/80"
            >
              {t("nav.login")}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800 hover:text-slate-900 rounded-full hover:bg-white/80 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3 animate-popIn text-xs sm:text-sm">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-1.5 border-b border-slate-100">{t("nav.features")}</a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-1.5 border-b border-slate-100">{t("nav.simulator")}</a>
          <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-1.5 border-b border-slate-100">{t("nav.comparison")}</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-1.5 border-b border-slate-100">{t("nav.testimonials")}</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 font-bold py-1.5">{t("nav.faq")}</a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full text-center py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs">
                {t("nav.dashboard_mobile")}
              </Link>
            ) : (
              <Link href="/register" className="w-full text-center py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs shadow-md">
                {t("nav.register_mobile")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

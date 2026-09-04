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
      const scrolled = window.scrollY > 40;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-7 text-xs xl:text-sm font-bold text-slate-800">
          <a href="#features" className="hover:text-brand-600 transition-colors whitespace-nowrap">{t("nav.features")}</a>
          <a href="#simulator" className="hover:text-brand-600 transition-colors whitespace-nowrap">{t("nav.simulator")}</a>
          <a href="#comparison" className="hover:text-brand-600 transition-colors whitespace-nowrap">{t("nav.comparison")}</a>
          <a href="#testimonials" className="hover:text-brand-600 transition-colors whitespace-nowrap">{t("nav.testimonials")}</a>
          <a href="#faq" className="hover:text-brand-600 transition-colors whitespace-nowrap">{t("nav.faq")}</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <CatalisButton href="/dashboard" variant="primary" size="sm">
              <span className="whitespace-nowrap">{t("nav.dashboard")}</span>
            </CatalisButton>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs xl:text-sm font-bold text-slate-800 hover:text-brand-600 px-2.5 xl:px-3.5 py-2 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                {t("nav.login")}
              </Link>
              <CatalisButton href="/register" variant="primary" size="sm">
                <span className="whitespace-nowrap">{t("nav.register")}</span>
              </CatalisButton>
            </>
          )}
        </div>

        {/* Mobile / Tablet Right Actions & Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:hidden">
          <LanguageSwitcher />
          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-xs font-extrabold text-slate-800 hover:text-brand-600 px-3 py-1.5 rounded-full border border-slate-200/80 bg-white/80 transition-colors whitespace-nowrap"
            >
              {t("nav.login")}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 text-slate-800 hover:text-slate-900 rounded-full hover:bg-white/80 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 animate-popIn text-sm">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 hover:text-brand-600 font-bold py-2 border-b border-slate-100 transition-colors">{t("nav.features")}</a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 hover:text-brand-600 font-bold py-2 border-b border-slate-100 transition-colors">{t("nav.simulator")}</a>
          <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 hover:text-brand-600 font-bold py-2 border-b border-slate-100 transition-colors">{t("nav.comparison")}</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 hover:text-brand-600 font-bold py-2 border-b border-slate-100 transition-colors">{t("nav.testimonials")}</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-800 hover:text-brand-600 font-bold py-2 transition-colors">{t("nav.faq")}</a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full text-center py-3 rounded-full bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors">
                {t("nav.dashboard_mobile")}
              </Link>
            ) : (
              <Link href="/register" className="w-full text-center py-3 rounded-full bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors">
                {t("nav.register_mobile")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

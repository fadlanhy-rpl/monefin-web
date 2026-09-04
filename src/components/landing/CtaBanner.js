"use client";

import { CatalisButton } from "../ui/CatalisButton";
import { useLanguage } from "../../context/LanguageContext";
import { ShieldCheck, Zap, Sparkles, Lock, ArrowRight } from "lucide-react";

export const CtaBanner = ({ isLoggedIn }) => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-[#f0faf8] to-[#eaf4f2] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-[#061715] via-[#00453F] to-[#042824] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-14 md:p-18 text-center text-white space-y-6 shadow-2xl relative overflow-hidden border-2 border-emerald-500/30">
          
          {/* Ambient Radiant Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-300/25 blur-3xl pointer-events-none" />
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-topo-pattern opacity-15 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("cta.badge")}</span>
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {t("cta.title")}
            </h2>

            <p className="text-emerald-100/90 text-xs sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <CatalisButton
                href={isLoggedIn ? "/dashboard" : "/register"}
                variant="primary"
                className="w-full sm:w-auto px-9 py-4 text-sm sm:text-base font-black shadow-xl shadow-emerald-950/40 ring-2 ring-emerald-400/30"
              >
                <span>{isLoggedIn ? t("cta.btn_loggedin") : t("cta.btn")}</span>
              </CatalisButton>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-200/90 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isEn ? "100% Free Forever" : "100% Gratis Selamanya"}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                {isEn ? "256-Bit Bank-Grade Encryption" : "Enkripsi Bank-Grade 256-Bit"}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                {isEn ? "No Credit Card Required" : "Tanpa Kartu Kredit"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

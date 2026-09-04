"use client";

import { X, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Comparison = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <section
      id="comparison"
      className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#f4faf9] to-white border-b border-brand-200/40 overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {t("comparison.title")}
          </h2>
        </div>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card 1: Old / Manual Method */}
          <div className="bg-slate-50 border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <X className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {t("comparison.old_title")}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t("comparison.old_sub")}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-200/80 w-full" />

              <ul className="space-y-4 text-xs sm:text-sm font-medium text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.old_1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.old_2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.old_3")}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isEn ? "Conventional Method" : "Metode Konvensional"}
              </span>
            </div>
          </div>

          {/* Card 2: MoneFin System */}
          <div className="bg-white border-2 border-brand-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-brand-900/10 relative flex flex-col justify-between ring-2 ring-brand-500/20">
            <span className="absolute -top-3.5 right-6 bg-brand-600 text-white text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              {t("comparison.new_badge")}
            </span>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-brand-600/30">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {t("comparison.new_title")}
                  </h3>
                  <p className="text-xs text-brand-700 font-bold">
                    {t("comparison.new_sub")}
                  </p>
                </div>
              </div>

              <div className="h-px bg-brand-100 w-full" />

              <ul className="space-y-4 text-xs sm:text-sm font-bold text-slate-800">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.new_1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.new_2")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t("comparison.new_3")}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="inline-block text-xs font-black text-brand-700 uppercase tracking-wider">
                {isEn ? "MoneFin Smart Ecosystem • 100% Free" : "MoneFin Smart Ecosystem • 100% Gratis"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

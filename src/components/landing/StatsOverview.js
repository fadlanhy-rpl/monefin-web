"use client";

import { useLanguage } from "../../context/LanguageContext";

export const StatsOverview = () => {
  const { t } = useLanguage();
  return (
    <section className="relative z-10 py-10 sm:py-16 bg-gradient-to-b from-white via-[#f0faf8] to-[#f4faf9] border-b border-brand-100/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div className="space-y-1 p-2">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">80%</p>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-600">{t("stats.efficiency")}</p>
          </div>
          <div className="space-y-1 p-2">
            <p className="text-2xl sm:text-4xl font-black text-brand-600 tracking-tight">Rp 120M+</p>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-600">{t("stats.managed")}</p>
          </div>
          <div className="space-y-1 p-2">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">99.8%</p>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-600">{t("stats.accuracy")}</p>
          </div>
          <div className="space-y-1 p-2">
            <p className="text-2xl sm:text-4xl font-black text-emerald-600 tracking-tight">100%</p>
            <p className="text-[11px] sm:text-sm font-semibold text-slate-600">{t("stats.free")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

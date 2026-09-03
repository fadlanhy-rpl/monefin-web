"use client";

import { X, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Comparison = () => {
  const { t } = useLanguage();

  return (
    <section id="comparison" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-[#f4faf9] via-[#e6f3f0]/50 to-white border-b border-brand-200/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{t("comparison.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-snug">
            {t("comparison.title")} <em className="catalis-heading-italic text-brand-600">{t("comparison.title_em")}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Old Method */}
          <div className="catalis-card bg-white/90 border border-slate-200 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-lg">{t("comparison.old_title")}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500">{t("comparison.old_sub")}</p>
              </div>
            </div>

            <ul className="space-y-3 text-[11px] sm:text-xs font-semibold text-slate-600">
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>{t("comparison.old_1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>{t("comparison.old_2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>{t("comparison.old_3")}</span>
              </li>
            </ul>
          </div>

          {/* Card 2: MoneFin System */}
          <div className="catalis-card bg-gradient-to-br from-brand-50 via-white to-emerald-50 border-2 border-brand-300 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-4 shadow-xl relative">
            <span className="absolute -top-3 right-6 bg-brand-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
              {t("comparison.new_badge")}
            </span>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-lg">{t("comparison.new_title")}</h3>
                <p className="text-[10px] sm:text-xs text-brand-700 font-semibold">{t("comparison.new_sub")}</p>
              </div>
            </div>

            <ul className="space-y-3 text-[11px] sm:text-xs font-semibold text-slate-700">
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{t("comparison.new_1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{t("comparison.new_2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{t("comparison.new_3")}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

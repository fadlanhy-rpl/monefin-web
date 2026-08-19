"use client";

import { useState } from "react";
import { CatalisButton } from "../ui/CatalisButton";
import { useLanguage } from "../../context/LanguageContext";

export const WealthSimulator = ({ isLoggedIn }) => {
  const { t } = useLanguage();
  const [monthlySavings, setMonthlySavings] = useState(2500000);
  const [timeHorizon, setTimeHorizon] = useState(5);
  const [returnRate, setReturnRate] = useState(9);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Calculate Wealth Projection
  const months = timeHorizon * 12;
  const monthlyRate = returnRate / 100 / 12;

  const totalFutureWealth = Math.round(
    monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );

  const totalSavedWithoutInterest = monthlySavings * months;
  const totalGrowth = Math.max(0, totalFutureWealth - totalSavedWithoutInterest);
  const growthPercentage = Math.round((totalGrowth / totalSavedWithoutInterest) * 100);

  return (
    <section id="simulator" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#f0f7f5] to-[#f4faf9] border-b border-brand-200/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{t("simulator.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-snug">
            {t("simulator.title_prefix")} <span className="text-brand-600 font-extrabold">{timeHorizon} {t("simulator.title_em")}</span> {t("simulator.title_suffix")}
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto">
            {t("simulator.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          {/* Slider Controls Column */}
          <div className="lg:col-span-6 catalis-card bg-white border border-slate-200/90 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 space-y-6 shadow-md">
            
            {/* Slider 1: Monthly Savings */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-slate-700 font-bold">{t("simulator.label_savings")}</label>
                <span className="text-brand-600 font-black text-xs sm:text-base">{formatRupiah(monthlySavings)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="500000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            {/* Slider 2: Time Horizon */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-slate-700 font-bold">{t("simulator.label_time")}</label>
                <span className="text-brand-600 font-black text-xs sm:text-base">{timeHorizon} {t("simulator.label_year")}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            {/* Slider 3: Expected Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-slate-700 font-bold">{t("simulator.label_return")}</label>
                <span className="text-brand-600 font-black text-xs sm:text-base">{returnRate}% {t("simulator.label_per_year")}</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

          </div>

          {/* Projection Display Column */}
          <div className="lg:col-span-6">
            <div className="section-dark-emerald catalis-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden border border-white/10">
              
              <div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-200">
                  {t("simulator.box_proj")}
                </span>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-1 tracking-tight break-all">
                  {formatRupiah(totalFutureWealth)}
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-200 mt-1 font-medium">
                  {t("simulator.box_est").replace("{timeHorizon}", timeHorizon)}
                </p>
              </div>

              {/* Growth Percentage Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] sm:text-xs font-bold shadow-xs">
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <span>{t("simulator.box_growth")} +{formatRupiah(totalGrowth)} (+{growthPercentage}%)</span>
              </div>

              <div className="pt-2">
                <CatalisButton href={isLoggedIn ? "/dashboard" : "/register"} variant="primary" className="w-full text-center">
                  <span>{t("simulator.box_btn")}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </CatalisButton>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

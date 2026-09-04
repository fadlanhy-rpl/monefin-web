"use client";

import { useState } from "react";
import { CatalisButton } from "../ui/CatalisButton";
import { useLanguage } from "../../context/LanguageContext";
import { TrendingUp, Sparkles, Shield, ArrowUpRight } from "lucide-react";

export const WealthSimulator = ({ isLoggedIn }) => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
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
  const growthPercentage = Math.round(
    (totalGrowth / totalSavedWithoutInterest) * 100
  );

  // Determine Milestone
  const getMilestone = () => {
    if (totalFutureWealth >= 300000000) {
      return t("simulator.milestone_property");
    }
    if (totalFutureWealth >= 100000000) {
      return t("simulator.milestone_emergency");
    }
    return t("simulator.milestone_foundation");
  };

  const savingsPresets = [
    { label: isEn ? "1M" : "1 Jt", value: 1000000 },
    { label: isEn ? "2.5M" : "2.5 Jt", value: 2500000 },
    { label: isEn ? "5M" : "5 Jt", value: 5000000 },
    { label: isEn ? "10M" : "10 Jt", value: 10000000 },
  ];

  const yearPresets = [3, 5, 10, 15];

  const ratePresets = [
    { label: isEn ? "6% Deposits" : "6% Deposito", value: 6 },
    { label: isEn ? "9% Bonds" : "9% Obligasi", value: 9 },
    { label: isEn ? "12% Stocks" : "12% Saham", value: 12 },
  ];

  const cashRatio = Math.min(
    100,
    Math.round((totalSavedWithoutInterest / totalFutureWealth) * 100)
  );
  const growthRatio = 100 - cashRatio;

  return (
    <section
      id="simulator"
      className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#f0f7f5] to-white border-b border-brand-200/40 overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {t("simulator.title")}
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("simulator.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Slider Controls Column */}
          <div className="lg:col-span-6 bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl shadow-slate-900/5 flex flex-col justify-between">
            
            {/* Slider 1: Monthly Savings */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                <label className="text-slate-800">{t("simulator.label_savings")}</label>
                <span className="text-brand-600 font-black text-sm sm:text-base tabular-nums">
                  {formatRupiah(monthlySavings)}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="500000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {savingsPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setMonthlySavings(preset.value)}
                    className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      monthlySavings === preset.value
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Rp {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Time Horizon */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                <label className="text-slate-800">{t("simulator.label_time")}</label>
                <span className="text-brand-600 font-black text-sm sm:text-base tabular-nums">
                  {timeHorizon} {t("simulator.label_year")}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {yearPresets.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTimeHorizon(yr)}
                    className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      timeHorizon === yr
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {yr} {t("simulator.label_year")}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 3: Return Rate */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                <label className="text-slate-800">{t("simulator.label_return")}</label>
                <span className="text-emerald-700 font-black text-sm sm:text-base tabular-nums">
                  {returnRate}% {t("simulator.label_per_year")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ratePresets.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReturnRate(r.value)}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-center ${
                      returnRate === r.value
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500/30"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Projection Visualizer Card (Finmax Dark Emerald Style) */}
          <div className="lg:col-span-6 bg-[#071613] text-white border border-emerald-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Ambient Background Aura inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Milestone Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{getMilestone()}</span>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                  {t("simulator.box_proj")}
                </p>
                <h3 className="text-3xl sm:text-5xl font-black text-emerald-400 tabular-nums tracking-tight pt-1">
                  {formatRupiah(totalFutureWealth)}
                </h3>
                <p className="text-xs text-slate-400 pt-1">
                  {isEn ? "Estimated projection over " : "Estimasi hasil dalam kurun waktu "}
                  <span className="text-white font-bold">
                    {timeHorizon} {isEn ? "Years" : "Tahun"}
                  </span>
                </p>
              </div>

              {/* Comparison Visualizer: Cash vs Compound Growth */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                  <span>{isEn ? "Principal Savings" : "Pokok Tabungan"} ({cashRatio}%)</span>
                  <span className="text-emerald-400">{isEn ? "Compound Interest" : "Bunga Majemuk"} ({growthRatio}%)</span>
                </div>

                <div className="w-full h-3 rounded-full overflow-hidden flex bg-white/10">
                  <div
                    className="bg-slate-400 h-full transition-all duration-300"
                    style={{ width: `${cashRatio}%` }}
                  />
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${growthRatio}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-slate-400">{isEn ? "Principal Saved:" : "Tabungan Pokok:"}</p>
                    <p className="font-bold text-white tabular-nums">
                      {formatRupiah(totalSavedWithoutInterest)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-[10px] text-emerald-300 font-bold">{isEn ? "Investment Returns:" : "Imbal Hasil:"}</p>
                    <p className="font-black text-emerald-400 tabular-nums">
                      +{formatRupiah(totalGrowth)} (+{growthPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 relative z-10">
              <CatalisButton
                href={isLoggedIn ? "/dashboard" : "/register"}
                variant="primary"
                className="w-full py-3.5 text-sm font-extrabold shadow-lg shadow-emerald-950/40"
              >
                <span>{t("simulator.box_btn")}</span>
              </CatalisButton>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

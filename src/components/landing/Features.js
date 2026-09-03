"use client";

import { useState } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Features = () => {
  const { t } = useLanguage();
  const [activeFeatureTab, setActiveFeatureTab] = useState("budgeting");
  const [simulatedIncome, setSimulatedIncome] = useState(7500000);
  const [aiInsightPrompt, setAiInsightPrompt] = useState("analisis");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <section id="features" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-[#f4faf9] via-[#e6f3f0]/40 to-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{t("features.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-snug">
            {t("features.title_prefix")} <em className="catalis-heading-italic text-brand-600">{t("features.title_em")}</em>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto mb-8 sm:mb-12 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md text-xs">
          <button
            onClick={() => setActiveFeatureTab("budgeting")}
            className={`px-3 py-2.5 rounded-xl font-bold text-[11px] sm:text-sm transition-all cursor-pointer ${
              activeFeatureTab === "budgeting"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
            }`}
          >
            {t("features.tab1")}
          </button>
          <button
            onClick={() => setActiveFeatureTab("accounts")}
            className={`px-3 py-2.5 rounded-xl font-bold text-[11px] sm:text-sm transition-all cursor-pointer ${
              activeFeatureTab === "accounts"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
            }`}
          >
            {t("features.tab2")}
          </button>
          <button
            onClick={() => setActiveFeatureTab("ai")}
            className={`px-3 py-2.5 rounded-xl font-bold text-[11px] sm:text-sm transition-all cursor-pointer ${
              activeFeatureTab === "ai"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
            }`}
          >
            {t("features.tab3")}
          </button>
          <button
            onClick={() => setActiveFeatureTab("goals")}
            className={`px-3 py-2.5 rounded-xl font-bold text-[11px] sm:text-sm transition-all cursor-pointer ${
              activeFeatureTab === "goals"
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
            }`}
          >
            {t("features.tab4")}
          </button>
        </div>

        {/* TAB CONTENT 1: AUTO BUDGETING 50/30/20 */}
        {activeFeatureTab === "budgeting" && (
          <div className="catalis-card bg-white border border-slate-200/90 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="inline-block text-[10px] sm:text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {t("features.t1_badge")}
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                {t("features.t1_title")}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t1_desc")}
              </p>

              {/* Interactive Slider Input */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t("features.t1_slider_label")}:</span>
                  <span className="text-brand-600 text-sm sm:text-base font-black">{formatRupiah(simulatedIncome)}</span>
                </div>
                <input
                  type="range"
                  min="3000000"
                  max="25000000"
                  step="500000"
                  value={simulatedIncome}
                  onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            </div>

            {/* Interactive Budget Breakdown Display */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              {/* Category 1: Needs (50%) */}
              <div className="bg-slate-50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0" />
                    {t("features.t1_cat1")}
                  </span>
                  <span className="text-slate-900 font-black text-[11px] sm:text-xs">{formatRupiah(simulatedIncome * 0.5)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full transition-all duration-300" style={{ width: "50%" }} />
                </div>
                <p className="text-[10px] text-slate-500">{t("features.t1_cat1_desc")}</p>
              </div>

              {/* Category 2: Wants (30%) */}
              <div className="bg-slate-50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    {t("features.t1_cat2")}
                  </span>
                  <span className="text-slate-900 font-black text-[11px] sm:text-xs">{formatRupiah(simulatedIncome * 0.3)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: "30%" }} />
                </div>
                <p className="text-[10px] text-slate-500">{t("features.t1_cat2_desc")}</p>
              </div>

              {/* Category 3: Savings (20%) */}
              <div className="bg-slate-50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                    {t("features.t1_cat3")}
                  </span>
                  <span className="text-slate-900 font-black text-[11px] sm:text-xs">{formatRupiah(simulatedIncome * 0.2)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: "20%" }} />
                </div>
                <p className="text-[10px] text-slate-500">{t("features.t1_cat3_desc")}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: AGREGASI MULTI-REKENING */}
        {activeFeatureTab === "accounts" && (
          <div className="catalis-card bg-white border border-slate-200/90 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="inline-block text-[10px] sm:text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {t("features.t2_badge")}
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                {t("features.t2_title")}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t2_desc")}
              </p>
            </div>

            <div className="lg:col-span-6 space-y-2.5">
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px] shrink-0">
                    BCA
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">BCA Tabungan Utama</p>
                    <p className="text-[10px] text-slate-500">{t("features.t2_balance_label")}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">Rp 28.500.000</span>
              </div>

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-black flex items-center justify-center text-[10px] shrink-0">
                    GOPAY
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">GoPay E-Wallet</p>
                    <p className="text-[10px] text-slate-500">{t("features.t2_balance_label")}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">Rp 4.250.000</span>
              </div>

              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-black flex items-center justify-center text-[10px] shrink-0">
                    MNDR
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Mandiri Dana Darurat</p>
                    <p className="text-[10px] text-slate-500">{t("features.t2_balance_label")}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">Rp 16.000.000</span>
              </div>

              <div className="p-3.5 bg-brand-600 text-white rounded-xl shadow-lg flex justify-between items-center text-xs">
                <span className="font-extrabold uppercase tracking-wider text-[10px] sm:text-xs">Total Net Worth</span>
                <span className="font-black text-sm sm:text-base">Rp 48.750.000</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: SMART AI INSIGHTS */}
        {activeFeatureTab === "ai" && (
          <div className="catalis-card bg-white border border-slate-200/90 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="inline-block text-[10px] sm:text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {t("features.t3_badge")}
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                {t("features.t3_title")}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t3_desc")}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsGeneratingAi(true);
                    setAiInsightPrompt("analisis");
                    setTimeout(() => setIsGeneratingAi(false), 800);
                  }}
                  className={`px-3 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                    aiInsightPrompt === "analisis"
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t("features.t3_btn1")}
                </button>
                <button
                  onClick={() => {
                    setIsGeneratingAi(true);
                    setAiInsightPrompt("investasi");
                    setTimeout(() => setIsGeneratingAi(false), 800);
                  }}
                  className={`px-3 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                    aiInsightPrompt === "investasi"
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t("features.t3_btn2")}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3 shadow-2xl relative overflow-hidden text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-[11px] text-brand-300">MoneFin AI Advisor</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">Active Analysis</span>
                </div>

                {isGeneratingAi ? (
                  <div className="py-6 text-center space-y-2">
                    <span className="w-6 h-6 border-2 border-brand-400 border-t-white rounded-full animate-spin inline-block" />
                    <p className="text-[11px] text-slate-300 font-semibold">{t("features.t3_loading")}</p>
                  </div>
                ) : aiInsightPrompt === "analisis" ? (
                  <div className="space-y-2.5 leading-relaxed text-slate-300 text-[11px] sm:text-xs">
                    <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{t("features.t3_a1_title")}</span>
                    </p>
                    <p>
                      {t("features.t3_a1_desc")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 leading-relaxed text-slate-300 text-[11px] sm:text-xs">
                    <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>{t("features.t3_a2_title")}</span>
                    </p>
                    <p>
                      {t("features.t3_a2_desc")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: TARGET IMPIAN TRACKER */}
        {activeFeatureTab === "goals" && (
          <div className="catalis-card bg-white border border-slate-200/90 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="inline-block text-[10px] sm:text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {t("features.t4_badge")}
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                {t("features.t4_title")}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t4_desc")}
              </p>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <svg className="w-16 h-16 text-brand-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">DP Rumah Impian</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t("features.t4_target")}: Dec 2026</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    65%
                  </span>
                </div>
                
                <div className="space-y-1.5 relative z-10 pt-1">
                  <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: "65%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Rp 65.000.000</span>
                    <span>Rp 100.000.000</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Dana Liburan Jepang</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t("features.t4_target")}: Sep 2026</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    25%
                  </span>
                </div>
                
                <div className="space-y-1.5 relative z-10 pt-1">
                  <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: "25%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Rp 5.000.000</span>
                    <span>Rp 20.000.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

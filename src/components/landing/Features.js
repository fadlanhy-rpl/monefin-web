"use client";

import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Wallet,
  Sparkles,
  Target,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Zap,
} from "lucide-react";

export const Features = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [activeFeatureTab, setActiveFeatureTab] = useState("budgeting");
  const [simulatedIncome, setSimulatedIncome] = useState(10000000);
  const [activePrompt, setActivePrompt] = useState("coffee");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("emergency");
  const [selectedAccount, setSelectedAccount] = useState("bca");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handlePromptClick = (key) => {
    setIsGeneratingAi(true);
    setActivePrompt(key);
    setTimeout(() => setIsGeneratingAi(false), 280);
  };

  const goalsData = {
    emergency: {
      title: t("features.t4_goal1"),
      target: 48000000,
      current: 36000000,
      monthly: 2000000,
      color: "text-emerald-600",
      bg: "bg-emerald-500",
    },
    house: {
      title: t("features.t4_goal2"),
      target: 120000000,
      current: 48000000,
      monthly: 3500000,
      color: "text-brand-600",
      bg: "bg-brand-600",
    },
    vacation: {
      title: t("features.t4_goal3"),
      target: 25000000,
      current: 20000000,
      monthly: 1500000,
      color: "text-amber-600",
      bg: "bg-amber-500",
    },
  };

  const activeGoal = goalsData[selectedGoal] || goalsData.emergency;
  const goalPercent = Math.min(
    100,
    Math.round((activeGoal.current / activeGoal.target) * 100)
  );
  const remainingMonths = Math.max(
    1,
    Math.ceil((activeGoal.target - activeGoal.current) / activeGoal.monthly)
  );

  return (
    <section
      id="features"
      className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#f0f7f5] to-white border-b border-slate-200/80 overflow-hidden"
    >
      {/* Dynamic Background Atmosphere (Not Plain!) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Topo Wave Lines */}
        <svg
          className="absolute w-full h-full opacity-[0.07] stroke-brand-700"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0,200 C 300,100 600,300 1200,150" strokeWidth="2" />
          <path d="M 0,400 C 400,250 800,500 1200,350" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M 0,600 C 350,450 750,700 1200,550" strokeWidth="1.5" />
        </svg>

        {/* Ambient Glow Bubbles */}
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight">
            {t("features.title")}
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Modern Interactive Feature Navigation Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-8 sm:mb-12 p-2 bg-slate-100/90 backdrop-blur-md rounded-2xl sm:rounded-full border border-slate-200 shadow-sm text-xs">
          {[
            { id: "budgeting", label: t("features.tab1"), icon: Sliders },
            { id: "accounts", label: t("features.tab2"), icon: Wallet },
            { id: "ai", label: t("features.tab3"), icon: Sparkles },
            { id: "goals", label: t("features.tab4"), icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-brand-700 shadow-md border border-slate-200/90 font-black ring-1 ring-brand-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT 1: AUTO BUDGETING 50/30/20 */}
        {activeFeatureTab === "budgeting" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Formula Keuangan Teruji Dunia</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t1_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t1_desc")}
              </p>

              {/* Interactive Income Slider & Quick Presets */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t("features.t1_slider_label")}</span>
                  <span className="text-brand-600 text-sm sm:text-base font-black tabular-nums">
                    {formatRupiah(simulatedIncome)}
                  </span>
                </div>

                <input
                  type="range"
                  min="3000000"
                  max="35000000"
                  step="500000"
                  value={simulatedIncome}
                  onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                  {[
                    { label: t("features.t1_preset_fresh"), value: 5000000 },
                    { label: t("features.t1_preset_mid"), value: 10000000 },
                    { label: t("features.t1_preset_senior"), value: 20000000 },
                    { label: "Rp 35 Jt", value: 35000000 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSimulatedIncome(preset.value)}
                      className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                        simulatedIncome === preset.value
                          ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-time 50/30/20 Breakdown Cards */}
            <div className="lg:col-span-6 space-y-3.5">
              {/* Category 1: Needs (50%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-brand-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-600 shrink-0" />
                    {t("features.t1_cat1")}
                  </span>
                  <span className="text-brand-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.5)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: "50%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat1_desc")}
                </p>
              </div>

              {/* Category 2: Wants (30%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    {t("features.t1_cat2")}
                  </span>
                  <span className="text-emerald-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.3)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: "30%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat2_desc")}
                </p>
              </div>

              {/* Category 3: Savings (20%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-amber-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    {t("features.t1_cat3")}
                  </span>
                  <span className="text-amber-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.2)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: "20%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat3_desc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: BUAT AKUN SALDO BANK & PROVIDER */}
        {activeFeatureTab === "accounts" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("features.t2_sync_status")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t2_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t2_desc")}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-800">{t("features.t2_why_title")}</p>
                <p className="text-slate-600 leading-relaxed">
                  {t("features.t2_why_desc")}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {[
                {
                  id: "bca",
                  name: isEn ? "BCA Main Savings" : "BCA Tabungan Utama",
                  category: isEn ? "Bank Account" : "Rekening Bank",
                  balance: 28500000,
                  logo: "/images/providers/bca.svg",
                },
                {
                  id: "mandiri",
                  name: isEn ? "Mandiri Salary Payroll" : "Mandiri Payroll Gaji",
                  category: isEn ? "Bank Account" : "Rekening Bank",
                  balance: 16000000,
                  logo: "/images/providers/mandiri.svg",
                },
                {
                  id: "gopay",
                  name: "GoPay E-Wallet",
                  category: "E-Wallet",
                  balance: 4250000,
                  logo: "/images/providers/gopay.svg",
                },
                {
                  id: "bibit",
                  name: isEn ? "Bibit Liquid Mutual Fund" : "Bibit Reksadana Likuid",
                  category: isEn ? "Money Market Fund" : "Investasi Pasar Uang",
                  balance: 12000000,
                  logo: "/images/providers/bibit.svg",
                },
              ].map((acc) => {
                const isSelected = selectedAccount === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center text-xs ${
                      isSelected
                        ? "bg-slate-50 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-2 shrink-0">
                        <img
                          src={acc.logo}
                          alt={acc.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xs sm:text-sm">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {acc.category}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-sm sm:text-base tabular-nums">
                      {formatRupiah(acc.balance)}
                    </span>
                  </div>
                );
              })}

              {/* Total Aggregate Net Worth Card */}
              <div className="p-4 sm:p-5 bg-[#071613] text-white rounded-2xl shadow-xl flex justify-between items-center text-xs border border-emerald-900">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">
                    {t("features.t2_total_label")}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {t("features.t2_total_sub")}
                  </p>
                </div>
                <span className="font-black text-lg sm:text-2xl text-emerald-400 tabular-nums">
                  Rp 60.750.000
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: SMART AI INSIGHTS */}
        {activeFeatureTab === "ai" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-50 text-brand-800 text-xs font-bold border border-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>{t("features.t3_badge_title")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t3_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t3_desc")}
              </p>

              {/* Clickable AI Dilemma Triggers */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("features.t3_prompt_title")}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "coffee", label: t("features.t3_btn1") },
                    { id: "emergency", label: t("features.t3_btn2") },
                    { id: "invest", label: t("features.t3_btn3") },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePromptClick(p.id)}
                      className={`text-left px-4 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                        activePrompt === p.id
                          ? "bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-1 ring-brand-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <span>{p.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          activePrompt === p.id ? "text-brand-600" : "text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Reactive AI Advisor Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#071613] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                      AI
                    </span>
                    <div>
                      <p className="font-black text-xs sm:text-sm text-white">
                        MoneFin Intelligence Copilot
                      </p>
                      <p className="text-[10px] text-emerald-400">{t("features.t3_realtime")}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t("features.t3_accuracy")}
                  </span>
                </div>

                {isGeneratingAi ? (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2 animate-pulse">
                    <Sparkles className="w-6 h-6 text-emerald-400 mx-auto animate-spin" />
                    <p>{t("features.t3_loading")}</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activePrompt === "coffee" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a1_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a1_desc")}
                        </p>
                      </>
                    )}

                    {activePrompt === "emergency" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a2_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a2_desc")}
                        </p>
                      </>
                    )}

                    {activePrompt === "invest" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a3_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a3_desc")}
                        </p>
                      </>
                    )}

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{t("features.t3_footer_left")}</span>
                      <span className="text-emerald-400 font-black">
                        {t("features.t3_footer_right")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: GOALS TRACKER */}
        {activeFeatureTab === "goals" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <Target className="w-3.5 h-3.5 text-teal-600" />
                <span>{t("features.t4_badge_title")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t4_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t4_desc")}
              </p>

              {/* Goals Selector Chips */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("features.t4_select_title")}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "emergency", label: t("features.t4_goal1") },
                    { id: "house", label: t("features.t4_goal2") },
                    { id: "vacation", label: t("features.t4_goal3") },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`text-left px-4 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                        selectedGoal === g.id
                          ? "bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-1 ring-brand-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <span>{g.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          selectedGoal === g.id ? "text-brand-600" : "text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Dynamic Goal Progress Circle Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 space-y-6 text-center shadow-lg">
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {activeGoal.title}
                </h4>

                {/* Circular Progress & Percentage */}
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-brand-600 transition-all duration-500"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - goalPercent / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-950 tabular-nums">
                      {goalPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t("features.t4_reached")}
                    </span>
                  </div>
                </div>

                {/* Metric Details */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-[11px] text-slate-500 font-medium">{t("features.t4_saved")}</p>
                    <p className="font-black text-slate-900 text-sm sm:text-base tabular-nums">
                      {formatRupiah(activeGoal.current)}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-[11px] text-slate-500 font-medium">{t("features.t4_target_total")}</p>
                    <p className="font-black text-slate-900 text-sm sm:text-base tabular-nums">
                      {formatRupiah(activeGoal.target)}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold">
                  {t("features.t4_est_completion")}{" "}
                  <span className="underline font-black">
                    {remainingMonths} {t("features.t4_months_left")}
                  </span>{" "}
                  ({isEn ? "Allocation" : "Alokasi"} {formatRupiah(activeGoal.monthly)}{isEn ? "/mo" : "/bln"})
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

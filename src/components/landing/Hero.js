"use client";

import { useState, useEffect, useRef } from "react";
import { CatalisButton } from "../ui/CatalisButton";
import { useLanguage } from "../../context/LanguageContext";
import {
  Shield,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

import { HeroInteractiveCanvas } from "./HeroInteractiveCanvas";

export const Hero = ({ isLoggedIn }) => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const heroRef = useRef(null);

  // Direct DOM Refs for zero-rerender mouse tracking
  const cockpitRef = useRef(null);
  const auraRef = useRef(null);
  const rafMoveRef = useRef(null);

  // Interactive Balance Simulation
  const [activeAccount, setActiveAccount] = useState("total");
  const [simulatedBalances, setSimulatedBalances] = useState({
    bca: 28500000,
    mandiri: 16000000,
    gopay: 4250000,
  });
  const [recentAction, setRecentAction] = useState(null);

  const localFormatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const totalNetWorth =
    simulatedBalances.bca + simulatedBalances.mandiri + simulatedBalances.gopay;

  const getCurrentBalance = () => {
    if (activeAccount === "bca") return simulatedBalances.bca;
    if (activeAccount === "mandiri") return simulatedBalances.mandiri;
    if (activeAccount === "gopay") return simulatedBalances.gopay;
    return totalNetWorth;
  };

  const getAccountLabel = () => {
    if (activeAccount === "total") return t("hero.card_total_net");
    if (activeAccount === "bca") return t("hero.card_bca");
    if (activeAccount === "mandiri") return t("hero.card_mandiri");
    return t("hero.card_gopay");
  };

  const handleSimulatedTransaction = (type, amount, label, accountKey = "bca") => {
    const targetKey = activeAccount === "total" ? accountKey : activeAccount;
    setSimulatedBalances((prev) => {
      const currentVal = prev[targetKey];
      const newVal =
        type === "add" ? currentVal + amount : Math.max(0, currentVal - amount);
      return { ...prev, [targetKey]: newVal };
    });

    if (type === "add") {
      setRecentAction({
        type: "income",
        text: `+${localFormatRupiah(amount)} (${label})`,
      });
    } else {
      setRecentAction({
        type: "expense",
        text: `-${localFormatRupiah(amount)} (${label})`,
      });
    }

    setTimeout(() => setRecentAction(null), 3800);
  };

  const resetBalances = () => {
    setSimulatedBalances({
      bca: 28500000,
      mandiri: 16000000,
      gopay: 4250000,
    });
    setRecentAction(null);
  };

  // Mouse Move Handler for Dynamic Radiant Glow and 3D Tilt (Zero React Re-renders)
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafMoveRef.current) return;
    rafMoveRef.current = requestAnimationFrame(() => {
      rafMoveRef.current = null;
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      if (auraRef.current) {
        auraRef.current.style.left = `${x}%`;
        auraRef.current.style.top = `${y}%`;
        auraRef.current.style.opacity = "0.9";
      }

      if (cockpitRef.current) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (clientX - centerX) / (rect.width / 2);
        const deltaY = (clientY - centerY) / (rect.height / 2);
        const rx = Math.max(-5, Math.min(5, -deltaY * 4));
        const ry = Math.max(-5, Math.min(5, deltaX * 4));
        cockpitRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
  };

  const handleMouseEnter = () => {
    if (auraRef.current) {
      auraRef.current.style.opacity = "0.9";
    }
  };

  const handleMouseLeave = () => {
    if (rafMoveRef.current) {
      cancelAnimationFrame(rafMoveRef.current);
      rafMoveRef.current = null;
    }
    if (auraRef.current) {
      auraRef.current.style.opacity = "0.5";
    }
    if (cockpitRef.current) {
      cockpitRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  useEffect(() => {
    return () => {
      if (rafMoveRef.current) {
        cancelAnimationFrame(rafMoveRef.current);
      }
    };
  }, []);

  // 50/30/20 proportions of current balance
  const activeBal = getCurrentBalance();
  const needsAmount = activeBal * 0.5;
  const wantsAmount = activeBal * 0.3;
  const savingsAmount = activeBal * 0.2;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative z-10 min-h-[calc(100vh-1rem)] flex flex-col justify-between overflow-hidden border-b border-brand-200/50 bg-[#f8faf9] pt-24 sm:pt-28 lg:pt-28 pb-10 sm:pb-14"
    >
      {/* 1. DYNAMIC LIVING FLUID CONTOUR STREAMLINES (CANVAS 60FPS) */}
      <HeroInteractiveCanvas />

      {/* Atmospheric Background Mesh & Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-topo-pattern opacity-40" />

        {/* Ambient Floating Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-400/12 blur-2xl animate-float-orb pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-brand-500/12 blur-2xl animate-float-orb-reverse pointer-events-none" />

        {/* Interactive Mouse-Following Radiant Aura */}
        <div
          ref={auraRef}
          className="absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            left: "50%",
            top: "35%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(0, 240, 160, 0.1) 0%, rgba(0, 104, 95, 0.04) 45%, transparent 70%)",
            filter: "blur(32px)",
            opacity: 0.5,
            willChange: "left, top, opacity",
          }}
        />
      </div>

      {/* 2. HERO CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        
        {/* Top Centered Header & Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 pt-1 pb-4 sm:pb-6">
          
          {/* Confident, Solid Monolithic Headline (No AI Slop Split Gradients) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 leading-[1.08] max-w-4xl mx-auto">
            {t("hero.title")}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t("hero.subtitle")}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <CatalisButton
              href={isLoggedIn ? "/dashboard" : "/register"}
              variant="primary"
              className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-xl shadow-brand-600/25 ring-2 ring-brand-500/20"
            >
              {isLoggedIn ? t("hero.cta_primary_loggedin") : t("hero.cta_primary")}
            </CatalisButton>

            <a
              href="#simulator"
              className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 shadow-sm hover:text-brand-600 hover:border-brand-300 transition-all text-center flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>{t("hero.cta_secondary")}</span>
            </a>
          </div>

          {/* Clean Integrated Trust Line (No Clunky AI Pill Badges) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-y-1.5 gap-x-5 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{t("hero.badge_privacy")}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t("hero.badge_no_cc")}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{t("hero.badge_speed")}</span>
            </span>
          </div>
        </div>

        {/* 3. CENTERPIECE INTERACTIVE FINTECH COCKPIT (Finmax + Finova Inspired) */}
        <div className="relative max-w-4xl mx-auto pt-2 sm:pt-4 pb-6 sm:pb-8">
          
          {/* Ambient Device Backdrop Halo */}
          <div className="absolute inset-x-12 inset-y-6 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-brand-500/15 blur-3xl rounded-[3rem] pointer-events-none -z-10" />

          {/* FLOATING SATELLITE WIDGET 1: LEFT SIDE (Live Cashflow Pulse) */}
          <div className="hidden lg:flex items-center gap-3 absolute -left-12 top-16 z-30 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-3.5 shadow-xl shadow-slate-900/10 animate-float-subtle max-w-[230px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cashflow In
                </span>
              </div>
              <p className="font-black text-xs text-slate-900 truncate">
                +Rp 8.000.000
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold truncate">
                {isEn ? "BCA Payroll Salary" : "Gaji Payroll BCA"}
              </p>
            </div>
          </div>

          {/* FLOATING SATELLITE WIDGET 2: RIGHT SIDE (Health Score) */}
          <div className="hidden lg:flex items-center gap-3 absolute -right-12 bottom-20 z-30 bg-[#091A17] text-white border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl shadow-emerald-950/20 animate-float-subtle-reverse max-w-[220px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Financial Health
              </p>
              <p className="font-black text-sm text-white">94 / 100</p>
              <p className="text-[10px] text-emerald-400 font-medium">
                {isEn ? "50/30/20 Allocation Stable" : "Alokasi 50/30/20 Stabil"}
              </p>
            </div>
          </div>

          {/* CENTRAL INTERACTIVE DEVICE / COCKPIT FRAME */}
          <div
            ref={cockpitRef}
            className="perspective-1000 w-full transition-transform duration-150 ease-out"
            style={{
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              willChange: "transform",
            }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-7 border-2 border-slate-200/90 shadow-2xl shadow-slate-900/10 space-y-4">
              
              {/* Cockpit Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                  <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                    MoneFin Live Control Desk
                  </span>
                </div>
                <button
                  onClick={resetBalances}
                  className="text-xs font-bold text-slate-400 hover:text-brand-600 flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
                  title={t("hero.card_reset_sim")}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">{t("hero.card_reset_sim")}</span>
                </button>
              </div>

              {/* Account Switcher Tabs with Real Logos */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-2xl text-[11px] font-bold">
                {[
                  { id: "total", label: t("hero.card_all") },
                  { id: "bca", label: "BCA", logo: "/images/providers/bca.svg" },
                  { id: "mandiri", label: "Mandiri", logo: "/images/providers/mandiri.svg" },
                  { id: "gopay", label: "GoPay", logo: "/images/providers/gopay.svg" },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setActiveAccount(acc.id)}
                    className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeAccount === acc.id
                        ? "bg-white text-brand-700 shadow-md font-black border border-slate-200"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {acc.logo && (
                      <img
                        src={acc.logo}
                        alt={acc.label}
                        className="h-3.5 w-auto max-w-[24px] object-contain shrink-0"
                      />
                    )}
                    <span className="truncate">{acc.label}</span>
                  </button>
                ))}
              </div>

              {/* Primary Dark Console Card */}
              <div className="bg-[#071613] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden space-y-3 border border-emerald-900/60">
                {/* Background Grid Pattern inside card */}
                <div className="absolute inset-0 bg-topo-pattern opacity-20 pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-slate-400 relative z-10">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] sm:text-xs text-emerald-300">
                    {getAccountLabel()}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {t("hero.card_live")}
                  </span>
                </div>

                {/* Net Worth Balance Number */}
                <div className="flex items-baseline gap-2 relative z-10">
                  <h3 className="text-2xl sm:text-4xl font-black text-emerald-400 tabular-nums tracking-tight">
                    {localFormatRupiah(activeBal)}
                  </h3>
                </div>

                {/* Action Notification Banner */}
                {recentAction && (
                  <div
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all animate-fadeIn relative z-10 ${
                      recentAction.type === "income"
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-200 border border-rose-500/30"
                    }`}
                  >
                    {recentAction.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{recentAction.text}</span>
                  </div>
                )}

                {/* Cashflow Sparkline */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    {t("hero.card_cashflow")}
                  </span>
                  <svg
                    className="w-28 sm:w-36 h-6 text-emerald-400"
                    viewBox="0 0 100 24"
                    fill="none"
                  >
                    <path
                      d="M0 18 Q25 4, 50 14 T100 2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Real-time 50/30/20 Distribution Preview */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{t("hero.card_split_title")}</span>
                  <span className="text-[10px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md font-black uppercase border border-brand-200">
                    50 / 30 / 20
                  </span>
                </div>

                {/* Segmented Bar */}
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                  <div
                    className="bg-brand-600 h-full transition-all duration-300"
                    style={{ width: "50%" }}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: "30%" }}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: "20%" }}
                  />
                </div>

                {/* Pillar Values */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                    <p className="text-slate-400 truncate">{t("hero.card_split_needs")}</p>
                    <p className="font-bold text-slate-800 tabular-nums">
                      {localFormatRupiah(needsAmount)}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                    <p className="text-slate-400 truncate">{t("hero.card_split_wants")}</p>
                    <p className="font-bold text-slate-800 tabular-nums">
                      {localFormatRupiah(wantsAmount)}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                    <p className="text-slate-400 truncate">{t("hero.card_split_savings")}</p>
                    <p className="font-bold text-slate-800 tabular-nums">
                      {localFormatRupiah(savingsAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Simulation Action Triggers */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-extrabold text-slate-600 text-center flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <span>{t("hero.card_simulate")}</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() =>
                      handleSimulatedTransaction(
                        "add",
                        8000000,
                        isEn ? "Salary Received" : "Gaji Masuk",
                        "bca"
                      )
                    }
                    className="px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <img
                      src="/images/providers/bca.svg"
                      alt="BCA"
                      className="h-3 w-auto object-contain shrink-0"
                    />
                    <span>{isEn ? "+8M Salary" : "+8 Jt Gaji"}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSimulatedTransaction(
                        "subtract",
                        45000,
                        isEn ? "Coffee & Snacks" : "Kopi & Jajan",
                        "gopay"
                      )
                    }
                    className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <img
                      src="/images/providers/gopay.svg"
                      alt="GoPay"
                      className="h-2.5 w-auto object-contain shrink-0"
                    />
                    <span>{isEn ? "-45k Coffee" : "-45rb Kopi"}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleSimulatedTransaction(
                        "subtract",
                        500000,
                        isEn ? "Mutual Fund" : "Reksadana",
                        "mandiri"
                      )
                    }
                    className="px-3 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <img
                      src="/images/providers/bibit.svg"
                      alt="Bibit"
                      className="h-3 w-auto object-contain shrink-0"
                    />
                    <span>{isEn ? "-500k Invest" : "-500rb Invest"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

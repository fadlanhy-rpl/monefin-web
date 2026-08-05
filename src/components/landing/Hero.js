"use client";

import { useState } from "react";
import { CatalisButton } from "../ui/CatalisButton";
import { formatRupiah } from "@/lib/utils"; // I will need to create/check this, or define it locally. Let's define locally for now to match exactly.

export const Hero = ({ isLoggedIn }) => {
  const [activeAccount, setActiveAccount] = useState("total");
  const [simulatedBalances, setSimulatedBalances] = useState({
    bca: 28500000,
    gopay: 4250000,
    mandiri: 16000000,
  });
  const [recentAction, setRecentAction] = useState(null);

  const localFormatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const totalNetWorth = simulatedBalances.bca + simulatedBalances.gopay + simulatedBalances.mandiri;

  const getCurrentBalance = () => {
    if (activeAccount === "bca") return simulatedBalances.bca;
    if (activeAccount === "gopay") return simulatedBalances.gopay;
    if (activeAccount === "mandiri") return simulatedBalances.mandiri;
    return totalNetWorth;
  };

  const handleSimulatedTransaction = (type, amount, label) => {
    const targetKey = activeAccount === "total" ? "bca" : activeAccount;
    setSimulatedBalances((prev) => {
      const currentVal = prev[targetKey];
      const newVal = type === "add" ? currentVal + amount : Math.max(0, currentVal - amount);
      return { ...prev, [targetKey]: newVal };
    });

    if (type === "add") {
      setRecentAction({ type: "income", text: `+${localFormatRupiah(amount)} (${label})` });
    } else {
      setRecentAction({ type: "expense", text: `-${localFormatRupiah(amount)} (${label})` });
    }

    setTimeout(() => setRecentAction(null), 3500);
  };

  return (
    <div className="hero-gradient-bg relative z-10 overflow-hidden border-b border-brand-200/40 pt-16 sm:pt-20">
      {/* Dynamic Glowing Ambient Orbs */}
      <div className="absolute top-0 left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-400/20 blur-3xl animate-float-orb pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-300/25 blur-3xl animate-float-orb-reverse pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* HERO CONTENT SECTION */}
      <section className="relative z-10 pt-8 pb-14 sm:pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Star Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 border border-brand-300/80 text-brand-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-500 animate-ping" />
                <svg className="w-3.5 h-3.5 text-brand-600 shrink-0" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Aplikasi Finansial Personal #1 Gratis &amp; Praktis</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.12]">
                Kelola dan <em className="catalis-heading-italic text-brand-600">Tumbuhkan</em> Keuangan Anda dengan Alat Terukur
              </h1>

              {/* Subheadline */}
              <p className="text-xs sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                MoneFin menyatukan pelacakan anggaran, agregasi dompet, dan analisis finansial otomatis agar Anda dapat mengambil keputusan keuangan secara percaya diri tanpa kerumitan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <CatalisButton href={isLoggedIn ? "/dashboard" : "/register"} variant="primary" className="w-full sm:w-auto text-center">
                  <span>{isLoggedIn ? "Buka Dashboard" : "Coba Sekarang — 100% Gratis"}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </CatalisButton>
                
                <CatalisButton href="#simulator" variant="secondary" className="w-full sm:w-auto text-center">
                  <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <span>Simulasi Wealth</span>
                </CatalisButton>
              </div>

              {/* Key Highlights Pill Badges */}
              <div className="pt-3 sm:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[11px] sm:text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Tanpa Kartu Kredit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Privasi Data Terjamin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Respon &lt; 1 Detik</span>
                </div>
              </div>
            </div>

            {/* Right Column: GLOWING BORDER HERO CARD */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              {/* Rotating Ambient Back Ring */}
              <div className="absolute -inset-2 sm:-inset-4 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-r from-brand-400/30 via-emerald-300/30 to-brand-600/30 blur-xl opacity-75 animate-spin-slow pointer-events-none" />

              <div className="glowing-border-card catalis-card relative mx-auto max-w-md p-4 sm:p-7 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl shadow-brand-900/10">
                {/* Account Switcher Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Pratinjau Saldo Dompet</p>
                    <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">Saldo Saat Ini</p>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                    <span>Saldo Real-time</span>
                  </span>
                </div>

                {/* Account Pills Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl mb-4 text-[10px] sm:text-xs font-bold border border-slate-200/60">
                  <button
                    onClick={() => setActiveAccount("total")}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg transition-all cursor-pointer ${
                      activeAccount === "total"
                        ? "bg-white text-brand-700 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveAccount("bca")}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg transition-all cursor-pointer ${
                      activeAccount === "bca"
                        ? "bg-white text-brand-700 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    BCA
                  </button>
                  <button
                    onClick={() => setActiveAccount("gopay")}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg transition-all cursor-pointer ${
                      activeAccount === "gopay"
                        ? "bg-white text-brand-700 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    GoPay
                  </button>
                </div>

                {/* Balance Display Card */}
                <div className="bg-gradient-to-br from-brand-900 via-brand-700 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white mb-4 shadow-xl relative overflow-hidden transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[10px] sm:text-xs text-brand-200 uppercase tracking-widest font-extrabold">
                      {activeAccount === "total"
                        ? "Total Sisa Net Worth"
                        : activeAccount === "bca"
                        ? "Saldo BCA Utama"
                        : activeAccount === "gopay"
                        ? "Saldo GoPay Wallet"
                        : "Saldo Mandiri Tabungan"}
                    </p>
                    <span className="text-[9px] sm:text-[10px] font-mono bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                      LIVE DEMO
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-black tracking-tight transition-all break-all">
                    {localFormatRupiah(getCurrentBalance())}
                  </h3>

                  {/* Toast Alert Simulation */}
                  {recentAction && (
                    <div
                      className={`mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full animate-bounce ${
                        recentAction.type === "income"
                          ? "bg-emerald-500/30 text-emerald-100 border border-emerald-400/40"
                          : "bg-rose-500/30 text-rose-100 border border-rose-400/40"
                      }`}
                    >
                      <span>{recentAction.text}</span>
                    </div>
                  )}

                  {/* Mini Sparkline Visualization */}
                  <div className="mt-4 pt-3 border-t border-white/15 flex justify-between items-center text-[10px] sm:text-xs text-brand-200">
                    <span className="font-mono">Cashflow Trend</span>
                    <svg className="w-16 sm:w-24 h-5 sm:h-6 text-emerald-300 overflow-visible" viewBox="0 0 100 30">
                      <path
                        d="M0 25 Q20 5, 40 20 T80 8 T100 2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="sparkline-path"
                      />
                    </svg>
                  </div>
                </div>

                {/* Interactive Transaction Action Buttons */}
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mb-2 text-center">
                  Simulasikan Transaksi Langsung:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => handleSimulatedTransaction("add", 2500000, "Bonus Project")}
                    className="press-scale px-2.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                    <span>+ Rp 2.500.000</span>
                  </button>
                  <button
                    onClick={() => handleSimulatedTransaction("subtract", 125000, "Belanja Bulanan")}
                    className="press-scale px-2.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="8 12h8"/></svg>
                    <span>- Rp 125.000</span>
                  </button>
                </div>

                {/* Footer Insight Widget */}
                <div className="bg-slate-50 rounded-xl p-2.5 sm:p-3.5 border border-slate-200/80 flex items-center justify-between text-[10px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      AI
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Status Alokasi Hemat</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">Sehat &amp; Terkendali</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-700 text-[10px] sm:text-xs bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    94% Optimum
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

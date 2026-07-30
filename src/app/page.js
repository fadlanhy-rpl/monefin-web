"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuthToken } from "../lib/api";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Calculator State
  const [monthlySavings, setMonthlySavings] = useState(2500000);
  const [timeHorizon, setTimeHorizon] = useState(3);
  const [returnRate, setReturnRate] = useState(8);

  // Interactive Demo Card State
  const [simulatedBalance, setSimulatedBalance] = useState(48750000);
  const [recentAction, setRecentAction] = useState(null);

  // Interactive Tab State
  const [activeTab, setActiveTab] = useState("budget");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  // Calculate Wealth Projection
  const months = timeHorizon * 12;
  const monthlyRate = returnRate / 100 / 12;

  const totalFutureWealth = Math.round(
    monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );

  const totalSavedWithoutInterest = monthlySavings * months;
  const totalGrowth = totalFutureWealth - totalSavedWithoutInterest;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleSimulatedTransaction = (type, amount, label) => {
    if (type === "add") {
      setSimulatedBalance((prev) => prev + amount);
      setRecentAction({ type: "income", text: `+${formatRupiah(amount)} (${label})` });
    } else {
      setSimulatedBalance((prev) => Math.max(0, prev - amount));
      setRecentAction({ type: "expense", text: `-${formatRupiah(amount)} (${label})` });
    }
    setTimeout(() => setRecentAction(null), 3000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Catalis Dual-Text Button Component
  const CatalisButton = ({ href, children, variant = "primary", className = "" }) => {
    const baseStyle =
      variant === "primary"
        ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 px-6 py-3.5"
        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-6 py-3.5";

    return (
      <Link
        href={href}
        className={`btn-catalis font-bold text-sm press-scale ${baseStyle} ${className}`}
      >
        <div className="btn-catalis-inner">
          <span className="btn-catalis-text flex items-center gap-2">
            {children}
          </span>
          <span className="btn-catalis-text flex items-center gap-2">
            {children}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-brand-600 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR (Catalis Style with Floating Rounded Pill Container) */}
      <div className="sticky top-4 z-50 px-4 max-w-7xl mx-auto">
        <nav className="backdrop-blur-xl bg-white/90 border border-slate-200/80 rounded-full shadow-lg shadow-slate-200/50 px-6 py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-brand-600 p-0.5 shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <img src="/images/LogoMonefinWhite.svg" alt="MoneFin Logo" className="w-4 h-4" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              MoneFin
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Fitur Utama</a>
            <a href="#simulator" className="hover:text-brand-600 transition-colors">Simulasi Wealth</a>
            <a href="#comparison" className="hover:text-brand-600 transition-colors">Keunggulan</a>
            <a href="#testimonials" className="hover:text-brand-600 transition-colors">Testimoni</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <CatalisButton href="/dashboard" variant="primary">
                <span>Ke Dashboard</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </CatalisButton>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-700 hover:text-brand-600 px-4 py-2 rounded-full transition-colors"
                >
                  Masuk
                </Link>
                <CatalisButton href="/register" variant="primary">
                  <span>Mulai Gratis</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </CatalisButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 animate-popIn">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2">Fitur Utama</a>
            <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2">Simulasi Wealth</a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2">Keunggulan</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2">Testimoni</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2">FAQ</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full text-center py-3 rounded-full bg-brand-600 text-white font-bold text-sm">
                  Ke Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="w-full text-center py-2.5 rounded-full border border-slate-300 text-slate-800 font-bold text-sm">
                    Masuk
                  </Link>
                  <Link href="/register" className="w-full text-center py-2.5 rounded-full bg-brand-600 text-white font-bold text-sm">
                    Mulai Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* HERO SECTION (Catalis Style with Large Typography & Floating Card Stacks) */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Catalis Star Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
                <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Dari Strategi Menuju Kebebasan Finansial</span>
              </div>

              {/* Catalis Typography Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Kelola dan <em className="catalis-heading-italic text-brand-600">Tumbuhkan</em> Keuangan Anda dengan Alat Terukur
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                MoneFin menyatukan pelacakan anggaran, manajemen dompet, dan analisis finansial otomatis agar Anda dapat mengambil keputusan keuangan secara percaya diri.
              </p>

              {/* CTA Buttons (Catalis Dual-Text Hover Slide Effect) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <CatalisButton href={isLoggedIn ? "/dashboard" : "/register"} variant="primary">
                  <span>{isLoggedIn ? "Buka Dashboard" : "Mulai Sekarang"}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </CatalisButton>
                
                <CatalisButton href="#simulator" variant="secondary">
                  <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <span>Pelajari Lebih Lanjut</span>
                </CatalisButton>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-3xl font-black text-slate-900">80%</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Efisiensi Pencatatan</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">Rp 120M+</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Dana Terkelola</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-brand-600">99%</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Akurasi Transaksi</p>
                </div>
              </div>

            </div>

            {/* Right Column: Catalis Hero Interactive Staggered Cards */}
            <div className="lg:col-span-5 relative">
              <div className="catalis-card relative mx-auto max-w-md rounded-3xl p-6 bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/40">
                
                {/* Header Card Mockup */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Kartu Utama</p>
                      <p className="text-sm font-black text-slate-900">MoneFin Account</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                    Active Sync
                  </span>
                </div>

                {/* Balance Display */}
                <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <p className="text-xs text-brand-200 uppercase tracking-widest font-extrabold mb-1">Total Net Worth</p>
                  <h3 className="text-3xl font-black tracking-tight">
                    {formatRupiah(simulatedBalance)}
                  </h3>
                  
                  {recentAction && (
                    <div className={`mt-3 inline-block text-xs font-bold px-3 py-1 rounded-full animate-bounce ${recentAction.type === 'income' ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40' : 'bg-rose-500/30 text-rose-100 border border-rose-400/40'}`}>
                      {recentAction.text}
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-end text-xs text-brand-200 font-mono">
                    <span>Account: **** 8892</span>
                    <span>EXP 08/29</span>
                  </div>
                </div>

                {/* Interactive Demo Buttons */}
                <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
                  Coba klik tombol di bawah untuk mensimulasikan transaksi:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleSimulatedTransaction("add", 5000000, "Gaji Bulanan")}
                    className="press-scale px-3 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                    <span>+ Rp 5.000.000</span>
                  </button>
                  <button
                    onClick={() => handleSimulatedTransaction("subtract", 150000, "Kopi & Makan")}
                    className="press-scale px-3 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    <span>- Rp 150.000</span>
                  </button>
                </div>

                {/* Mini Stats Row */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">Budget Bulan Ini</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5">Sisa 68%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Status Tabungan</span>
                    <p className="font-black text-emerald-700 text-sm mt-0.5">On Track</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION ABOUT US (Catalis Style) */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
            <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Tentang MoneFin</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight max-w-4xl mx-auto">
            Kami berdedikasi memberdayakan individu untuk mengambil <em className="catalis-heading-italic text-brand-600">kontrol penuh</em> atas finansial dan mencapai tujuan jangka panjang mereka.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="catalis-card bg-slate-50 border border-slate-200 rounded-3xl p-8 text-left space-y-2">
              <p className="text-4xl font-black text-brand-600">80%</p>
              <p className="text-sm font-semibold text-slate-700">Pengurangan Waktu Pencatatan Laporan</p>
            </div>
            <div className="catalis-card bg-slate-50 border border-slate-200 rounded-3xl p-8 text-left space-y-2">
              <p className="text-4xl font-black text-brand-600">Rp 4.5M</p>
              <p className="text-sm font-semibold text-slate-700">Rata-rata Hemat per Tahun (Pengguna)</p>
            </div>
            <div className="catalis-card bg-slate-50 border border-slate-200 rounded-3xl p-8 text-left space-y-2">
              <p className="text-4xl font-black text-brand-600">99.8%</p>
              <p className="text-sm font-semibold text-slate-700">Tingkat Retensi Disiplin Budget</p>
            </div>
          </div>

        </div>
      </section>

      {/* WEALTH SIMULATOR SECTION */}
      <section id="simulator" className="py-24 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Kalkulator Masa Depan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Berapa Kekayaan Anda dalam <span className="text-brand-600 font-extrabold">{timeHorizon} Tahun</span> ke Depan?
            </h2>
            <p className="text-slate-600 text-base">
              Geser kontrol di bawah untuk merencanakan tabungan rutin dan melihat efek compounding saat Anda menggunakan MoneFin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Slider Controls */}
            <div className="lg:col-span-6 catalis-card bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
              
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-700 font-bold">Tabungan Rutin / Bulan</label>
                  <span className="text-brand-600 font-black text-base">{formatRupiah(monthlySavings)}</span>
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
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>Rp 500rb</span>
                  <span>Rp 10jt</span>
                  <span>Rp 20jt</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-700 font-bold">Jangka Waktu (Tahun)</label>
                  <span className="text-brand-600 font-black text-base">{timeHorizon} Tahun</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>1 Thn</span>
                  <span>5 Thn</span>
                  <span>10 Thn</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-700 font-bold">Estimasi Return Investment / Thn</label>
                  <span className="text-brand-600 font-black text-base">{returnRate}% / tahun</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>4% (Deposito)</span>
                  <span>8% (Obligasi/RD)</span>
                  <span>15% (Saham)</span>
                </div>
              </div>

            </div>

            {/* Projection Result */}
            <div className="lg:col-span-6">
              <div className="catalis-card bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 border border-brand-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <p className="text-xs font-bold text-brand-200 uppercase tracking-widest mb-2">
                  Proyeksi Total Akumulasi Aset
                </p>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
                  {formatRupiah(totalFutureWealth)}
                </h3>

                <div className="space-y-4 pt-4 border-t border-brand-500/60">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-100 font-semibold">Total Modal Disimpan ({months} bln):</span>
                    <span className="text-white font-bold">{formatRupiah(totalSavedWithoutInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-100 font-semibold">Estimasi Imbal Hasil (Growth):</span>
                    <span className="text-emerald-300 font-black">+{formatRupiah(totalGrowth)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-brand-100 leading-relaxed flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  <span>
                    <strong>Catatan Intelegensi MoneFin:</strong> Dengan disiplin budgeting di MoneFin, rata-rata pengguna berhasil menyisihkan <strong>23% lebih banyak</strong> dibanding pencatatan manual biasa.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE BENEFITS SECTION (Catalis Style) */}
      <section id="features" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Fitur Utama</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Membuat Pengelolaan Keuangan Mudah, <em className="catalis-heading-italic text-brand-600">Menyederhanakan</em> Finansial Anda
            </h2>
            <p className="text-slate-600 text-base">
              Platform kami menyediakan alat canggih dan analisis terkini untuk membantu Anda mengelola, menumbuhkan, dan mengamankan aset Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Budgeting & Expense Tracking",
                desc: "Kendalikan keuangan Anda dengan pelacak pengeluaran intuitif dan alokasi budget otomatis.",
                icon: <svg className="w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 14h4"/></svg>,
              },
              {
                title: "Investment Management",
                desc: "Pantau portofolio investasi dan pertumbuhan aset Anda dalam satu tampilan dashboard terkonsolidasi.",
                icon: <svg className="w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
              },
              {
                title: "Transformasi Digital",
                desc: "Integrasikan semua rekening bank & e-wallet dalam sistem digital terpusat tanpa pencatatan manual.",
                icon: <svg className="w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m12 8 4 4-4 4M8 12h8"/></svg>,
              },
              {
                title: "Strategi Target Impian",
                desc: "Tetapkan target tabungan (DP rumah, dana darurat) dengan tracker pencapaian progresif.",
                icon: <svg className="w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
              },
            ].map((b, idx) => (
              <div key={idx} className="catalis-card bg-slate-50 border border-slate-200/90 rounded-3xl p-8 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {b.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{b.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURE EXPLORER SHOWCASE SECTION */}
      <section className="py-24 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Demo Interaktif</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Lihat Bagaimana MoneFin <em className="catalis-heading-italic text-brand-600">Bekerja</em>
            </h2>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: "budget", label: "Auto Budgeting", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 14h4"/></svg> },
              { id: "accounts", label: "Agregasi Rekening", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
              { id: "insights", label: "Smart Insights", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> },
              { id: "goals", label: "Target Financial", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`press-scale px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2.5 ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 scale-105"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Preview */}
          <div className="catalis-card bg-white border border-slate-200 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl shadow-slate-200/50 min-h-[300px] flex items-center justify-center">
            {activeTab === "budget" && (
              <div className="w-full space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-slate-900">Sistem Alokasi Budget Cerdas (50/30/20)</h4>
                  <span className="text-xs text-brand-700 font-bold bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">Automated</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Atur alokasi bulanan untuk Kebutuhan Pokok, Keinginan, dan Tabungan secara otomatis. MoneFin memberikan peringatan dinamis sebelum budget Anda habis.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Kebutuhan Makanan (72% Terpakai)</span>
                      <span className="text-amber-600">Rp 3.600.000 / Rp 5.000.000</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-amber-500 w-[72%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Transportasi & Bensin (40% Terpakai)</span>
                      <span className="text-emerald-600">Rp 800.000 / Rp 2.000.000</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-emerald-500 w-[40%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "accounts" && (
              <div className="w-full space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-slate-900">Satu Dashboard untuk Semua Bank & E-Wallet</h4>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">Multi-Sync</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Tidak perlu lagi membuka 5 aplikasi bank berbeda. Pantau saldo Bank Mandiri, BCA, GoPay, OVO, dan Kas Tunai Anda dalam satu tampilan terkonsolidasi.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                    <p className="text-xs text-slate-500 font-semibold">Bank BCA</p>
                    <p className="text-lg font-black text-slate-900 mt-1">Rp 24.500.000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                    <p className="text-xs text-slate-500 font-semibold">GoPay / e-Wallet</p>
                    <p className="text-lg font-black text-slate-900 mt-1">Rp 1.250.000</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                    <p className="text-xs text-slate-500 font-semibold">Reksadana Investment</p>
                    <p className="text-lg font-black text-emerald-600 mt-1">Rp 23.000.000</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "insights" && (
              <div className="w-full space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-slate-900">Analisis Cerdas & Rekomendasi Finansial</h4>
                  <span className="text-xs text-brand-700 font-bold bg-brand-50 border border-brand-200 px-3.5 py-1 rounded-full">Smart AI</span>
                </div>
                <p className="text-slate-600 text-sm">
                  MoneFin secara otomatis mendeteksi pola pengeluaran yang boros dan memberikan saran konkret untuk meningkatkan tabungan Anda bulan depan.
                </p>
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-brand-600 text-white shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Insight Minggu Ini:</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      "Pengeluaran jajan Anda minggu ini naik 18%. Dengan mengurangi 2 porsi jajan per minggu, Anda bisa menghemat <strong>Rp 480.000</strong> lagi setiap bulan!"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "goals" && (
              <div className="w-full space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-slate-900">Target Impian & Dana Darurat</h4>
                  <span className="text-xs text-teal-700 font-bold bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">Goal Tracker</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Tetapkan target impian Anda (misal: DP Rumah, Liburan ke Jepang, atau Dana Darurat 6 Bulan) dan lacak progresnya secara visual.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900">DP Rumah Impian</span>
                    <span className="text-xs font-bold text-emerald-600">Rp 65M / Rp 100M (65%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 w-[65%] rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section id="comparison" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Perbandingan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Pencatatan Manual vs <em className="catalis-heading-italic text-brand-600">MoneFin</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="catalis-card bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5">
              <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>Cara Kuno (Buku / Excel)</span>
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span> Ribet mencatat satu per satu setiap malam.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span> Sering lupa ke mana saja uang gaji habis.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span> Tidak ada peringatan saat budget hampir habis.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span> Tidak ada saran atau insight finansial.
                </li>
              </ul>
            </div>

            {/* MoneFin Way */}
            <div className="catalis-card bg-gradient-to-br from-brand-50 via-white to-emerald-50 border border-brand-200 rounded-3xl p-8 space-y-5 shadow-xl shadow-brand-600/10">
              <h3 className="text-lg font-bold text-brand-700 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <span>Cara Pintar (MoneFin)</span>
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-800 font-semibold">
                <li className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Pencatatan cepat &lt; 5 detik dengan kategori otomatis.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Monitoring saldo terkonsolidasi 24/7 real-time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Notifikasi peringatan budget otomatis.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Smart AI Insight untuk meningkatkan tabungan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* INFINITE TESTIMONIAL MARQUEE LOOP (Catalis Loop Component) */}
      <section id="testimonials" className="py-24 bg-white border-y border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
            <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Testimoni Pengguna</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Apa Kata Klien & <em className="catalis-heading-italic text-brand-600">Pengguna Kami</em>
          </h2>
        </div>

        {/* Marquee Loop Track */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee space-x-6">
            {[
              {
                name: "Jaxson Baptista",
                role: "Manager di LunoxInc",
                text: "MoneFin benar-benar mengubah cara saya mengelola keuangan. Dengan antarmuka intuitif dan fitur canggih, saya punya visibilitas total pada pengeluaran dan investasi.",
              },
              {
                name: "Rian Pratama",
                role: "Software Engineer",
                text: "MoneFin bikin saya sadar kalau tiap bulan pengeluaran jajan bisa sampai 1.5 juta! Sekarang budgetnya teratur dan tabungan naik signifikan.",
              },
              {
                name: "Siti Rahmawati",
                role: "Entrepreneur",
                text: "Fitur agregasi saldo dan target finansialnya sangat membantu mengurus keuangan bisnis kecil saya dan pribadi tanpa campur aduk.",
              },
              {
                name: "Budi Santoso",
                role: "Product Manager",
                text: "UI-nya sangat bersih, cepat, dan gak bikin pusing dibanding app keuangan lain. Pengalaman login Google-nya juga sangat seamless!",
              },
              {
                name: "Davis Vetrovs",
                role: "Financial Analyst",
                text: "Simulasi wealth compounding MoneFin sangat akurat dan membantu saya membuat strategi investasi jangka panjang bersama keluarga.",
              },
            ].concat([
              {
                name: "Jaxson Baptista",
                role: "Manager di LunoxInc",
                text: "MoneFin benar-benar mengubah cara saya mengelola keuangan. Dengan antarmuka intuitif dan fitur canggih, saya punya visibilitas total pada pengeluaran dan investasi.",
              },
              {
                name: "Rian Pratama",
                role: "Software Engineer",
                text: "MoneFin bikin saya sadar kalau tiap bulan pengeluaran jajan bisa sampai 1.5 juta! Sekarang budgetnya teratur dan tabungan naik signifikan.",
              },
              {
                name: "Siti Rahmawati",
                role: "Entrepreneur",
                text: "Fitur agregasi saldo dan target finansialnya sangat membantu mengurus keuangan bisnis kecil saya dan pribadi tanpa campur aduk.",
              },
              {
                name: "Budi Santoso",
                role: "Product Manager",
                text: "UI-nya sangat bersih, cepat, dan gak bikin pusing dibanding app keuangan lain. Pengalaman login Google-nya juga sangat seamless!",
              },
              {
                name: "Davis Vetrovs",
                role: "Financial Analyst",
                text: "Simulasi wealth compounding MoneFin sangat akurat dan membantu saya membuat strategi investasi jangka panjang bersama keluarga.",
              },
            ]).map((t, idx) => (
              <div
                key={idx}
                className="catalis-card w-[360px] shrink-0 bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4 text-left"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{t.text}"</p>
                <div className="pt-4 border-t border-slate-200/80">
                  <p className="text-sm font-black text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 bg-[#fafbfc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <svg className="w-4 h-4 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Pertanyaan Yang Sering <em className="catalis-heading-italic text-brand-600">Diajukan</em>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah MoneFin aman untuk menyimpan data keuangan saya?",
                a: "Sangat aman. MoneFin menggunakan enkripsi standar bank 256-bit dan autentikasi OTP 2-FA. Data Anda dienkripsi secara penuh dan tidak akan pernah dijual ke pihak ketiga.",
              },
              {
                q: "Apakah aplikasi MoneFin dapat digunakan secara gratis?",
                a: "Ya! Anda dapat mendaftar Starter Plan dan menggunakan fitur-fitur utama MoneFin secara gratis selamanya.",
              },
              {
                q: "Bagaimana cara kerja autentikasi dengan Google?",
                a: "Anda cukup mengklik tombol 'Login dengan Google' dan sistem kami akan memverifikasi identitas Anda secara aman menggunakan protokol OAuth2 resmi dari Google.",
              },
              {
                q: "Apakah saya bisa mengakses MoneFin di HP dan Laptop sekaligus?",
                a: "Tentu saja! MoneFin dirancang responsif penuh untuk diakses dari Smartphone, Tablet, maupun Komputer kapan saja.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="catalis-card bg-white border border-slate-200 rounded-3xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-8 py-5 text-left font-extrabold text-slate-900 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <svg className={`w-5 h-5 text-brand-600 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER (Calm Dark Emerald Slate Style) */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 border border-brand-800/40 rounded-[40px] p-10 sm:p-16 text-center text-white shadow-2xl shadow-slate-950/20 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
              Siap Menguasai Keuangan Anda <em className="catalis-heading-italic text-brand-300 font-normal">Hari Ini?</em>
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              Bergabunglah dengan ribuan orang yang telah mengubah cara mereka mengelola anggaran dan tabungan bersama MoneFin. 100% Gratis Selamanya.
            </p>
            <div className="flex justify-center">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="press-scale inline-flex items-center gap-3 px-10 py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-xl transition-all"
              >
                <span>{isLoggedIn ? "Buka Dashboard Saya" : "Mulai Gratis Sekarang"}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Catalis Footer Style) */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shadow-sm">
              <img src="/images/LogoMonefinWhite.svg" alt="MoneFin Logo" className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-slate-900 text-base">MoneFin</span>
          </div>
          <p>&copy; {new Date().getFullYear()} MoneFin Inc. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6 font-bold text-slate-600">
            <a href="#" className="hover:text-brand-600 transition-colors">Privasi</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

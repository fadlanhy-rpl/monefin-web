"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Wallet,
  ArrowDownUp,
  PieChart,
  Target,
  Sparkles,
  CheckCircle2,
  Receipt,
  Bot,
  Trophy,
  FileSpreadsheet,
  ArrowRight,
  Info,
  ShieldCheck,
  Check
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function OnboardingTutorialModal({
  isOpen,
  onClose,
  showTutorialOnLogin = true,
  onToggleShowTutorialOnLogin
}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === "en";

  const [currentStep, setCurrentStep] = useState(0);

  // Dukungan tombol keyboard Escape dan Panah
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      } else if (e.key === "ArrowLeft") {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheckboxToggle = (e) => {
    const newValue = e.target.checked;
    if (onToggleShowTutorialOnLogin) {
      onToggleShowTutorialOnLogin(newValue);
    }
  };

  const handleNavigateTo = (path) => {
    onClose();
    router.push(path);
  };

  const steps = [
    {
      id: "accounts",
      stepNum: "01",
      navTitle: isEn ? "Connect Accounts" : "Hubungkan Rekening",
      navSubtitle: isEn ? "Balance & wallet foundation" : "Fondasi saldo & dompet",
      icon: Wallet,
      badge: isEn ? "Essential First Step" : "Langkah Pertama yang Wajib Dilakukan",
      title: isEn ? "Create Your Financial Accounts & Wallets" : "Buat Rekening & Dompet Keuangan Anda",
      description: isEn
        ? "Before logging income or expenses, MoneFin needs source accounts. Add your everyday bank accounts, e-wallets, or cash so your total net worth consolidates accurately."
        : "Sebelum mencatat pengeluaran atau pemasukan, MoneFin membutuhkan rekening asal dana. Buat akun sesuai bank atau e-wallet yang Anda gunakan sehari-hari agar seluruh saldo terkonsolidasi dalam satu Net Worth yang akurat.",
      actionText: isEn ? "Open Accounts Page Now" : "Buka Menu Rekening Sekarang",
      actionPath: "/accounts",
      renderCanvas: () => (
        <div className="space-y-3">
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-teal-400 tracking-wider uppercase">
                  {isEn ? "Total Net Worth" : "Total Kekayaan Bersih (Net Worth)"}
                </p>
                <p className="text-xl font-black text-white mt-0.5">Rp 18.250.000</p>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-md border border-teal-500/30">
                {isEn ? "3 Active Wallets" : "3 Dompet Aktif"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[11px]">
                  BCA
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "BCA Savings" : "BCA Tabungan"}</p>
                  <p className="text-[11px] font-bold text-slate-500">Rp 12.500.000</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-[11px]">
                  GP
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "GoPay Main" : "GoPay Utama"}</p>
                  <p className="text-[11px] font-bold text-slate-500">Rp 750.000</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-[11px]">
                  Rp
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "Cash Wallet" : "Kas Dompet Fisik"}</p>
                  <p className="text-[11px] font-bold text-slate-500">Rp 5.000.000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>{isEn ? "MoneFin Tip:" : "Tip MoneFin:"}</strong>{" "}
              {isEn
                ? "You can create bank accounts (BCA, Mandiri, BRI), e-wallets (GoPay, OVO, Dana), or physical cash. Balances update automatically whenever a transaction occurs."
                : "Anda bisa membuat rekening bank (BCA, Mandiri, BRI), e-wallet (GoPay, OVO, Dana), maupun uang tunai. Saldo akan otomatis bertambah atau berkurang setiap transaksi terjadi."}
            </p>
          </div>
        </div>
      )
    },
    {
      id: "transactions",
      stepNum: "02",
      navTitle: isEn ? "Track Cash Flow" : "Catat Arus Kas",
      navSubtitle: isEn ? "Income & expenses" : "Pemasukan & pengeluaran",
      icon: ArrowDownUp,
      badge: isEn ? "Step Two" : "Langkah Kedua",
      title: isEn ? "Track Inflows & Outflows of Money" : "Pantau Aliran Uang Masuk & Keluar",
      description: isEn
        ? "Financial clarity begins with knowing where every rupiah goes. Log daily spending or income instantly — tagged with relevant categories and funding accounts."
        : "Kunci stabilitas finansial adalah mengetahui ke mana uang pergi. Catat transaksi harian secara instan — baik pengeluaran makan, tagihan listrik, hingga pemasukan gaji — lengkap dengan kategori dan rekening sumber.",
      actionText: isEn ? "Open Transactions Page Now" : "Buka Menu Transaksi Sekarang",
      actionPath: "/transactions",
      renderCanvas: () => (
        <div className="space-y-2.5">
          <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
            <div className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                  ↓
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "Monthly Salary" : "Gaji Bulanan"}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isEn ? "BCA Savings • Regular Income" : "BCA Tabungan • Pemasukan Rutin"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600">+Rp 8.500.000</span>
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs">
                  ↑
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "Lunch & Coffee" : "Makan Siang & Kopi"}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isEn ? "GoPay Main • Food & Drinks" : "GoPay Utama • Makanan & Minuman"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-600">-Rp 38.000</span>
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs">
                  ↑
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{isEn ? "Electricity Token" : "Token Listrik PLN"}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isEn ? "BCA Savings • Bills & Utilities" : "BCA Tabungan • Tagihan & Utilitas"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-600">-Rp 200.000</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <Info className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
            <p className="leading-snug">
              {isEn
                ? "Whenever you record an expense, the selected account balance is deducted in real-time and your dashboard cash flow chart updates immediately."
                : "Setiap kali Anda mencatat pengeluaran, saldo rekening yang dipilih akan otomatis terpotong secara riil dan grafik cashflow dashboard langsung terbarui."}
            </p>
          </div>
        </div>
      )
    },
    {
      id: "budgets",
      stepNum: "03",
      navTitle: isEn ? "Set Budget Limits" : "Kunci Batas Anggaran",
      navSubtitle: isEn ? "Anti-overspending envelopes" : "Sistem amplop anti-boncos",
      icon: PieChart,
      badge: isEn ? "Step Three" : "Langkah Ketiga",
      title: isEn ? "Prevent Overspending with Smart Budgets" : "Cegah Pengeluaran Berlebih dengan Budgeting",
      description: isEn
        ? "Establish monthly spending limits for key categories (e.g. Dining, Entertainment, Groceries). MoneFin sends early alerts before you breach the 80% threshold."
        : "Tentukan pagu batas belanja bulanan untuk setiap pos pengeluaran (misal: Makan & Minum, Hiburan, Belanja). MoneFin akan memberi peringatan dini sebelum Anda melewati batas aman 80%.",
      actionText: isEn ? "Set Category Budgets Now" : "Atur Anggaran Kategori Sekarang",
      actionPath: "/budgets",
      renderCanvas: () => (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-slate-800">{isEn ? "Food & Drinks" : "Makanan & Minuman"}</span>
                <span className="font-bold text-slate-500">Rp 1.150.000 / Rp 1.500.000</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "76%" }}></div>
              </div>
              <p className="text-[10px] text-amber-700 font-bold mt-1">
                {isEn
                  ? "76% Used — Rp 350,000 remaining until month-end"
                  : "76% Terpakai — Sisa Rp 350.000 hingga akhir bulan"}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-slate-800">{isEn ? "Transport & Fuel" : "Transportasi & Bensin"}</span>
                <span className="font-bold text-slate-500">Rp 320.000 / Rp 800.000</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "40%" }}></div>
              </div>
              <p className="text-[10px] text-teal-700 font-bold mt-1">
                {isEn ? "40% Used — Budget healthy & on track" : "40% Terpakai — Kondisi Anggaran Sehat & Aman"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {isEn
                ? "Envelope budgeting keeps you financially disciplined without tedious manual calculations."
                : "Sistem amplop budgeting membantu Anda disiplin finansial tanpa harus menghitung nota belanja secara manual setiap malam."}
            </p>
          </div>
        </div>
      )
    },
    {
      id: "goals",
      stepNum: "04",
      navTitle: isEn ? "Set Financial Goals" : "Pasang Target Impian",
      navSubtitle: isEn ? "Achieve life milestones" : "Wujudkan rencana finansial",
      icon: Target,
      badge: isEn ? "Step Four" : "Langkah Keempat",
      title: isEn ? "Build Emergency Funds & Dream Targets" : "Kumpulkan Dana Darurat & Target Impian",
      description: isEn
        ? "Don't let leftover money slip away. Plan concrete targets such as a 6-Month Emergency Fund, Down Payment, or Vacation with automated timelines and progress."
        : "Jangan biarkan sisa uang menguap tanpa tujuan. Rencanakan target konkret seperti Dana Darurat 6 Bulan, DP Rumah, Liburan, atau Modal Usaha dengan pelacakan progres dan estimasi waktu tercapai.",
      actionText: isEn ? "Create Financial Goal Now" : "Buat Target Finansial Sekarang",
      actionPath: "/goals",
      renderCanvas: () => (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-[#00685F] uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {isEn ? "Top Priority" : "Prioritas Utama"}
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1">
                  {isEn ? "6-Month Emergency Fund" : "Dana Darurat 6 Bulan"}
                </h4>
              </div>
              <span className="text-xs font-black text-[#00685F]">
                {isEn ? "60% Achieved" : "60% Tercapai"}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>{isEn ? "Saved: Rp 9.000.000" : "Terkumpul: Rp 9.000.000"}</span>
                <span>{isEn ? "Target: Rp 15.000.000" : "Target: Rp 15.000.000"}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00685F] rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
              <span>{isEn ? "Allocation: Rp 1.500.000 / mo" : "Alokasi: Rp 1.500.000 / bln"}</span>
              <span className="text-slate-700 font-bold">
                {isEn ? "± 4 Months Remaining" : "± 4 Bulan Lagi Selesai"}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-900 text-xs">
            <p className="leading-snug">
              {isEn
                ? "Every time you save, deposit directly into your goal in the Goals section. MoneFin projects your milestone completion date."
                : "Setiap kali Anda menabung, setor langsung ke target di halaman Goals. MoneFin akan menghitung sisa waktu hingga impian Anda terwujud."}
            </p>
          </div>
        </div>
      )
    },
    {
      id: "smart-suite",
      stepNum: "05",
      navTitle: isEn ? "Smart Powerhouse Tools" : "Fitur Cerdas Unggulan",
      navSubtitle: isEn ? "Explore the full suite" : "Eksplorasi ekosistem lengkap",
      icon: Sparkles,
      badge: isEn ? "Step Five" : "Langkah Kelima",
      title: isEn ? "Explore MoneFin's Smart Ecosystem" : "Jelajahi Ekosistem Pintar MoneFin",
      description: isEn
        ? "MoneFin goes beyond basic bookkeeping. Benefit from smart receipt split billing, AI advisory, healthy financial quests, and report exports."
        : "MoneFin bukan sekadar buku kas biasa. Nikmati fitur modern untuk memudahkan gaya hidup Anda: split bill cerdas dengan pajak, konsultasi AI, gamifikasi finansial, hingga ekspor laporan.",
      actionText: isEn ? "Explore Full Dashboard" : "Jelajahi Dashboard Lengkap",
      actionPath: "/dashboard",
      renderCanvas: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00685F] flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Smart Split Bill</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {isEn
                  ? "Scan receipts or enter items, calculate tax & tip fairly among friends."
                  : "Scan struk bon / input manual, hitung pajak & tip patungan teman secara adil."}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">
                {isEn ? "Finny AI Advisor" : "Konsultan Finny AI"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {isEn
                  ? "Ask for cash flow tips, expense cuts, and financial health diagnostics anytime."
                  : "Tanya saran cashflow, tips hemat jajan, dan analisis kesehatan finansial langsung ke AI."}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">
                {isEn ? "Quests & Achievements" : "Quest & Achievement"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {isEn
                  ? "Earn badges and complete missions to build healthy money management habits."
                  : "Raih lencana dan selesaikan tantangan finansial untuk membangun disiplin keuangan."}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">
                {isEn ? "PDF/Excel Reports" : "Laporan Ekspor PDF/Excel"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {isEn
                  ? "Export net cash flow recaps and profit/loss statements for your archives."
                  : "Unduh rekapitulasi arus kas dan laporan laba-rugi bersih Anda kapan saja."}
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00685F] flex items-center justify-center text-white font-black text-xs shadow-xs">
              M
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                {isEn ? "Getting Started with MoneFin" : "Panduan Memulai MoneFin"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                {isEn
                  ? "Essential first steps & how your financial ecosystem works"
                  : "Langkah pertama & cara kerja ekosistem keuangan Anda"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
            title={isEn ? "Close Guide (Esc)" : "Tutup Panduan (Esc)"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content: 2-Column Split Master/Detail on Desktop */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sisi Kiri: Navigasi Urutan Langkah (Master Rail) */}
          <div className="w-full md:w-72 bg-slate-50/90 border-b md:border-b-0 md:border-r border-slate-100 p-3 sm:p-5 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
            <div className="hidden md:block mb-2">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                {isEn ? "Financial Roadmap" : "Peta Jalan Finansial"}
              </p>
            </div>

            {steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer shrink-0 md:w-full ${
                    isActive
                      ? "bg-white text-[#00685F] shadow-sm border border-slate-200/80 ring-2 ring-[#00685F]/10"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-[11px] shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#00685F] text-white"
                        : isPast
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200/70 text-slate-600"
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : step.stepNum}
                  </div>

                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-black truncate leading-tight">
                      {step.navTitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate hidden md:block mt-0.5">
                      {step.navSubtitle}
                    </p>
                  </div>
                </button>
              );
            })}

            <div className="hidden md:block mt-auto pt-3 border-t border-slate-200/60">
              <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                💡 <strong className="text-slate-700">{isEn ? "~2 min read." : "Waktu baca ~2 menit."}</strong>{" "}
                {isEn
                  ? "These foundations ensure all MoneFin features work at their best."
                  : "Fondasi ini memastikan seluruh fitur MoneFin bekerja maksimal."}
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Panggung Informasi Interaktif (Detail Stage) */}
          <div className="flex-1 p-4 sm:p-7 overflow-y-auto space-y-4 sm:space-y-5 bg-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00685F] border border-teal-100 text-[11px] font-black uppercase tracking-wider mb-2">
                <span>
                  {isEn ? `Step ${currentStepData.stepNum} / 05` : `Langkah ${currentStepData.stepNum} / 05`}
                </span>
                <span>•</span>
                <span>{currentStepData.badge}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                {currentStepData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-1.5">
                {currentStepData.description}
              </p>
            </div>

            {/* Live Interactive Canvas Representation */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              {currentStepData.renderCanvas()}
            </div>

            {/* Direct Action Shortcut Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleNavigateTo(currentStepData.actionPath)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-xs cursor-pointer active:scale-98"
              >
                <span>{currentStepData.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] text-slate-400 font-medium text-center sm:text-right">
                {isEn ? "Can be opened now or later" : "Bisa dibuka langsung sekarang atau nanti"}
              </span>
            </div>

          </div>

        </div>

        {/* Unified Bottom Footer Bar */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          
          {/* Checkbox Toggle & Settings Notice */}
          <div className="space-y-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showTutorialOnLogin}
                onChange={handleCheckboxToggle}
                className="w-4 h-4 rounded text-[#00685F] focus:ring-[#00685F] border-slate-300 accent-[#00685F] cursor-pointer"
              />
              <span className="text-xs font-extrabold text-slate-700">
                {isEn ? "Show this walkthrough guide every time I sign in" : "Tampilkan panduan ini setiap kali saya login"}
              </span>
            </label>
            <p className="text-[10px] text-slate-400 font-medium pl-6">
              {isEn ? (
                <>
                  This setting can be changed anytime in{" "}
                  <strong className="text-slate-600">Settings &gt; Preferences</strong>.
                </>
              ) : (
                <>
                  Pengaturan ini dapat diubah kapan saja di menu{" "}
                  <strong className="text-slate-600">Pengaturan &gt; Preferensi</strong>.
                </>
              )}
            </p>
          </div>

          {/* Stepper Control Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                currentStep === 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-white border border-slate-200/80"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isEn ? "Previous" : "Sebelumnya"}</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                className="px-5 py-2 rounded-xl bg-[#00685F] text-white hover:bg-[#004D46] text-xs font-black transition shadow-sm shadow-[#00685F]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{isEn ? `Next (0${currentStep + 2}/05)` : `Lanjut (0${currentStep + 2}/05)`}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#00685F] text-white hover:bg-[#004D46] text-xs font-black transition shadow-sm shadow-[#00685F]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{isEn ? "Done & Get Started" : "Selesai & Mulai Kelola"}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

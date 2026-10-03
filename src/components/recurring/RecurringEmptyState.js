"use client";

import { 
  RefreshCcw, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  Sparkles,
  Wifi,
  Briefcase,
  Tv,
  Coffee,
  Plus,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function RecurringEmptyState({
  isFiltered = false,
  onResetFilters,
  onAddSchedule,
  onApplyStarter,
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isEn = language === "en";

  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4 border border-slate-200/60 shadow-2xs">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          {isEn ? "No Matching Schedules Found" : "Tidak Ada Jadwal yang Cocok"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          {isEn 
            ? "We couldn't find any recurring schedules matching your search keyword or selected filters." 
            : "Tidak ditemukan transaksi rutin yang sesuai dengan kata kunci pencarian atau kombinasi filter Anda."}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-xs min-h-[40px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? "Reset All Filters" : "Reset Semua Filter"}</span>
        </button>
      </div>
    );
  }

  const starterTemplates = [
    {
      id: "salary",
      title: isEn ? "Monthly Salary" : "Gaji Bulanan",
      desc: isEn ? "Regular payday income" : "Pemasukan gajian tetap",
      type: "income",
      amount: 5000000,
      period_type: "monthly",
      icon: Briefcase,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      accentBg: "hover:border-emerald-300 hover:bg-emerald-50/20",
    },
    {
      id: "bills",
      title: isEn ? "Internet & Electricity" : "WiFi & Tagihan",
      desc: isEn ? "Monthly internet & utilities" : "Tagihan internet/listrik",
      type: "expense",
      amount: 350000,
      period_type: "monthly",
      icon: Wifi,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/60",
      accentBg: "hover:border-blue-300 hover:bg-blue-50/20",
    },
    {
      id: "streaming",
      title: isEn ? "Streaming Subscriptions" : "Langganan Streaming",
      desc: isEn ? "Netflix, Spotify, etc." : "Netflix, Spotify, YouTube",
      type: "expense",
      amount: 186000,
      period_type: "monthly",
      icon: Tv,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/60",
      accentBg: "hover:border-purple-300 hover:bg-purple-50/20",
    },
    {
      id: "daily_food",
      title: isEn ? "Daily Food Allowance" : "Uang Makan & Saku",
      desc: isEn ? "Daily consumption budget" : "Alokasi konsumsi harian",
      type: "expense",
      amount: 50000,
      period_type: "daily",
      icon: Coffee,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
      accentBg: "hover:border-amber-300 hover:bg-amber-50/20",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
      
      {/* Decorative ambient background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00685F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Icon with glowing ring */}
      <div className="relative mb-5">
        <div className="w-18 h-18 rounded-3xl bg-[#00685F]/10 border border-[#00685F]/20 flex items-center justify-center text-[#00685F] shadow-sm">
          <RefreshCcw className="w-9 h-9" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#00685F] text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        {t("recurring.empty_title") || (isEn ? "No Recurring Transactions Yet" : "Belum Ada Jadwal Transaksi Rutin")}
      </h3>
      
      <p className="text-slate-500 mt-2 max-w-lg text-xs sm:text-sm leading-relaxed">
        {t("recurring.empty_desc") || (isEn
          ? "Set up recurring schedules so MoneFin automatically records recurring income and expenses without manual entry every time."
          : "Pasang jadwal rutin agar sistem MoneFin mencatat pengeluaran dan pemasukan otomatis tanpa perlu input manual setiap kali.")}
      </p>

      {/* Quick Starter Templates Grid (Hick's Law: Guided Defaults) */}
      <div className="mt-8 sm:mt-10 w-full max-w-3xl text-left relative z-10">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            {isEn ? "Quick Start Templates" : "Template Populer Cepat"}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {isEn ? "1-click apply" : "Klik untuk gunakan"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {starterTemplates.map((template) => {
            const Icon = template.icon;
            const isInc = template.type === "income";

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onApplyStarter({
                  title: template.title,
                  type: template.type,
                  amount: template.amount,
                  period_type: template.period_type,
                })}
                className={`p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all duration-200 text-left cursor-pointer group flex flex-col justify-between ${template.accentBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-2xs ${template.badgeColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isInc ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {template.period_type === "daily" ? (isEn ? "Daily" : "Harian") : (isEn ? "Monthly" : "Bulanan")}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors leading-tight">
                    {template.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {template.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className={`font-mono text-xs font-black ${isInc ? "text-emerald-600" : "text-slate-900"}`}>
                    {isInc ? "+" : ""}{formatCurrency(template.amount)}
                  </span>
                  <span className="text-[10px] font-bold text-[#00685F] opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEn ? "Use →" : "Pilih →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Custom Add Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onAddSchedule}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00685F] text-white font-bold rounded-2xl hover:bg-[#004D46] shadow-sm hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 text-sm cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t("recurring.add_button") || (isEn ? "Add Recurring Schedule" : "Tambah Jadwal Rutin")}</span>
        </button>
      </div>

    </div>
  );
}

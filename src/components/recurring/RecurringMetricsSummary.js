"use client";

import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw,
  Sparkles,
  CalendarCheck
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export default function RecurringMetricsSummary({ metrics, isVisible = true }) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isEn = language === "en";

  const isNetPositive = (metrics.netFlow || 0) >= 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5 transition-all duration-500 delay-75 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      
      {/* 1. Monthly Recurring Income */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {t("recurring.monthly_income") || (isEn ? "Recurring Income" : "Pemasukan Rutin")}
            </span>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <div className="text-2xl sm:text-[26px] font-black text-emerald-600 font-mono tracking-tight tabular-nums leading-none">
            +{formatCurrency(metrics.monthlyIncome || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-semibold">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
              {t("recurring.per_month") || "/ bulan"}
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{metrics.activeCount || 0} {isEn ? "active rules" : "jadwal aktif"}</span>
          </div>
        </div>
      </div>

      {/* 2. Monthly Recurring Expense */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200/80 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:bg-rose-500/10 transition-colors" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {t("recurring.monthly_expense") || (isEn ? "Recurring Expense" : "Pengeluaran Rutin")}
            </span>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 font-mono tracking-tight tabular-nums leading-none">
            {formatCurrency(metrics.monthlyExpense || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-semibold">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
              {t("recurring.per_month") || "/ bulan"}
            </span>
            <span>•</span>
            <span>{isEn ? "scheduled bills" : "kewajiban terjadwal"}</span>
          </div>
        </div>
      </div>

      {/* 3. Net Cashflow Projection */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none transition-colors ${
          isNetPositive ? "bg-[#00685F]/5 group-hover:bg-[#00685F]/10" : "bg-rose-500/5 group-hover:bg-rose-500/10"
        }`} />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isNetPositive ? "bg-[#00685F]" : "bg-rose-500"}`} />
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {t("recurring.net_cashflow") || (isEn ? "Net Recurring Flow" : "Arus Kas Otomatis")}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform ${
            isNetPositive 
              ? "bg-[#00685F]/10 text-[#00685F] border border-[#00685F]/20" 
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}>
            {isNetPositive ? <TrendingUp className="w-4.5 h-4.5 stroke-[2.5]" /> : <TrendingDown className="w-4.5 h-4.5 stroke-[2.5]" />}
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <div className={`text-2xl sm:text-[26px] font-black font-mono tracking-tight tabular-nums leading-none ${
            isNetPositive ? "text-[#00685F]" : "text-rose-600"
          }`}>
            {isNetPositive ? "+" : ""}{formatCurrency(metrics.netFlow || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
              isNetPositive 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                : "bg-rose-50 text-rose-700 border border-rose-200/50"
            }`}>
              <Sparkles className="w-3 h-3" />
              {isNetPositive ? (isEn ? "Projected Surplus" : "Surplus Bulanan") : (isEn ? "Projected Deficit" : "Defisit Bulanan")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Total Schedules & Status */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-bl-full pointer-events-none group-hover:bg-slate-500/10 transition-colors" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              {t("recurring.active_count") || (isEn ? "Active Schedules" : "Jadwal Aktif")}
            </span>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200/70 text-slate-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <RefreshCcw className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-[26px] font-black text-slate-900 font-mono tracking-tight tabular-nums leading-none">
              {metrics.activeCount || 0}
              <span className="text-sm text-slate-400 font-bold ml-1">/ {metrics.totalCount || 0}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {metrics.pausedCount || 0} {t("recurring.status_paused") || (isEn ? "paused" : "jeda")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
            <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{isEn ? "Managed automations" : "Total otomasi terdaftar"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

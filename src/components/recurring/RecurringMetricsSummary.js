"use client";

import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw 
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export default function RecurringMetricsSummary({ metrics, isVisible = true }) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isEn = language === "en";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 transition-all duration-500 delay-75 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      
      {/* 1. Monthly Recurring Income */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("recurring.monthly_income") || (isEn ? "Recurring Income" : "Pemasukan Rutin")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">
            +{formatCurrency(metrics.monthlyIncome)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {t("recurring.per_month") || "/ bulan"} • {metrics.activeCount} {isEn ? "active" : "aktif"}
          </p>
        </div>
      </div>

      {/* 2. Monthly Recurring Expense */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("recurring.monthly_expense") || (isEn ? "Recurring Expense" : "Pengeluaran Rutin")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(metrics.monthlyExpense)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {t("recurring.per_month") || "/ bulan"} • {isEn ? "obligations" : "kewajiban rutin"}
          </p>
        </div>
      </div>

      {/* 3. Net Cashflow Projection */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("recurring.net_cashflow") || (isEn ? "Net Recurring Flow" : "Arus Kas Otomatis")}
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${metrics.netFlow >= 0 ? "bg-[#00685F]/10 text-[#00685F]" : "bg-rose-50 text-rose-600"}`}>
            {metrics.netFlow >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-xl sm:text-2xl font-black tabular-nums ${metrics.netFlow >= 0 ? "text-[#00685F]" : "text-rose-600"}`}>
            {metrics.netFlow >= 0 ? "+" : ""}{formatCurrency(metrics.netFlow)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {metrics.netFlow >= 0 ? (isEn ? "Surplus projected" : "Estimasi surplus bulanan") : (isEn ? "Deficit projected" : "Estimasi defisit bulanan")}
          </p>
        </div>
      </div>

      {/* 4. Total Schedules & Status */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t("recurring.active_count") || (isEn ? "Active Schedules" : "Jadwal Aktif")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <RefreshCcw className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {metrics.activeCount} <span className="text-xs text-slate-400 font-bold">/ {metrics.totalCount}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {metrics.pausedCount} {t("recurring.status_paused") || (isEn ? "paused" : "terjeda")}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          {isEn ? "Managed automations" : "Total otomasi terdaftar"}
        </p>
      </div>

    </div>
  );
}

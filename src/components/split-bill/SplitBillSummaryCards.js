"use client";

import { Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export default function SplitBillSummaryCards({
  summary,
  statusFilter,
  setStatusFilter,
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
      {/* Active Bills Card */}
      <div 
        onClick={() => setStatusFilter("active")}
        className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          statusFilter === "active" 
            ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20" 
            : "bg-white border-slate-100 hover:border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t("split_bill.total_active_bills", "Tagihan Aktif")}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.total_active || 0}
          </h3>
          <span className="text-xs font-bold text-amber-600">
            {language === "en" ? "Pending Settlement" : "Menunggu Pelunasan"}
          </span>
        </div>
      </div>

      {/* Pending Collection Card */}
      <div 
        onClick={() => setStatusFilter("active")}
        className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t("split_bill.total_owed_to_me", "Perlu Ditagih (Piutang)")}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-black text-orange-600 truncate">
            {formatCurrency(summary?.total_owed_to_me || 0)}
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            {language === "en" ? "Owed by friends" : "Uang Anda ditalangi ke teman"}
          </span>
        </div>
      </div>

      {/* Settled Bills Card */}
      <div 
        onClick={() => setStatusFilter("settled")}
        className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          statusFilter === "settled" 
            ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20" 
            : "bg-white border-slate-100 hover:border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t("split_bill.total_settled_bills", "Tagihan Selesai")}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary?.total_settled || 0}
          </h3>
          <span className="text-xs font-bold text-emerald-600">
            {language === "en" ? "100% Settled" : "Lunas Semua"}
          </span>
        </div>
      </div>
    </div>
  );
}

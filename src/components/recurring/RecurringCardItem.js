"use client";

import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export default function RecurringCardItem({
  item,
  categories = [],
  accounts = [],
  onToggleActive,
  onEdit,
  onDelete,
  getNextRunInfo,
  periodLabels = {},
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isEn = language === "en";

  const isIncome = item.type === "income";
  const isActive = item.is_active !== false;
  const nextRun = getNextRunInfo(item);
  const category = item.category || categories.find((c) => String(c.id) === String(item.category_id));
  const account = item.account || accounts.find((a) => String(a.id) === String(item.account_id));

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden group ${
        isActive
          ? "border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
          : "border-slate-200 bg-slate-50/40 opacity-75 hover:opacity-100"
      }`}
    >
      {/* Top Row: Icon, Title & Status */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isIncome 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                : "bg-slate-100 text-slate-700 border border-slate-200/60"
            }`}>
              {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate" title={item.title}>
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-500">
                <span className="truncate max-w-[120px]" title={category?.name}>
                  {category?.name || (isEn ? "Uncategorized" : "Tanpa Kategori")}
                </span>
                <span>•</span>
                <span className="truncate max-w-[120px] text-slate-600" title={account?.name}>
                  {account?.name || (isEn ? "General Wallet" : "Rekening Utama")}
                </span>
              </div>
            </div>
          </div>

          {/* Active / Paused Status Pill */}
          <div className="shrink-0">
            {isActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t("recurring.status_active") || (isEn ? "Active" : "Aktif")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                {t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda")}
              </span>
            )}
          </div>
        </div>

        {/* Middle: Amount & Schedule Info */}
        <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
              {t("recurring.field_frequency") || (isEn ? "Frequency" : "Frekuensi")}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{periodLabels[item.period_type] || item.period_type}</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
              {t("recurring.field_amount") || (isEn ? "Amount" : "Nominal")}
            </p>
            <p className={`font-black text-lg sm:text-xl tabular-nums leading-none ${
              isIncome ? "text-emerald-600" : "text-slate-900"
            }`}>
              {isIncome ? "+" : ""}{formatCurrency(item.amount)}
            </p>
          </div>
        </div>

        {/* Next Execution Badge */}
        <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t("recurring.next_run") || (isEn ? "Next run" : "Jadwal berikutnya")}:</span>
          </div>
          <span className={`font-bold ${nextRun.isDueToday ? "text-[#00685F]" : "text-slate-700"}`}>
            {nextRun.text}
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Pause / Resume Button */}
        <button
          onClick={() => onToggleActive(item)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
            isActive
              ? "bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600"
              : "bg-[#00685F]/10 hover:bg-[#00685F]/20 text-[#00685F]"
          }`}
          title={isActive ? (isEn ? "Pause automation" : "Jeda otomasi") : (isEn ? "Resume automation" : "Aktifkan otomasi")}
        >
          {isActive ? (
            <>
              <PauseCircle className="w-4 h-4 text-slate-500" />
              <span>{t("recurring.pause_action") || (isEn ? "Pause" : "Jeda")}</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 text-[#00685F]" />
              <span>{t("recurring.resume_action") || (isEn ? "Resume" : "Aktifkan")}</span>
            </>
          )}
        </button>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            aria-label={isEn ? "Edit schedule" : "Edit jadwal"}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            aria-label={isEn ? "Delete schedule" : "Hapus jadwal"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

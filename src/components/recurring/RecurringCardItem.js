"use client";

import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Clock, 
  Wallet,
  Tag,
  Edit3, 
  Trash2,
  Sparkles
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";
import { getCategoryIcon, getCategoryColorStyle } from "../../lib/categoryIcons";

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

  // Resolved frequency label
  const frequencyLabel = periodLabels[item.period_type] || (
    item.period_type === "daily" 
      ? (isEn ? "Daily" : "Setiap Hari")
      : item.period_type === "weekly"
      ? (isEn ? "Weekly" : "Setiap Minggu")
      : (isEn ? "Monthly" : "Setiap Bulan")
  );

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-5 sm:p-5.5 flex flex-col justify-between relative overflow-hidden group ${
        isActive
          ? "bg-white border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5"
          : "bg-slate-50/60 border-slate-200/70 opacity-75 hover:opacity-95"
      }`}
    >
      {/* Top Accent Line for Active Cards */}
      {isActive && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isIncome ? "bg-emerald-500" : "bg-slate-900"
        }`} />
      )}

      <div>
        {/* Top Header Row: Category Icon, Title, and iOS Toggle Switch */}
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Category / Type Icon */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${
              category
                ? getCategoryColorStyle(category.color)
                : isIncome
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}>
              {category?.icon ? (
                getCategoryIcon(category.icon, "w-5 h-5")
              ) : isIncome ? (
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>

            {/* Title & Metadata Badges */}
            <div className="min-w-0 flex-1">
              <h3 
                className="font-black text-slate-900 text-base leading-snug truncate group-hover:text-[#00685F] transition-colors" 
                title={item.title}
              >
                {item.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {/* Category Chip */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100/90 text-slate-600 text-[10px] font-bold truncate max-w-[120px]">
                  <Tag className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{category?.name || (isEn ? "Uncategorized" : "Tanpa Kategori")}</span>
                </span>

                {/* Account Chip */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100/90 text-slate-600 text-[10px] font-bold truncate max-w-[120px]">
                  <Wallet className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{account?.name || (isEn ? "General Wallet" : "Rekening Utama")}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tactile Switch Toggle & Status Pill */}
          <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => onToggleActive(item)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00685F]/20 ${
                isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
              title={isActive ? (isEn ? "Pause automation" : "Jeda otomasi") : (isEn ? "Resume automation" : "Aktifkan otomasi")}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-[10px] font-extrabold ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
              {isActive ? (t("recurring.status_active") || (isEn ? "Active" : "Aktif")) : (t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"))}
            </span>
          </div>

        </div>

        {/* Amount & Frequency Section */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
              {t("recurring.field_frequency") || (isEn ? "Frequency" : "Frekuensi")}
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/90 border border-slate-200/60 px-2.5 py-1 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{frequencyLabel}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
              {t("recurring.field_amount") || (isEn ? "Amount" : "Nominal")}
            </span>
            <div className={`font-mono font-black text-xl sm:text-2xl tabular-nums leading-none tracking-tight ${
              isIncome ? "text-emerald-600" : "text-slate-900"
            }`}>
              {isIncome ? "+" : "-"}{formatCurrency(item.amount)}
            </div>
          </div>
        </div>

        {/* Next Execution Badge */}
        <div className={`mt-3.5 py-2.5 px-3.5 rounded-2xl border flex items-center justify-between text-[11px] font-semibold transition-colors ${
          !isActive
            ? "bg-amber-50/60 border-amber-200/50 text-amber-800"
            : nextRun.isDueToday
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-slate-50/80 border-slate-200/70 text-slate-700"
        }`}>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 shrink-0 ${
              !isActive ? "text-amber-500" : nextRun.isDueToday ? "text-emerald-600 animate-pulse" : "text-slate-400"
            }`} />
            <span className="text-slate-500">{t("recurring.next_run") || (isEn ? "Next execution" : "Jadwal berikutnya")}:</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-bold">
            {nextRun.isDueToday && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
            <span className={nextRun.isDueToday ? "text-emerald-700 font-extrabold" : "text-slate-900"}>
              {nextRun.text}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <span>{isIncome ? (isEn ? "Auto Inflow" : "Otomasi Masuk") : (isEn ? "Auto Outflow" : "Otomasi Keluar")}</span>
        </div>

        {/* Edit & Delete Action Buttons with Generous Click Targets */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#00685F] hover:bg-[#00685F]/10 border border-transparent hover:border-[#00685F]/20 transition-all cursor-pointer min-h-[36px]"
            title={isEn ? "Edit schedule" : "Edit jadwal"}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEn ? "Edit" : "Edit"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/50 transition-all cursor-pointer min-h-[36px]"
            title={isEn ? "Delete schedule" : "Hapus jadwal"}
            aria-label={isEn ? "Delete schedule" : "Hapus jadwal"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

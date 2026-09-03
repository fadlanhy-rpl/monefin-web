import { TrendingUp, Sparkles, Zap, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import SmartInsightCard from "../shared/SmartInsightCard";

export default function GoalsStats({
  savingRate,
  savingRateIncrease = 12,
  openAddModal
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
      {/* LAJU MENABUNG (SAVING RATE CARD) */}
      <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100/90 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
        
        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-orange-100/40 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full blur-2xl pointer-events-none" />

        {/* TOP ROW: Icon + Growth Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:rotate-6 transition-transform duration-300">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 shadow-2xs">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            <span>+{savingRateIncrease}% MoM</span>
          </span>
        </div>

        {/* MIDDLE SECTION: Value & Context */}
        <div className="relative z-10 my-4 sm:my-5 space-y-1">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">
            {t("goals.saving_rate") || "Laju Menabung"}
          </p>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {formatCurrency(savingRate)}
          </h4>
          <p className="text-xs text-slate-500 font-medium pt-0.5">
            {t("goals.saving_rate_desc") || "Rata-rata dalam 30 hari terakhir"}
          </p>
        </div>

        {/* BOTTOM SECTION: Progress Metric Bar */}
        <div className="relative z-10 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">
              {language === "en" ? "Saving Consistency" : "Konsistensi Menabung"}
            </span>
            <span className="text-[#00685F] font-black">
              {language === "en" ? "Healthy Pace" : "Sangat Baik"}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-500 h-full w-[78%] rounded-full shadow-xs" />
          </div>
        </div>

      </div>

      {/* TIPS CERDAS — Dynamic (AI or Engine) */}
      <SmartInsightCard page="goals" className="lg:col-span-2" onActionClick={openAddModal} />
    </div>
  );
}

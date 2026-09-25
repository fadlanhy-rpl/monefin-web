"use client";

import { 
  Target, 
  Shield, 
  Home, 
  Plane, 
  Plus, 
  Search, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function GoalsEmptyState({
  isFiltered = false,
  searchQuery = "",
  onResetSearch,
  onAddGoal,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-slate-400 mx-auto flex items-center justify-center mb-3.5 shadow-2xs">
          <Search className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          {t("goals.no_match_title") || (isEn ? "No Matching Goals Found" : "Tidak Ada Target yang Cocok")}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          {searchQuery
            ? (isEn
                ? `No financial goals matched "${searchQuery}". Try searching with a different title or purpose.`
                : `Tidak ditemukan target tabungan yang cocok dengan "${searchQuery}". Coba kata kunci nama target lain.`)
            : (t("goals.no_match_desc") || (isEn
                ? "No financial goals matched your search query."
                : "Tidak ditemukan target yang cocok dengan kata kunci pencarian Anda."))
          }
        </p>
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("goals.reset_search") || (isEn ? "Show All Goals" : "Tampilkan Semua Target")}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4 shadow-2xs">
        <Target className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
        {t("goals.empty_title") || (isEn ? "No Financial Goals Yet" : "Belum Ada Target Finansial")}
      </h3>

      <p className="text-slate-500 mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed font-medium">
        {t("goals.empty_desc") || (isEn
          ? "You haven't set any savings or dream goals yet. Establish your first target (like an Emergency Fund or Home Down Payment) to build focused savings habits and peace of mind."
          : "Anda belum membuat target tabungan atau impian finansial. Tetapkan target pertama Anda (seperti Dana Darurat atau DP Rumah) agar tabungan lebih terarah, terukur, dan konsisten.")}
      </p>

      {/* Starter Inspiration Cards */}
      <div className="mt-8 w-full max-w-2xl text-left">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">
          {t("goals.starter_title") || (isEn ? "Choose an idea to start your first goal:" : "Pilih inspirasi target untuk memulai:")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Preset 1: Emergency Fund */}
          <button
            type="button"
            onClick={() => onAddGoal && onAddGoal({
              title: isEn ? "Emergency Fund (6 Months)" : "Dana Darurat (6 Bulan)",
              subtitle: isEn ? "Living expenses reserve" : "Dana cadangan biaya hidup",
              target: 30000000,
              icon: "shield",
              tag: "Safety",
              type: "linear"
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              {t("goals.starter_emergency_title") || (isEn ? "Emergency Fund" : "Dana Darurat")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("goals.starter_emergency_desc") || (isEn ? "Living expense safety net for peace of mind" : "Proteksi biaya hidup untuk ketenangan pikiran")}
            </div>
            <div className="text-[11px] text-emerald-600 mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Start goal" : "Mulai target"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Preset 2: First Home */}
          <button
            type="button"
            onClick={() => onAddGoal && onAddGoal({
              title: isEn ? "First Home Down Payment" : "DP Rumah Pertama",
              subtitle: isEn ? "Dream home down payment" : "Tabungan uang muka hunian",
              target: 100000000,
              icon: "home",
              tag: "Property",
              type: "linear"
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">
              {t("goals.starter_home_title") || (isEn ? "Home Down Payment" : "DP Rumah Pertama")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("goals.starter_home_desc") || (isEn ? "Plan your future home with steady savings" : "Rencanakan hunian impian dengan tabungan terukur")}
            </div>
            <div className="text-[11px] text-[#00685F] mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Start goal" : "Mulai target"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Preset 3: Vacation / Education */}
          <button
            type="button"
            onClick={() => onAddGoal && onAddGoal({
              title: isEn ? "Japan Holiday Vacation" : "Liburan ke Jepang",
              subtitle: isEn ? "Family holiday savings" : "Tabungan liburan keluarga",
              target: 25000000,
              icon: "plane",
              tag: "Lifestyle",
              type: "circular"
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/20 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Plane className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
              {t("goals.starter_vacation_title") || (isEn ? "Travel & Dreams" : "Liburan & Impian")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("goals.starter_vacation_desc") || (isEn ? "Enjoy debt-free holidays or milestones" : "Wujudkan liburan atau impian tanpa berutang")}
            </div>
            <div className="text-[11px] text-amber-600 mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Start goal" : "Mulai target"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => onAddGoal && onAddGoal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#00685F] hover:bg-[#004D46] text-white font-bold rounded-2xl shadow-md shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("goals.add_goal_btn") || (isEn ? "Create Savings Goal" : "Buat Target Tabungan")}</span>
        </button>
      </div>
    </div>
  );
}

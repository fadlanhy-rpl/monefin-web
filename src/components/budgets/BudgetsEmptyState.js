"use client";

import { 
  PieChart, 
  Sparkles, 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Zap, 
  Film, 
  PiggyBank, 
  Hash,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

function getCategoryIconSmall(iconType) {
  switch (iconType) {
    case "utensils": return <Utensils className="w-4 h-4" />;
    case "car": return <Car className="w-4 h-4" />;
    case "shopping-bag": return <ShoppingBag className="w-4 h-4" />;
    case "zap": return <Zap className="w-4 h-4" />;
    case "film": return <Film className="w-4 h-4" />;
    case "piggy-bank": return <PiggyBank className="w-4 h-4" />;
    default: return <Hash className="w-4 h-4" />;
  }
}

export default function BudgetsEmptyState({
  monthName = "",
  onAddBudget,
  onAiRecommend,
  categories = [],
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  // Display up to 3 starter expense categories
  const starterCategories = categories.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4 shadow-2xs">
        <PieChart className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
        {t("budgets.empty_title") || (isEn ? "No Budgets Set for This Month" : "Belum Ada Anggaran untuk Bulan Ini")}
      </h3>

      <p className="text-slate-500 mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed font-medium">
        {isEn
          ? `You haven't set any category spending limits for ${monthName || "this month"}. Set category limits to keep your expenses under control.`
          : `Anda belum menentukan batas anggaran pengeluaran untuk ${monthName || "bulan ini"}. Buat anggaran kategori agar pengeluaran tetap terkontrol.`}
      </p>

      {/* Starter Category Cards */}
      {starterCategories.length > 0 && (
        <div className="mt-8 w-full max-w-2xl text-left">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">
            {t("budgets.starter_title") || (isEn ? "Choose a category to set your first budget:" : "Pilih kategori untuk memulai anggaran pertama:")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {starterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onAddBudget && onAddBudget(cat.id)}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  {getCategoryIconSmall(cat.icon)}
                </div>
                <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors truncate">
                  {cat.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                  <span>{isEn ? "Set monthly limit" : "Atur batas bulanan"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => onAddBudget && onAddBudget()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00685F] hover:bg-[#004D46] text-white font-bold rounded-2xl shadow-md shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("budgets.add_budget") || (isEn ? "Add Budget" : "Tambah Anggaran")}</span>
        </button>

        {onAiRecommend && (
          <button
            type="button"
            onClick={onAiRecommend}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-50 hover:bg-teal-100/70 text-[#00685F] border border-teal-200/60 font-bold rounded-2xl transition-all active:scale-95 text-xs sm:text-sm cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#00685F]" />
            <span>{isEn ? "Get AI Recommendations" : "Rekomendasi AI"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

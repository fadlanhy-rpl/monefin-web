import { ChevronLeft, ChevronRight, Plus, LayoutGrid, List, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function BudgetsHeader({
  isVisible,
  activeMonth,
  monthIndex,
  monthsLength,
  handlePrevMonth,
  handleNextMonth,
  viewMode,
  setViewMode,
  openAddModal,
  onAiRecommend
}) {
  const { t } = useLanguage();

  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t("budgets.title") || "Anggaran & Limits"}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
          {t("budgets.subtitle") || "Kendalikan pengeluaran Anda. Tetapkan batasan anggaran per kategori dan terima wawasan saat batas mulai menipis."}
        </p>
      </div>
      
      {/* Controls Container */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 w-full sm:w-auto flex-nowrap overflow-x-auto no-scrollbar py-1 select-none shrink-0">
        
        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-slate-200/50 shrink-0 h-9 sm:h-10">
          <button 
            onClick={() => setViewMode("card")}
            className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${viewMode === "card" ? "bg-white text-[#00685F] shadow-xs font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title={t("categories.card_view") || "Card"}
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-[#00685F] shadow-xs font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title={t("categories.list_view") || "List"}
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl px-1.5 sm:px-2.5 text-xs sm:text-sm font-bold shadow-xs shrink-0 h-9 sm:h-10">
          <button 
            type="button"
            onClick={handlePrevMonth}
            disabled={monthIndex === 0}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${monthIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span className="px-1.5 sm:px-3 text-slate-700 min-w-[75px] sm:min-w-[105px] text-center truncate">{activeMonth}</span>
          <button 
            type="button"
            onClick={handleNextMonth}
            disabled={monthIndex === monthsLength - 1}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${monthIndex === monthsLength - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* AI Recommend Button */}
        {onAiRecommend && (
          <button
            onClick={onAiRecommend}
            className="press-scale flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-500 to-brand-700 text-white px-2.5 sm:px-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer shrink-0 text-xs sm:text-sm h-9 sm:h-10"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">AI</span>
          </button>
        )}

        {/* Set New Budget Button */}
        <button 
          onClick={openAddModal}
          className="press-scale flex items-center justify-center gap-1.5 sm:gap-2 bg-[#00685F] text-white px-3 sm:px-4 md:px-5 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer shrink-0 text-xs sm:text-sm h-9 sm:h-10"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="whitespace-nowrap">{t("budgets.add_budget") || "Set New Budget"}</span>
        </button>
      </div>
    </div>
  );
}

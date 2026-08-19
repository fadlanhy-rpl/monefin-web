import { ChevronLeft, ChevronRight, Plus, LayoutGrid, List } from "lucide-react";
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
  openAddModal
}) {
  const { t } = useLanguage();

  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div className="flex-1 min-w-0 pr-4">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">{t("budgets.title") || "Monthly Budget"}</h2>
        <p className="text-gray-400 text-sm mt-1">{t("budgets.subtitle") || "Track your spending efficiency across categories"}</p>
      </div>
      
      {/* Horizontal scrollable container for controls, prevents wrapping, hides scrollbars, shrinks-0 for items */}
      <div className="flex flex-row items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 w-full md:w-auto select-none min-w-0">
        
        {/* View Switcher Toggle (shrink-0) */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 shrink-0">
          <button 
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "card" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title={t("categories.card_view") || "Card"}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title={t("categories.list_view") || "List"}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Month Switcher (shrink-0) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold shadow-sm shrink-0">
          <ChevronLeft 
            className={`w-4 h-4 cursor-pointer transition-colors ${monthIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700'}`} 
            onClick={handlePrevMonth}
          />
          <span className="px-4 text-slate-700 min-w-[100px] text-center">{activeMonth}</span>
          <ChevronRight 
            className={`w-4 h-4 cursor-pointer transition-colors ${monthIndex === monthsLength - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700'}`} 
            onClick={handleNextMonth}
          />
        </div>

        {/* Set New Budget Button (shrink-0) */}
        <button 
          onClick={openAddModal}
          className="press-scale flex items-center gap-1.5 sm:gap-2 bg-[#00685F] text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer shrink-0 text-xs sm:text-sm"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">{t("budgets.add_budget") || "Set New Budget"}</span>
        </button>
      </div>
    </div>
  );
}

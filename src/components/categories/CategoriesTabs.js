import { LayoutGrid, List } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function CategoriesTabs({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 select-none bg-white p-3 sm:p-4 rounded-3xl border border-slate-100 shadow-sm w-full">
      {/* Tab Switcher */}
      <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 border border-slate-100 w-full sm:w-auto">
        <button 
          onClick={() => setActiveTab("expense")}
          className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === "expense" 
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" 
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          {t("categories.expense") || "Pengeluaran"}
        </button>
        <button 
          onClick={() => setActiveTab("income")}
          className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === "income" 
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" 
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          {t("categories.income") || "Pemasukan"}
        </button>
      </div>

      {/* View Switcher (Card vs List) */}
      <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 border border-slate-100 w-full sm:w-auto justify-center">
        <button
          onClick={() => setViewMode("card")}
          title="Grid Card View"
          className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-[10px] sm:text-xs font-bold ${
            viewMode === "card"
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>{t("categories.card_view") || "Card"}</span>
        </button>
        <button
          onClick={() => setViewMode("list")}
          title="Sleek List View"
          className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-[10px] sm:text-xs font-bold ${
            viewMode === "list"
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>{t("categories.list_view") || "List"}</span>
        </button>
      </div>
    </div>
  );
}

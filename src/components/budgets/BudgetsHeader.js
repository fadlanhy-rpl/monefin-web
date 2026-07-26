import { ChevronLeft, ChevronRight, Plus, LayoutGrid, List } from "lucide-react";

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
  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Monthly Budget</h2>
        <p className="text-gray-400 text-sm mt-1">Track your spending efficiency across categories</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 select-none">
          <button 
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "card" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title="Tampilan Kartu (Card)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
            title="Tampilan Daftar (List)"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold shadow-sm select-none">
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

        {/* Set New Budget Button */}
        <button 
          onClick={openAddModal}
          className="press-scale flex items-center gap-2 bg-[#00685F] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Set New Budget
        </button>
      </div>
    </div>
  );
}

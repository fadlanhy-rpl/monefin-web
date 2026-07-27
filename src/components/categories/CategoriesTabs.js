import { LayoutGrid, List } from "lucide-react";

export default function CategoriesTabs({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 select-none bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      {/* Tab Switcher */}
      <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 border border-slate-100 w-full sm:w-auto">
        <button 
          onClick={() => setActiveTab("expense")}
          className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === "expense" 
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" 
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          Pengeluaran
        </button>
        <button 
          onClick={() => setActiveTab("income")}
          className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === "income" 
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" 
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* View Switcher (Card vs List) */}
      <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 border border-slate-100 w-full sm:w-auto justify-center">
        <button
          onClick={() => setViewMode("card")}
          title="Grid Card View"
          className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer text-xs font-bold ${
            viewMode === "card"
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>Card</span>
        </button>
        <button
          onClick={() => setViewMode("list")}
          title="Sleek List View"
          className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer text-xs font-bold ${
            viewMode === "list"
              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
              : "text-slate-500 hover:text-[#00685F] hover:bg-slate-100/50"
          }`}
        >
          <List className="w-4 h-4 shrink-0" />
          <span>List</span>
        </button>
      </div>
    </div>
  );
}

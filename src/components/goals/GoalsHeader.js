import { Plus } from "lucide-react";

export default function GoalsHeader({
  isVisible,
  activeGoalsCount,
  openAddModal
}) {
  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} space-y-4`}>

      {/* HEADER TITLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Target Tabungan</h2>
          <p className="text-xs sm:text-sm font-bold text-[#00685F] mt-1 flex items-center gap-2 select-none">
            <span className="w-2 h-2 bg-[#00685F] rounded-full animate-pulse"></span> 
            {activeGoalsCount} Active Goals
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-[#00685F] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00685F]/20 cursor-pointer text-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Buat Target Baru
        </button>
      </div>
    </div>
  );
}

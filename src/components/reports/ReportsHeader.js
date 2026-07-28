import { Calendar, Plus, FileText, FileSpreadsheet } from "lucide-react";

export default function ReportsHeader({
  isVisible,
  onNewTransaction,
  onExportPDF,
  onExportCSV
}) {
  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4`}>
      {/* Title & Date Range Badge */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Laporan Keuangan</h1>
        <div className="flex items-center gap-1.5 bg-[#E6F0EF] text-[#00685F] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#00685F]/10 italic shadow-xs">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>1 Jan 2026 - 30 Jun 2026</span>
        </div>
      </div>

      {/* Action Buttons - Single Horizontal Row (Non-Wrapping) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto max-w-full pb-1 sm:pb-0 select-none">
        <button 
          onClick={onNewTransaction}
          className="bg-[#00685F] text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>New Transaction</span>
        </button>
        <button 
          onClick={onExportPDF}
          className="bg-white border border-slate-200 text-slate-700 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
          <span>Export PDF Report</span>
        </button>
        <button 
          onClick={onExportCSV}
          className="bg-[#00685F] text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

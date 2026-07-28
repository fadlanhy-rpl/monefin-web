import { Calendar, Plus, FileText, FileSpreadsheet } from "lucide-react";

export default function ReportsHeader({
  onAddTransaction,
  onExportPDF,
  onExportCSV
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h2>
        <div className="flex items-center gap-1.5 bg-[#E6F0EF] text-[#00685F] px-3 py-1 rounded text-xs font-bold border border-[#00685F]/10 italic">
          <Calendar className="w-3.5 h-3.5" /> 1 Jan 2026 - 30 Jun 2026
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full lg:w-auto">
        <button 
          onClick={onAddTransaction}
          className="flex-1 lg:flex-initial bg-[#00685F] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Transaction
        </button>
        <button 
          onClick={onExportPDF}
          className="flex-1 lg:flex-initial bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4" /> Export PDF Report
        </button>
        <button 
          onClick={onExportCSV}
          className="flex-1 lg:flex-initial bg-[#00685F] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#004D46] transition cursor-pointer shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export CSV
        </button>
      </div>
    </div>
  );
}

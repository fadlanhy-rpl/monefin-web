"use client";

import { useState } from "react";
import { Calendar, Plus, FileText, FileSpreadsheet, ChevronDown, Sparkles } from "lucide-react";

export default function ReportsHeader({
  isVisible,
  onNewTransaction,
  onExportPDF,
  onExportCSV,
  selectedPeriod,
  onPeriodChange
}) {
  const [periodOpen, setPeriodOpen] = useState(false);

  const periods = [
    { id: "s1", label: "Semester 1 (Jan - Jun 2026)" },
    { id: "q1", label: "Kuartal 1 (Jan - Mar 2026)" },
    { id: "q2", label: "Kuartal 2 (Apr - Jun 2026)" },
    { id: "full", label: "Tahun Penuh 2026" }
  ];

  const currentPeriodLabel = periods.find(p => p.id === selectedPeriod)?.label || "1 Jan 2026 - 30 Jun 2026";

  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4`}>
      {/* Title & Interactive Date Range Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Laporan Keuangan</h1>
          <Sparkles className="w-5 h-5 text-[#00685F] animate-pulse hidden sm:block" />
        </div>

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-2 bg-[#E6F0EF] text-[#00685F] hover:bg-[#d5e8e6] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#00685F]/15 transition-all cursor-pointer shadow-xs select-none"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0 text-[#00685F]" />
            <span>{currentPeriodLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${periodOpen ? 'rotate-180' : ''}`} />
          </button>

          {periodOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Pilih Periode Laporan
              </div>
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onPeriodChange(p.id);
                    setPeriodOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedPeriod === p.id 
                      ? "bg-[#E6F0EF] text-[#00685F]" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{p.label}</span>
                  {selectedPeriod === p.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00685F]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Single Horizontal Row (Non-Wrapping with micro-animations) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto max-w-full pb-1 sm:pb-0 select-none">
        <button 
          onClick={onNewTransaction}
          className="bg-[#00685F] text-white px-3 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Transaction</span>
        </button>
        <button 
          onClick={onExportPDF}
          className="bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
          <span>Export PDF Report</span>
        </button>
        <button 
          onClick={onExportCSV}
          className="bg-[#00685F] text-white px-3 sm:px-4 py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

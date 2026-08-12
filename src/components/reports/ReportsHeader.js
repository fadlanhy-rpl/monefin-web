"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Plus, FileSpreadsheet, Sparkles, X } from "lucide-react";

// Preset chips configuration
const PRESETS = [
  {
    id: "this_month",
    label: "Bulan Ini",
    getRange: () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      return { start_month: `${y}-${m}`, end_month: `${y}-${m}` };
    },
  },
  {
    id: "3_months",
    label: "3 Bulan",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 2);
      return {
        start_month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
        end_month:   `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}`,
      };
    },
  },
  {
    id: "6_months",
    label: "6 Bulan",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 5);
      return {
        start_month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
        end_month:   `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}`,
      };
    },
  },
  {
    id: "this_year",
    label: "Tahun Ini",
    getRange: () => {
      const y = new Date().getFullYear();
      return { start_month: `${y}-01`, end_month: `${y}-12` };
    },
  },
];

export default function ReportsHeader({
  isVisible,
  onNewTransaction,
  onExportCSV,
  activePreset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomRangeChange,
  loading,
}) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [localStart, setLocalStart] = useState(customStart || "");
  const [localEnd, setLocalEnd]     = useState(customEnd || "");
  const pickerRef = useRef(null);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowCustomPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleApplyCustom = () => {
    if (localStart && localEnd) {
      onCustomRangeChange(localStart, localEnd);
      setShowCustomPicker(false);
    }
  };

  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} flex flex-col gap-5 relative z-20`}>
      {/* Top Row: Title + Action Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Laporan Keuangan
              <Sparkles className="w-5 h-5 text-[#00685F] animate-pulse hidden sm:block" />
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Analisis mendalam keuangan Anda dalam satu tampilan</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-nowrap shrink-0">
          <button
            onClick={onNewTransaction}
            className="bg-[#00685F] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
            <span>Transaksi Baru</span>
          </button>

          <button
            onClick={onExportCSV}
            disabled={loading}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#00685F]/30 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 group disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Quick Preset Chips + Custom Range Picker */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm relative z-20">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Periode:
        </span>

        {/* Preset Chips */}
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset.id, preset.getRange())}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              activePreset === preset.id && !showCustomPicker
                ? "bg-[#00685F] text-white border-[#00685F] shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-100 hover:border-[#00685F]/30 hover:text-[#00685F]"
            }`}
          >
            {preset.label}
          </button>
        ))}

        {/* Custom Range Picker */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
              activePreset === "custom"
                ? "bg-[#00685F] text-white border-[#00685F] shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-100 hover:border-[#00685F]/30 hover:text-[#00685F]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {activePreset === "custom" && customStart && customEnd
              ? `${customStart} → ${customEnd}`
              : "Custom Range"}
          </button>

          {showCustomPicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-30 w-72 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-700">Pilih Rentang Bulan</h4>
                <button onClick={() => setShowCustomPicker(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dari Bulan</label>
                  <input
                    type="month"
                    value={localStart}
                    onChange={(e) => setLocalStart(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sampai Bulan</label>
                  <input
                    type="month"
                    value={localEnd}
                    min={localStart}
                    onChange={(e) => setLocalEnd(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition"
                  />
                </div>
              </div>
              <button
                onClick={handleApplyCustom}
                disabled={!localStart || !localEnd}
                className="w-full py-2.5 bg-[#00685F] hover:bg-[#004D46] text-white rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                Terapkan Filter
              </button>
            </div>
          )}
        </div>

        {/* Active period label */}
        {activePreset === "custom" && customStart && customEnd && (
          <span className="text-[10px] font-bold text-[#00685F] bg-[#00685F]/5 px-2.5 py-1 rounded-lg border border-[#00685F]/10 select-none">
            {customStart} → {customEnd}
          </span>
        )}
      </div>
    </div>
  );
}

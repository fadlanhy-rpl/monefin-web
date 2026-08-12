"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Plus, FileSpreadsheet, Sparkles, X, ChevronLeft, ChevronRight, ArrowRight, Check } from "lucide-react";

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

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const formatMY = (ymStr) => {
  if (!ymStr) return "-";
  const [y, m] = ymStr.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${MONTH_NAMES[idx] || m} ${y}`;
};

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
  const [localStart, setLocalStart] = useState(customStart || `${new Date().getFullYear()}-01`);
  const [localEnd, setLocalEnd]     = useState(customEnd || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab]   = useState("start"); // "start" | "end"

  const pickerRef = useRef(null);

  useEffect(() => {
    if (customStart) setLocalStart(customStart);
    if (customEnd)   setLocalEnd(customEnd);
  }, [customStart, customEnd]);

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

  const handleMonthClick = (mIdx) => {
    const mStr = String(mIdx + 1).padStart(2, "0");
    const ymVal = `${pickerYear}-${mStr}`;

    if (activeTab === "start") {
      setLocalStart(ymVal);
      if (localEnd && ymVal > localEnd) {
        setLocalEnd(ymVal);
      }
      setActiveTab("end");
    } else {
      if (localStart && ymVal < localStart) {
        setLocalStart(ymVal);
      } else {
        setLocalEnd(ymVal);
      }
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
              ? `${formatMY(customStart)} → ${formatMY(customEnd)}`
              : "Custom Range"}
          </button>

          {/* Ultra Modern Custom Calendar Range Modal */}
          {showCustomPicker && (
            <div className="absolute top-full left-0 sm:left-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-30 w-80 sm:w-84 space-y-5 animate-in fade-in zoom-in-95 duration-200 select-none">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F0EF] text-[#00685F] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 tracking-tight">Pilih Rentang Bulan</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Tentukan periode laporan custom</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomPicker(false)} 
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-xl transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Start & End Tabs / Active Range Card */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("start")}
                  className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    activeTab === "start"
                      ? "bg-white text-[#00685F] border-[#00685F]/30 shadow-xs"
                      : "text-slate-500 border-transparent hover:text-slate-800"
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400">Dari Bulan</span>
                  <span className="text-xs font-black truncate block mt-0.5">{formatMY(localStart)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("end")}
                  className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    activeTab === "end"
                      ? "bg-white text-[#00685F] border-[#00685F]/30 shadow-xs"
                      : "text-slate-500 border-transparent hover:text-slate-800"
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400">Sampai Bulan</span>
                  <span className="text-xs font-black truncate block mt-0.5">{formatMY(localEnd)}</span>
                </button>
              </div>

              {/* Year Navigation Bar */}
              <div className="flex items-center justify-between px-2 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setPickerYear(y => y - 1)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black text-slate-900 tracking-tight">{pickerYear}</span>
                <button
                  type="button"
                  onClick={() => setPickerYear(y => y + 1)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month Grid (12 Months) */}
              <div className="grid grid-cols-4 gap-2">
                {MONTH_NAMES.map((mName, idx) => {
                  const mStr = String(idx + 1).padStart(2, "0");
                  const ymVal = `${pickerYear}-${mStr}`;
                  const isStart = localStart === ymVal;
                  const isEnd = localEnd === ymVal;
                  const isInRange = localStart && localEnd && ymVal > localStart && ymVal < localEnd;

                  let btnStyle = "bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border-slate-100";
                  if (isStart || isEnd) {
                    btnStyle = "bg-[#00685F] text-white font-black border-[#00685F] shadow-sm scale-105";
                  } else if (isInRange) {
                    btnStyle = "bg-[#E6F0EF] text-[#00685F] font-black border-[#00685F]/20";
                  }

                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => handleMonthClick(idx)}
                      className={`py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer border text-center relative ${btnStyle}`}
                    >
                      <span>{mName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!localStart || !localEnd}
                className="w-full py-3 bg-[#00685F] hover:bg-[#004D46] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00685F]/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan Filter</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

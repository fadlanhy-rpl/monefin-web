"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  X,
  Check
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAY_NAMES_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RecurringDatePicker({ 
  value, 
  onChange, 
  label = "Tanggal Mulai Berlaku",
  placeholder 
}) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const modalCardRef = useRef(null);

  const MONTH_NAMES = isEn ? MONTH_NAMES_EN : MONTH_NAMES_ID;
  const DAY_NAMES = isEn ? DAY_NAMES_EN : DAY_NAMES_ID;

  // Parse YYYY-MM-DD
  const parseDateStr = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = String(dateStr).split("-");
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date();
  };

  const selectedDate = value ? parseDateStr(value) : null;
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    if (value) {
      setViewDate(parseDateStr(value));
    }
  }, [value]);

  const handleOpen = () => {
    if (value) {
      setViewDate(parseDateStr(value));
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const formatDateToYYYYMMDD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSelectDay = (dayNumber) => {
    const newD = new Date(year, month, dayNumber);
    onChange(formatDateToYYYYMMDD(newD));
    setIsOpen(false);
  };

  // Quick Preset Handlers
  const handleQuickPreset = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate = new Date(today);

    if (type === "today") {
      targetDate = new Date(today);
    } else if (type === "tomorrow") {
      targetDate.setDate(today.getDate() + 1);
    } else if (type === "next_month_first") {
      targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else if (type === "payday_25") {
      if (today.getDate() > 25) {
        targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 25);
      } else {
        targetDate = new Date(today.getFullYear(), today.getMonth(), 25);
      }
    }

    onChange(formatDateToYYYYMMDD(targetDate));
    setViewDate(targetDate);
    setIsOpen(false);
  };

  // Calendar Math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const gridCells = [];
  // Previous month trailing
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: true,
    });
  }
  // Next month leading (fill to 35 or 42)
  const targetTotal = gridCells.length > 35 ? 42 : 35;
  const remaining = targetTotal - gridCells.length;
  for (let i = 1; i <= remaining; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  // Formatting display date
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return placeholder || (isEn ? "Select start date" : "Pilih tanggal mulai");
    const d = parseDateStr(dateStr);
    const day = d.getDate();
    const mName = MONTH_NAMES[d.getMonth()];
    const y = d.getFullYear();

    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

    const dayName = isEn 
      ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()]
      : ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][d.getDay()];

    return {
      main: `${dayName}, ${day} ${mName} ${y}`,
      short: `${day} ${mName} ${y}`,
      isToday,
    };
  };

  const displayInfo = formatDisplayDate(value);
  const todayDate = new Date();

  return (
    <>
      {/* Trigger Button Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
          {label} <span className="text-rose-500">*</span>
        </label>

        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className={`w-full px-4 py-3 bg-slate-50/90 hover:bg-white border rounded-2xl flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer shadow-2xs group ${
            isOpen
              ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white shadow-xs"
              : "border-slate-200/90 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              isOpen 
                ? "bg-[#00685F] text-white border-[#00685F]" 
                : "bg-emerald-50 text-[#00685F] border-emerald-100 group-hover:scale-105"
            }`}>
              <CalendarIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {typeof displayInfo === "object" ? displayInfo.main : displayInfo}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                {typeof displayInfo === "object" && displayInfo.isToday && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isEn ? "Today" : "Hari Ini"}
                  </span>
                )}
                <span>{isEn ? "Click to pick start date" : "Klik untuk pilih tanggal"}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#00685F]/10 group-hover:text-[#00685F] transition-colors">
            {isEn ? "Pick Date" : "Ubah"}
          </div>
        </button>

        <p className="text-[11px] text-slate-400">
          {isEn 
            ? "The recurring schedule will start running automatically from this date." 
            : "Otomasi jadwal transaksi ini akan mulai berjalan aktif sejak tanggal ini."}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* CENTERED CALENDAR MODAL (100% UNCLIPPED, NEVER CUT OFF BY VIEWPORT EDGE)   */}
      {/* ========================================================================= */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          {/* Backdrop Click Outside */}
          <div className="fixed inset-0 -z-10" onClick={handleClose} aria-hidden="true" />

          {/* Centered Calendar Card */}
          <div
            ref={modalCardRef}
            className="bg-white border border-slate-200/90 rounded-[2rem] shadow-2xl p-4 sm:p-5 max-w-[340px] w-full select-none animate-in zoom-in-95 duration-150 relative max-h-[92vh] overflow-y-auto overscroll-contain shadow-slate-900/20"
          >
            {/* Header: Title & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00685F]/10 text-[#00685F] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {isEn ? "Select Start Date" : "Pilih Tanggal Mulai"}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title={isEn ? "Close" : "Tutup"}
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Presets Row */}
            <div className="py-2.5 border-b border-slate-100">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("today")}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/70 transition cursor-pointer text-center"
                >
                  {isEn ? "Today" : "Hari Ini"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("tomorrow")}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/70 transition cursor-pointer text-center"
                >
                  {isEn ? "Tomorrow" : "Besok"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("next_month_first")}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/70 transition cursor-pointer text-center truncate"
                  title={isEn ? "Next Month (1st)" : "Awal Bulan Depan"}
                >
                  {isEn ? "Next Mth (1st)" : "Awal Bln"}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("payday_25")}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/70 transition cursor-pointer text-center"
                >
                  {isEn ? "Payday (25)" : "Gajian (25)"}
                </button>
              </div>
            </div>

            {/* Month & Year Navigation */}
            <div className="flex items-center justify-between pt-3 pb-2 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title={isEn ? "Previous Month" : "Bulan Sebelumnya"}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="text-center">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  {MONTH_NAMES[month]} {year}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title={isEn ? "Next Month" : "Bulan Berikutnya"}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {DAY_NAMES.map((d, idx) => (
                <span
                  key={d}
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    idx === 0 ? "text-rose-500" : "text-slate-400"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={idx}
                      className="h-8.5 flex items-center justify-center text-xs font-semibold text-slate-300 pointer-events-none select-none"
                    >
                      {cell.day}
                    </div>
                  );
                }

                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === cell.day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                const isToday =
                  todayDate.getDate() === cell.day &&
                  todayDate.getMonth() === month &&
                  todayDate.getFullYear() === year;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDay(cell.day)}
                    className={`h-8.5 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/30 scale-105"
                        : isToday
                        ? "bg-[#00685F]/10 text-[#00685F] ring-2 ring-[#00685F]/20 hover:bg-[#00685F]/20"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Footer with Selected Date Summary & Done Button */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold truncate">
                <span className="w-2 h-2 rounded-full bg-[#00685F]" />
                <span className="truncate">
                  {typeof displayInfo === "object" ? displayInfo.short : displayInfo}
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-[#00685F] text-white text-xs font-bold hover:bg-[#004D46] transition active:scale-95 cursor-pointer shadow-xs"
              >
                {isEn ? "Done" : "Selesai"}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

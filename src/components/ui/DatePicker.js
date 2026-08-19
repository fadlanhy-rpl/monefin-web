import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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

export default function DatePicker({ value, onChange, placeholder = "Pilih Tanggal" }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const MONTH_NAMES = language === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ID;
  const DAY_NAMES = language === 'en' ? DAY_NAMES_EN : DAY_NAMES_ID;

  // Parse initial date from YYYY-MM-DD
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

  // Update viewDate when value changes
  useEffect(() => {
    if (value) {
      setViewDate(parseDateStr(value));
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Navigation handlers
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

  const handleToday = (e) => {
    e.stopPropagation();
    const todayDate = new Date();
    const formattedStr = formatDateToYYYYMMDD(todayDate);
    onChange(formattedStr);
    setViewDate(todayDate);
    setIsOpen(false);
  };

  const handleSelectDay = (dayNumber) => {
    const newD = new Date(year, month, dayNumber);
    onChange(formatDateToYYYYMMDD(newD));
    setIsOpen(false);
  };

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Build grid cells
  const gridCells = [];
  
  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: true
    });
  }

  // Next month leading days (fill up 35 or 42 cells)
  const totalCellsSoFar = gridCells.length;
  const targetTotal = totalCellsSoFar > 35 ? 42 : 35;
  for (let i = 1; i <= targetTotal - totalCellsSoFar; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: false,
      isNext: true
    });
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return placeholder;
    const d = parseDateStr(dateStr);
    const day = d.getDate();
    const mName = MONTH_NAMES[d.getMonth()];
    const y = d.getFullYear();
    
    // Check if today
    const now = new Date();
    if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return `${language === 'en' ? 'Today' : 'Hari ini'}, ${day} ${mName} ${y}`;
    }
    return `${day} ${mName} ${y}`;
  };

  const todayDate = new Date();

  return (
    <div className="relative select-none" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${
          isOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00685F]/10 text-[#00685F] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <span className={value ? "text-slate-900 font-extrabold" : "text-slate-400 font-medium"}>
            {formatDisplayDate(value)}
          </span>
        </div>
      </button>

      {/* Floating Modern Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[80] p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {MONTH_NAMES[month]} {year}
              </h4>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d, idx) => (
              <span
                key={d}
                className={`text-[10px] font-black uppercase tracking-wider ${
                  idx === 0 ? "text-red-400" : "text-slate-400"
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
                    className="h-9 flex items-center justify-center text-xs font-semibold text-slate-300 pointer-events-none select-none"
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
                  className={`h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all cursor-pointer ${
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

          {/* Quick Action Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center px-1">
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-extrabold text-[#00685F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> {language === 'en' ? 'Today' : 'Hari Ini'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {language === 'en' ? 'Close' : 'Tutup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

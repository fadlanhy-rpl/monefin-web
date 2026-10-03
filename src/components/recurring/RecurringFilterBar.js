"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { 
  Search, 
  X, 
  Calendar, 
  ChevronDown, 
  Layers, 
  Check,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function RecurringFilterBar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  freqFilter,
  setFreqFilter,
  statusFilter,
  setStatusFilter,
  isVisible = true,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [freqOpen, setFreqOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [freqCoords, setFreqCoords] = useState(null);
  const [statusCoords, setStatusCoords] = useState(null);

  const freqRef = useRef(null);
  const statusRef = useRef(null);
  const freqMenuRef = useRef(null);
  const statusMenuRef = useRef(null);

  const isFiltered = Boolean(
    searchQuery.trim() ||
    typeFilter !== "all" ||
    freqFilter !== "all" ||
    statusFilter !== "all"
  );

  const handleResetAll = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setFreqFilter("all");
    setStatusFilter("all");
  };

  const handleToggleFreq = () => {
    if (freqOpen) {
      setFreqOpen(false);
    } else {
      if (freqRef.current) {
        const rect = freqRef.current.getBoundingClientRect();
        setFreqCoords(rect);
      }
      setFreqOpen(true);
      setStatusOpen(false);
    }
  };

  const handleToggleStatus = () => {
    if (statusOpen) {
      setStatusOpen(false);
    } else {
      if (statusRef.current) {
        const rect = statusRef.current.getBoundingClientRect();
        setStatusCoords(rect);
      }
      setStatusOpen(true);
      setFreqOpen(false);
    }
  };

  const getDropdownStyle = (rect, width = 200) => {
    if (!rect || typeof window === "undefined") return {};
    const padding = 12;
    let left = rect.left;
    if (left + width > window.innerWidth - padding) {
      left = Math.max(padding, rect.right - width);
    }
    if (left < padding) {
      left = padding;
    }
    let top = rect.bottom + 6;
    const estHeight = 200;
    if (top + estHeight > window.innerHeight && rect.top - estHeight - 6 > 0) {
      top = rect.top - estHeight - 6;
    }
    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      zIndex: 9999,
    };
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        freqRef.current && !freqRef.current.contains(e.target) &&
        (!freqMenuRef.current || !freqMenuRef.current.contains(e.target))
      ) {
        setFreqOpen(false);
      }
      if (
        statusRef.current && !statusRef.current.contains(e.target) &&
        (!statusMenuRef.current || !statusMenuRef.current.contains(e.target))
      ) {
        setStatusOpen(false);
      }
    }

    function handleScrollOrResize() {
      setFreqOpen(false);
      setStatusOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  return (
    <>
      <div className={`bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs transition-all duration-500 delay-150 ease-out transform relative z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#00685F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("recurring.search_placeholder") || (isEn ? "Search schedule title, category, or account..." : "Cari nama jadwal, kategori, atau rekening...")}
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-7 h-7 rounded-xl flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                title={isEn ? "Clear search" : "Hapus pencarian"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Controls Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full lg:w-auto shrink-0 select-none">
            
            {/* Type Filters Segmented Pill */}
            <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center shrink-0 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] flex items-center gap-1.5 ${
                  typeFilter === "all" 
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <span>{t("recurring.filter_all") || (isEn ? "All" : "Semua")}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setTypeFilter("income")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] flex items-center gap-1.5 ${
                  typeFilter === "income" 
                    ? "bg-white text-emerald-700 shadow-2xs border border-slate-200/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t("recurring.filter_income") || (isEn ? "Income" : "Pemasukan")}</span>
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("expense")}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] flex items-center gap-1.5 ${
                  typeFilter === "expense" 
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{t("recurring.filter_expense") || (isEn ? "Expense" : "Pengeluaran")}</span>
              </button>
            </div>

            {/* Frequency Dropdown Trigger */}
            <div className="relative shrink-0" ref={freqRef}>
              <button
                type="button"
                onClick={handleToggleFreq}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] border ${
                  freqOpen 
                    ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white text-[#00685F] shadow-xs" 
                    : freqFilter !== "all"
                    ? "border-[#00685F]/40 bg-[#00685F]/5 text-[#00685F]"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-700"
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${freqFilter !== "all" || freqOpen ? "text-[#00685F]" : "text-slate-400"}`} />
                <span>
                  {freqFilter === "daily"
                    ? (t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian"))
                    : freqFilter === "weekly"
                    ? (t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan"))
                    : freqFilter === "monthly"
                    ? (t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan"))
                    : (t("recurring.frequency_all") || (isEn ? "All Frequencies" : "Semua Frekuensi"))}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  freqOpen ? "rotate-180 text-[#00685F]" : "text-slate-400"
                }`} />
              </button>
            </div>

            {/* Status Dropdown Trigger */}
            <div className="relative shrink-0" ref={statusRef}>
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] border ${
                  statusOpen 
                    ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white text-[#00685F] shadow-xs" 
                    : statusFilter !== "all"
                    ? "border-[#00685F]/40 bg-[#00685F]/5 text-[#00685F]"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200/90 text-slate-700"
                }`}
              >
                {statusFilter === "active" ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                ) : statusFilter === "paused" ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                ) : (
                  <Layers className={`w-3.5 h-3.5 ${statusFilter !== "all" || statusOpen ? "text-[#00685F]" : "text-slate-400"}`} />
                )}
                <span>
                  {statusFilter === "active"
                    ? (t("recurring.status_active") || (isEn ? "Active" : "Aktif"))
                    : statusFilter === "paused"
                    ? (t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"))
                    : (isEn ? "All Status" : "Semua Status")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  statusOpen ? "rotate-180 text-[#00685F]" : "text-slate-400"
                }`} />
              </button>
            </div>

            {/* Reset All Filters Pill Button (Visible only when filters applied) */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition cursor-pointer shrink-0 min-h-[40px] active:scale-95"
                title={isEn ? "Reset all filters" : "Reset semua filter"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? "Reset" : "Reset"}</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Floating Frequency Dropdown (Portaled) */}
      {mounted && freqOpen && freqCoords && createPortal(
        <div
          ref={freqMenuRef}
          style={getDropdownStyle(freqCoords, 200)}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/10 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {[
            { value: "all", label: t("recurring.frequency_all") || (isEn ? "All Frequencies" : "Semua Frekuensi") },
            { value: "daily", label: t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian") },
            { value: "weekly", label: t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan") },
            { value: "monthly", label: t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan") },
          ].map((opt) => {
            const isSelected = freqFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setFreqFilter(opt.value);
                  setFreqOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00685F]/10 text-[#00685F]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#00685F] stroke-[2.5]" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}

      {/* Floating Status Dropdown (Portaled) */}
      {mounted && statusOpen && statusCoords && createPortal(
        <div
          ref={statusMenuRef}
          style={getDropdownStyle(statusCoords, 185)}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/10 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {[
            { value: "all", label: isEn ? "All Status" : "Semua Status", dot: null },
            { value: "active", label: t("recurring.status_active") || (isEn ? "Active" : "Aktif"), dot: "bg-emerald-500" },
            { value: "paused", label: t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"), dot: "bg-amber-400" },
          ].map((opt) => {
            const isSelected = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value);
                  setStatusOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00685F]/10 text-[#00685F]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.dot ? (
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                  ) : (
                    <Layers className={`w-3.5 h-3.5 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                  )}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#00685F] stroke-[2.5]" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

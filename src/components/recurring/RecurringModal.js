"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  ChevronDown, 
  Check, 
  RefreshCcw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Tag, 
  Clock,
  Sparkles,
  CalendarDays,
  CalendarCheck,
  Search,
  Info,
  Calendar,
  Minus,
  Plus
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { getCategoryIcon, getCategoryColorStyle } from "../../lib/categoryIcons";
import RecurringDatePicker from "./RecurringDatePicker";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function RecurringModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formState,
  setFormState,
  categories = [],
  accounts = [],
  isSaving = false,
}) {
  const { t, language } = useLanguage();
  const { currencySymbol, formatCurrency } = useCurrency();
  const isEn = language === "en";

  const [openDropdown, setOpenDropdown] = useState(null); // 'account' | 'category' | null
  const [accountSearch, setAccountSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllDays, setShowAllDays] = useState(true); // Toggle 31-day matrix
  
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dropdownRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset local search filters on close
  useEffect(() => {
    if (!isOpen) {
      setOpenDropdown(null);
      setAccountSearch("");
      setCategorySearch("");
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Formatting helpers
  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const str = String(val).trim();
    const normalized =
      typeof val === "number" || /^-?\d+\.\d{1,2}$/.test(str)
        ? String(Math.round(Number(val) || 0))
        : str;
    const raw = normalized.replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleAmountChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormState({ ...formState, amount: rawDigits });
  };

  const handleSetQuickAmount = (val) => {
    setFormState({ ...formState, amount: String(val) });
  };

  const filteredCategories = categories
    .filter((c) => c.type === formState.type)
    .filter((c) => !categorySearch.trim() || c.name.toLowerCase().includes(categorySearch.toLowerCase()));

  const filteredAccounts = accounts.filter(
    (a) => !accountSearch.trim() || a.name.toLowerCase().includes(accountSearch.toLowerCase())
  );

  const selectedCategory = categories.find((c) => String(c.id) === String(formState.category_id));
  const selectedAccount = accounts.find((a) => String(a.id) === String(formState.account_id));

  // Quick Amount Recommendations based on Type
  const quickAmountOptions = formState.type === "income"
    ? [
        { label: "1 Jt", value: 1000000 },
        { label: "2.5 Jt", value: 2500000 },
        { label: "5 Jt", value: 5000000 },
        { label: "10 Jt", value: 10000000 },
      ]
    : [
        { label: "50 Rb", value: 50000 },
        { label: "100 Rb", value: 100000 },
        { label: "350 Rb", value: 350000 },
        { label: "1 Jt", value: 1000000 },
      ];

  // Title suggestions
  const suggestedTitles = formState.type === "income"
    ? [
        isEn ? "Monthly Salary" : "Gaji Bulanan",
        isEn ? "Freelance Retainer" : "Proyek Lepas",
        isEn ? "Investment Dividend" : "Dividen Saham",
        isEn ? "Allowance" : "Uang Saku",
      ]
    : [
        isEn ? "WiFi & Internet" : "WiFi & Internet",
        isEn ? "Electricity Bill" : "Listrik PLN",
        isEn ? "Streaming (Netflix)" : "Netflix / Spotify",
        isEn ? "House / Room Rent" : "Sewa Kosan",
        isEn ? "Gym Membership" : "Membership Gym",
      ];

  const periodCards = [
    { 
      value: "daily", 
      label: isEn ? "Daily" : "Harian", 
      desc: isEn ? "Every 1 day" : "Setiap 1 hari",
      icon: Clock 
    },
    { 
      value: "weekly", 
      label: isEn ? "Weekly" : "Mingguan", 
      desc: isEn ? "Every 7 days" : "Setiap 7 hari",
      icon: CalendarDays 
    },
    { 
      value: "monthly", 
      label: isEn ? "Monthly" : "Bulanan", 
      desc: isEn ? "Every month" : "Setiap 1 bulan",
      icon: CalendarCheck 
    },
  ];

  // ================= DAY & DATE HELPERS =================
  const getEffectiveDayNumber = () => {
    if (!formState.effective_date) return new Date().getDate();
    const parts = formState.effective_date.split("-");
    if (parts.length === 3) return parseInt(parts[2], 10);
    return new Date().getDate();
  };

  const getEffectiveDayOfWeek = () => {
    if (!formState.effective_date) return new Date().getDay();
    const parts = formState.effective_date.split("-");
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.getDay();
    }
    return new Date().getDay();
  };

  // Adjust effective_date for Monthly Day-of-Month (Free 1-31 picker)
  const handleSelectDayOfMonth = (dayNumber) => {
    const clampedDay = Math.max(1, Math.min(31, parseInt(dayNumber, 10) || 1));
    const curDate = formState.effective_date ? new Date(formState.effective_date) : new Date();
    const year = curDate.getFullYear();
    const month = curDate.getMonth();
    
    // Days in current selected month
    const maxDays = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(clampedDay, maxDays);
    
    const yyyy = String(year);
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(safeDay).padStart(2, "0");
    
    setFormState({ ...formState, effective_date: `${yyyy}-${mm}-${dd}` });
  };

  // Stepper increment/decrement for day of month
  const handleStepDayOfMonth = (delta) => {
    const current = getEffectiveDayNumber();
    let next = current + delta;
    if (next < 1) next = 31;
    if (next > 31) next = 1;
    handleSelectDayOfMonth(next);
  };

  // Adjust effective_date for Weekly Day-of-Week
  const handleSelectDayOfWeek = (targetDayIndex) => { // 0: Sunday, 1: Monday, ... 6: Saturday
    const today = new Date();
    const curDay = today.getDay();
    let diff = targetDayIndex - curDay;
    if (diff < 0) diff += 7; // next occurrence
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    setFormState({ ...formState, effective_date: `${yyyy}-${mm}-${dd}` });
  };

  const daysOfWeekLabels = isEn 
    ? [
        { idx: 1, label: "Mon", full: "Monday" },
        { idx: 2, label: "Tue", full: "Tuesday" },
        { idx: 3, label: "Wed", full: "Wednesday" },
        { idx: 4, label: "Thu", full: "Thursday" },
        { idx: 5, label: "Fri", full: "Friday" },
        { idx: 6, label: "Sat", full: "Saturday" },
        { idx: 0, label: "Sun", full: "Sunday" },
      ]
    : [
        { idx: 1, label: "Sen", full: "Senin" },
        { idx: 2, label: "Sel", full: "Selasa" },
        { idx: 3, label: "Rab", full: "Rabu" },
        { idx: 4, label: "Kam", full: "Kamis" },
        { idx: 5, label: "Jum", full: "Jumat" },
        { idx: 6, label: "Sab", full: "Sabtu" },
        { idx: 0, label: "Min", full: "Minggu" },
      ];

  const currentDayNum = getEffectiveDayNumber();
  const currentWeekDayIdx = getEffectiveDayOfWeek();
  const currentWeekDayObj = daysOfWeekLabels.find((d) => d.idx === currentWeekDayIdx) || daysOfWeekLabels[0];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50/80 to-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00685F]/10 text-[#00685F] border border-[#00685F]/20 flex items-center justify-center shrink-0 shadow-2xs">
              <RefreshCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00685F] animate-pulse" />
                <span className="text-[#00685F] text-[10px] font-extrabold uppercase tracking-wider">
                  {isEn ? "Financial Automation" : "Otomasi Transaksi Rutin"}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug mt-0.5">
                {modalMode === "add"
                  ? (t("recurring.modal_add_title") || (isEn ? "Add Recurring Transaction" : "Tambah Transaksi Rutin"))
                  : (t("recurring.modal_edit_title") || (isEn ? "Edit Recurring Transaction" : "Edit Transaksi Rutin"))}
              </h3>
            </div>
          </div>
          
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* ================= MODAL FORM BODY ================= */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 overscroll-contain" ref={dropdownRef}>
            
            {/* 1. Transaction Type Segmented Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_type") || (isEn ? "Transaction Type" : "Jenis Transaksi")}
              </label>
              
              <div className="grid grid-cols-2 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    const nextCat = categories.find((c) => c.type === "expense")?.id || "";
                    setFormState({ ...formState, type: "expense", category_id: nextCat });
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[42px] ${
                    formState.type === "expense"
                      ? "bg-white text-rose-700 shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ArrowDownLeft className={`w-4 h-4 stroke-[2.5] ${formState.type === "expense" ? "text-rose-600" : "text-slate-400"}`} />
                  <span>{t("recurring.filter_expense") || (isEn ? "Expense" : "Pengeluaran")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextCat = categories.find((c) => c.type === "income")?.id || "";
                    setFormState({ ...formState, type: "income", category_id: nextCat });
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[42px] ${
                    formState.type === "income"
                      ? "bg-white text-[#00685F] shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <ArrowUpRight className={`w-4 h-4 stroke-[2.5] ${formState.type === "income" ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{t("recurring.filter_income") || (isEn ? "Income" : "Pemasukan")}</span>
                </button>
              </div>
            </div>

            {/* 2. Hero Amount Input Card */}
            <div className="bg-slate-50/90 rounded-3xl p-4 sm:p-5 border border-slate-200/90 focus-within:border-[#00685F] focus-within:ring-4 focus-within:ring-[#00685F]/10 focus-within:bg-white transition-all shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t("recurring.field_amount") || (isEn ? "Amount" : "Nominal")} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {formState.type === "income" ? (isEn ? "Adds to balance" : "Menambah saldo otomatis") : (isEn ? "Deducts balance" : "Memotong saldo otomatis")}
                </span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1.5 rounded-xl bg-slate-200/70 text-slate-800 text-xs sm:text-sm font-black shrink-0">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formState.amount)}
                  onChange={handleAmountChange}
                  className="w-full text-2xl sm:text-3xl font-black font-mono text-slate-900 tabular-nums outline-none bg-transparent placeholder:text-slate-300"
                  placeholder="0"
                  autoFocus={modalMode === "add"}
                />
              </div>

              {/* Quick Amount Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 mr-1">
                  {isEn ? "Quick:" : "Cepat:"}
                </span>
                {quickAmountOptions.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => handleSetQuickAmount(q.value)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white hover:bg-[#00685F]/10 hover:text-[#00685F] border border-slate-200 text-slate-600 shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Schedule Title & Quick Suggestions */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_title") || (isEn ? "Schedule Title" : "Nama Transaksi")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                placeholder={t("recurring.field_title_placeholder") || (isEn ? "e.g. Monthly Salary, Netflix, Gym" : "Mis. Gaji Pokok, Netflix, Listrik PLN")}
              />
              
              {/* Quick Title Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400">
                  {isEn ? "Preset:" : "Contoh:"}
                </span>
                {suggestedTitles.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormState({ ...formState, title: st })}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Frequency Selector Cards */}
            <div className="space-y-3">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_frequency") || (isEn ? "Frequency Interval" : "Frekuensi Jadwal")}
              </label>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {periodCards.map((opt) => {
                  const isSelected = formState.period_type === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormState({ ...formState, period_type: opt.value })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-[#00685F] bg-[#00685F]/5 ring-2 ring-[#00685F]/15 shadow-2xs"
                          : "border-slate-200/90 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00685F] stroke-[3]" />}
                      </div>
                      <div className="mt-2.5">
                        <span className={`text-xs font-black block ${isSelected ? "text-[#00685F]" : "text-slate-800"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ========================================================================= */}
              {/* SMART FREE RECURRING DAY SELECTION (BEBAS TIDAK TERPAKU)                */}
              {/* ========================================================================= */}

              {/* 4A. Monthly: Complete 31-Day Interactive Grid + Stepper + Quick Presets */}
              {formState.period_type === "monthly" && (
                <div className="p-4 bg-slate-50/90 rounded-3xl border border-slate-200/80 space-y-3 transition-all">
                  
                  {/* Top Bar: Stepper & Active Indicator */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {isEn ? "Monthly Execution Day" : "Pilih Tanggal Berulang (1 - 31)"}
                      </span>
                      <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <CalendarCheck className="w-4 h-4 text-[#00685F]" />
                        <span>{isEn ? "Every month on day:" : "Berulang setiap tanggal:"}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#00685F] text-white font-mono font-black text-xs shadow-xs">
                          {currentDayNum}
                        </span>
                      </div>
                    </div>

                    {/* Numeric Stepper for Fast Manual Adjustment */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-2xl p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleStepDayOfMonth(-1)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title={isEn ? "Previous day" : "Kurang 1 hari"}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={currentDayNum}
                        onChange={(e) => handleSelectDayOfMonth(e.target.value)}
                        className="w-8 text-center text-xs font-black font-mono text-slate-900 outline-none bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleStepDayOfMonth(1)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title={isEn ? "Next day" : "Tambah 1 hari"}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Popular Shortcuts Row */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {[
                      { label: isEn ? "1st (Start of Month)" : "Awal Bulan (Tgl 1)", day: 1 },
                      { label: isEn ? "15th (Mid Month)" : "Tengah Bulan (Tgl 15)", day: 15 },
                      { label: isEn ? "25th (Payday)" : "Gajian (Tgl 25)", day: 25 },
                      { label: isEn ? "End of Month (28th)" : "Akhir Bulan (Tgl 28)", day: 28 },
                    ].map((p) => {
                      const isSel = currentDayNum === p.day;
                      return (
                        <button
                          key={p.day}
                          type="button"
                          onClick={() => handleSelectDayOfMonth(p.day)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                            isSel
                              ? "bg-[#00685F]/15 text-[#00685F] border border-[#00685F]/30 font-black"
                              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Complete 31-Day Matrix Grid (Any date can be chosen!) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {isEn ? "Select Any Day (1 - 31):" : "Klik Angka Kalender (1 - 31 Bebas):"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {isEn ? "31 days grid" : "Matriks 31 hari"}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                        const isCur = currentDayNum === dayNum;
                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleSelectDayOfMonth(dayNum)}
                            className={`h-8 sm:h-9 rounded-xl sm:rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                              isCur
                                ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/30 scale-105 z-10"
                                : "bg-white hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/70 shadow-2xs hover:border-[#00685F]/30"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Informative Note for Month-End Edge Cases (29, 30, 31) */}
                  {currentDayNum >= 29 && (
                    <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-2xl p-2.5 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        {isEn
                          ? "For months with fewer days (such as February), automation will automatically record on the last valid day of that month."
                          : "Untuk bulan yang memiliki hari lebih sedikit (seperti Februari), pencatatan otomatis akan dieksekusi pada hari terakhir bulan tersebut."}
                      </span>
                    </div>
                  )}

                </div>
              )}

              {/* 4B. Weekly: 7-Day Day-of-Week Selector */}
              {formState.period_type === "weekly" && (
                <div className="p-4 bg-slate-50/90 rounded-3xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        {isEn ? "Weekly Execution Day" : "Pilih Hari Berulang Setiap Minggu"}
                      </span>
                      <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <CalendarDays className="w-4 h-4 text-[#00685F]" />
                        <span>{isEn ? "Repeating every:" : "Berulang setiap hari:"}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#00685F] text-white font-bold text-xs shadow-xs">
                          {currentWeekDayObj.full}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {daysOfWeekLabels.map((d) => {
                      const isCur = currentWeekDayIdx === d.idx;
                      return (
                        <button
                          key={d.idx}
                          type="button"
                          onClick={() => handleSelectDayOfWeek(d.idx)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                            isCur 
                              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/30 scale-105" 
                              : "bg-white hover:bg-[#00685F]/10 hover:text-[#00685F] text-slate-700 border border-slate-200/80 shadow-2xs"
                          }`}
                        >
                          <span className="block text-[11px] font-bold">{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4C. Daily: Friendly Badge */}
              {formState.period_type === "daily" && (
                <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/70 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-[#00685F] shrink-0" />
                  <span>
                    {isEn 
                      ? "This schedule will execute once every single day without interruption." 
                      : "Jadwal ini akan otomatis dicatat setiap 1 hari sekali tanpa jeda."}
                  </span>
                </div>
              )}

            </div>

            {/* 5. Account & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Account Dropdown */}
              <div className={`space-y-1.5 relative ${openDropdown === "account" ? "z-40" : "z-20"}`}>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t("recurring.field_account") || (isEn ? "Account" : "Rekening")} <span className="text-rose-500">*</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => toggleDropdown("account")}
                  className={`w-full px-3.5 py-3 bg-slate-50/80 border rounded-2xl flex items-center justify-between text-left text-sm font-bold transition-all cursor-pointer group ${
                    openDropdown === "account"
                      ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white shadow-xs text-slate-900"
                      : "border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#00685F] flex items-center justify-center shrink-0 border border-emerald-100">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{selectedAccount?.name || (isEn ? "Select Account" : "Pilih Rekening")}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${openDropdown === "account" ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>

                {openDropdown === "account" && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 z-[70] p-2 space-y-1 max-h-56 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150">
                    {accounts.length > 4 && (
                      <div className="relative mb-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={accountSearch}
                          onChange={(e) => setAccountSearch(e.target.value)}
                          placeholder={isEn ? "Search account..." : "Cari rekening..."}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#00685F]"
                        />
                      </div>
                    )}

                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc) => {
                        const isSelected = String(formState.account_id) === String(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setFormState({ ...formState, account_id: acc.id });
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition ${
                              isSelected
                                ? "bg-[#00685F]/10 text-[#00685F] font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#00685F] flex items-center justify-center shrink-0 border border-emerald-100">
                                <Wallet className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{acc.name}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#00685F] stroke-[2.5]" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center font-medium">
                        {isEn ? "No accounts found" : "Rekening tidak ditemukan"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className={`space-y-1.5 relative ${openDropdown === "category" ? "z-40" : "z-20"}`}>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t("recurring.field_category") || (isEn ? "Category" : "Kategori")} <span className="text-rose-500">*</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => toggleDropdown("category")}
                  className={`w-full px-3.5 py-3 bg-slate-50/80 border rounded-2xl flex items-center justify-between text-left text-sm font-bold transition-all cursor-pointer group ${
                    openDropdown === "category"
                      ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white shadow-xs text-slate-900"
                      : "border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {selectedCategory ? (
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColorStyle(selectedCategory.color)}`}>
                        {getCategoryIcon(selectedCategory.icon, "w-3.5 h-3.5")}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="truncate">{selectedCategory?.name || (isEn ? "Select Category" : "Pilih Kategori")}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${openDropdown === "category" ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>

                {openDropdown === "category" && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 z-[70] p-2 space-y-1 max-h-56 overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-150">
                    {categories.length > 4 && (
                      <div className="relative mb-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder={isEn ? "Search category..." : "Cari kategori..."}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#00685F]"
                        />
                      </div>
                    )}

                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => {
                        const isSelected = String(formState.category_id) === String(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormState({ ...formState, category_id: cat.id });
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition ${
                              isSelected
                                ? "bg-[#00685F]/10 text-[#00685F] font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColorStyle(cat.color)}`}>
                                {getCategoryIcon(cat.icon, "w-3.5 h-3.5")}
                              </div>
                              <span className="truncate">{cat.name}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#00685F] stroke-[2.5]" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center font-medium">
                        {isEn ? "No categories available" : "Tidak ada kategori"}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* ========================================================================= */}
            {/* 6. GORGEOUS CUSTOM MODERN CALENDAR FOR EFFECTIVE START DATE               */}
            {/* ========================================================================= */}
            <RecurringDatePicker
              value={formState.effective_date}
              onChange={(newDate) => {
                setFormState({ ...formState, effective_date: newDate });
              }}
              label={t("recurring.field_effective_date") || (isEn ? "Effective Start Date" : "Tanggal Mulai Berlaku")}
            />

            {/* 7. Live Virtual Schedule Ticket (Simulation Preview) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#00685F]/5 to-emerald-500/5 border border-[#00685F]/20 relative overflow-hidden">
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-[#00685F]/10 text-[#00685F] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-xs text-slate-700 leading-relaxed min-w-0 flex-1">
                  <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider mb-1 text-[#00685F]">
                    {isEn ? "Simulation Preview" : "Simulasi Otomasi"}
                  </div>
                  <p>
                    {formState.type === "income" ? (isEn ? "Automated income of " : "Pemasukan sebesar ") : (isEn ? "Automated expense of " : "Pengeluaran sebesar ")}
                    <span className="font-black font-mono text-slate-900">
                      {formState.amount ? `${currencySymbol} ${formatThousand(formState.amount)}` : "Rp 0"}
                    </span>{" "}
                    {isEn ? "will be recorded " : "akan dicatat "}
                    <span className="font-bold text-[#00685F]">
                      {formState.period_type === "daily" 
                        ? (isEn ? "every single day" : "setiap 1 hari sekali") 
                        : formState.period_type === "weekly" 
                        ? (isEn ? `every week on ${currentWeekDayObj.full}` : `setiap minggu pada hari ${currentWeekDayObj.full}`) 
                        : (isEn ? `every month on day ${currentDayNum}` : `setiap bulan pada tanggal ${currentDayNum}`)}
                    </span>{" "}
                    {selectedAccount ? `${isEn ? "on" : "ke"} ${selectedAccount.name}` : ""}.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= MODAL FOOTER ================= */}
          <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/80 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 rounded-2xl border border-slate-200/90 text-slate-700 font-bold text-sm hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {t("recurring.btn_cancel") || (isEn ? "Cancel" : "Batal")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-[#00685F] text-white font-bold text-sm hover:bg-[#004D46] shadow-sm hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isSaving ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>{isEn ? "Saving..." : "Menyimpan..."}</span>
                </>
              ) : (
                <span>{t("recurring.btn_save") || (isEn ? "Save Schedule" : "Simpan Jadwal")}</span>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>,
    document.body
  );
}

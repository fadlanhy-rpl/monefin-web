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
  CalendarCheck
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

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
  const { currencySymbol } = useCurrency();
  const [openDropdown, setOpenDropdown] = useState(null);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dropdownRef = useRef(null);

  // Close on Escape
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

  // Click outside to close custom dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !mounted) return null;

  const isEn = language === "en";

  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const raw = String(val).replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleAmountChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormState({ ...formState, amount: rawDigits });
  };

  const handleQuickAmount = (val) => {
    setFormState({ ...formState, amount: String(val) });
  };

  const filteredCategories = categories.filter((c) => c.type === formState.type);
  const selectedCategory = categories.find((c) => String(c.id) === String(formState.category_id));
  const selectedAccount = accounts.find((a) => String(a.id) === String(formState.account_id));

  const periodCards = [
    { 
      value: "daily", 
      label: isEn ? "Daily" : "Harian", 
      desc: isEn ? "Every day" : "Setiap hari",
      icon: Clock 
    },
    { 
      value: "weekly", 
      label: isEn ? "Weekly" : "Mingguan", 
      desc: isEn ? "Every 7 days" : "Setiap minggu",
      icon: CalendarDays 
    },
    { 
      value: "monthly", 
      label: isEn ? "Monthly" : "Bulanan", 
      desc: isEn ? "Every month" : "Setiap bulan",
      icon: CalendarCheck 
    },
  ];

  const quickAmounts = formState.type === "income"
    ? [2000000, 5000000, 10000000, 20000000]
    : [50000, 150000, 500000, 1000000];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100/90 my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-5 border-b border-slate-100/80 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00685F]/10 text-[#00685F] border border-[#00685F]/20 flex items-center justify-center shrink-0 shadow-sm">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#00685F]/10 text-[#00685F] text-[10px] font-bold uppercase tracking-wide">
                  {isEn ? "Automation" : "Otomasi Finansial"}
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= MODAL BODY ================= */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1" ref={dropdownRef}>
            
            {/* 1. Transaction Type Segmented Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_type") || (isEn ? "Transaction Type" : "Jenis Transaksi")}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, type: "expense", category_id: "" })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    formState.type === "expense"
                      ? "bg-white text-rose-700 shadow-sm border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ArrowDownLeft className={`w-4 h-4 ${formState.type === "expense" ? "text-rose-600" : "text-slate-400"}`} />
                  <span>{t("recurring.filter_expense") || (isEn ? "Expense" : "Pengeluaran")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, type: "income", category_id: "" })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    formState.type === "income"
                      ? "bg-white text-[#00685F] shadow-sm border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ArrowUpRight className={`w-4 h-4 ${formState.type === "income" ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{t("recurring.filter_income") || (isEn ? "Income" : "Pemasukan")}</span>
                </button>
              </div>
            </div>

            {/* 2. Hero Amount Card */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 focus-within:border-[#00685F] focus-within:ring-4 focus-within:ring-[#00685F]/10 focus-within:bg-white transition-all">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t("recurring.field_amount") || (isEn ? "Amount" : "Nominal")} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {formState.type === "income" ? (isEn ? "Will add to balance" : "Menambah saldo") : (isEn ? "Will deduct balance" : "Memotong saldo")}
                </span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-xl bg-slate-200/70 text-slate-700 text-xs sm:text-sm font-black shrink-0">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formState.amount)}
                  onChange={handleAmountChange}
                  className="w-full text-2xl sm:text-3xl font-black text-slate-900 tabular-nums outline-none bg-transparent placeholder:text-slate-300"
                  placeholder="0"
                  autoFocus={modalMode === "add"}
                />
              </div>

              {/* Quick Amount Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickAmount(q)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-[#00685F]/10 hover:text-[#00685F] border border-slate-200/70 text-slate-600 shadow-2xs transition-all cursor-pointer"
                  >
                    +{formatThousand(q)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_title") || (isEn ? "Schedule Title" : "Nama Transaksi")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                placeholder={t("recurring.field_title_placeholder") || (isEn ? "e.g. Monthly Salary, Netflix, Gym" : "Mis. Gaji Pokok, Netflix, Gym")}
              />
            </div>

            {/* 4. Frequency Selector Cards */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_frequency") || (isEn ? "Frequency" : "Frekuensi Jadwal")}
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
                          : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00685F]" />}
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs font-extrabold block ${isSelected ? "text-[#00685F]" : "text-slate-800"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Account & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Account Dropdown */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t("recurring.field_account") || (isEn ? "Account" : "Rekening")} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown("account")}
                  className={`w-full px-3.5 py-3 bg-slate-50/70 border rounded-2xl flex items-center justify-between text-left text-sm font-semibold transition-all cursor-pointer ${
                    openDropdown === "account"
                      ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white text-slate-900"
                      : "border-slate-200/80 text-slate-800 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedAccount?.name || (isEn ? "Select Account" : "Pilih Rekening")}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${openDropdown === "account" ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>
                {openDropdown === "account" && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 z-[70] p-1.5 space-y-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {accounts.length > 0 ? (
                      accounts.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            setFormState({ ...formState, account_id: acc.id });
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition ${
                            String(formState.account_id) === String(acc.id)
                              ? "bg-[#00685F]/10 text-[#00685F]"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{acc.name}</span>
                          {String(formState.account_id) === String(acc.id) && (
                            <Check className="w-3.5 h-3.5 text-[#00685F] shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        {isEn ? "No accounts found" : "Belum ada rekening"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t("recurring.field_category") || (isEn ? "Category" : "Kategori")} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown("category")}
                  className={`w-full px-3.5 py-3 bg-slate-50/70 border rounded-2xl flex items-center justify-between text-left text-sm font-semibold transition-all cursor-pointer ${
                    openDropdown === "category"
                      ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white text-slate-900"
                      : "border-slate-200/80 text-slate-800 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedCategory?.name || (isEn ? "Select Category" : "Pilih Kategori")}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${openDropdown === "category" ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>
                {openDropdown === "category" && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 z-[70] p-1.5 space-y-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setFormState({ ...formState, category_id: cat.id });
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition ${
                            String(formState.category_id) === String(cat.id)
                              ? "bg-[#00685F]/10 text-[#00685F]"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {String(formState.category_id) === String(cat.id) && (
                            <Check className="w-3.5 h-3.5 text-[#00685F] shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        {isEn ? "No categories available" : "Tidak ada kategori"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Effective Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("recurring.field_effective_date") || (isEn ? "Effective Start Date" : "Tanggal Mulai Berlaku")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formState.effective_date || ""}
                  onChange={(e) => setFormState({ ...formState, effective_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] focus:bg-white transition-all text-sm font-semibold text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {isEn ? "The date from which this recurring schedule will begin running." : "Tanggal saat jadwal transaksi ini pertama kali mulai dicatat secara otomatis."}
              </p>
            </div>

            {/* 7. Live Interactive Schedule Preview */}
            <div className="p-3.5 rounded-2xl bg-[#00685F]/5 border border-[#00685F]/15 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900">
                  {isEn ? "Schedule Preview: " : "Ringkasan Otomasi: "}
                </span>
                {formState.type === "income" ? (isEn ? "Income of " : "Pemasukan sebesar ") : (isEn ? "Expense of " : "Pengeluaran sebesar ")}
                <span className="font-black text-slate-900">
                  {formState.amount ? `${currencySymbol} ${formatThousand(formState.amount)}` : "Rp 0"}
                </span>{" "}
                {isEn ? "will be recorded " : "akan dicatat "}
                <span className="font-bold text-[#00685F]">
                  {formState.period_type === "daily" ? (isEn ? "every day" : "setiap hari") : formState.period_type === "weekly" ? (isEn ? "every week" : "setiap minggu") : (isEn ? "every month" : "setiap bulan")}
                </span>{" "}
                {selectedAccount ? `${isEn ? "on" : "pada"} ${selectedAccount.name}` : ""}.
              </div>
            </div>

          </div>

          {/* ================= MODAL FOOTER ================= */}
          <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {t("recurring.btn_cancel") || (isEn ? "Cancel" : "Batal")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-[#00685F] text-white font-bold text-sm hover:bg-[#004D46] shadow-sm hover:shadow transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isSaving ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
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

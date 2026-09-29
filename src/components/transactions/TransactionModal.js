import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check, Sparkles, Loader2 } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { aiSuggestCategory } from "../../services/ai.service";
import { getAccounts } from "../../services/account.service";
import { getCategories } from "../../services/category.service";
import { getBootstrapSnapshot } from "../../services/bootstrap.service";

export default function TransactionModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  isSubmitting = false,
  formType,
  setFormType,
  formAmount,
  setFormAmount,
  formCategoryId,
  setFormCategoryId,
  formAccountId,
  setFormAccountId,
  formDate,
  setFormDate,
  formNote,
  setFormNote,
  categories = [],
  accounts = []
}) {
  const { t, language } = useLanguage();
  const { currencySymbol, formatCurrency } = useCurrency();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [aiSuggestLoading, setAiSuggestLoading] = useState(false);
  const [aiSuggestNote, setAiSuggestNote] = useState("");

  // Self-healing local fallback so modal never opens with empty accounts/categories on cold start
  const [localAccounts, setLocalAccounts] = useState(() => {
    const snap = getBootstrapSnapshot();
    return Array.isArray(snap?.accounts) ? snap.accounts : [];
  });
  const [localCategories, setLocalCategories] = useState(() => {
    const snap = getBootstrapSnapshot();
    return Array.isArray(snap?.categories) ? snap.categories : [];
  });
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  const effAccounts = accounts && accounts.length > 0 ? accounts : localAccounts;
  const effCategories = categories && categories.length > 0 ? categories : localCategories;

  const categoryRef = useRef(null);
  const accountRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Self-fetch accounts & categories if modal is opened before parent page finishes loading
  useEffect(() => {
    if (!isOpen) return;
    const snap = getBootstrapSnapshot();
    const snapAcc = Array.isArray(snap?.accounts) && snap.accounts.length > 0 ? snap.accounts : null;
    const snapCat = Array.isArray(snap?.categories) && snap.categories.length > 0 ? snap.categories : null;

    const needAcc = (!accounts || accounts.length === 0) && localAccounts.length === 0 && !snapAcc;
    const needCat = (!categories || categories.length === 0) && localCategories.length === 0 && !snapCat;

    if (snapAcc && localAccounts.length === 0) {
      Promise.resolve().then(() => setLocalAccounts(snapAcc));
    }
    if (snapCat && localCategories.length === 0) {
      Promise.resolve().then(() => setLocalCategories(snapCat));
    }

    if (!needAcc && !needCat) return;

    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) setIsLoadingMeta(true);
    });

    Promise.all([
      needAcc
        ? getAccounts()
            .then((res) => (!Array.isArray(res?.data) || res.data.length === 0 ? getAccounts(true) : res))
            .catch(() => null)
        : Promise.resolve(null),
      needCat
        ? getCategories()
            .then((res) => (!Array.isArray(res?.data) || res.data.length === 0 ? getCategories("", true) : res))
            .catch(() => null)
        : Promise.resolve(null),
    ])
      .then(([accRes, catRes]) => {
        if (ignore) return;
        if (Array.isArray(accRes?.data) && accRes.data.length > 0) {
          setLocalAccounts(accRes.data);
        }
        if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
          setLocalCategories(catRes.data);
        }
      })
      .finally(() => {
        if (!ignore) setIsLoadingMeta(false);
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, accounts, categories, localAccounts.length, localCategories.length]);

  // Ensure default account & category are auto-selected as soon as effAccounts / effCategories are ready
  useEffect(() => {
    if (!isOpen) return;
    if (!formAccountId && effAccounts.length > 0) {
      setFormAccountId(effAccounts[0].id);
    }
    if (effCategories.length > 0) {
      const filtered = effCategories.filter((c) =>
        formType === "expense" ? c.type === "expense" || !c.type : c.type === "income" || !c.type
      );
      const pool = filtered.length > 0 ? filtered : effCategories;
      const validCurrent = pool.some((c) => String(c.id) === String(formCategoryId));
      if (!formCategoryId || (modalMode === "add" && !validCurrent)) {
        setFormCategoryId(pool[0].id);
      }
    }
  }, [isOpen, modalMode, formType, effAccounts, effCategories, formAccountId, formCategoryId, setFormAccountId, setFormCategoryId]);

  if (!isOpen) return null;

  // Format thousand separator (guards against SQL decimal strings like "225000.00")
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
    setFormAmount(rawDigits);
  };

  const filteredCategories = effCategories.filter((c) =>
    formType === "expense" ? c.type === "expense" || !c.type : c.type === "income" || !c.type
  );
  const selectedCategory = effCategories.find((c) => String(c.id) === String(formCategoryId));
  const selectedAccount = effAccounts.find((a) => String(a.id) === String(formAccountId));

  const handleAiSuggestCategory = async () => {
    if (!formNote.trim() || aiSuggestLoading) return;
    setAiSuggestLoading(true);
    setAiSuggestNote("");
    try {
      const res = await aiSuggestCategory(formNote, formType);
      const cat = res?.data?.category;
      if (cat?.id) {
        setFormCategoryId(cat.id);
        setAiSuggestNote(`AI menyarankan: ${cat.name}`);
        setTimeout(() => setAiSuggestNote(""), 3000);
      } else {
        setAiSuggestNote("Tidak ada saran — coba tulis catatan lebih detail.");
        setTimeout(() => setAiSuggestNote(""), 3000);
      }
    } catch {
      setAiSuggestNote("Gagal mendapatkan saran AI.");
      setTimeout(() => setAiSuggestNote(""), 3000);
    } finally {
      setAiSuggestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 sm:my-auto flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add" ? (t("transactions.add_transaction") || "Add Transaction") : (t("transactions.edit_transaction") || "Edit Transaction")}
          </h3>
          <button 
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Type Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormType("income")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${formType === "income" ? "bg-[#00685F] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t("dashboard.income") || "Income"}
              </button>
              <button
                type="button"
                onClick={() => setFormType("expense")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${formType === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t("dashboard.expense") || "Expense"}
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.amount") || "Amount"}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formAmount)}
                  onChange={handleAmountChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-black text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5 relative" ref={categoryRef}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.category") || "Category"}</label>
                {/* AI Suggest button — only active when Note field has text */}
                <button
                  type="button"
                  onClick={handleAiSuggestCategory}
                  disabled={!formNote.trim() || aiSuggestLoading}
                  title={formNote.trim() ? "Biarkan AI menyarankan kategori berdasarkan catatan" : "Isi catatan terlebih dahulu"}
                  className="flex items-center gap-1 text-[10px] font-bold text-brand-600 hover:text-brand-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {aiSuggestLoading ? (
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                    </svg>
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  AI Suggest
                </button>
              </div>
              {aiSuggestNote && (
                <p className="text-[10px] text-brand-600 font-semibold animate-in fade-in duration-200">{aiSuggestNote}</p>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsAccountOpen(false);
                }}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${isCategoryOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"}`}
              >
                <span className={selectedCategory ? "text-slate-900" : "text-slate-400 font-medium"}>
                  {selectedCategory
                    ? selectedCategory.name
                    : isLoadingMeta && effCategories.length === 0
                      ? (language === "en" ? "Loading categories..." : "Memuat kategori...")
                      : (t("transactions.select_category") || "Select Category")}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-[#00685F]" : ""}`} />
              </button>
              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {filteredCategories.length === 0 ? (
                    <div className="px-3.5 py-3 text-xs text-slate-400 flex items-center justify-center gap-2">
                      {isLoadingMeta && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00685F]" />}
                      <span>{isLoadingMeta ? (language === "en" ? "Loading categories..." : "Memuat kategori...") : (language === "en" ? "No categories available" : "Kategori belum tersedia")}</span>
                    </div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormCategoryId(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${String(cat.id) === String(formCategoryId) ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
                      >
                        <span>{cat.name}</span>
                        {String(cat.id) === String(formCategoryId) && <Check className="w-4 h-4 text-[#00685F]" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Account Dropdown (with Account Balance preview) */}
            <div className="space-y-1.5 relative" ref={accountRef}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.account") || "Account"}</label>
              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen(!isAccountOpen);
                  setIsCategoryOpen(false);
                }}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${isAccountOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"}`}
              >
                {selectedAccount ? (
                  <div className="flex items-center justify-between w-full pr-2 min-w-0 gap-2">
                    <span className="text-slate-900 truncate">{selectedAccount.name}</span>
                    <span className="text-xs font-semibold text-[#00685F] bg-[#00685F]/10 px-2 py-0.5 rounded-lg shrink-0">
                      {formatCurrency(selectedAccount.balance || 0)}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 font-medium">
                    {isLoadingMeta && effAccounts.length === 0
                      ? (language === "en" ? "Loading accounts..." : "Memuat akun saldo...")
                      : (t("transactions.select_account") || "Select Account")}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isAccountOpen ? "rotate-180 text-[#00685F]" : ""}`} />
              </button>
              {isAccountOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {effAccounts.length === 0 ? (
                    <div className="px-3.5 py-3 text-xs text-slate-400 flex items-center justify-center gap-2">
                      {isLoadingMeta && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00685F]" />}
                      <span>{isLoadingMeta ? (language === "en" ? "Loading accounts..." : "Memuat akun saldo...") : (language === "en" ? "No accounts available" : "Belum ada akun saldo")}</span>
                    </div>
                  ) : (
                    effAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setFormAccountId(acc.id);
                          setIsAccountOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${String(acc.id) === String(formAccountId) ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="truncate">{acc.name}</span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {language === "en" ? "Balance:" : "Saldo:"} {formatCurrency(acc.balance || 0)}
                          </span>
                        </div>
                        {String(acc.id) === String(formAccountId) && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.date") || "Date"}</label>
              <DatePicker
                value={formDate}
                onChange={setFormDate}
                placeholder={t("transactions.select_date") || "Select Date"}
              />
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.note") || "Note"}</label>
              <input
                type="text"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm text-slate-600 font-semibold"
                placeholder={t("transactions.note_placeholder") || "Transaction details..."}
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("transactions.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === "en" ? "Saving..." : "Menyimpan..."}</span>
                </>
              ) : (
                t("transactions.save") || "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

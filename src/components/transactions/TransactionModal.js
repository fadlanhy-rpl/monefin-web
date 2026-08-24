import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import DatePicker from "../ui/DatePicker";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function TransactionModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
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
  const { currencySymbol } = useCurrency();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

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

  if (!isOpen) return null;

  // Format thousand separator
  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const raw = String(val).replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleAmountChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormAmount(rawDigits);
  };

  const selectedCategory = categories.find((c) => String(c.id) === String(formCategoryId));
  const selectedAccount = accounts.find((a) => String(a.id) === String(formAccountId));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between shrink-0">
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
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5 relative" ref={categoryRef}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("transactions.category") || "Category"}</label>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsAccountOpen(false);
                }}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${isCategoryOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"}`}
              >
                <span className={selectedCategory ? "text-slate-900" : "text-slate-400 font-medium"}>
                  {selectedCategory ? selectedCategory.name : (t("transactions.select_category") || "Select Category")}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-[#00685F]" : ""}`} />
              </button>
              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {categories.filter(c => formType === 'expense' ? c.type === 'expense' || !c.type : c.type === 'income' || !c.type).map((cat) => (
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
                  ))}
                </div>
              )}
            </div>

            {/* Account Dropdown */}
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
                <span className={selectedAccount ? "text-slate-900" : "text-slate-400 font-medium"}>
                  {selectedAccount ? selectedAccount.name : (t("transactions.select_account") || "Select Account")}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isAccountOpen ? "rotate-180 text-[#00685F]" : ""}`} />
              </button>
              {isAccountOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {accounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setFormAccountId(acc.id);
                        setIsAccountOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${String(acc.id) === String(formAccountId) ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                      <span>{acc.name}</span>
                      {String(acc.id) === String(formAccountId) && <Check className="w-4 h-4 text-[#00685F]" />}
                    </button>
                  ))}
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
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm text-slate-600 font-semibold"
                placeholder={t("transactions.note_placeholder") || "Transaction details..."}
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {t("transactions.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {t("transactions.save") || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

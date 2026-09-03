import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function RecurringModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formState,
  setFormState,
  categories = [],
  accounts = []
}) {
  const { t, language } = useLanguage();
  const { currencySymbol } = useCurrency();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

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

  const filteredCategories = categories.filter(c => c.type === formState.type);

  const selectedCategory = categories.find((c) => String(c.id) === String(formState.category_id));
  const selectedAccount = accounts.find((a) => String(a.id) === String(formState.account_id));

  const isEn = language === "en";

  const periodOptions = [
    { value: 'daily', label: isEn ? 'Daily' : 'Harian' },
    { value: 'weekly', label: isEn ? 'Weekly' : 'Mingguan' },
    { value: 'monthly', label: isEn ? 'Monthly' : 'Bulanan' },
    { value: 'yearly', label: isEn ? 'Yearly' : 'Tahunan' },
  ];
  const selectedPeriod = periodOptions.find(p => p.value === formState.period_type);

  const typeOptions = [
    { value: 'expense', label: isEn ? 'Expense' : 'Pengeluaran' },
    { value: 'income', label: isEn ? 'Income' : 'Pemasukan' }
  ];
  const selectedType = typeOptions.find(t => t.value === formState.type);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add"
              ? (isEn ? "Add Recurring Transaction" : "Tambah Transaksi Rutin")
              : (isEn ? "Edit Recurring Transaction" : "Edit Transaksi Rutin")}
          </h3>
          <button 
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-6 space-y-5 overflow-y-auto flex-1" ref={dropdownRef}>
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isEn ? "Title / Description" : "Judul / Deskripsi"}
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
                placeholder={isEn ? "e.g. Salary, Netflix" : "Mis. Gaji, Netflix"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isEn ? "Type" : "Tipe"}
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('type')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-left text-sm font-bold text-slate-800 ${openDropdown === 'type' ? 'border-[#00685F] ring-4 ring-[#00685F]/10 bg-white' : 'border-slate-100'}`}
                >
                  <span>{selectedType?.label || (isEn ? "Select" : "Pilih")}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] p-1.5 space-y-1">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormState({ ...formState, type: opt.value, category_id: "" });
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-sm font-bold ${formState.type === opt.value ? 'bg-[#00685F]/10 text-[#00685F]' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isEn ? "Amount" : "Nominal"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formatThousand(formState.amount)}
                    onChange={handleAmountChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Period */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isEn ? "Period (Frequency)" : "Periode (Seberapa sering)"}
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown('period')}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-left text-sm font-bold text-slate-800 ${openDropdown === 'period' ? 'border-[#00685F] ring-4 ring-[#00685F]/10 bg-white' : 'border-slate-100'}`}
              >
                <span>{selectedPeriod?.label || (isEn ? "Select" : "Pilih")}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {openDropdown === 'period' && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] p-1.5 space-y-1">
                  {periodOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormState({ ...formState, period_type: opt.value });
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-sm font-bold ${formState.period_type === opt.value ? 'bg-[#00685F]/10 text-[#00685F]' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Account */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isEn ? "Account" : "Akun"}
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('account')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-left text-sm font-bold text-slate-800 ${openDropdown === 'account' ? 'border-[#00685F] ring-4 ring-[#00685F]/10 bg-white' : 'border-slate-100'}`}
                >
                  <span className="truncate mr-2">{selectedAccount?.name || (isEn ? "Select Account" : "Pilih Akun")}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
                {openDropdown === 'account' && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[70] p-1.5 space-y-1 max-h-40 overflow-y-auto">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setFormState({ ...formState, account_id: acc.id });
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-sm font-bold ${String(formState.account_id) === String(acc.id) ? 'bg-[#00685F]/10 text-[#00685F]' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {acc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isEn ? "Category" : "Kategori"}
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('category')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-left text-sm font-bold text-slate-800 ${openDropdown === 'category' ? 'border-[#00685F] ring-4 ring-[#00685F]/10 bg-white' : 'border-slate-100'}`}
                >
                  <span className="truncate mr-2">{selectedCategory?.name || (isEn ? "Category" : "Kategori")}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
                {openDropdown === 'category' && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[70] p-1.5 space-y-1 max-h-40 overflow-y-auto">
                    {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormState({ ...formState, category_id: cat.id });
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-sm font-bold ${String(formState.category_id) === String(cat.id) ? 'bg-[#00685F]/10 text-[#00685F]' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {cat.name}
                      </button>
                    )) : (
                      <div className="px-3 py-2 text-xs text-slate-400 text-center font-medium">{isEn ? "No categories available" : "Tidak ada kategori"}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {isEn ? "Cancel" : "Batal"}
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {isEn ? "Save" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function BudgetModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formCategoryId,
  setFormCategoryId,
  formLimit,
  setFormLimit,
  categories = []
}) {
  const { t, language } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Format raw number into Indonesian thousand separator string (e.g. 1000000 -> 1.000.000)
  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const raw = String(val).replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleLimitChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormLimit(rawDigits);
  };

  const selectedCategory = categories.find((c) => String(c.id) === String(formCategoryId));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add" ? (t("budgets.add_title") || "Set New Budget") : (t("budgets.edit_title") || "Edit Budget")}
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
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Custom Modern Category Dropdown */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t("budgets.category") || "Kategori (Category)"}
              </label>
              
              {/* Dropdown Trigger Button */}
              <button
                type="button"
                disabled={modalMode === "edit"}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${
                  isDropdownOpen
                    ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white"
                    : "border-slate-100 hover:border-slate-200"
                } ${modalMode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span className={selectedCategory ? "text-slate-900" : "text-slate-400 font-medium"}>
                  {selectedCategory ? selectedCategory.name : (t("budgets.select_category") || "Pilih Kategori Pengeluaran")}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-[#00685F]" : ""
                  }`}
                />
              </button>

              {/* Floating Dropdown List */}
              {isDropdownOpen && modalMode !== "edit" && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {categories.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400 text-center font-medium">
                      {language === 'en' ? 'No expense categories available.' : 'Tidak ada kategori pengeluaran.'}
                    </div>
                  ) : (
                    categories.map((cat) => {
                      const isSelected = String(cat.id) === String(formCategoryId);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setFormCategoryId(cat.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${
                            isSelected
                              ? "bg-[#00685F]/10 text-[#00685F]"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#00685F]" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {modalMode === "edit" && (
                <p className="text-xs text-slate-500 mt-1">{t("budgets.category_locked") || "Kategori tidak dapat diubah setelah anggaran dibuat."}</p>
              )}
            </div>

            {/* Limit Input with Thousand Separator */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t("budgets.limit") || "Batas Anggaran (Limit)"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formLimit)}
                  onChange={handleLimitChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {t("common.cancel") || "Batal"}
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {t("common.save") || "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

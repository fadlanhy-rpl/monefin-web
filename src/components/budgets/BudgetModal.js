import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Check, Search, Hash } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { getCategoryIcon, getCategoryColorStyle } from "../../lib/categoryIcons";

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
  const { currencySymbol } = useCurrency();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Reset search term when dropdown toggles
  useEffect(() => {
    if (!isDropdownOpen) {
      setSearchTerm("");
    }
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  // Format raw number into Indonesian thousand separator string (e.g. 1000000 -> 1.000.000)
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

  const handleLimitChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormLimit(rawDigits);
  };

  const selectedCategory = categories.find((c) => String(c.id) === String(formCategoryId));

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 sm:my-auto flex flex-col overflow-visible relative">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
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
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-visible relative">
          <div className="p-6 space-y-5 overflow-visible">
            {/* Custom Modern Category Dropdown */}
            <div className="space-y-1.5 relative z-40" ref={dropdownRef}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("budgets.category") || "Kategori (Category)"}
              </label>
              
              {/* Dropdown Trigger Button */}
              <button
                type="button"
                disabled={modalMode === "edit"}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full px-4 py-3 bg-slate-50/80 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer group ${
                  isDropdownOpen
                    ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white shadow-xs"
                    : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                } ${modalMode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {selectedCategory ? (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColorStyle(selectedCategory.color)}`}>
                      {getCategoryIcon(selectedCategory.icon, "w-4 h-4")}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                  )}
                  <span className={`truncate ${selectedCategory ? "text-slate-900" : "text-slate-400 font-medium"}`}>
                    {selectedCategory ? selectedCategory.name : (t("budgets.select_category") || "Pilih Kategori Pengeluaran")}
                  </span>
                </div>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isDropdownOpen ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-400 group-hover:text-slate-600"
                }`}>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Floating Dropdown List with Backdrop Blur and Clear Elevation */}
              {isDropdownOpen && modalMode !== "edit" && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {/* Category Search Input if > 5 categories */}
                  {categories.length > 5 && (
                    <div className="px-1.5 pt-0.5 pb-2 border-b border-slate-100">
                      <div className="relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={language === "en" ? "Search category..." : "Cari kategori..."}
                          className="w-full pl-8 pr-3 py-2 text-xs bg-slate-100/80 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#00685F]/20 text-slate-800 placeholder-slate-400 font-medium"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 overscroll-contain">
                    {filteredCategories.length === 0 ? (
                      <div className="px-4 py-4 text-xs text-slate-400 text-center font-medium">
                        {searchTerm
                          ? (language === "en" ? "No matching categories found." : "Kategori tidak ditemukan.")
                          : (language === "en" ? "No expense categories available." : "Tidak ada kategori pengeluaran.")}
                      </div>
                    ) : (
                      filteredCategories.map((cat) => {
                        const isSelected = String(cat.id) === String(formCategoryId);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormCategoryId(cat.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer ${
                              isSelected
                                ? "bg-[#00685F]/10 text-[#00685F] font-bold ring-1 ring-[#00685F]/20"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColorStyle(cat.color)}`}>
                                {getCategoryIcon(cat.icon, "w-4 h-4")}
                              </div>
                              <span className="text-sm truncate">{cat.name}</span>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#00685F] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {modalMode === "edit" && (
                <p className="text-xs text-slate-500 mt-1">{t("budgets.category_locked") || "Kategori tidak dapat diubah setelah anggaran dibuat."}</p>
              )}
            </div>

            {/* Limit Input with Thousand Separator */}
            <div className="space-y-1.5 relative z-10">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("budgets.limit") || "Batas Anggaran (Limit)"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formLimit)}
                  onChange={handleLimitChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-black text-slate-800 hover:border-slate-300"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white rounded-b-[2.5rem] sm:rounded-b-[2rem] relative z-20">
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

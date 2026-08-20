import { useState, useEffect, useRef } from "react";
import { X, Sparkles, ChevronDown, Check, Landmark, Smartphone, Banknote } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function AccountModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formName,
  setFormName,
  formBalance,
  setFormBalance,
  formNumber,
  setFormNumber,
  formHolder,
  setFormHolder,
  formType,
  setFormType,
  formTheme,
  setFormTheme,
  isSubmitting
}) {
  const { t, language } = useLanguage();
  const { currencySymbol } = useCurrency();
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const typeRef = useRef(null);
  const themeRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
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

  const handleBalanceChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormBalance(rawDigits);
  };

  // Preset Template Quick Fill
  const applyPreset = (preset) => {
    switch (preset) {
      case "BCA":
        setFormName("Bank BCA");
        setFormType("bank");
        setFormTheme("bank-primary");
        setFormNumber("xxxx " + Math.floor(1000 + Math.random() * 9000));
        setFormHolder("AKHMAD MAARIZ");
        break;
      case "Mandiri":
        setFormName("Bank Mandiri");
        setFormType("bank");
        setFormTheme("bank-dark");
        setFormNumber("xxxx " + Math.floor(1000 + Math.random() * 9000));
        setFormHolder("");
        break;
      case "GoPay":
        setFormName("GoPay");
        setFormType("ewallet");
        setFormTheme("wallet");
        setFormNumber("");
        setFormHolder("");
        break;
      case "OVO":
        setFormName("OVO");
        setFormType("ewallet");
        setFormTheme("wallet");
        setFormNumber("");
        setFormHolder("");
        break;
      case "Tunai":
        setFormName("Dompet Tunai");
        setFormType("cash");
        setFormTheme("cash");
        setFormNumber("");
        setFormHolder("");
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00685F]" />
            {modalMode === "add" ? (t("accounts.add_title") || "Tambah Akun Baru") : (t("accounts.edit_title") || "Edit Akun")}
          </h3>
          <button 
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Quick presets (Only on Add mode) */}
            {modalMode === "add" && (
              <div className="space-y-1.5 select-none">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{language === 'en' ? "Quick Account Template" : "Template Akun Cepat"}</label>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {["BCA", "Mandiri", "GoPay", "OVO", "Tunai"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-[#00685F] text-slate-600 hover:text-[#00685F] rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("accounts.account_name") || "Nama Akun"}</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
                placeholder={t("accounts.account_name_placeholder") || "Contoh: BANK BCA, E-Wallet, Cash"}
              />
            </div>

            {/* Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("accounts.balance") || "Saldo (Balance)"}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formBalance)}
                  onChange={handleBalanceChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Account Type Custom Dropdown */}
            <div className="space-y-1.5 relative" ref={typeRef}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t("accounts.account_type") || "Tipe Akun"}</label>
              <button
                type="button"
                onClick={() => {
                  setIsTypeOpen(!isTypeOpen);
                  setIsThemeOpen(false);
                }}
                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${
                  isTypeOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {formType === "bank" && <Landmark className="w-4 h-4 text-[#00685F]" />}
                  {formType === "ewallet" && <Smartphone className="w-4 h-4 text-[#00685F]" />}
                  {formType === "cash" && <Banknote className="w-4 h-4 text-[#00685F]" />}
                  <span>
                    {formType === "bank" && (t("accounts.type_bank") || "Akun Bank (Rekening)")}
                    {formType === "ewallet" && (t("accounts.type_emoney") || "Dompet Digital (E-Wallet)")}
                    {formType === "cash" && (t("accounts.type_cash") || "Uang Tunai (Cash)")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isTypeOpen ? "rotate-180 text-[#00685F]" : ""}`} />
              </button>

              {isTypeOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {[
                    { id: "bank", label: t("accounts.type_bank") || "Akun Bank (Rekening)", icon: Landmark },
                    { id: "ewallet", label: t("accounts.type_emoney") || "Dompet Digital (E-Wallet)", icon: Smartphone },
                    { id: "cash", label: t("accounts.type_cash") || "Uang Tunai (Cash)", icon: Banknote }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = formType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setFormType(item.id);
                          if (item.id === "bank") setFormTheme("bank-primary");
                          if (item.id === "ewallet") setFormTheme("wallet");
                          if (item.id === "cash") setFormTheme("cash");
                          setIsTypeOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${
                          isSelected ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00685F]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Card Theme Custom Dropdown (only for Bank) */}
            {formType === "bank" && (
              <div className="space-y-1.5 relative" ref={themeRef}>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{language === 'en' ? "Card Theme" : "Desain Kartu"}</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsThemeOpen(!isThemeOpen);
                    setIsTypeOpen(false);
                  }}
                  className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${
                    isThemeOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 ${formTheme === "bank-primary" ? "bg-[#00685F]" : "bg-slate-900"}`}></span>
                    <span>
                      {formTheme === "bank-primary" ? (language === 'en' ? "Premium Green (Primary)" : "Premium Green (Utama)") : (language === 'en' ? "Luxurious Dark" : "Luxurious Dark (Gelap)")}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isThemeOpen ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>

                {isThemeOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { id: "bank-primary", label: language === 'en' ? "Premium Green (Primary)" : "Premium Green (Utama)", color: "bg-[#00685F]" },
                      { id: "bank-dark", label: language === 'en' ? "Luxurious Dark" : "Luxurious Dark (Gelap)", color: "bg-slate-900" }
                    ].map((item) => {
                      const isSelected = formTheme === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setFormTheme(item.id);
                            setIsThemeOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm font-bold transition-all text-left cursor-pointer ${
                            isSelected ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 ${item.color}`}></span>
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#00685F]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Optional fields for Banks */}
            {formType === "bank" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{language === 'en' ? "Account Number (Optional)" : "Nomor Rekening (Optional)"}</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                    placeholder="xxxx 1234"
                  />
                </div>

                {formTheme === "bank-primary" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{language === 'en' ? "Account Holder (Optional)" : "Pemilik Rekening (Optional)"}</label>
                    <input
                      type="text"
                      value={formHolder}
                      onChange={(e) => setFormHolder(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                      placeholder="AKHMAD MAARIZ"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="p-6 pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {language === 'en' ? "Cancel" : "Batal"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-b-transparent rounded-full"></span>
              ) : (
                language === 'en' ? "Save" : "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

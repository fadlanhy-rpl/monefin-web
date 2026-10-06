import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Check, Landmark, Smartphone, Banknote } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { BANK_THEMES, EWALLET_THEMES, CASH_THEMES, TEMPLATES_BY_TYPE } from "./accountThemes";

/**
 * Interactive Live WYSIWYG Mini-Card Preview
 */
function MiniCardPreview({
  formName,
  formBalance,
  formNumber,
  formHolder,
  activeType,
  formTheme,
  currencySymbol,
  language
}) {
  const formattedBal = formBalance 
    ? new Intl.NumberFormat("id-ID").format(formBalance) 
    : "0";

  // Bank Card Preview
  if (activeType === "bank") {
    const theme = BANK_THEMES[formTheme] || BANK_THEMES["bank-primary"];
    const ThemeIcon = theme.icon || Landmark;
    const isMastercard = theme.brand === "MASTERCARD";
    const isVisa = theme.brand === "VISA";

    return (
      <div className={`${theme.bg} p-4 sm:p-5 rounded-2xl text-white flex flex-col justify-between h-40 sm:h-44 shadow-lg ${theme.shadow} relative overflow-hidden transition-all duration-300 border ${theme.border || "border-white/10"}`}>
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/15 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 shrink-0">
              <ThemeIcon className="w-4 h-4 text-white/90" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm tracking-wide uppercase leading-tight truncate">
                {formName || (language === 'en' ? "Bank Name" : "Nama Bank")}
              </h4>
              <span className="text-[10px] text-white/70 font-mono tracking-wider truncate block">
                {formNumber || "•••• •••• •••• 1234"}
              </span>
            </div>
          </div>
          
          {/* Mini EMV Chip Visual */}
          <div className="w-6 h-4 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded border border-yellow-500/20 shrink-0 select-none shadow-xs"></div>
        </div>

        <div className="relative z-10 my-auto min-w-0">
          <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none">
            {language === 'en' ? "Available Balance" : "Saldo Tersedia"}
          </p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black mt-1 tracking-tight font-mono sm:font-sans truncate">
            {currencySymbol} {formattedBal}
          </h3>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-2">
          <div className="min-w-0">
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-wide">
              {language === 'en' ? "Cardholder" : "Pemilik Rekening"}
            </p>
            <p className="font-extrabold text-[10px] tracking-wide mt-0.5 truncate uppercase">
              {formHolder || "PEMILIK REKENING"}
            </p>
          </div>
          {/* Brand Logo */}
          {isMastercard ? (
            <div className="flex gap-0.5 select-none opacity-70 shrink-0">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full"></div>
              <div className="w-3.5 h-3.5 bg-amber-500 rounded-full -ml-2"></div>
            </div>
          ) : isVisa ? (
            <span className="text-[9px] font-black tracking-widest text-white/60 italic shrink-0">VISA</span>
          ) : (
            <span className="text-[8px] font-black tracking-widest text-white/50 uppercase italic shrink-0">{theme.brand || "GPN"}</span>
          )}
        </div>

        {/* Glow Ambient */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
      </div>
    );
  }

  // E-Wallet Card Preview
  if (activeType === "ewallet") {
    const theme = EWALLET_THEMES[formTheme] || EWALLET_THEMES["wallet"];
    const isDark = theme.isDark;

    return (
      <div className={`${theme.cardBg} p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col justify-between h-40 sm:h-44 relative overflow-hidden transition-all duration-300`}>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 ${theme.iconBox} rounded-xl flex items-center justify-center shadow-inner shrink-0`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`font-extrabold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight truncate`}>
                {formName || (language === 'en' ? "E-Wallet Name" : "Nama E-Wallet")}
              </h4>
              <span className={`${theme.badge} text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block`}>
                {language === 'en' ? "E-Wallet" : "Dompet Digital"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto min-w-0">
          <p className={`text-[8px] font-bold ${isDark ? 'text-white/60' : 'text-slate-400'} uppercase tracking-wider leading-none`}>
            {language === 'en' ? "Available Balance" : "Saldo Tersedia"}
          </p>
          <h3 className={`text-lg sm:text-xl md:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} mt-1 tracking-tight font-mono sm:font-sans truncate`}>
            {currencySymbol} {formattedBal}
          </h3>
        </div>

        <div className={`flex justify-between items-center border-t ${isDark ? 'border-white/10' : 'border-slate-100'} pt-2 relative z-10`}>
          <span className={`text-[9px] font-semibold ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
            {language === 'en' ? "Connected App" : "Aplikasi Terhubung"}
          </span>
          <div className="flex -space-x-1.5 select-none shrink-0">
            <div className={`w-5 h-5 border-2 ${isDark ? 'border-zinc-800' : 'border-white'} rounded-full flex items-center justify-center text-[7px] font-black uppercase ${isDark ? 'bg-zinc-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              GP
            </div>
            <div className={`w-5 h-5 border-2 ${isDark ? 'border-zinc-800' : 'border-white'} rounded-full flex items-center justify-center text-[7px] font-black uppercase ${theme.primaryDot} text-white`}>
              OV
            </div>
          </div>
        </div>

        <div className={`absolute right-0 bottom-0 w-24 h-24 ${theme.glow} rounded-tl-[4rem] pointer-events-none`}></div>
      </div>
    );
  }

  // Cash Card Preview
  if (activeType === "cash") {
    const theme = CASH_THEMES[formTheme] || CASH_THEMES["cash"];

    return (
      <div className={`${theme.cardBg} p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col justify-between h-40 sm:h-44 relative overflow-hidden transition-all duration-300`}>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 ${theme.iconBox} rounded-xl flex items-center justify-center shadow-inner shrink-0`}>
              <Banknote className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight leading-tight truncate">
                {formName || (language === 'en' ? "Cash Pocket" : "Nama Dompet")}
              </h4>
              <span className={`${theme.badge} text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block`}>
                {language === 'en' ? "Cash" : "Tunai"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto min-w-0">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none">
            {language === 'en' ? "Cash in Hand" : "Saldo Tunai"}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight font-mono sm:font-sans truncate">
            {currencySymbol} {formattedBal}
          </h3>
        </div>

        <div className="flex justify-between items-center text-[9px] font-semibold text-slate-500 border-t border-slate-100 pt-2 relative z-10">
          <span>{language === 'en' ? "Physical Cash Ledger" : "Catatan Kas Fisik"}</span>
          <span className="text-slate-400">{language === 'en' ? "Active" : "Aktif"}</span>
        </div>

        <div className={`absolute right-0 bottom-0 w-24 h-24 ${theme.glow} rounded-tl-[4rem] pointer-events-none`}></div>
      </div>
    );
  }

  return null;
}

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

  // Robustly sanitize active account type (guards against event objects or invalid strings)
  const activeType = (typeof formType === "string" && ["bank", "ewallet", "cash"].includes(formType)) 
    ? formType 
    : "bank";

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

  const handleBalanceChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormBalance(rawDigits);
  };

  // Preset Template Quick Fill
  const applyPreset = (presetItem) => {
    setFormName(presetItem.title);
    setFormType(presetItem.type);
    setFormTheme(presetItem.theme);
    setFormNumber(presetItem.defaultNumber || "");
    setFormHolder(presetItem.defaultHolder || "");
  };

  // Handle switching account type with appropriate theme default
  const handleTypeSelect = (newType) => {
    setFormType(newType);
    if (newType === "bank") {
      setFormTheme("bank-primary");
    } else if (newType === "ewallet") {
      setFormTheme("wallet-teal");
    } else if (newType === "cash") {
      setFormTheme("cash-emerald");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
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
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            
            {/* Live Interactive Card Preview */}
            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? "Live Card Preview" : "Tampilan Kartu Nyata (Live Preview)"}
              </label>
              <MiniCardPreview 
                formName={formName}
                formBalance={formBalance}
                formNumber={formNumber}
                formHolder={formHolder}
                activeType={activeType}
                formTheme={formTheme}
                currencySymbol={currencySymbol}
                language={language}
              />
            </div>

            {/* Segmented Account Type Selector (Fitts's Law & Ergonomics) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t("accounts.account_type") || "Tipe Akun"}
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
                {[
                  { id: "bank", label: language === 'en' ? "Bank" : "Bank", icon: Landmark },
                  { id: "ewallet", label: language === 'en' ? "E-Wallet" : "E-Wallet", icon: Smartphone },
                  { id: "cash", label: language === 'en' ? "Cash" : "Tunai", icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTypeSelect(item.id)}
                      className={`py-2.5 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-[#00685F] shadow-sm ring-1 ring-black/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Curated Categorized Quick Presets (Only on Add mode) */}
            {modalMode === "add" && TEMPLATES_BY_TYPE[activeType] && (
              <div className="space-y-2 p-3 sm:p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00685F]" />
                    {language === 'en' ? "Quick Templates" : "Pilih Template Populer"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {activeType === "bank" ? "6 Pilihan Bank" : activeType === "ewallet" ? "4 E-Wallet" : "2 Dompet Tunai"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEMPLATES_BY_TYPE[activeType].map((tpl) => {
                    const isSelected = formName === tpl.title;
                    return (
                      <button
                        key={tpl.name}
                        type="button"
                        onClick={() => applyPreset(tpl)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer border active:scale-95 text-left ${
                          isSelected
                            ? "bg-emerald-50 border-[#00685F] text-[#00685F] shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700 hover:text-slate-900 shadow-2xs hover:shadow-xs"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tpl.color}`}></span>
                        <span className="truncate">{tpl.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Curated Color Swatches Palette */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {language === 'en' ? "Card Aesthetic / Theme" : "Tema & Estetika Kartu"}
                </label>
                <span className="text-[11px] font-bold text-[#00685F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/80">
                  {activeType === "bank" && (BANK_THEMES[formTheme]?.[language === 'en' ? 'nameEn' : 'nameId'] || "Emerald Mint")}
                  {activeType === "ewallet" && (EWALLET_THEMES[formTheme]?.[language === 'en' ? 'nameEn' : 'nameId'] || "Fresh Mint")}
                  {activeType === "cash" && (CASH_THEMES[formTheme]?.[language === 'en' ? 'nameEn' : 'nameId'] || "Clean Ledger")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-0.5">
                {activeType === "bank" && Object.values(BANK_THEMES).filter(t => t.id !== "bank-emerald").map((themeItem) => {
                  const isSelected = formTheme === themeItem.id || (themeItem.id === "bank-primary" && formTheme === "bank-emerald");
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => setFormTheme(themeItem.id)}
                      title={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      aria-label={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm ${themeItem.swatch} ${
                        isSelected 
                          ? "ring-4 ring-offset-2 ring-[#00685F] scale-110 shadow-md" 
                          : "hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
                    </button>
                  );
                })}

                {activeType === "ewallet" && Object.values(EWALLET_THEMES).filter(t => t.id !== "wallet").map((themeItem) => {
                  const isSelected = formTheme === themeItem.id || (themeItem.id === "wallet-teal" && formTheme === "wallet");
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => setFormTheme(themeItem.id)}
                      title={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      aria-label={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm ${themeItem.swatch} ${
                        isSelected 
                          ? "ring-4 ring-offset-2 ring-[#00685F] scale-110 shadow-md" 
                          : "hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
                    </button>
                  );
                })}

                {activeType === "cash" && Object.values(CASH_THEMES).filter(t => t.id !== "cash").map((themeItem) => {
                  const isSelected = formTheme === themeItem.id || (themeItem.id === "cash-emerald" && formTheme === "cash");
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => setFormTheme(themeItem.id)}
                      title={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      aria-label={language === 'en' ? themeItem.nameEn : themeItem.nameId}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm ${themeItem.swatch} ${
                        isSelected 
                          ? "ring-4 ring-offset-2 ring-[#00685F] scale-110 shadow-md" 
                          : "hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t("accounts.account_name") || "Nama Akun"}
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
                placeholder={
                  activeType === "bank" 
                    ? "Contoh: Bank BCA, Mandiri, BRI" 
                    : activeType === "ewallet"
                    ? "Contoh: GoPay, OVO, DANA"
                    : "Contoh: Dompet Utama, Kas Harian"
                }
              />
            </div>

            {/* Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {modalMode === "add" ? (t("accounts.initial_balance") || "Saldo Awal") : (t("accounts.balance") || "Saldo (Balance)")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formatThousand(formBalance)}
                  onChange={handleBalanceChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Optional Fields for Banks & E-Wallets */}
            {(activeType === "bank" || activeType === "ewallet") && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {activeType === "bank" 
                      ? (language === 'en' ? "Account Number (Optional)" : "Nomor Rekening (Opsional)")
                      : (language === 'en' ? "Phone / Account Number (Optional)" : "Nomor HP / Akun (Opsional)")}
                  </label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                    placeholder={activeType === "bank" ? "Contoh: 507795569085" : "Contoh: 081234567890"}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'en' ? "Account Holder (Optional)" : "Pemilik Rekening (Opsional)"}
                  </label>
                  <input
                    type="text"
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                    placeholder="Contoh: Muhammad Faqih"
                  />
                </div>
              </>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 sm:py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {language === 'en' ? "Cancel" : "Batal"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 sm:py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-[#00685F]/20"
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

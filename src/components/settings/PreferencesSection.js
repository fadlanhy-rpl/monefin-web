"use client";

import { useState, useRef, useEffect } from "react";
import { Sliders, DollarSign, Globe, Bell, ChevronDown, Check, Compass, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function PreferencesSection({
  currency,
  setCurrency,
  language,
  setLanguage,
  txAlert,
  setTxAlert,
  budgetAlert,
  setBudgetAlert,
  showTutorialOnLogin = true,
  setShowTutorialOnLogin,
  onOpenTutorialModal,
  onSave,
  isSaving = false,
}) {
  const { t, language: globalLanguage } = useLanguage();
  const isEn = globalLanguage === "en";
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const currencyRef = useRef(null);
  const languageRef = useRef(null);

  const currencyOptions = [
    { value: "IDR", code: "Rp", label: "Rupiah Indonesia", desc: "IDR (Rp)" },
    { value: "USD", code: "$",  label: "US Dollar",        desc: "USD ($)" },
    { value: "EUR", code: "€",  label: "Euro",             desc: "EUR (€)" },
    { value: "SGD", code: "S$", label: "Singapore Dollar", desc: "SGD (S$)" },
  ];

  const languageOptions = [
    { value: "id", code: "ID", label: "Bahasa Indonesia", desc: "Bahasa Indonesia" },
    { value: "en", code: "EN", label: "English (US)",      desc: "United States" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFormLang = language || globalLanguage || "id";
  const selectedCurrency = currencyOptions.find(o => o.value === currency) || currencyOptions[0];
  const selectedLanguage = languageOptions.find(o => o.value === activeFormLang) || languageOptions[0];

  return (
    <div className="bg-white p-5 sm:p-7 md:p-9 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10 transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-teal-100 shadow-2xs">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
            {t("settings.preferences")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {t("settings.preferences_desc")}
          </p>
        </div>
      </div>

      {/* Currency & Language Settings */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{isEn ? "Regional & Language" : "Regional & Bahasa"}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Preferred Currency */}
          <div className="space-y-1.5 relative" ref={currencyRef}>
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <DollarSign className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.primary_currency")}</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLanguageOpen(false);
              }}
              className={`w-full min-h-[48px] bg-slate-50/80 border rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between text-left cursor-pointer transition-all ${
                isCurrencyOpen
                  ? "border-[#00685F] bg-white ring-4 ring-[#00685F]/10 shadow-sm"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-7 h-7 rounded-xl bg-white border border-slate-200/80 text-[#00685F] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {selectedCurrency.code}
                </span>
                <div className="truncate">
                  <span className="text-slate-900 block truncate leading-tight font-extrabold">{selectedCurrency.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{selectedCurrency.desc}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isCurrencyOpen ? "rotate-180 text-[#00685F]" : ""}`} />
            </button>

            {isCurrencyOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {currencyOptions.map((opt) => {
                  const isSelected = currency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCurrency(opt.value);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                        isSelected 
                          ? "bg-teal-50 text-[#00685F] font-extrabold border border-teal-100" 
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {opt.code}
                        </span>
                        <div>
                          <span className="block">{opt.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="space-y-1.5 relative" ref={languageRef}>
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Globe className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.app_language")}</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsCurrencyOpen(false);
              }}
              className={`w-full min-h-[48px] bg-slate-50/80 border rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between text-left cursor-pointer transition-all ${
                isLanguageOpen
                  ? "border-[#00685F] bg-white ring-4 ring-[#00685F]/10 shadow-sm"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-7 h-7 rounded-xl bg-white border border-slate-200/80 text-[#00685F] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {selectedLanguage.code}
                </span>
                <div className="truncate">
                  <span className="text-slate-900 block truncate leading-tight font-extrabold">{selectedLanguage.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{selectedLanguage.desc}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isLanguageOpen ? "rotate-180 text-[#00685F]" : ""}`} />
            </button>

            {isLanguageOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {languageOptions.map((opt) => {
                  const isSelected = activeFormLang === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setLanguage(opt.value);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                        isSelected 
                          ? "bg-teal-50 text-[#00685F] font-extrabold border border-teal-100" 
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {opt.code}
                        </span>
                        <div>
                          <span className="block">{opt.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Notification Switches */}
      <div className="space-y-4 pt-1">
        <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{t("settings.notification_settings")}</span>
        </h3>

        <div className="space-y-3 select-none">
          {/* Toggle 1: Transaction Alerts */}
          <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors">
            <div className="pr-3 space-y-0.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">{t("settings.new_tx_alert")}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">{t("settings.new_tx_alert_desc")}</p>
            </div>
            <button 
              type="button"
              onClick={() => setTxAlert(!txAlert)}
              aria-label={txAlert ? "Disable transaction alerts" : "Enable transaction alerts"}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
                txAlert ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                txAlert ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Toggle 2: Budget Limit Warnings */}
          <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors">
            <div className="pr-3 space-y-0.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">{t("settings.budget_alert")}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">{t("settings.budget_alert_desc")}</p>
            </div>
            <button 
              type="button"
              onClick={() => setBudgetAlert(!budgetAlert)}
              aria-label={budgetAlert ? "Disable budget alerts" : "Enable budget alerts"}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
                budgetAlert ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                budgetAlert ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Guide & Onboarding Settings */}
      <div className="space-y-4 pt-1">
        <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{t("settings.tutorial_section") || (isEn ? "Guide & Onboarding" : "Panduan & Onboarding")}</span>
        </h3>

        <div className="space-y-3 select-none">
          {/* Toggle: Show Tutorial on Login */}
          <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors">
            <div className="pr-3 space-y-0.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                {t("settings.show_tutorial_on_login") || "Tampilkan Panduan Saat Login"}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                {t("settings.show_tutorial_on_login_desc") || "Buka dialog panduan langkah awal secara otomatis setiap kali Anda masuk ke MoneFin"}
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setShowTutorialOnLogin && setShowTutorialOnLogin(!showTutorialOnLogin)}
              aria-label={showTutorialOnLogin ? "Disable auto tutorial" : "Enable auto tutorial"}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
                showTutorialOnLogin ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                showTutorialOnLogin ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Action Card: Open Tutorial Now */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-teal-50/60 rounded-2xl border border-teal-200/70 shadow-2xs">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00685F]" />
                <span>{t("settings.open_tutorial_now") || (isEn ? "Open Interactive Guide Now" : "Buka Panduan Tutorial Sekarang")}</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                {t("settings.open_tutorial_now_desc") || "Pelajari kembali ekosistem MoneFin, langkah awal penting, dan cara kerja setiap fitur"}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenTutorialModal}
              className="min-h-[42px] px-5 py-2.5 bg-white text-[#00685F] border border-teal-300 hover:border-teal-400 hover:bg-teal-50 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 self-stretch sm:self-auto text-center flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t("settings.open_guide_btn") || (isEn ? "Open Guide" : "Buka Panduan")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="w-full sm:w-auto min-h-[44px] bg-[#00685F] text-white px-8 py-3 rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 active:scale-[0.98] cursor-pointer text-center select-none flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{t("settings.save_preferences")}</span>
        </button>
      </div>

    </div>
  );
}


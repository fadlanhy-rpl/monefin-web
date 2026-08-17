"use client";

import { useState, useRef, useEffect } from "react";
import { Sliders, DollarSign, Globe, Bell, Sun, Moon, ChevronDown, Check } from "lucide-react";

export default function PreferencesSection({
  currency,
  setCurrency,
  language,
  setLanguage,
  emailNotif,
  setEmailNotif,
  txAlert,
  setTxAlert,
  budgetAlert,
  setBudgetAlert,
  theme,
  setTheme,
  onSave
}) {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const currencyRef = useRef(null);
  const languageRef = useRef(null);

  const currencyOptions = [
    { value: "IDR", label: "IDR - Rupiah Indonesia (Rp)" },
    { value: "USD", label: "USD - US Dollar ($)" },
    { value: "EUR", label: "EUR - Euro (€)" },
    { value: "SGD", label: "SGD - Singapore Dollar (S$)" },
  ];

  const languageOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English (US)" },
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

  const selectedCurrencyLabel = currencyOptions.find(o => o.value === currency)?.label || "IDR - Rupiah Indonesia (Rp)";
  const selectedLanguageLabel = languageOptions.find(o => o.value === language)?.label || "Bahasa Indonesia";

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-md transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-teal-100">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Preferensi & Notifikasi</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola pengaturan mata uang, bahasa, dan pemberitahuan</p>
        </div>
      </div>

      {/* Currency & Language Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Preferred Currency */}
        <div className="space-y-1.5 relative" ref={currencyRef}>
          <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
            <DollarSign className="w-3.5 h-3.5 text-[#00685F]" />
            <span>Mata Uang Utama</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setIsCurrencyOpen(!isCurrencyOpen);
              setIsLanguageOpen(false);
            }}
            className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between text-left cursor-pointer transition-all ${
              isCurrencyOpen
                ? "border-[#00685F] bg-white ring-4 ring-[#00685F]/10"
                : "border-slate-200/70 hover:border-slate-300"
            }`}
          >
            <span className="truncate text-slate-800">{selectedCurrencyLabel}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isCurrencyOpen ? "rotate-180 text-[#00685F]" : ""}`} />
          </button>

          {isCurrencyOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
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
                    className={`w-full px-4 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                      isSelected 
                        ? "bg-[#00685F]/10 text-[#00685F]" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="space-y-1.5 relative" ref={languageRef}>
          <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
            <Globe className="w-3.5 h-3.5 text-[#00685F]" />
            <span>Bahasa Aplikasi</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setIsLanguageOpen(!isLanguageOpen);
              setIsCurrencyOpen(false);
            }}
            className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-between text-left cursor-pointer transition-all ${
              isLanguageOpen
                ? "border-[#00685F] bg-white ring-4 ring-[#00685F]/10"
                : "border-slate-200/70 hover:border-slate-300"
            }`}
          >
            <span className="truncate text-slate-800">{selectedLanguageLabel}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isLanguageOpen ? "rotate-180 text-[#00685F]" : ""}`} />
          </button>

          {isLanguageOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              {languageOptions.map((opt) => {
                const isSelected = language === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.value);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                      isSelected 
                        ? "bg-[#00685F]/10 text-[#00685F]" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Notification Switches */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#00685F]" />
          <span>Pengaturan Notifikasi</span>
        </h3>

        <div className="space-y-2 select-none">
          {/* Toggle 1: Email Monthly Digest */}
          <div className="flex justify-between items-center p-3.5 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">Laporan Bulanan via Email</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Terima ringkasan performa finansial setiap akhir bulan</p>
            </div>
            <button 
              type="button"
              onClick={() => setEmailNotif(!emailNotif)}
              className={`w-11 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 ${
                emailNotif ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                emailNotif ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Toggle 2: Transaction Alerts */}
          <div className="flex justify-between items-center p-3.5 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">Notifikasi Transaksi Baru</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Kirim pemberitahuan setiap ada pencatatan transaksi</p>
            </div>
            <button 
              type="button"
              onClick={() => setTxAlert(!txAlert)}
              className={`w-11 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 ${
                txAlert ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                txAlert ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>

          {/* Toggle 3: Budget Limit Warnings */}
          <div className="flex justify-between items-center p-3.5 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">Peringatan Batas Anggaran (Budget Alert)</p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Beritahu saat pengeluaran kategori mencapai 80% limit</p>
            </div>
            <button 
              type="button"
              onClick={() => setBudgetAlert(!budgetAlert)}
              className={`w-11 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 ${
                budgetAlert ? 'bg-[#00685F]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
                budgetAlert ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-[#00685F]" />
          <span>Tema Tampilan</span>
        </h3>

        <div className="grid grid-cols-3 gap-3 select-none">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              theme === "light" 
                ? "bg-[#E6F0EF] border-[#00685F] text-[#00685F] shadow-xs" 
                : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-bold">Terang</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              theme === "dark" 
                ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-bold">Gelap</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              theme === "system" 
                ? "bg-[#E6F0EF] border-[#00685F] text-[#00685F] shadow-xs" 
                : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-xs font-bold">Sistem</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onSave}
          className="w-full sm:w-auto bg-[#00685F] text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 active:scale-95 cursor-pointer text-center select-none"
        >
          Simpan Preferensi
        </button>
      </div>

    </div>
  );
}

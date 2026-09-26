"use client";

import { useState, useRef, useEffect } from "react";
import { Coins, ChevronDown, Check } from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export const CURRENCY_OPTIONS = [
  { code: "IDR", symbol: "Rp", nameId: "Rupiah Indonesia", nameEn: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "USD", symbol: "$",  nameId: "Dolar Amerika",    nameEn: "US Dollar",         flag: "🇺🇸" },
  { code: "EUR", symbol: "€",  nameId: "Euro Eropa",       nameEn: "Euro",              flag: "🇪🇺" },
  { code: "SGD", symbol: "S$", nameId: "Dolar Singapura",  nameEn: "Singapore Dollar",  flag: "🇸🇬" },
];

/**
 * Compact Dropdown Currency Switcher for Navbar & Headers
 */
export function CurrencySwitcher() {
  const { currencyCode, changeCurrency, rates } = useCurrency();
  const { language } = useLanguage();
  const isEn = language === "en";
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const current = CURRENCY_OPTIONS.find((c) => c.code === currencyCode) || CURRENCY_OPTIONS[0];

  const getRateHint = (code) => {
    const idrPerUsd = rates?.IDR || 15500;
    if (code === "IDR") return isEn ? "Base Currency (Rp)" : "Mata Uang Dasar (Rp)";
    if (code === "USD") return `1 USD ≈ Rp ${Math.round(idrPerUsd).toLocaleString("id-ID")}`;
    if (code === "EUR") {
      const idrPerEur = idrPerUsd / (rates?.EUR || 0.92);
      return `1 EUR ≈ Rp ${Math.round(idrPerEur).toLocaleString("id-ID")}`;
    }
    if (code === "SGD") {
      const idrPerSgd = idrPerUsd / (rates?.SGD || 1.35);
      return `1 SGD ≈ Rp ${Math.round(idrPerSgd).toLocaleString("id-ID")}`;
    }
    return "";
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 bg-slate-100/80 hover:bg-white px-2.5 py-1 rounded-full border border-slate-200/70 hover:border-brand-300 text-[10px] sm:text-[11px] font-extrabold text-slate-800 hover:text-brand-700 transition-all cursor-pointer shadow-2xs select-none"
        aria-expanded={open}
        aria-haspopup="listbox"
        title={isEn ? "Switch Display Currency (Live Rate)" : "Ganti Mata Uang Tampilan (Kurs Live)"}
      >
        <Coins className="w-3 h-3 text-brand-600 shrink-0" />
        <span className="text-brand-700">{current.symbol}</span>
        <span>{current.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 py-2 z-50 animate-popIn"
        >
          <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {isEn ? "Multi-Currency (Live)" : "Multi-Mata Uang (Live)"}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Auto FX
            </span>
          </div>
          <div className="py-1">
            {CURRENCY_OPTIONS.map((opt) => {
              const isActive = currencyCode === opt.code;
              return (
                <button
                  key={opt.code}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    changeCurrency(opt.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-brand-50/90 text-brand-800"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center font-black text-[11px] text-slate-800 shrink-0">
                      {opt.symbol}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black leading-tight flex items-center gap-1.5">
                        <span>{opt.code}</span>
                        <span className="text-[10px] font-semibold text-slate-500 truncate">
                          {isEn ? opt.nameEn : opt.nameId}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium tabular-nums truncate">
                        {getRateHint(opt.code)}
                      </p>
                    </div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Segmented Pill Bar for Interactive Demos & Mobile Menus
 */
export function CurrencySwitcherPill({ compact = false, dark = false }) {
  const { currencyCode, changeCurrency } = useCurrency();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl border ${
        dark
          ? "bg-white/10 border-white/15"
          : "bg-slate-100/90 border-slate-200/80"
      }`}
    >
      {CURRENCY_OPTIONS.map((opt) => {
        const isActive = currencyCode === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => changeCurrency(opt.code)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 select-none ${
              compact ? "text-[10px]" : "text-[11px]"
            } ${
              isActive
                ? dark
                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                  : "bg-brand-600 text-white shadow-xs"
                : dark
                ? "text-slate-300 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
            }`}
          >
            <span className="opacity-85">{opt.symbol}</span>
            <span>{opt.code}</span>
          </button>
        );
      })}
    </div>
  );
}

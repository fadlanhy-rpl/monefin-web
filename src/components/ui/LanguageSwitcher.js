"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const LANG_OPTIONS = [
  { value: "en", label: "English (US)",     short: "EN", flag: "🇺🇸" },
  { value: "id", label: "Bahasa Indonesia", short: "ID", flag: "🇮🇩" },
];

/**
 * Desktop dropdown language switcher (hover-triggered, animated)
 */
export function LanguageSwitcherDropdown() {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANG_OPTIONS.find(o => o.value === language) ?? LANG_OPTIONS[0];

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-[#00685F] hover:bg-teal-50/60 transition-all duration-200 text-xs font-bold border border-transparent hover:border-teal-100 select-none"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wide">{current.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-1 w-44 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {LANG_OPTIONS.map(opt => {
            const isActive = language === opt.value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => { changeLanguage(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "text-[#00685F] bg-teal-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{opt.flag}</span>
                  <span>{opt.label}</span>
                </span>
                {isActive && <Check className="w-3.5 h-3.5 text-[#00685F] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Mobile toggle pill (EN / ID) — for sidebar/mobile menu
 */
export function LanguageSwitcherPill() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
        <Globe className="w-3.5 h-3.5 text-[#00685F]" />
        {language === "en" ? "Language" : "Bahasa"}
      </span>
      <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
        {LANG_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => changeLanguage(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer select-none ${
              language === opt.value
                ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
                : "text-slate-400 hover:text-[#00685F]"
            }`}
          >
            {opt.flag} {opt.short}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Legacy simple pill (backward compatible with existing usage)
 */
export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
      {LANG_OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => changeLanguage(opt.value)}
          className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all cursor-pointer ${
            language === opt.value
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {opt.short}
        </button>
      ))}
    </div>
  );
}


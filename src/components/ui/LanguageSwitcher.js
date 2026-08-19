"use client";

import { useLanguage } from "../../context/LanguageContext";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
      <button
        onClick={() => changeLanguage("id")}
        className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${
          language === "id"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${
          language === "en"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        EN
      </button>
    </div>
  );
}

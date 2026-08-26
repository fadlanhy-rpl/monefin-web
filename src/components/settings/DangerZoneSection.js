"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function DangerZoneSection({ onDeleteAccount }) {
  const { t } = useLanguage();

  return (
    <div className="bg-red-50/60 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100/80 rounded-2xl flex items-center justify-center text-red-600 shrink-0 border border-red-200/60">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-red-600 leading-tight">{t("settings.danger_zone_title")}</h2>
          <p className="text-xs text-red-500/90 font-medium mt-1">{t("settings.danger_zone_desc")}</p>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={onDeleteAccount}
        className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-2xl font-extrabold hover:bg-red-700 transition-all shadow-md shadow-red-500/20 cursor-pointer text-xs sm:text-sm active:scale-95 shrink-0 flex items-center justify-center gap-2 select-none"
      >
        <Trash2 className="w-4 h-4" />
        <span>{t("settings.delete_account_btn")}</span>
      </button>
    </div>
  );
}

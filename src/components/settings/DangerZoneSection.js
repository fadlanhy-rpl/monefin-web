"use client";

import { Trash2, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function DangerZoneSection({ onDeleteAccount }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="bg-rose-50/70 p-5 sm:p-7 md:p-9 rounded-[2rem] sm:rounded-[2.5rem] border border-rose-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-rose-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0 border border-rose-200 shadow-2xs">
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-rose-950 tracking-tight leading-tight">
              {t("settings.danger_zone_title") || (isEn ? "Danger Zone: Delete Account" : "Zona Bahaya: Hapus Akun")}
            </h2>
            <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
              {isEn ? "Irreversible" : "Permanen"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-800/80 font-medium leading-relaxed">
            {t("settings.danger_zone_desc") || (isEn 
              ? "Permanently delete your MoneFin account and all financial data." 
              : "Menghapus akun MoneFin beserta seluruh data transaksi, anggaran, dan rekening secara permanen.")}
          </p>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={onDeleteAccount}
        className="w-full md:w-auto min-h-[44px] bg-red-600 text-white px-6 sm:px-7 py-3 rounded-2xl font-extrabold hover:bg-red-700 transition-all shadow-md shadow-red-600/25 cursor-pointer text-xs sm:text-sm active:scale-[0.98] shrink-0 flex items-center justify-center gap-2 select-none"
      >
        <Trash2 className="w-4 h-4 text-red-200" />
        <span>{t("settings.delete_account_btn") || (isEn ? "Delete Account" : "Hapus Akun")}</span>
      </button>
    </div>
  );
}


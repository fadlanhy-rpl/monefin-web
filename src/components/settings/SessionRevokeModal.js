"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, X, AlertTriangle, Laptop, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SessionRevokeModal({
  isOpen,
  onClose,
  onConfirm,
  session = null, // if null, indicates revoke all other sessions
  otherCount = 0,
  isLoading = false,
}) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const isSingle = !!session;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-screen bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Click outside to close backdrop */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={!isLoading ? onClose : undefined} 
        aria-hidden="true"
      />

      <div className="bg-white rounded-[2.25rem] w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-center relative my-auto overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm mt-2">
          <LogOut className="w-8 h-8 text-rose-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {isSingle
            ? (t("settings.revoke_modal_title") || "Keluarkan Sesi Ini?")
            : (t("settings.revoke_all_modal_title") || "Keluarkan Semua Sesi Lain?")}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5 leading-relaxed px-2">
          {isSingle
            ? (t("settings.revoke_modal_desc") || "Apakah Anda yakin ingin mengeluarkan sesi ini? Perangkat tersebut akan langsung kehilangan akses.")
            : (t("settings.revoke_all_modal_desc") || "Semua sesi aktif selain perangkat ini akan langsung diputus. Anda tetap dapat menggunakan sesi saat ini.")}
        </p>

        {/* Session Details Box (If single session) */}
        {isSingle && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-6 text-left space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{session.device_name}</span>
            </div>
            {session.ip_address && (
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-700">{session.ip_address}</span>
              </div>
            )}
          </div>
        )}

        {/* Multiple count summary (If all sessions) */}
        {!isSingle && (
          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/60 mb-6 text-left flex items-start gap-2.5 text-xs text-amber-800 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Tindakan ini akan mengeluarkan <strong>{otherCount} sesi</strong> aktif di perangkat lain secara bersamaan.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {t("common.cancel") || "Batal"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-bold text-xs sm:text-sm hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("settings.revoking") || "Mengeluarkan..."}</span>
              </>
            ) : isSingle ? (
              t("settings.revoke_modal_confirm") || "Ya, Keluarkan"
            ) : (
              t("settings.revoke_all_modal_confirm") || "Ya, Keluarkan Semua"
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}

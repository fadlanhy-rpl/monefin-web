"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, X, LogOut, Mail, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  userEmail = "",
}) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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

  const handleConfirm = async () => {
    setIsLoading(true);
    const emailParam = encodeURIComponent(userEmail || "");
    const targetUrl = `/forgot-password?email=${emailParam}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("monefin_logout_redirect", targetUrl);
    }
    try {
      await logout(targetUrl);
    } catch (err) {
      console.error("Logout for forgot password failed:", err);
      // Fallback in case of unexpected error
      window.location.href = targetUrl;
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-screen bg-slate-950/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={!isLoading ? onClose : undefined} 
        aria-hidden="true"
      />

      <div className="bg-white rounded-[2.25rem] sm:rounded-[2.5rem] w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 animate-in zoom-in-95 duration-200 text-center relative my-auto overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00685F] via-teal-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Badge */}
        <div className="w-16 h-16 bg-teal-50 text-[#00685F] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm mt-2">
          <KeyRound className="w-8 h-8 text-[#00685F]" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">
          {isEn ? "Reset Password via Email?" : "Lupa Password Anda?"}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 leading-relaxed px-2">
          {isEn
            ? "To reset your password via email OTP verification, you need to sign out of this session first for account security."
            : "Untuk mereset password melalui kode OTP email, Anda perlu keluar (logout) dari sesi ini terlebih dahulu demi keamanan akun Anda."}
        </p>

        {/* Email Pill Box */}
        {userEmail && (
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4 text-left flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-[#00685F] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isEn ? "Account Email" : "Email Akun"}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 mb-6 text-left flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            {isEn
              ? "You will be redirected directly to the Forgot Password page with your email already pre-filled."
              : "Setelah keluar, Anda akan langsung diarahkan ke halaman Lupa Password dengan email yang sudah terisi otomatis."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isEn ? "Cancel" : "Batal"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 bg-[#00685F] hover:bg-[#004D46] text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all active:scale-95 shadow-lg shadow-[#00685F]/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{isEn ? "Signing out..." : "Sedang keluar..."}</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>{isEn ? "Sign Out & Reset" : "Keluar & Reset"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

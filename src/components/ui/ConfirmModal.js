import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  isDanger = true,
  isLoading = false
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200 relative my-auto">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center mb-5 transition-transform hover:scale-105 select-none bg-red-50 text-red-500 border border-red-100 shadow-sm">
          <Trash2 className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title & Message */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight select-none">
          {title}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-7 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3.5 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-lg ${
              isDanger
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/20 hover:shadow-red-500/30"
                : "bg-[#00685F] hover:bg-[#004D46] shadow-[#00685F]/20"
            }`}
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full"></span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


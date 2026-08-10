import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Anggaran?",
  description = "Apakah Anda yakin ingin menghapus anggaran kategori ini? Tindakan ini tidak dapat dibatalkan.",
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

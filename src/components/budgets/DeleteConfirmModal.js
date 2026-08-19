import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Anggaran?",
  description = "Apakah Anda yakin ingin menghapus anggaran kategori ini? Tindakan ini tidak dapat dibatalkan.",
  isLoading = false
}) {
  const { t } = useLanguage();

  // If props for title/desc are provided but we have translation, we can just fallback if not provided
  // In BudgetsGrid.js, the strings are just hardcoded as props so we will override them with translation if they match default.
  // Actually, wait, let's just use translations directly here because it's only used for budgets currently.
  // But to keep it generic in case it's used elsewhere, we check if they are the default Indonesian strings, then translate.
  // Or just ignore props and use translate if it's the default. Let's just use t().

  const displayTitle = title === "Hapus Anggaran?" ? (t("budgets.delete_title") || "Delete Budget?") : title;
  const displayDesc = description === "Apakah Anda yakin ingin menghapus anggaran kategori ini? Tindakan ini tidak dapat dibatalkan." 
    ? (t("budgets.delete_desc") || "Are you sure you want to delete this budget? Transaction history for the related category will not be deleted, but the budget warning limit will be removed.") 
    : description;

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
          {displayTitle}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mb-6 leading-relaxed">
          {displayDesc}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {t("common.cancel") || "Batal"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (t("budgets.deleting") || "Menghapus...") : (t("budgets.delete_confirm") || "Ya, Hapus")}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, HardDrive, Layers } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptDetailModal({ isOpen, onClose, transaction }) {
  const { formatCurrency } = useCurrency();
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const [failedImgUrl, setFailedImgUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction || !mounted) return null;

  const receiptData = transaction.receipt_data || {};
  const items = receiptData.items || receiptData.split_items || [];
  const imageUrl = transaction.receipt_image_url;
  const imgError = Boolean(imageUrl && failedImgUrl === imageUrl);
  const pagesCount = Number(receiptData.pages_count) || 1;
  const scanType = receiptData.scan_type || "single";

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {t("receipts.detail_title", isEn ? "Receipt Details & Proof of Purchase" : "Rincian Struk & Bukti Belanja")}
              </h3>
              {pagesCount > 1 && (
                <span className="px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#00685F] font-mono tabular-nums text-[10px] font-black uppercase tracking-wider">
                  {scanType === "multi_receipt"
                    ? isEn
                      ? `${pagesCount} Combined Receipts`
                      : `Gabungan ${pagesCount} Struk`
                    : isEn
                      ? `Long Receipt (${pagesCount} Parts)`
                      : `Struk Panjang (${pagesCount} Bagian)`}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
              {transaction.description || receiptData.merchant || (isEn ? "Transaction" : "Transaksi")}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label={t("common.close", isEn ? "Close" : "Tutup")}
            className="text-slate-400 hover:text-slate-600 p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t("receipts.detail_date", isEn ? "Date" : "Tanggal")}
              </span>
              <p className="font-black text-slate-800">{formatDate(transaction.transaction_date)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t("receipts.detail_account", isEn ? "Account" : "Rekening")}
              </span>
              <p className="font-black text-slate-800">{transaction.account?.name || (isEn ? "Primary" : "Utama")}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t("receipts.detail_category", isEn ? "Category" : "Kategori")}
              </span>
              <p className="font-black text-slate-800">{transaction.category?.name || (isEn ? "General" : "Umum")}</p>
            </div>

            <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 space-y-1">
              <span className="text-[10px] text-[#00685F] font-bold uppercase">
                {t("receipts.detail_total", isEn ? "Total Amount" : "Total Akhir")}
              </span>
              <p className="font-black text-[#00685F]">{formatCurrency(-Math.abs(transaction.amount))}</p>
            </div>
          </div>

          {/* Photo Attachment (if saved) */}
          {imageUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#00685F]" />
                  {t("receipts.detail_attachment", isEn ? "Receipt Photo Attachment" : "Lampiran Foto Struk")}
                </span>
                {!imgError && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#00685F] hover:underline flex items-center gap-1"
                  >
                    <span>{t("receipts.open_full_size", isEn ? "Open Full Size" : "Buka Ukuran Penuh")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center min-h-24 max-h-96 overflow-y-auto">
                {imgError ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-slate-500">
                    <HardDrive className="w-8 h-8 text-slate-600" />
                    <p className="text-xs text-center">
                      {isEn
                        ? "Image could not be loaded. The server may be unreachable."
                        : "Gambar tidak dapat dimuat. Server mungkin tidak dapat dijangkau."}
                    </p>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-teal-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>{isEn ? "Try opening directly" : "Coba buka langsung"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt={isEn ? "Shopping Receipt" : "Struk Belanja"}
                    className="w-auto max-w-full object-contain rounded-xl"
                    onError={() => setFailedImgUrl(imageUrl)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {t("receipts.detail_no_photo", isEn
                  ? "Receipt photo was not stored on server (per user preference to save storage & preserve privacy)."
                  : "Foto struk tidak disimpan di server (sesuai pilihan pengguna untuk menghemat penyimpanan & menjaga privasi).")}
              </span>
            </div>
          )}

          {/* Item Breakdown (if itemized) */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-[#00685F]" />
                <span>
                  {t("receipts.detail_items_breakdown", isEn ? "Purchased Items Breakdown" : "Rincian Barang Belanja")} ({items.length} {isEn ? "Items" : "Item"})
                </span>
              </div>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/40 overflow-hidden text-xs">
                {items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <p className="font-bold text-slate-800">{it.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {it.qty}x @ {formatCurrency(it.price)}
                      </p>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatCurrency(it.total || it.qty * it.price)}
                    </span>
                  </div>
                ))}

                {(receiptData.tax > 0 || receiptData.discount > 0) && (
                  <div className="p-3 bg-slate-50 space-y-1 text-[11px] text-slate-500">
                    {receiptData.tax > 0 && (
                      <div className="flex justify-between">
                        <span>{isEn ? "Tax / VAT:" : "Pajak (PPN):"}</span>
                        <span>{formatCurrency(receiptData.tax)}</span>
                      </div>
                    )}
                    {receiptData.discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>{isEn ? "Discount:" : "Diskon:"}</span>
                        <span>-{formatCurrency(receiptData.discount)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 transition cursor-pointer"
          >
            {t("common.close", isEn ? "Close" : "Tutup")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

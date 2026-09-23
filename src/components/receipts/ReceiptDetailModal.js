"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, HardDrive, Layers } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useCurrency } from "../../hooks/useCurrency";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptDetailModal({ isOpen, onClose, transaction }) {
  const { formatCurrency } = useCurrency();
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

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

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Rincian Struk & Bukti Belanja
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {transaction.description || receiptData.merchant || "Transaksi"}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tanggal</span>
              <p className="font-black text-slate-800">{formatDate(transaction.transaction_date)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Rekening</span>
              <p className="font-black text-slate-800">{transaction.account?.name || "Utama"}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Kategori</span>
              <p className="font-black text-slate-800">{transaction.category?.name || "Umum"}</p>
            </div>

            <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 space-y-1">
              <span className="text-[10px] text-[#00685F] font-bold uppercase">Total Akhir</span>
              <p className="font-black text-[#00685F]">{formatCurrency(-Math.abs(transaction.amount))}</p>
            </div>
          </div>

          {/* Photo Attachment (if saved) */}
          {imageUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#00685F]" />
                  Lampiran Foto Struk
                </span>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#00685F] hover:underline flex items-center gap-1"
                >
                  <span>Buka Ukuran Penuh</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Struk Belanja"
                  className="max-h-72 object-contain rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Foto struk tidak disimpan di server (sesuai pilihan pengguna untuk menghemat penyimpanan & menjaga privasi).</span>
            </div>
          )}

          {/* Item Breakdown (if itemized) */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-[#00685F]" />
                <span>Rincian Barang Belanja ({items.length} Item)</span>
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
                        <span>Pajak (PPN):</span>
                        <span>{formatCurrency(receiptData.tax)}</span>
                      </div>
                    )}
                    {receiptData.discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Diskon:</span>
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
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

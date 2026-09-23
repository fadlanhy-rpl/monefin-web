"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Key,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { scanReceipt } from "../../services/receipt.service";
import ReceiptGuideModal from "./ReceiptGuideModal";
import Link from "next/link";

/**
 * Client-side Canvas Image Compression
 * Resizes image to max 1600px width/height and compresses to JPEG ~80% quality.
 * Shrinks 5MB phone photos to ~200-300KB in milliseconds.
 */
function compressImage(file, maxDimension = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name || "receipt.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // fallback
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  hasAiConfig = true,
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Mohon unggah file gambar (JPG, PNG, atau WebP).");
      return;
    }

    setErrorMsg("");
    setIsProcessing(true);
    setProcessingStatus("Mengompresi gambar untuk kecepatan...");

    try {
      // 1. Compress client-side
      const compressedFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressedFile);

      setProcessingStatus("Membaca struk dengan Vision AI...");

      // 2. Send to backend
      const response = await scanReceipt(compressedFile);

      if (response?.success && response?.data) {
        onScanSuccess(response.data, compressedFile, previewUrl);
        onClose();
      } else {
        throw new Error(response?.message || "Gagal memproses struk.");
      }
    } catch (err) {
      console.warn("Receipt scan error:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        "Gagal memindai struk. Pastikan kunci API sudah terkonfigurasi dan foto struk terbaca jelas.";
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Click outside backdrop */}
        <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col overflow-hidden relative z-10">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center font-black">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Pindai Struk Belanja
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Catat pengeluaran instan lewat foto struk fisik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="text-slate-400 hover:text-[#00685F] p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Lihat Panduan"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            {/* BYOK Warning if user has no AI key configured */}
            {!hasAiConfig && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Key className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Kunci API (BYOK) Belum Dikonfigurasi</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Fitur Pindai Struk membaca gambar menggunakan AI. Hubungkan API key Anda (seperti Google Gemini yang <strong>100% gratis</strong>) di menu Pengaturan.
                </p>
                <div className="pt-1">
                  <Link
                    href="/settings?tab=ai"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition"
                  >
                    <span>Buka Pengaturan AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug flex-1">
                  <p className="font-bold">Gagal Memindai Struk</p>
                  <p className="text-rose-700 mt-0.5">{errorMsg}</p>
                  {(errorMsg.toLowerCase().includes("kuota") ||
                    errorMsg.toLowerCase().includes("saldo") ||
                    errorMsg.toLowerCase().includes("rate limit") ||
                    errorMsg.toLowerCase().includes("habis") ||
                    errorMsg.toLowerCase().includes("tidak mendukung") ||
                    errorMsg.toLowerCase().includes("ganti model") ||
                    errorMsg.toLowerCase().includes("bukan vision") ||
                    errorMsg.toLowerCase().includes("pengaturan")) && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center gap-2">
                      <Link
                        href="/settings?tab=ai"
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] transition shadow-xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Buka Pengaturan AI (Ganti Provider / Model)</span>
                      </Link>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing ? (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-dashed border-[#00685F]/40 bg-teal-50/20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F]">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl border-2 border-[#00685F] border-t-transparent animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-800">
                    Memproses Struk Belanja...
                  </p>
                  <p className="text-xs text-[#00685F] font-bold animate-pulse">
                    {processingStatus}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Proses ini memerlukan waktu beberapa detik tergantung koneksi dan resolusi struk.
                </p>
              </div>
            ) : (
              /* Dropzone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-[#00685F] bg-teal-50/50 scale-[0.99]"
                    : "border-slate-200 hover:border-[#00685F]/60 hover:bg-slate-50/60"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <p className="text-sm font-bold text-slate-800">
                  Tarik & Lepas Foto Struk di Sini
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  atau klik untuk memilih file dari komputer / galeri HP Anda
                </p>

                <div className="flex items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ambil Foto Langsung</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition active:scale-95"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Pilih Galeri</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Tips Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00685F]" />
                Foto otomatis dikompresi & aman
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="text-[#00685F] font-bold hover:underline"
              >
                Lihat tips foto jelas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      <ReceiptGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>,
    document.body
  );
}

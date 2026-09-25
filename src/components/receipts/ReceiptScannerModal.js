"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
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
  ShieldCheck,
  CameraOff,
  SwitchCamera,
  ZapOff,
  Circle,
} from "lucide-react";
import { scanReceipt } from "../../services/receipt.service";
import ReceiptGuideModal from "./ReceiptGuideModal";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Client-side Canvas Image Compression
 * Resizes image to max 1600px width/height and compresses to JPEG ~80% quality.
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
              resolve(file);
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

/**
 * Capture a JPEG File from a <video> element via canvas.
 */
function captureFrameFromVideo(videoEl, quality = 0.85) {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(new File([blob], "receipt_camera.jpg", { type: "image/jpeg", lastModified: Date.now() }));
        } else {
          resolve(null);
        }
      },
      "image/jpeg",
      quality
    );
  });
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// ─── Camera View Sub-component ────────────────────────────────────────────────
function CameraView({ onCapture, onClose, isEn, t }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // environment = back, user = front
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const startStream = useCallback(async (facing) => {
    // Stop previous stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsReady(false);
    setCameraError(null);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setIsReady(true);
        };
      }

      // Check if device has multiple cameras (for flip button)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setHasMultipleCameras(videoInputs.length > 1);
    } catch (err) {
      console.warn("Camera error:", err);
      let msg = "";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = isEn
          ? "Camera access was denied. Please allow camera permission in your browser settings and try again."
          : "Akses kamera ditolak. Izinkan akses kamera di pengaturan browser Anda dan coba lagi.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = isEn
          ? "No camera found on this device. Please use the 'Choose Image File' option instead."
          : "Tidak ada kamera yang ditemukan pada perangkat ini. Gunakan opsi 'Pilih Galeri' sebagai gantinya.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = isEn
          ? "Camera is in use by another application. Close other apps using the camera and try again."
          : "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang menggunakan kamera dan coba lagi.";
      } else if (err.name === "OverconstrainedError") {
        // Retry with simpler constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(() => {});
              setIsReady(true);
            };
          }
          return;
        } catch {
          msg = isEn ? "Could not start the camera." : "Tidak dapat memulai kamera.";
        }
      } else {
        msg = isEn
          ? `Could not access camera: ${err.message || err.name}`
          : `Tidak dapat mengakses kamera: ${err.message || err.name}`;
      }
      setCameraError(msg);
    }
  }, [isEn]);

  useEffect(() => {
    startStream(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFlip = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startStream(next);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !isReady || isCapturing) return;
    setIsCapturing(true);
    try {
      const file = await captureFrameFromVideo(videoRef.current);
      if (file) {
        // Stop stream before passing to parent
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        onCapture(file);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Camera viewport */}
      <div className="relative w-full bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] max-h-[45vh] sm:max-h-[50vh] flex items-center justify-center">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-900/40 flex items-center justify-center">
              <CameraOff className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-xs">{cameraError}</p>
            <button
              type="button"
              onClick={() => startStream(facingMode)}
              className="mt-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold rounded-xl transition"
            >
              {isEn ? "Try Again" : "Coba Lagi"}
            </button>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            />
            {/* Loading spinner while camera warms up */}
            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <p className="text-[11px] sm:text-xs text-slate-400">
                  {isEn ? "Starting camera..." : "Memulai kamera..."}
                </p>
              </div>
            )}
            {/* Viewfinder corners */}
            {isReady && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
                <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
                <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Camera controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-0.5 sm:px-1">
        {/* Back button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition active:scale-95"
        >
          <X className="w-3.5 h-3.5" />
          <span>{isEn ? "Cancel" : "Batal"}</span>
        </button>

        {/* Capture button */}
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isReady || !!cameraError || isCapturing}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-900 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-800 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <Circle className="w-3.5 h-3.5 fill-white" />
          <span>
            {isCapturing
              ? (isEn ? "Capturing..." : "Mengambil...")
              : (isEn ? "Capture" : "Ambil Foto")}
          </span>
        </button>

        {/* Flip camera button (only shown if multiple cameras available) */}
        {hasMultipleCameras ? (
          <button
            type="button"
            onClick={handleFlip}
            disabled={!isReady || !!cameraError}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition active:scale-95 disabled:opacity-40"
            title={isEn ? "Flip Camera" : "Balik Kamera"}
          >
            <SwitchCamera className="w-3.5 h-3.5" />
            <span>{isEn ? "Flip" : "Balik"}</span>
          </button>
        ) : (
          <div className="w-[50px] sm:w-[70px]" /> /* spacer to keep capture button centered */
        )}
      </div>

      <p className="text-center text-[10px] sm:text-[11px] text-slate-400">
        {isEn
          ? "Point camera at receipt, then tap Capture"
          : "Arahkan kamera ke struk, lalu ketuk Ambil Foto"}
      </p>
    </div>
  );
}

// ─── Main Scanner Modal ────────────────────────────────────────────────────────
export default function ReceiptScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  hasAiConfig = true,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const fileInputRef = useRef(null);

  // Reset camera view when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCamera(false);
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleFileProcess = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg(isEn ? "Please upload an image file (JPG, PNG, or WebP)." : "Mohon unggah file gambar (JPG, PNG, atau WebP).");
      return;
    }

    setShowCamera(false);
    setErrorMsg("");
    setIsProcessing(true);
    setProcessingStatus(isEn ? "Compressing image for speed..." : "Mengompresi gambar untuk kecepatan...");

    try {
      const compressedFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressedFile);

      setProcessingStatus(isEn ? "Reading receipt with Vision AI..." : "Membaca struk dengan Vision AI...");

      const response = await scanReceipt(compressedFile);

      if (response?.success && response?.data) {
        onScanSuccess(response.data, compressedFile, previewUrl);
        onClose();
      } else {
        throw new Error(response?.message || (isEn ? "Failed to process receipt." : "Gagal memproses struk."));
      }
    } catch (err) {
      console.warn("Receipt scan error:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        (isEn
          ? "Failed to scan receipt. Ensure API key is configured and receipt photo is clear."
          : "Gagal memindai struk. Pastikan kunci API sudah terkonfigurasi dan foto struk terbaca jelas.");
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleOpenCamera = () => {
    // Check if getUserMedia is supported at all
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg(
        isEn
          ? "Camera is not supported on this browser. Please use 'Choose Image File' instead, or try a modern browser (Chrome, Firefox, Safari)."
          : "Kamera tidak didukung di browser ini. Gunakan 'Pilih Galeri' sebagai gantinya, atau coba browser modern (Chrome, Firefox, Safari)."
      );
      return;
    }
    setErrorMsg("");
    setShowCamera(true);
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
      <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
        {/* Click outside backdrop */}
        <div className="fixed inset-0 -z-10" onClick={!isProcessing && !showCamera ? onClose : undefined} aria-hidden="true" />
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col overflow-hidden relative z-10">
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center font-black shrink-0">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight truncate">
                  {showCamera
                    ? (isEn ? "Point Camera at Receipt" : "Arahkan Kamera ke Struk")
                    : t("receipts.scan_title", isEn ? "Scan Shopping Receipt" : "Pindai Struk Belanja")}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                  {showCamera
                    ? (isEn ? "Tap 'Capture' when the receipt is in frame" : "Ketuk 'Ambil Foto' saat struk terlihat jelas")
                    : t("receipts.scan_subtitle", isEn ? "Instant expense logging via physical receipt photo" : "Catat pengeluaran instan lewat foto struk fisik")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-2">
              {!showCamera && (
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-slate-400 hover:text-[#00685F] p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition cursor-pointer"
                  title={t("receipts.view_guide", isEn ? "View Guide" : "Lihat Panduan")}
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (showCamera) {
                    setShowCamera(false);
                  } else {
                    onClose();
                  }
                }}
                disabled={isProcessing}
                className="text-slate-400 hover:text-slate-600 p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
            {/* BYOK Warning */}
            {!hasAiConfig && !showCamera && (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-[11px] sm:text-xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Key className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("receipts.byok_unconfigured_title", isEn ? "API Key (BYOK) Not Configured" : "Kunci API (BYOK) Belum Dikonfigurasi")}</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {t("receipts.byok_unconfigured_desc", isEn
                    ? "Receipt scanning reads images using AI. Connect your own API key (e.g. Google Gemini which is 100% free) in Settings."
                    : "Fitur Pindai Struk membaca gambar menggunakan AI. Hubungkan API key Anda (seperti Google Gemini yang 100% gratis) di menu Pengaturan.")}
                </p>
                <div className="pt-0.5 sm:pt-1">
                  <Link
                    href="/settings?tab=ai"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-amber-700 transition text-[11px] sm:text-xs"
                  >
                    <span>{t("receipts.open_ai_settings", isEn ? "Open AI Settings" : "Buka Pengaturan AI")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && !showCamera && (
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] sm:text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug flex-1">
                  <p className="font-bold">{t("receipts.scan_failed", isEn ? "Failed to Scan Receipt" : "Gagal Memindai Struk")}</p>
                  <p className="text-rose-700 mt-0.5">{errorMsg}</p>
                  {(errorMsg.toLowerCase().includes("kuota") ||
                    errorMsg.toLowerCase().includes("saldo") ||
                    errorMsg.toLowerCase().includes("rate limit") ||
                    errorMsg.toLowerCase().includes("habis") ||
                    errorMsg.toLowerCase().includes("tidak mendukung") ||
                    errorMsg.toLowerCase().includes("ganti model") ||
                    errorMsg.toLowerCase().includes("bukan vision") ||
                    errorMsg.toLowerCase().includes("pengaturan") ||
                    errorMsg.toLowerCase().includes("quota") ||
                    errorMsg.toLowerCase().includes("vision")) && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center gap-2">
                      <Link
                        href="/settings?tab=ai"
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-[11px] transition shadow-xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{t("receipts.open_ai_settings_change", isEn ? "Open AI Settings (Change Provider / Model)" : "Buka Pengaturan AI (Ganti Provider / Model)")}</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Camera View ── */}
            {showCamera ? (
              <CameraView
                isEn={isEn}
                t={t}
                onCapture={handleFileProcess}
                onClose={() => setShowCamera(false)}
              />
            ) : isProcessing ? (
              /* Processing State */
              <div className="py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-dashed border-[#00685F]/40 bg-teal-50/20">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F]">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 rounded-xl sm:rounded-2xl border-2 border-[#00685F] border-t-transparent animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm md:text-base font-black text-slate-800">
                    {t("receipts.processing_title", isEn ? "Processing Shopping Receipt..." : "Memproses Struk Belanja...")}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#00685F] font-bold animate-pulse">
                    {processingStatus}
                  </p>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  {t("receipts.processing_time_notice", isEn
                    ? "This process takes a few seconds depending on connection and receipt resolution."
                    : "Proses ini memerlukan waktu beberapa detik tergantung koneksi dan resolusi struk.")}
                </p>
              </div>
            ) : (
              /* Dropzone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-[#00685F] bg-teal-50/50 scale-[0.99]"
                    : "border-slate-200 hover:border-[#00685F]/60 hover:bg-slate-50/60"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Hidden file input (gallery / file picker only) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                      // Reset so same file can be re-selected
                      e.target.value = "";
                    }
                  }}
                />

                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition">
                  <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {t("receipts.drag_drop_title", isEn ? "Drag & Drop Receipt Photo Here" : "Tarik & Lepas Foto Struk di Sini")}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {t("receipts.drag_drop_sub", isEn ? "or click to browse files from your computer / gallery" : "atau klik untuk memilih file dari komputer / galeri")}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-sm mt-3.5 sm:mt-5">
                  {/* Camera button — uses getUserMedia, works on all devices */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCamera();
                    }}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-xs whitespace-nowrap min-w-0"
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{t("receipts.take_photo", isEn ? "Take Photo" : "Ambil Foto")}</span>
                  </button>

                  {/* Gallery / file picker button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-200 transition active:scale-95 whitespace-nowrap min-w-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{t("receipts.choose_gallery", isEn ? "Choose File" : "Pilih File")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Tips Footer */}
            {!showCamera && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 pt-0.5 sm:pt-1 px-1">
                <span className="flex items-center gap-1.5 min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00685F] shrink-0" />
                  <span className="truncate">
                    {t("receipts.compressed_safe", isEn ? "Images automatically compressed & secure" : "Foto otomatis dikompresi & aman")}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-[#00685F] font-bold hover:underline shrink-0 text-left sm:text-right cursor-pointer"
                >
                  {t("receipts.view_photo_tips", isEn ? "View tips for clear photo" : "Lihat tips foto jelas")}
                </button>
              </div>
            )}
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

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
  Circle,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Images,
  Check,
} from "lucide-react";
import { scanReceipt } from "../../services/receipt.service";
import ReceiptGuideModal from "./ReceiptGuideModal";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";

const MAX_PHOTOS = 8;

/**
 * Client-side Canvas Image Compression
 * Adaptive compression:
 * - 1–2 photos: max 1280px @ 0.72 quality
 * - 3–8 photos: max 1100px @ 0.68 quality (keeps 8 photos around ~1MB total for fast upload)
 */
function compressImage(file, maxDimension = 1280, quality = 0.72) {
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
function captureFrameFromVideo(videoEl, index = 1, quality = 0.85) {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(
            new File([blob], `receipt_camera_${index}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
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

// ─── Camera View Sub-component (Supports Continuous Multi-Part Capture 1..8) ──
function CameraView({
  queuedPhotos,
  onAddPhoto,
  onRemovePhoto,
  onFinishAndScan,
  onClose,
  isEn,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startStream = useCallback(
    async (facing) => {
      stopStream();
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
            ? "No camera found on this device. Please use the 'Choose File' option instead."
            : "Tidak ada kamera yang ditemukan pada perangkat ini. Gunakan opsi 'Pilih File' sebagai gantinya.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          msg = isEn
            ? "Camera is in use by another application. Close other apps using the camera and try again."
            : "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang menggunakan kamera dan coba lagi.";
        } else if (err.name === "OverconstrainedError") {
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
    },
    [isEn, stopStream]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startStream(facingMode);
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFlip = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startStream(next);
  };

  const count = queuedPhotos.length;
  const isFull = count >= MAX_PHOTOS;

  const handleCapture = async () => {
    if (!videoRef.current || !isReady || isCapturing || isFull) return;
    setIsCapturing(true);
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 140);

    try {
      const file = await captureFrameFromVideo(videoRef.current, count + 1);
      if (file) {
        onAddPhoto([file]);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top Camera Status Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-white text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono tabular-nums font-black px-2 py-0.5 rounded bg-[#00685F] text-white">
            {String(count).padStart(2, "0")} / {String(MAX_PHOTOS).padStart(2, "0")}
          </span>
          <span className="truncate text-slate-200 font-medium">
            {count === 0
              ? isEn
                ? "Take 1 photo, or up to 8 parts for a long receipt"
                : "Ambil 1 foto, atau hingga 8 bagian untuk struk panjang"
              : isEn
                ? `Captured ${count} part(s). Slide receipt down for next part or tap Scan.`
                : `${count} bagian diambil. Geser struk ke bawah untuk lanjut atau klik Pindai.`}
          </span>
        </div>
      </div>

      {/* Camera viewport */}
      <div className="relative w-full bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] max-h-[42vh] sm:max-h-[46vh] flex items-center justify-center border border-slate-800">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-900/40 flex items-center justify-center">
              <CameraOff className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-xs">{cameraError}</p>
            <button
              type="button"
              onClick={() => startStream(facingMode)}
              className="mt-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {isEn ? "Try Again" : "Coba Lagi"}
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
              style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            />
            {flashEffect && <div className="absolute inset-0 bg-white/60 pointer-events-none transition-opacity" />}
            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <p className="text-[11px] sm:text-xs text-slate-400">
                  {isEn ? "Starting camera..." : "Memulai kamera..."}
                </p>
              </div>
            )}
            {/* Viewfinder corners + Overlap helper line when count > 0 */}
            {isReady && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
                <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
                <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-white/70 rounded-br-lg" />
                {count > 0 && (
                  <div className="absolute top-6 inset-x-4 border-b border-dashed border-teal-300/80 pb-1 flex justify-center">
                    <span className="px-2 py-0.5 rounded bg-slate-950/75 text-teal-200 text-[10px] font-bold">
                      {isEn
                        ? `Part 0${count + 1}: Keep 1–2 top lines overlapping from Part 0${count}`
                        : `Bagian 0${count + 1}: Sisakan 1–2 baris atas dari Bagian 0${count}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Live Captured Filmstrip inside Camera View */}
      {count > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
          {queuedPhotos.map((item, idx) => (
            <div
              key={item.id}
              className="relative w-12 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={`Part ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 left-0.5 px-1 rounded bg-slate-950/80 text-white font-mono tabular-nums text-[9px] font-black">
                0{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemovePhoto(item.id)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 cursor-pointer"
                aria-label={isEn ? `Remove photo ${idx + 1}` : `Hapus foto ${idx + 1}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Camera controls (Fitts's Law: generous touch targets) */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <button
          type="button"
          onClick={() => {
            stopStream();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{count > 0 ? (isEn ? "Review Tray" : "Ke Antrean") : (isEn ? "Cancel" : "Batal")}</span>
        </button>

        {/* Shutter button */}
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isReady || !!cameraError || isCapturing || isFull}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
        >
          <Circle className="w-3.5 h-3.5 fill-white" />
          <span>
            {isCapturing
              ? isEn
                ? "Capturing..."
                : "Mengambil..."
              : isFull
                ? isEn
                  ? "Max 8 Reached"
                  : "Maks 8 Foto"
                : count === 0
                  ? isEn
                    ? "Take Photo 01"
                    : "Ambil Foto 01"
                  : isEn
                    ? `+ Part 0${count + 1}`
                    : `+ Bagian 0${count + 1}`}
          </span>
        </button>

        {/* Right button: Scan Now if count > 0, else Flip camera */}
        {count > 0 ? (
          <button
            type="button"
            onClick={() => {
              stopStream();
              onFinishAndScan();
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-[#00685F] text-white rounded-xl text-xs font-bold hover:bg-[#004D46] transition active:scale-95 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>
              {isEn ? `Scan (${count})` : `Pindai (${count})`}
            </span>
          </button>
        ) : hasMultipleCameras ? (
          <button
            type="button"
            onClick={handleFlip}
            disabled={!isReady || !!cameraError}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition active:scale-95 disabled:opacity-40 cursor-pointer"
            title={isEn ? "Flip Camera" : "Balik Kamera"}
          >
            <SwitchCamera className="w-3.5 h-3.5" />
            <span>{isEn ? "Flip" : "Balik"}</span>
          </button>
        ) : (
          <div className="w-[64px]" />
        )}
      </div>
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
  const { user } = useAuth();
  const isEn = language === "en";

  const isAiConfigured = Boolean(
    hasAiConfig &&
      user?.preferences?.ai_enabled &&
      (user?.preferences?.ai_config?.api_key_masked ||
        user?.preferences?.ai_config?.api_key ||
        user?.preferences?.ai_config?.api_key_encrypted)
  );

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideInitialTab, setGuideInitialTab] = useState("camera");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [queuedPhotos, setQueuedPhotos] = useState([]);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const fileInputRef = useRef(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowCamera(false);
      setErrorMsg("");
      setQueuedPhotos((prev) => {
        prev.forEach((p) => {
          if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
        });
        return [];
      });
    }
  }, [isOpen]);

  const openGuide = (tab = "camera") => {
    setGuideInitialTab(tab);
    setIsGuideOpen(true);
  };

  // Add 1 or multiple files to queue (max 8 total)
  const handleAddFilesToQueue = useCallback(
    (fileList) => {
      if (!fileList || fileList.length === 0) return;

      if (!isAiConfigured) {
        setErrorMsg(
          isEn
            ? "AI BYOK is not enabled yet. Please configure your free Google Gemini API key in Settings > AI Chatbot first."
            : "Fitur AI BYOK belum aktif. Silakan hubungkan API key Google Gemini gratis Anda di Pengaturan > AI Chatbot terlebih dahulu."
        );
        return;
      }

      const incoming = Array.from(fileList).filter((f) => f && f.type && f.type.startsWith("image/"));
      if (incoming.length === 0) {
        setErrorMsg(
          isEn
            ? "Please upload valid image files (JPG, PNG, or WebP)."
            : "Mohon unggah file gambar yang valid (JPG, PNG, atau WebP)."
        );
        return;
      }

      setErrorMsg("");
      setQueuedPhotos((prev) => {
        const remainingSlots = MAX_PHOTOS - prev.length;
        if (remainingSlots <= 0) {
          setErrorMsg(
            isEn
              ? `Maximum ${MAX_PHOTOS} photos reached per scan.`
              : `Maksimal ${MAX_PHOTOS} foto struk per pemindaian telah tercapai.`
          );
          return prev;
        }

        const toAdd = incoming.slice(0, remainingSlots).map((file, idx) => ({
          id: `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${idx}`,
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        if (incoming.length > remainingSlots) {
          setErrorMsg(
            isEn
              ? `Only the first ${remainingSlots} photo(s) were added (limit: ${MAX_PHOTOS} photos per scan).`
              : `Hanya ${remainingSlots} foto pertama yang ditambahkan (batas maksimal ${MAX_PHOTOS} foto per scan).`
          );
        }

        return [...prev, ...toAdd];
      });
    },
    [isAiConfigured, isEn]
  );

  const handleRemoveQueuedPhoto = (id) => {
    setQueuedPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleMovePhoto = (index, direction) => {
    setQueuedPhotos((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, moved);
      return copy;
    });
  };

  const handleClearQueue = () => {
    setQueuedPhotos((prev) => {
      prev.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      return [];
    });
    setErrorMsg("");
  };

  // Compress and scan all queued photos (1..8)
  const handleScanQueuedPhotos = async () => {
    if (queuedPhotos.length === 0 || isProcessing) return;

    if (!isAiConfigured) {
      setErrorMsg(
        isEn
          ? "AI BYOK is not enabled yet. Please configure your free Google Gemini API key in Settings > AI Chatbot first."
          : "Fitur AI BYOK belum aktif. Silakan hubungkan API key Google Gemini gratis Anda di Pengaturan > AI Chatbot terlebih dahulu."
      );
      return;
    }

    setShowCamera(false);
    setErrorMsg("");
    setIsProcessing(true);

    const count = queuedPhotos.length;
    const maxDim = count <= 2 ? 1280 : 1100;
    const quality = count <= 2 ? 0.72 : 0.68;

    setProcessingStatus(
      count > 1
        ? isEn
          ? `Compressing ${count} receipt photos for fast upload...`
          : `Mengompresi ${count} foto struk agar cepat diproses...`
        : isEn
          ? "Compressing image for speed..."
          : "Mengompresi gambar untuk kecepatan..."
    );

    try {
      const compressedFiles = await Promise.all(
        queuedPhotos.map((item) => compressImage(item.file, maxDim, quality))
      );
      const previewUrls = compressedFiles.map((f) => URL.createObjectURL(f));

      setProcessingStatus(
        count > 1
          ? isEn
            ? `Reading & stitching ${count} receipt parts with Vision AI...`
            : `Membaca & menyambung ${count} bagian struk dengan Vision AI...`
          : isEn
            ? "Reading receipt with Vision AI..."
            : "Membaca struk dengan Vision AI..."
      );

      const response = await scanReceipt(compressedFiles);

      if (response?.success && response?.data) {
        onScanSuccess(
          response.data,
          compressedFiles[0],
          previewUrls[0],
          compressedFiles,
          previewUrls
        );
        onClose();
      } else {
        previewUrls.forEach((u) => URL.revokeObjectURL(u));
        throw new Error(
          response?.message || (isEn ? "Failed to process receipt." : "Gagal memproses struk.")
        );
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
    if (!isAiConfigured) {
      setErrorMsg(
        isEn
          ? "Please activate AI BYOK first to enable receipt scanning."
          : "Silakan aktifkan AI BYOK terlebih dahulu untuk menggunakan fitur scan struk."
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg(
        isEn
          ? "Camera is not supported on this browser. Please use 'Choose File' instead, or try a modern browser (Chrome, Firefox, Safari)."
          : "Kamera tidak didukung di browser ini. Gunakan 'Pilih File' sebagai gantinya, atau coba browser modern (Chrome, Firefox, Safari)."
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
      handleAddFilesToQueue(files);
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

  const count = queuedPhotos.length;

  return createPortal(
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-950/65 backdrop-blur-md z-[9999] flex items-center justify-center p-2.5 sm:p-5 md:p-6 overflow-y-auto"
      >
        {/* Click outside backdrop */}
        <div
          className="fixed inset-0 -z-10"
          onClick={!isProcessing && !showCamera ? onClose : undefined}
          aria-hidden="true"
        />
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 motion-reduce:animate-none duration-200 my-auto flex flex-col max-h-[92dvh] overflow-hidden relative z-10">
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#E6F0EF] text-[#00685F] flex items-center justify-center font-black shrink-0 border border-[#00685F]/15">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight truncate">
                    {showCamera
                      ? isEn
                        ? "Point Camera at Receipt"
                        : "Arahkan Kamera ke Struk"
                      : t("receipts.scan_title", isEn ? "Scan Shopping Receipt" : "Pindai Struk Belanja")}
                  </h3>
                  {!showCamera && (
                    <span className="px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#00685F] font-mono tabular-nums text-[10px] font-black uppercase tracking-wider">
                      {count > 0 ? `${count}/${MAX_PHOTOS} ${isEn ? "Photos" : "Foto"}` : isEn ? "1–8 Photos" : "1–8 Foto"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                  {showCamera
                    ? isEn
                      ? "Snap 1 photo or up to 8 sequential parts for a long receipt"
                      : "Ambil 1 foto atau hingga 8 bagian berurutan untuk struk panjang"
                    : isEn
                      ? "Upload 1 receipt or up to 8 photos for long/combined receipts"
                      : "Unggah 1 foto struk atau hingga 8 foto untuk struk panjang / gabungan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {!showCamera && (
                <button
                  type="button"
                  onClick={() => openGuide("multi")}
                  className="text-slate-500 hover:text-[#00685F] px-2 py-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title={t("receipts.view_guide", isEn ? "View Guide" : "Lihat Panduan")}
                >
                  <HelpCircle className="w-4 h-4 text-[#00685F]" />
                  <span className="hidden sm:inline">{isEn ? "Guide" : "Panduan"}</span>
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
                aria-label={isEn ? "Close" : "Tutup"}
                className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto">
            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleAddFilesToQueue(e.target.files);
                  e.target.value = "";
                }
              }}
            />

            {/* Error Message */}
            {errorMsg && !showCamera && (
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] sm:text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug flex-1">
                  <p className="font-bold">
                    {t("receipts.scan_failed", isEn ? "Notice / Scan Error" : "Perhatian / Gagal Memindai")}
                  </p>
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
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] transition shadow-xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>
                          {t(
                            "receipts.open_ai_settings_change",
                            isEn
                              ? "Open AI Settings (Change Provider / Model)"
                              : "Buka Pengaturan AI (Ganti Provider / Model)"
                          )}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Case 1: AI BYOK Not Configured ── */}
            {!isAiConfigured && !showCamera ? (
              <div className="space-y-3.5 animate-in fade-in duration-300">
                <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-4">
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900">
                          {isEn ? "AI BYOK Required" : "Fitur AI Belum Aktif"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{isEn ? "Free Google Gemini" : "Google Gemini 100% Gratis"}</span>
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {isEn ? "Activate AI to Scan Receipts" : "Aktifkan Fitur AI untuk Scan Struk"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {isEn
                          ? "MoneFin uses Bring Your Own Key (BYOK) so your financial receipts are read directly via your private AI connection without costly subscription plans."
                          : "Fitur Pindai Struk membaca 1 hingga 8 foto struk fisik sekaligus menggunakan Vision AI. Dengan konsep Bring Your Own Key (BYOK), privasi keuangan Anda tetap aman dan bebas biaya langganan."}
                      </p>
                    </div>
                  </div>

                  {/* Step by step guide to get Free Google Gemini API Key */}
                  <div className="bg-white rounded-2xl border border-teal-100 p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          className="w-3.5 h-3.5"
                          alt="Google"
                        />
                        <span>
                          {isEn
                            ? "How to get a Free Google Gemini API Key:"
                            : "Panduan Mendapatkan API Key Gemini Gratis:"}
                        </span>
                      </div>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00685F] hover:text-[#004D46] hover:underline shrink-0"
                      >
                        <span>{isEn ? "Open Google AI Studio" : "Buka Google AI Studio"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <ol className="text-xs text-slate-700 space-y-2 font-medium list-decimal list-inside">
                      <li className="leading-relaxed">
                        {isEn ? (
                          <>
                            Open{" "}
                            <a
                              href="https://aistudio.google.com/app/apikey"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-[#00685F] underline"
                            >
                              aistudio.google.com
                            </a>{" "}
                            and sign in with your Google account.
                          </>
                        ) : (
                          <>
                            Buka tautan{" "}
                            <a
                              href="https://aistudio.google.com/app/apikey"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-[#00685F] underline"
                            >
                              aistudio.google.com
                            </a>{" "}
                            dan login dengan akun Google Anda.
                          </>
                        )}
                      </li>
                      <li className="leading-relaxed">
                        {isEn ? (
                          <>
                            Click <strong>Get API Key</strong> &gt; <strong>Create API Key</strong> (Free Tier, no credit card required).
                          </>
                        ) : (
                          <>
                            Klik tombol <strong>Get API Key</strong> &gt; <strong>Create API Key</strong> (Gratis, tanpa perlu kartu kredit).
                          </>
                        )}
                      </li>
                      <li className="leading-relaxed">
                        {isEn ? (
                          <>
                            Copy the generated key (starts with{" "}
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-900 font-mono text-[11px]">
                              AIzaSy...
                            </code>
                            ).
                          </>
                        ) : (
                          <>
                            Salin kode API Key yang muncul (berawalan{" "}
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-900 font-mono text-[11px]">
                              AIzaSy...
                            </code>
                            ).
                          </>
                        )}
                      </li>
                      <li className="leading-relaxed">
                        {isEn ? (
                          <>
                            Go to <strong>Settings &gt; AI Chatbot</strong> in MoneFin, paste your key, select <strong>gemini-3.6-flash</strong>, and turn AI on.
                          </>
                        ) : (
                          <>
                            Buka menu <strong>Pengaturan &gt; AI Chatbot</strong> di MoneFin, tempelkan API Key, pilih model <strong>gemini-3.6-flash</strong>, lalu simpan.
                          </>
                        )}
                      </li>
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                    <Link
                      href="/settings?tab=ai"
                      onClick={onClose}
                      className="flex-1 py-3 px-4 bg-[#00685F] hover:bg-[#004D46] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00685F]/20 active:scale-98 cursor-pointer"
                    >
                      <Key className="w-4 h-4" />
                      <span>{isEn ? "Open AI Settings in MoneFin" : "Buka Pengaturan AI di MoneFin"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openGuide("byok")}
                      className="py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>{isEn ? "View Visual Guide" : "Lihat Panduan Lengkap"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : showCamera ? (
              /* ── Camera View (Continuous Multi-Part Capture) ── */
              <CameraView
                queuedPhotos={queuedPhotos}
                onAddPhoto={handleAddFilesToQueue}
                onRemovePhoto={handleRemoveQueuedPhoto}
                onFinishAndScan={handleScanQueuedPhotos}
                onClose={() => setShowCamera(false)}
                isEn={isEn}
              />
            ) : isProcessing ? (
              /* ── Processing State ── */
              <div className="py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 rounded-2xl border border-dashed border-[#00685F]/40 bg-[#E6F0EF]/25">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F]">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl border-2 border-[#00685F] border-t-transparent animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm md:text-base font-black text-slate-800">
                    {count > 1
                      ? isEn
                        ? `Processing ${count} Receipt Photos...`
                        : `Memproses ${count} Foto Struk Belanja...`
                      : t("receipts.processing_title", isEn ? "Processing Shopping Receipt..." : "Memproses Struk Belanja...")}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#00685F] font-bold animate-pulse">
                    {processingStatus}
                  </p>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  {count > 1
                    ? isEn
                      ? "AI is extracting items across all photos and automatically deduplicating overlapping lines."
                      : "AI sedang mengekstrak seluruh barang dari semua foto dan otomatis menghapus baris yang tumpang tindih."
                    : t(
                        "receipts.processing_time_notice",
                        isEn
                          ? "This process takes a few seconds depending on connection and receipt resolution."
                          : "Proses ini memerlukan waktu beberapa detik tergantung koneksi dan resolusi struk."
                      )}
                </p>
              </div>
            ) : count > 0 ? (
              /* ── Multi-Photo Queue Tray (1..8 Photos Ready to Scan) ── */
              <div className="space-y-3.5">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono tabular-nums text-[11px] font-black px-2 py-0.5 rounded-md bg-[#00685F] text-white">
                        {String(count).padStart(2, "0")} / {String(MAX_PHOTOS).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-black text-slate-800 truncate">
                        {count === 1
                          ? isEn
                            ? "1 Receipt Photo Ready"
                            : "1 Foto Struk Siap Dipindai"
                          : isEn
                            ? `${count} Receipt Parts Queued (Top → Bottom)`
                            : `${count} Bagian Foto Struk (Urutan Atas → Bawah)`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearQueue}
                      className="text-[11px] font-bold text-rose-600 hover:underline shrink-0 cursor-pointer"
                    >
                      {isEn ? "Clear All" : "Hapus Semua"}
                    </button>
                  </div>

                  {/* Responsive Thumbnail Grid (2 cols mobile, 4 cols sm+) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {queuedPhotos.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[3/4] flex flex-col justify-between shadow-2xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={`Receipt part ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Bar: Sequence Badge + Remove Button */}
                        <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 text-white font-mono tabular-nums text-[10px] font-black backdrop-blur-xs">
                            0{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveQueuedPhoto(item.id)}
                            aria-label={isEn ? `Remove photo ${idx + 1}` : `Hapus foto ${idx + 1}`}
                            className="w-6 h-6 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Bar: Reorder Left / Right Controls & Section Label */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs px-1.5 py-1 flex items-center justify-between text-white">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMovePhoto(idx, -1)}
                            aria-label={isEn ? "Move earlier" : "Geser ke kiri"}
                            className="p-0.5 rounded hover:bg-white/20 disabled:opacity-25 cursor-pointer disabled:cursor-default"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-200 truncate">
                            {count === 1
                              ? isEn
                                ? "Single"
                                : "Utama"
                              : idx === 0
                                ? isEn
                                  ? "Top"
                                  : "Atas"
                                : idx === count - 1
                                  ? isEn
                                    ? "Bottom"
                                    : "Bawah"
                                  : isEn
                                    ? `Part ${idx + 1}`
                                    : `Bag. ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            disabled={idx === count - 1}
                            onClick={() => handleMovePhoto(idx, 1)}
                            aria-label={isEn ? "Move later" : "Geser ke kanan"}
                            className="p-0.5 rounded hover:bg-white/20 disabled:opacity-25 cursor-pointer disabled:cursor-default"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add More Slot if < 8 */}
                    {count < MAX_PHOTOS && (
                      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-2 aspect-[3/4] flex flex-col items-center justify-center gap-1.5 text-center">
                        <span className="font-mono tabular-nums text-[10px] font-bold text-slate-400">
                          +0{count + 1}
                        </span>
                        <button
                          type="button"
                          onClick={handleOpenCamera}
                          className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Camera className="w-3 h-3 shrink-0" />
                          <span>{isEn ? "Camera" : "Kamera"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3 shrink-0" />
                          <span>{isEn ? "Files" : "Galeri"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Helper note about long receipt / multi-receipt */}
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {count === 1
                      ? isEn
                        ? "Is this a long receipt? Add part 02–08 before scanning, or scan this single photo directly below."
                        : "Struk masih panjang atau ada struk lain? Tambahkan foto ke-2 s/d ke-8 di atas, atau langsung pindai foto ini."
                      : isEn
                        ? "AI will automatically stitch sequential parts (removing overlapping lines) or combine separate receipts into 1 transaction."
                        : "AI otomatis menyambung bagian struk panjang (tanpa menghitung ganda baris yang tumpang tindih) atau menggabungkan beberapa struk dalam 1 transaksi."}
                  </p>
                </div>

                {/* Primary CTA: Scan Queued Photos (Fitts's Law: full width, high contrast, 46px height) */}
                <button
                  type="button"
                  onClick={handleScanQueuedPhotos}
                  className="w-full py-3 px-5 bg-[#00685F] hover:bg-[#004D46] text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00685F]/20 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {count === 1
                      ? isEn
                        ? "Scan 1 Receipt Photo Now"
                        : "Pindai 1 Foto Struk Sekarang"
                      : isEn
                        ? `Scan ${count} Photos Together (1 Transaction)`
                        : `Pindai ${count} Foto Sekaligus (1 Transaksi)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* ── Empty Dropzone (Initial Entry) ── */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-[#00685F] bg-[#E6F0EF]/50 scale-[0.99]"
                    : "border-slate-200 hover:border-[#00685F]/60 hover:bg-slate-50/60"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#E6F0EF] text-[#00685F] flex items-center justify-center mb-2.5 sm:mb-3 transition">
                  <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <p className="text-xs sm:text-sm font-black text-slate-800">
                  {t(
                    "receipts.drag_drop_title",
                    isEn ? "Drag & Drop 1–8 Receipt Photos Here" : "Tarik & Lepas 1–8 Foto Struk di Sini"
                  )}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                  {isEn
                    ? "Select 1 photo for a normal receipt, or up to 8 photos for a long receipt (top-to-bottom) / multiple receipts"
                    : "Pilih 1 foto untuk struk biasa, atau hingga 8 foto sekaligus untuk struk belanja panjang (atas ke bawah) / gabungan struk"}
                </p>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-sm mt-4 sm:mt-5">
                  {/* Camera button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCamera();
                    }}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-xs whitespace-nowrap min-w-0 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {t("receipts.take_photo", isEn ? "Take Photo (1–8)" : "Ambil Foto (1–8)")}
                    </span>
                  </button>

                  {/* Multi-file Gallery picker button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition active:scale-95 whitespace-nowrap min-w-0 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 shrink-0 text-[#00685F]" />
                    <span className="truncate">
                      {t("receipts.choose_gallery", isEn ? "Choose 1–8 Files" : "Pilih 1–8 File")}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Tips Footer */}
            {!showCamera && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-500 pt-0.5 px-1">
                <span className="flex items-center gap-1.5 min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00685F] shrink-0" />
                  <span className="truncate">
                    {t(
                      "receipts.compressed_safe",
                      isEn ? "Auto-compressed & smart overlap deduplication" : "Kompresi otomatis & deduplikasi struk panjang"
                    )}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => openGuide("multi")}
                  className="text-[#00685F] font-bold hover:underline shrink-0 text-left sm:text-right cursor-pointer inline-flex items-center gap-1"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>
                    {isEn ? "How to photo long receipts (1–8)" : "Cara foto struk panjang (1–8 bagian)"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      <ReceiptGuideModal
        isOpen={isGuideOpen}
        initialTab={guideInitialTab}
        onClose={() => setIsGuideOpen(false)}
      />
    </>,
    document.body
  );
}

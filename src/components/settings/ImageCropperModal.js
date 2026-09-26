"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalDims, setNaturalDims] = useState({ width: 1, height: 1 });
  const [cropBoxSize, setCropBoxSize] = useState(260);

  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const cropBoxRef = useRef(null);

  // Measure actual cutout box size (220px on mobile, 260px on sm+)
  const updateCropBoxSize = useCallback(() => {
    if (cropBoxRef.current) {
      const rect = cropBoxRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setCropBoxSize(rect.width);
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(updateCropBoxSize);
    window.addEventListener("resize", updateCropBoxSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateCropBoxSize);
    };
  }, [isOpen, updateCropBoxSize]);

  // Compute cover-fit base dimensions so at zoom = 1 the image always fills 100% of the cutout box
  const getBaseDisplayDims = useCallback(
    (natW = naturalDims.width, natH = naturalDims.height, boxSize = cropBoxSize) => {
      const safeW = Math.max(1, natW);
      const safeH = Math.max(1, natH);
      const baseScale = Math.max(boxSize / safeW, boxSize / safeH);
      return {
        width: safeW * baseScale,
        height: safeH * baseScale,
      };
    },
    [naturalDims.width, naturalDims.height, cropBoxSize]
  );

  // Clamp offset so the user can never drag empty/black space into the crop frame
  const clampOffset = useCallback(
    (rawOffset, targetZoom = zoom, targetRotation = rotation, boxSize = cropBoxSize) => {
      const { width: baseW, height: baseH } = getBaseDisplayDims(
        naturalDims.width,
        naturalDims.height,
        boxSize
      );
      const isRotated90 = Math.abs(targetRotation % 180) === 90;
      const effW = (isRotated90 ? baseH : baseW) * targetZoom;
      const effH = (isRotated90 ? baseW : baseH) * targetZoom;

      const maxX = Math.max(0, (effW - boxSize) / 2);
      const maxY = Math.max(0, (effH - boxSize) / 2);

      return {
        x: Math.max(-maxX, Math.min(maxX, rawOffset.x)),
        y: Math.max(-maxY, Math.min(maxY, rawOffset.y)),
      };
    },
    [zoom, rotation, cropBoxSize, naturalDims.width, naturalDims.height, getBaseDisplayDims]
  );

  const handleImageLoad = (e) => {
    const img = e.currentTarget;
    const natW = img.naturalWidth || img.width || 512;
    const natH = img.naturalHeight || img.height || 512;
    setNaturalDims({ width: natW, height: natH });
    const boxW = cropBoxRef.current?.getBoundingClientRect()?.width || cropBoxSize;
    if (boxW > 0) setCropBoxSize(boxW);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleClose = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  // Handle keyboard Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setOffset(
      clampOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    );
  }, [isDragging, dragStart, clampOffset]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    if (e.cancelable) e.preventDefault();
    setOffset(
      clampOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    );
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (nextZoom) => {
    setZoom(nextZoom);
    setOffset((prev) => clampOffset(prev, nextZoom, rotation));
  };

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    setOffset((prev) => clampOffset(prev, zoom, nextRot));
  };

  const handleUseOriginal = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const exportSize = 512;
    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Center-crop ("object-cover") full photo into 512x512 square so there is never empty space
    const natW = img.naturalWidth || img.width || 512;
    const natH = img.naturalHeight || img.height || 512;
    const scale = Math.max(exportSize / natW, exportSize / natH);
    const drawW = natW * scale;
    const drawH = natH * scale;
    const drawX = (exportSize - drawW) / 2;
    const drawY = (exportSize - drawH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          let file;
          try {
            file = new File([blob], "profile-avatar.jpg", {
              type: "image/jpeg",
              lastModified: Date.now()
            });
          } catch {
            blob.name = "profile-avatar.jpg";
            blob.lastModifiedDate = new Date();
            file = blob;
          }
          onCropComplete(file);
          handleClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleApplyCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const activeCropSize =
      cropBoxRef.current?.getBoundingClientRect()?.width || cropBoxSize || 260;
    const exportSize = 512; // Ukuran export canvas (px)
    const exportRatio = exportSize / activeCropSize;

    const { width: baseW, height: baseH } = getBaseDisplayDims(
      img.naturalWidth || naturalDims.width,
      img.naturalHeight || naturalDims.height,
      activeCropSize
    );
    const safeOffset = clampOffset(offset, zoom, rotation, activeCropSize);

    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, exportSize, exportSize);

    // Exact 1:1 match with CSS transform: translate3d(offset.x, offset.y, 0) rotate(rotation) scale(zoom)
    ctx.save();
    ctx.translate(exportSize / 2, exportSize / 2);
    ctx.translate(safeOffset.x * exportRatio, safeOffset.y * exportRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * exportRatio, zoom * exportRatio);
    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    // Export sebagai file Blob JPEG berkualitas tinggi
    canvas.toBlob(
      (blob) => {
        if (blob) {
          let croppedFile;
          try {
            croppedFile = new File([blob], "profile-avatar.jpg", {
              type: "image/jpeg",
              lastModified: Date.now()
            });
          } catch {
            blob.name = "profile-avatar.jpg";
            blob.lastModifiedDate = new Date();
            croppedFile = blob;
          }
          onCropComplete(croppedFile);
          handleClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  if (!isOpen || !imageSrc || typeof document === "undefined") return null;

  const baseDisplayDims = getBaseDisplayDims();
  const clampedOffset = clampOffset(offset);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col my-auto max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              {isEn ? "Crop Profile Photo" : "Sesuaikan Foto Profil"}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {isEn ? "Drag to reposition, use slider to zoom" : "Geser foto dan atur perbesaran untuk posisi terbaik"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={isEn ? "Close" : "Tutup"}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop Viewport Canvas Area */}
        <div 
          className="relative w-full h-72 sm:h-80 bg-slate-900 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={containerRef}
        >
          {/* Draggable & Transformable Image (Exact Cover-Fit to Cutout Frame at zoom = 1) */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="To crop"
            onLoad={handleImageLoad}
            draggable={false}
            className="max-w-none pointer-events-none select-none shrink-0"
            style={{
              width: `${baseDisplayDims.width}px`,
              height: `${baseDisplayDims.height}px`,
              transform: `translate3d(${clampedOffset.x}px, ${clampedOffset.y}px, 0) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: "center center",
            }}
          />

          {/* Semi-transparent dark mask with circular/square cutout */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
            {/* Viewport Boundary 220px on tiny screens, 260px on larger screens */}
            <div
              ref={cropBoxRef}
              className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-3xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative overflow-hidden"
            >
              {/* Subtle Rule of Thirds Guide Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/75 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-white/80 flex items-center gap-1.5 border border-white/10 shadow-xs">
            <Move className="w-3 h-3" />
            <span>{isEn ? "Drag to move" : "Geser foto di layar"}</span>
          </div>
        </div>

        {/* Controls Toolbar: Zoom Slider & Rotate */}
        <div className="p-4 sm:p-5 bg-white space-y-3 sm:space-y-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => handleZoomChange(Math.max(1, +(zoom - 0.15).toFixed(2)))}
              aria-label="Zoom Out"
              className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              aria-label="Zoom"
              className="w-full accent-[#00685F] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => handleZoomChange(Math.min(3, +(zoom + 0.15).toFixed(2)))}
              aria-label="Zoom In"
              className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              title={isEn ? "Rotate 90 degrees" : "Putar 90 derajat"}
              className="p-2 ml-1 sm:ml-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#00685F] transition cursor-pointer shrink-0"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleUseOriginal}
              className="text-[11px] sm:text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-2 transition cursor-pointer py-1.5"
            >
              {isEn ? "Skip & use full photo" : "Gunakan foto penuh"}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#00685F] hover:bg-[#004D46] text-white text-xs font-black transition shadow-sm shadow-[#00685F]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isEn ? "Apply" : "Terapkan"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

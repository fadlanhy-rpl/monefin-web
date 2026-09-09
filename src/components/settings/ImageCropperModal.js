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

  const imageRef = useRef(null);
  const containerRef = useRef(null);

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
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

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
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplyCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const cropSize = 300; // Ukuran area crop tampilan (px)
    const exportSize = 512; // Ukuran export canvas (px)
    const scaleFactor = exportSize / cropSize;

    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Bersihkan canvas
    ctx.clearRect(0, 0, exportSize, exportSize);

    // Pusatkan titik gambar untuk transformasi (rotasi, zoom, pan)
    ctx.save();
    ctx.translate(exportSize / 2, exportSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // Hitung posisi draw
    // img rendered dimensions vs natural dimensions
    const renderedWidth = img.width;
    const renderedHeight = img.height;

    // Geser sesuai offset pan
    const drawX = (offset.x / zoom) - (renderedWidth / 2);
    const drawY = (offset.y / zoom) - (renderedHeight / 2);

    ctx.drawImage(img, drawX, drawY, renderedWidth, renderedHeight);
    ctx.restore();

    // Export sebagai file Blob JPEG
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "profile-avatar.jpg", {
            type: "image/jpeg",
            lastModified: Date.now()
          });
          onCropComplete(croppedFile);
          handleClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  if (!isOpen || !imageSrc || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
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
            className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop Viewport Canvas Area */}
        <div 
          className="relative w-full h-80 bg-slate-900 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={containerRef}
        >
          {/* Draggable & Transformable Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="To crop"
            draggable={false}
            className="max-w-none transition-transform duration-75 pointer-events-none select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              maxHeight: "260px"
            }}
          />

          {/* Semi-transparent dark mask with circular/square cutout */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Viewport Boundary 260x260 with rounded shape & rule-of-thirds grid */}
            <div className="w-[260px] h-[260px] rounded-3xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative overflow-hidden">
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/70 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-white/80 flex items-center gap-1.5 border border-white/10 shadow-xs">
            <Move className="w-3 h-3" />
            <span>{isEn ? "Drag to move" : "Klik & geser foto"}</span>
          </div>
        </div>

        {/* Controls Toolbar: Zoom Slider & Rotate */}
        <div className="p-5 bg-white space-y-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#00685F] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />

            <button
              type="button"
              onClick={handleRotate}
              title={isEn ? "Rotate 90 degrees" : "Putar 90 derajat"}
              className="p-2 ml-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-[#00685F] transition cursor-pointer shrink-0"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              {isEn ? "Cancel" : "Batal"}
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-6 py-2.5 rounded-xl bg-[#00685F] hover:bg-[#004D46] text-white text-xs font-black transition shadow-sm shadow-[#00685F]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEn ? "Apply Crop" : "Terapkan Potongan"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

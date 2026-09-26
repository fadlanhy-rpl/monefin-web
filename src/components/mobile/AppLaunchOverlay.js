"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  ArrowUpRight,
  Activity,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Play,
} from "lucide-react";

// Module-level flag so internal route changes (/dashboard -> /transactions -> /dashboard)
// never replay the splash once the initial cold boot has completed.
let hasCompletedColdBoot = false;

/**
 * 60fps Lightweight Financial Streamline Canvas for the Mobile Launch Screen
 * Mirrors HeroInteractiveCanvas.js aesthetic while optimized for mobile GPU compositing.
 */
function LaunchStreamlineCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let rafId = null;
    let width = 0;
    let height = 0;

    const lines = [
      { ratio: 0.2, amp: 22, freq: 0.004, speed: 0.0018, phase: 0, color: "rgba(16, 185, 129, 0.24)", w: 1.5 },
      { ratio: 0.38, amp: 30, freq: 0.0032, speed: 0.0014, phase: 1.7, color: "rgba(45, 212, 191, 0.26)", w: 1.8 },
      { ratio: 0.56, amp: 26, freq: 0.0038, speed: 0.0021, phase: 3.1, color: "rgba(0, 240, 160, 0.2)", w: 1.4 },
      { ratio: 0.74, amp: 32, freq: 0.0029, speed: 0.0016, phase: 4.4, color: "rgba(16, 185, 129, 0.18)", w: 1.6 },
      { ratio: 0.88, amp: 18, freq: 0.0045, speed: 0.0023, phase: 5.2, color: "rgba(45, 212, 191, 0.15)", w: 1.2 },
    ];

    const pulses = [
      { lineIdx: 0, progress: 0.18, speed: 0.0045, r: 3.5 },
      { lineIdx: 1, progress: 0.58, speed: 0.0055, r: 4 },
      { lineIdx: 2, progress: 0.34, speed: 0.005, r: 3.5 },
      { lineIdx: 3, progress: 0.76, speed: 0.004, r: 4 },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 360;
      height = rect.height || 640;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.w;
        const baseY = height * line.ratio;
        for (let x = 0; x <= width; x += 10) {
          const y =
            baseY +
            Math.sin(x * line.freq + time * line.speed + line.phase) * line.amp +
            Math.cos(x * line.freq * 0.6 - time * line.speed * 0.7) * (line.amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      pulses.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const line = lines[p.lineIdx];
        const px = p.progress * width;
        const py =
          height * line.ratio +
          Math.sin(px * line.freq + time * line.speed + line.phase) * line.amp +
          Math.cos(px * line.freq * 0.6 - time * line.speed * 0.7) * (line.amp * 0.35);

        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4);
        grad.addColorStop(0, "rgba(52, 211, 153, 0.95)");
        grad.addColorStop(0.4, "rgba(16, 185, 129, 0.35)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ECFDF5";
        ctx.beginPath();
        ctx.arc(px, py, p.r * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

/**
 * Shared Inner Visual Scene for both Fullscreen Boot Splash & Interactive Phone Preview.
 * Rendered immediately at Frame 0 (including SSR) so it appears right after the OS MoneFin logo
 * without any intermediate spinner.
 */
export function HeroLaunchScene({ progress = 20, isEn = false, compact = false }) {
  const clamped = Math.max(15, Math.min(100, progress));
  const targetBalance = 48750000;
  // Smooth ease-out curve for the Net Worth counter
  const normalized = Math.min(1, Math.max(0, (clamped - 15) / 78));
  const eased = 1 - Math.pow(1 - normalized, 3);
  const animatedBalance = Math.round(targetBalance * (0.18 + 0.82 * eased));

  const formatIdr = (val) => "Rp " + val.toLocaleString("id-ID");

  const needsWidth = Math.min(50, (0.25 + 0.75 * eased) * 50);
  const wantsWidth = Math.min(30, (0.2 + 0.8 * eased) * 30);
  const savingsWidth = Math.min(20, (0.15 + 0.85 * eased) * 20);

  const statusLabel =
    clamped < 45
      ? isEn
        ? "Initializing 256-Bit Encrypted Vault..."
        : "Menginisialisasi Brankas Enkripsi 256-Bit..."
      : clamped < 88
      ? isEn
        ? "Syncing 50/30/20 Allocation & Multi-Currency..."
        : "Menyinkronkan Alokasi 50/30/20 & Multi-Mata Uang..."
      : isEn
      ? "MoneFin Live Financial Cockpit Ready"
      : "MoneFin Live Financial Cockpit Siap";

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#041714] via-[#072520] to-[#041512] text-white overflow-hidden flex flex-col justify-between select-none">
      {/* 1. 60FPS Living Contour Streamlines */}
      <LaunchStreamlineCanvas />

      {/* Ambient Emerald & Teal Radiant Glows */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-16 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

      {/* Top Status & Brand Header (Focal Point 1) */}
      <div
        className={`relative z-10 px-4 ${
          compact ? "pt-5" : "pt-8 sm:pt-10"
        } flex flex-col items-center text-center`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur-md shadow-lg">
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center shadow-sm shadow-emerald-500/40">
            <img
              src="/images/logo-monefin-white.svg"
              alt="MoneFin"
              className="w-3.5 h-3.5"
            />
          </div>
          <span className="font-black text-xs tracking-tight text-white">MoneFin</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
            Live Cockpit
          </span>
        </div>
      </div>

      {/* Centerpiece Hero Cockpit + 2 Satellite Widgets (Focal Points 2 & 3) */}
      <div className="relative z-10 px-4 my-auto space-y-2.5 max-w-sm mx-auto w-full">
        {/* Satellite Pill 1: Live Cashflow In (Top-Left Floating) */}
        <div
          className="flex items-center gap-2.5 bg-white/95 text-slate-900 rounded-2xl px-3 py-2 shadow-xl border border-emerald-200/80 max-w-[235px] animate-float-subtle"
          style={{
            willChange: "transform, opacity",
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Cashflow In
              </span>
            </div>
            <p className="text-xs font-black text-slate-900 tabular-nums truncate">
              +Rp 8.000.000
            </p>
            <p className="text-[10px] font-bold text-emerald-600 truncate">
              {isEn ? "BCA Payroll Salary" : "Gaji Payroll BCA"}
            </p>
          </div>
        </div>

        {/* Central Hero Cockpit Console Card (Visible from Frame 0 right after MoneFin logo) */}
        <div
          className="bg-white/95 backdrop-blur-2xl text-slate-900 rounded-3xl p-4 shadow-2xl border-2 border-emerald-400/40 space-y-3"
          style={{
            willChange: "transform, opacity",
          }}
        >
          {/* Cockpit Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              <span className="text-[11px] font-black text-slate-900">
                MoneFin Control Desk
              </span>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              IDR • USD • EUR • SGD
            </span>
          </div>

          {/* Account Provider Pills */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
            <div className="py-1 px-1.5 rounded-lg bg-white text-brand-700 shadow-xs font-black text-center truncate">
              {isEn ? "All" : "Semua"}
            </div>
            <div className="py-1 px-1.5 rounded-lg text-slate-600 flex items-center justify-center gap-1">
              <img src="/images/providers/bca.svg" alt="BCA" className="h-2.5 w-auto object-contain" />
              <span>BCA</span>
            </div>
            <div className="py-1 px-1.5 rounded-lg text-slate-600 flex items-center justify-center gap-1">
              <img src="/images/providers/mandiri.svg" alt="Mandiri" className="h-2.5 w-auto object-contain" />
              <span>Mandiri</span>
            </div>
            <div className="py-1 px-1.5 rounded-lg text-slate-600 flex items-center justify-center gap-1">
              <img src="/images/providers/gopay.svg" alt="GoPay" className="h-2.5 w-auto object-contain" />
              <span>GoPay</span>
            </div>
          </div>

          {/* Dark Emerald Net Worth Readout */}
          <div className="bg-[#071613] rounded-2xl p-3.5 text-white relative overflow-hidden space-y-2 border border-emerald-900/60">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-extrabold uppercase tracking-wider text-emerald-300">
                {isEn ? "Total Net Worth" : "Total Kekayaan Bersih"}
              </span>
              <span className="font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px]">
                LIVE SYNC
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums tracking-tight">
              {formatIdr(animatedBalance)}
            </div>

            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-semibold">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                {isEn ? "+18.4% Monthly Growth" : "+18.4% Pertumbuhan Bulanan"}
              </span>
              <svg className="w-20 h-4 text-emerald-400" viewBox="0 0 100 24" fill="none">
                <path
                  d="M0 18 Q25 4, 50 14 T100 2"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* 50 / 30 / 20 Live Allocation Bar */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-800">
              <span>{isEn ? "Smart 50/30/20 Allocation" : "Alokasi Otomatis 50/30/20"}</span>
              <span className="text-[9px] text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded font-black border border-brand-200">
                50 / 30 / 20
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200">
              <div
                className="bg-brand-600 h-full"
                style={{ width: `${needsWidth}%` }}
              />
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${wantsWidth}%` }}
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${savingsWidth}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold text-slate-600">
              <div className="bg-white rounded-lg py-1 border border-slate-200/70">
                {isEn ? "Needs 50%" : "Kebutuhan 50%"}
              </div>
              <div className="bg-white rounded-lg py-1 border border-slate-200/70">
                {isEn ? "Wants 30%" : "Keinginan 30%"}
              </div>
              <div className="bg-white rounded-lg py-1 border border-slate-200/70">
                {isEn ? "Savings 20%" : "Tabungan 20%"}
              </div>
            </div>
          </div>
        </div>

        {/* Satellite Pill 2: Financial Health Score (Bottom-Right Floating) */}
        <div
          className="ml-auto flex items-center gap-2.5 bg-[#091A17]/95 text-white rounded-2xl px-3 py-2 shadow-xl border border-emerald-500/40 max-w-[225px] animate-float-subtle-reverse"
          style={{
            willChange: "transform, opacity",
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider">
              Financial Health
            </p>
            <p className="text-xs font-black text-white">94 / 100 • Optimal</p>
            <p className="text-[10px] text-emerald-400 font-medium truncate">
              {isEn ? "AI Advisor Active" : "AI Advisor Aktif"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Progress & Security Telemetry (Focal Point 4) */}
      <div
        className={`relative z-10 px-5 ${
          compact ? "pb-5" : "pb-8 sm:pb-10"
        } max-w-sm mx-auto w-full space-y-2`}
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-200/90">
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{statusLabel}</span>
          </span>
          <span className="font-black text-emerald-400 tabular-nums shrink-0 ml-2">
            {Math.min(100, Math.round(clamped))}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-300"
            style={{ width: `${Math.min(100, clamped)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Phone Mockup for the /download page so users can preview and replay
 * the exact Hero-style APK Launch Animation before or after downloading.
 */
export function ApkLaunchPhonePreview() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [progress, setProgress] = useState(18);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    let raf = null;
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, 18 + (elapsed / duration) * 82);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [runId]);

  const handleReplay = useCallback(() => {
    setProgress(18);
    setRunId((prev) => prev + 1);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Smartphone Hardware Frame */}
      <div className="relative w-[305px] sm:w-[330px] h-[610px] sm:h-[640px] rounded-[2.85rem] p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-950/30 border-2 border-slate-700/80">
        {/* Top Speaker / Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-24 h-5 rounded-full bg-black/90 border border-white/10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span className="w-8 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Inner Screen Viewport */}
        <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden border border-white/10">
          <HeroLaunchScene progress={progress} isEn={isEn} compact />

          {/* Replay Overlay Button in Corner when complete */}
          {progress >= 100 && (
            <button
              onClick={handleReplay}
              className="absolute top-12 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
              title={isEn ? "Replay APK Launch Animation" : "Putar Ulang Animasi APK"}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? "Replay" : "Putar Ulang"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Below Phone */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button
          onClick={handleReplay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 text-xs font-extrabold transition-all cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>
            {isEn
              ? "Replay APK Startup Animation"
              : "Putar Ulang Animasi Saat APK Dibuka"}
          </span>
        </button>
      </div>
    </div>
  );
}

/**
 * Unified Boot Splash Overlay rendered directly by DashboardLayout from SSR Frame 0.
 * Eliminates the old "Memuat dashboard..." spinner before the splash, pre-renders the
 * dashboard underneath while animating, and executes a silky 550ms cubic-bezier cross-fade.
 */
export function DashboardBootSplash({ isReady, onComplete }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [progress, setProgress] = useState(22);
  const [exiting, setExiting] = useState(false);
  const isReadyRef = useRef(isReady);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    const isApkEnv =
      typeof window !== "undefined" &&
      (document.documentElement.classList.contains("monefin-apk") ||
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        window.location.search.includes("source=apk") ||
        document.referrer.includes("id.web.monefin.app") ||
        sessionStorage.getItem("monefin_apk_session") === "1");

    // On normal website browser, never run the APK boot splash
    if (!isApkEnv || hasCompletedColdBoot) {
      hasCompletedColdBoot = true;
      if (onComplete) onComplete();
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = prefersReducedMotion ? 350 : 1250;
    const maxWait = 2400;
    const start = performance.now();
    let raf = null;
    let exitTimer = null;

    const tick = (now) => {
      const elapsed = now - start;
      const rawPct = 22 + (elapsed / minDuration) * 78;

      if (elapsed < minDuration) {
        setProgress(Math.min(96, rawPct));
        raf = requestAnimationFrame(tick);
      } else if (!isReadyRef.current && elapsed < maxWait) {
        const holdPct = Math.min(99, 96 + ((elapsed - minDuration) / (maxWait - minDuration)) * 3);
        setProgress(holdPct);
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setExiting(true);
        hasCompletedColdBoot = true;
        exitTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 520);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (!isReadyRef.current) return;
    setProgress(100);
    setExiting(true);
    hasCompletedColdBoot = true;
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 350);
  };

  return (
    <div
      onClick={handleSkip}
      role="status"
      aria-label="MoneFin Live Financial Cockpit Launching"
      style={{
        transition:
          "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
      }}
      className={`apk-only-splash fixed inset-0 z-[9999] ${
        exiting
          ? "opacity-0 scale-[1.035] pointer-events-none"
          : "opacity-100 scale-100"
      }`}
    >
      <HeroLaunchScene progress={progress} isEn={isEn} />
    </div>
  );
}

export function isColdBootCompleted() {
  return hasCompletedColdBoot;
}

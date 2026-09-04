"use client";

import { useRef, useEffect } from "react";
import { TrendingUp, Shield, Lock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { AuthInteractiveCanvas } from "./AuthInteractiveCanvas";

export default function LoginIllustration() {
  const { t } = useLanguage();
  const illustrationRef = useRef(null);
  const cardRef = useRef(null);
  const rafMoveRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!illustrationRef.current || !cardRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafMoveRef.current) return;
    rafMoveRef.current = requestAnimationFrame(() => {
      rafMoveRef.current = null;
      if (!illustrationRef.current || !cardRef.current) return;

      const rect = illustrationRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (clientX - centerX) / (rect.width / 2);
      const deltaY = (clientY - centerY) / (rect.height / 2);

      const rx = Math.max(-5, Math.min(5, -deltaY * 4));
      const ry = Math.max(-5, Math.min(5, deltaX * 4));
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  };

  const handleMouseLeave = () => {
    if (rafMoveRef.current) {
      cancelAnimationFrame(rafMoveRef.current);
      rafMoveRef.current = null;
    }
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  useEffect(() => {
    return () => {
      if (rafMoveRef.current) {
        cancelAnimationFrame(rafMoveRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={illustrationRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:flex w-[50%] h-screen bg-gradient-to-br from-[#061714] via-[#002b27] to-[#001714] p-8 xl:p-12 flex-col justify-between relative overflow-hidden select-none border-r border-emerald-950/40"
    >
      {/* Dynamic Flowing Streamlines Canvas (60FPS) */}
      <AuthInteractiveCanvas />

      {/* Atmospheric Background Mesh & Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-topo-pattern opacity-30" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl animate-float-orb pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-brand-500/12 blur-2xl animate-float-orb-reverse pointer-events-none" />
      </div>

      {/* Top Header: Logo & Status */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-brand-900/40">
            <img
              src="/images/LogoMonefinWhite.svg"
              alt="MoneFin Logo"
              className="w-5 h-5"
            />
          </div>
          <span className="text-white text-xl font-black tracking-tight">
            MoneFin
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Core Desk Live</span>
        </div>
      </div>

      {/* Centerpiece: Simple & Clean Single Cockpit Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4 w-full">
        <div className="perspective-1000 w-full max-w-[420px]">
          <div
            ref={cardRef}
            className="w-full bg-[#091A17]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 space-y-5 transition-transform duration-150 ease-out"
            style={{
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              willChange: "transform",
            }}
          >
            {/* Cockpit Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
                <span className="text-xs font-black text-white tracking-tight uppercase">
                  MoneFin Live Control Desk
                </span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Multi-Rekening
              </span>
            </div>

            {/* Total Balance Metric */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
                Total Net Worth
              </p>
              <h3 className="text-3xl xl:text-4xl font-black text-emerald-400 tabular-nums tracking-tight mt-1">
                Rp 48.750.000
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>+12.5% Bulan Ini (Cashflow Sehat)</span>
              </div>
            </div>

            {/* Dynamic Smooth Sparkline */}
            <div className="py-1">
              <svg
                className="w-full h-8 text-emerald-400"
                viewBox="0 0 200 32"
                fill="none"
              >
                <path
                  d="M0 24 Q35 6, 70 18 T130 10 T170 16 T200 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Provider Badges */}
            <div className="pt-3 border-t border-emerald-900/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Bisa Buat Akun Bank & Dompet
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                  <img
                    src="/images/providers/bca.svg"
                    alt="BCA"
                    className="h-3 w-auto object-contain"
                  />
                </div>
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                  <img
                    src="/images/providers/mandiri.svg"
                    alt="Mandiri"
                    className="h-3 w-auto object-contain"
                  />
                </div>
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                  <img
                    src="/images/providers/gopay.svg"
                    alt="GoPay"
                    className="h-2.5 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slogan & Clean Reassurance */}
      <div className="relative z-10 space-y-2.5">
        <h2 className="text-xl xl:text-2xl font-black text-white leading-tight max-w-lg">
          {t("auth.slogan_title")}
        </h2>
        <p className="text-slate-300 text-xs xl:text-sm max-w-md font-normal leading-relaxed">
          {t("auth.slogan_desc")}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-emerald-300/80 font-semibold border-t border-emerald-900/50">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enkripsi Bank 256-Bit</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Kontrol Mandiri</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privasi Terproteksi</span>
          </span>
        </div>
      </div>
    </div>
  );
}

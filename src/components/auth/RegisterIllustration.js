"use client";

import { useEffect, useRef } from "react";
import { TrendingUp, Rss, PiggyBank } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function RegisterIllustration() {
  const { t } = useLanguage();
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Reference size of the illustration container is 512x400
        const scaleX = width / 512;
        const scaleY = height / 400;
        // Choose the smaller scale to fit both width and height, capped at 1.0
        const scale = Math.min(scaleX, scaleY, 1);
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    });

    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="hidden lg:flex w-1/2 h-screen bg-[#00685F] p-6 xl:p-12 flex-col justify-between relative overflow-hidden">
      {/* CSS Stylesheet Injector for keyframe animation and responsive scaling */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-float-register {
            animation: float-reg 6s ease-in-out infinite;
        }
        @keyframes float-reg {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .illustration-scale-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
            transform-origin: center;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-shadow { 
            box-shadow: 0 20px 50px rgba(0,0,0,0.1); 
        }
        @media (max-width: 1400px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.85);
            }
        }
        @media (max-width: 1200px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.75);
            }
        }
        @media (max-height: 900px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.85);
            }
        }
        @media (max-height: 800px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.75);
            }
        }
        @media (max-height: 700px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.65);
            }
        }
        @media (max-height: 600px) {
            .illustration-scale-container {
                transform: translate(-50%, -50%) scale(0.55);
            }
        }
      `}} />

      {/* Logo */}
      <div className="flex items-center gap-3 z-10">
        <div className="bg-white p-2 rounded-xl shadow-lg">
          <img
            src="/images/LogoMonefinGreen.svg"
            alt="MoneFin Logo"
            className="w-6 h-6"
          />
        </div>
        <span className="text-white text-2xl font-bold tracking-tight">MoneFin</span>
      </div>

      {/* AREA ILUSTRASI KARTU */}
      <div 
        ref={wrapperRef}
        className="illustration-scale-wrapper flex-1 flex items-center justify-center min-h-0 my-4 w-full relative z-10"
      >
        <div 
          ref={containerRef}
          className="illustration-scale-container w-[512px] h-[400px] shrink-0"
        >
          {/* Card 1: Net Worth */}
          <div className="absolute top-0 left-0 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] w-72 card-shadow animate-float-register z-20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Net Worth</span>
              <TrendingUp className="text-[#00685F] w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">$248,500.00</h3>
            
            {/* Simple Bar Chart Visualization */}
            <div className="flex items-end gap-2 mt-6 h-16">
              <div className="bg-teal-100 w-full rounded-t-md h-1/3"></div>
              <div className="bg-teal-200 w-full rounded-t-md h-1/2"></div>
              <div className="bg-teal-300 w-full rounded-t-md h-3/4"></div>
              <div className="bg-[#00685F] w-full rounded-t-md h-2/3"></div>
              <div className="bg-teal-500 w-full rounded-t-md h-full"></div>
            </div>
          </div>

          {/* Card 2: Platinum Reserve (Black Card) */}
          <div className="absolute bottom-10 right-0 bg-[#1A1A1A] p-8 rounded-[2.5rem] w-80 h-52 text-white flex flex-col justify-between shadow-2xl z-10 translate-x-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Platinum Reserve</span>
              <Rss className="w-6 h-6 opacity-50" />
            </div>
            <div className="space-y-1">
              <p className="text-lg tracking-[0.3em] font-medium opacity-80">•••• •••• •••• 8</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] text-zinc-500 uppercase mb-1">Member Since</p>
                <p className="text-xs font-bold">22</p>
              </div>
              <div className="bg-zinc-800 px-3 py-1 rounded text-[10px] font-bold">VISA</div>
            </div>
          </div>

          {/* Card 3: Monthly Savings (Bubble) */}
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 bg-[#E6F0EF] p-4 rounded-full flex items-center gap-3 shadow-xl z-30 animate-float-register" 
            style={{ animationDelay: "1s" }}
          >
            <div className="bg-[#00685F] w-10 h-10 rounded-full flex items-center justify-center text-white shadow-inner">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Monthly Savings</p>
              <p className="text-sm font-black text-[#00685F]">+$3,450.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* TEKS SLOGAN */}
      <div className="z-10">
        <h2 className="text-2xl xl:text-4xl font-extrabold text-white leading-tight max-w-lg">
          {t("auth.slogan_title")}
        </h2>
        <p className="text-white/70 mt-2 xl:mt-4 text-xs xl:text-sm max-w-lg font-medium">
          {t("auth.slogan_desc")}
        </p>
      </div>
    </div>
  );
}

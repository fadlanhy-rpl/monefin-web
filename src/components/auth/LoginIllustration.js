"use client";

import { useEffect, useRef } from "react";
import { TrendingUp, CheckCircle2, Rss } from "lucide-react";

export default function LoginIllustration() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Reference size of the illustration container is 580x450
        const scaleX = width / 580;
        const scaleY = height / 450;
        // Choose the smaller scale to fit both width and height, capped at 1.0
        const scale = Math.min(scaleX, scaleY, 1);
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    });

    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="hidden lg:flex w-[55%] h-screen bg-[#00685F] p-6 xl:p-12 flex-col justify-between relative overflow-hidden">
      {/* CSS Stylesheet Injector for keyframe animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-float-spending {
            animation: float-spend 4s ease-in-out infinite;
        }
        @keyframes float-spend {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
        }
        .illustration-scale-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
            transform-origin: center;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
      <div className="flex items-center gap-2 z-20">
        <div className="bg-white p-1.5 rounded-lg">
          <img
            src="/images/LogoMonefinGreen.svg"
            alt="MoneFin Logo"
            className="w-5 h-5"
          />
        </div>
        <span className="text-white text-xl font-bold tracking-tight">MoneFin</span>
      </div>

      {/* CONTAINER ILUSTRASI */}
      <div 
        ref={wrapperRef}
        className="illustration-scale-wrapper flex-1 flex items-center justify-center min-h-0 my-4 w-full relative z-10"
      >
        <div 
          ref={containerRef}
          className="illustration-scale-container w-[580px] h-[450px] shrink-0"
        >
          {/* 1. Total Portfolio (Kiri Atas) */}
          <div className="absolute top-10 left-0 bg-[#F9FBFA] p-6 rounded-[2.5rem] shadow-xl w-[360px] h-[240px] z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Portfolio</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">$142,850.40</h3>
            
            <div className="flex items-center gap-1.5 mt-4 text-[#00685F] font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% this month</span>
            </div>

            {/* Mini Chart SVG */}
            <div className="mt-6 flex justify-center">
              <div className="w-32 h-16 opacity-40">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <path d="M0 35 Q 20 30, 40 32 T 70 15 T 100 10" fill="none" stroke="#00685F" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Spending (Kanan Atas - FLOATING) */}
          <div className="absolute top-10 right-8 bg-[#F9FBFA] rounded-[2.2rem] shadow-lg w-[135px] h-[115px] flex flex-col items-center justify-center z-20 animate-float-spending">
            <div className="w-14 h-14 bg-[#A0522D] rounded-full border-[3px] border-white shadow-inner flex items-center justify-center mb-1.5">
              <div className="w-full h-full rounded-full border-[3px] border-white/30"></div>
            </div>
            <p className="text-gray-600 text-xs font-bold">Spending</p>
          </div>

          {/* 3. Invoice Paid (Bawah Portfolio) */}
          <div className="absolute bottom-16 left-0 bg-[#F9FBFA] p-5 rounded-[2rem] shadow-lg w-[260px] flex items-center gap-4 z-20">
            <div className="bg-[#E6F0EF] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="text-[#00685F] w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Invoice Paid</p>
              <p className="text-base font-extrabold text-gray-400">$2,400.00</p>
            </div>
          </div>

          {/* 4. Black Credit Card (Kanan - Sedikit Miring) */}
          <div className="absolute top-[180px] right-8 bg-[#141414] p-6 rounded-[2rem] shadow-2xl w-[175px] h-[195px] flex flex-col justify-between text-white z-0 transform rotate-[6deg]">
            <div className="flex justify-between items-start">
              <Rss className="w-6 h-6 opacity-60" />
              <div className="w-10 h-7 bg-zinc-800 rounded-md border border-zinc-700/50"></div>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-zinc-500 mb-2">**** 4412</p>
            </div>
          </div>
        </div>
      </div>

      {/* TEKS SLOGAN BAWAH */}
      <div className="z-20">
        <h2 className="text-2xl xl:text-4xl font-extrabold text-white leading-tight max-w-sm">
          Master Your Money with Smart Insights
        </h2>
        <p className="text-white/60 mt-2 xl:mt-4 text-xs xl:text-sm max-w-xs font-medium">
          Join over 50,000 users worldwide who trust MoneFin for their wealth management.
        </p>
      </div>
    </div>
  );
}

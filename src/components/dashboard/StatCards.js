"use client";

import { useEffect, useState, useRef } from "react";

function CountUp({ target, prefix = "", locale = "id-ID", isHidden = false }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isHidden) return;
    if (!ref.current || hasAnimated) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAnimated(true);
        animate();
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.4 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated, target, isHidden]);

  const animate = () => {
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (isHidden) {
    return <span>••••••</span>;
  }

  return <span ref={ref}>{prefix}{value.toLocaleString(locale)}</span>;
}

export default function StatCards() {
  const [isVisible, setIsVisible] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
      
      {/* Premium Total Balance Card (Credit Card UI) */}
      <div className={`reveal relative pt-3 ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "0ms" }}>
        <div className="absolute top-0 left-3 right-3 h-12 rounded-2xl bg-brand-400/50 blur-[1px]"></div>
        <div className="tilt-card shimmer-sweep glow-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-lg cursor-pointer">
          {/* Card texture overlay */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
               style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 2px, transparent 2px, transparent 18px)" }}></div>
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute top-12 right-12 w-28 h-28 rounded-full bg-white/5 blur-lg"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-white/70 font-semibold tracking-wider uppercase">Total Balance</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-3xl font-extrabold tracking-tight tabular-nums min-h-[40px] flex items-center">
                  <CountUp target={15250000} prefix="Rp " isHidden={!showBalance} />
                </p>
                <button 
                  onClick={() => setShowBalance(!showBalance)} 
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-1"
                  aria-label={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                >
                  {showBalance ? (
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* Credit Card Chip Visual */}
            <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-300 p-1 opacity-90 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-1.5 h-1.5 border-r border-b border-black/10"></div>
                <div className="w-1.5 h-1.5 border-l border-b border-black/10"></div>
              </div>
              <div className="w-full h-[1px] bg-black/10"></div>
              <div className="flex justify-between">
                <div className="w-1.5 h-1.5 border-r border-t border-black/10"></div>
                <div className="w-1.5 h-1.5 border-l border-t border-black/10"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-between items-center relative z-10">
            <span className="inline-block bg-white/15 text-[10px] font-extrabold tracking-wider px-2.5 py-1.5 rounded-lg">SAVINGS +4.2%</span>
            <span className="text-[10px] text-white/60 tracking-widest font-mono">•••• 8820</span>
          </div>
        </div>
      </div>

      {/* Monthly Income Card with Sparkline */}
      <div className={`reveal card-hover rounded-2xl bg-white p-6 shadow-card border border-slate-100/50 flex flex-col justify-between ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "80ms" }}>
        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span> Monthly Income
          </p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              <CountUp target={8000000} prefix="Rp " />
            </p>
            <span className="flex items-center gap-0.5 text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              12%
            </span>
          </div>
        </div>

        {/* Sparkline & Progress Container */}
        <div className="mt-4 pt-2 flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full bg-brand-600 rounded-full ${isVisible ? 'bar-grow' : ''}`} style={{ "--target-width": "78%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">78% of income target achieved</p>
          </div>
          {/* SVG Sparkline */}
          <div className="w-16 h-8 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="incomeGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00685F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00685F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M0,35 Q15,30 30,15 T60,25 T90,5 L100,5" 
                fill="none" 
                stroke="#00685F" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="sparkline-path"
              />
              <path 
                d="M0,35 Q15,30 30,15 T60,25 T90,5 L100,5 L100,40 L0,40 Z" 
                fill="url(#incomeGlow)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Monthly Expenses Card with Sparkline */}
      <div className={`reveal card-hover rounded-2xl bg-white p-6 shadow-card border border-slate-100/50 flex flex-col justify-between ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "160ms" }}>
        <div>
          <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Monthly Expenses
          </p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              <CountUp target={3200000} prefix="Rp " />
            </p>
            <span className="flex items-center gap-0.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
              5%
            </span>
          </div>
        </div>

        {/* Sparkline & Progress Container */}
        <div className="mt-4 pt-2 flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full bg-red-500 rounded-full ${isVisible ? 'bar-grow' : ''}`} style={{ "--target-width": "32%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">32% of monthly budget limit</p>
          </div>
          {/* SVG Sparkline */}
          <div className="w-16 h-8 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M0,5 Q20,10 40,30 T80,15 T100,28" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="sparkline-path"
              />
              <path 
                d="M0,5 Q20,10 40,30 T80,15 T100,28 L100,40 L0,40 Z" 
                fill="url(#expenseGlow)"
              />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}

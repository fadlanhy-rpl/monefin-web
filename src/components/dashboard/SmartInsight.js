"use client";

import { useEffect, useState, useRef } from "react";
import { Lightbulb, Check, ChevronLeft } from "lucide-react";

function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return 'Rp ' + abs;
}

export default function SmartInsight({ status = null, savings = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [budgetValue, setBudgetValue] = useState(1500000);
  const [savedBudget, setSavedBudget] = useState(1500000);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (status && status.income_amount) {
      setBudgetValue(status.income_amount);
      setSavedBudget(status.income_amount);
    }
  }, [status]);

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

  const handleSave = (e) => {
    e.stopPropagation();
    setSavedBudget(budgetValue);
    setIsFlipped(false);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  return (
    <div 
      ref={ref} 
      className={`reveal xl:col-span-1 min-h-[295px] sm:min-h-[260px] [perspective:1000px] ${isVisible ? 'in-view' : ''}`} 
      style={{ animationDelay: "400ms" }}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? 'flip-card-flipped' : ''}`}
      >
        
        {/* CARD FRONT */}
        <div className="absolute inset-0 w-full h-full flip-card-front card-hover bg-gradient-to-br from-brand-50/70 via-brand-50/30 to-white rounded-2xl p-5 sm:p-6 shadow-card border border-brand-100 flex flex-col justify-between [backface-visibility:hidden]">
          <div className="flex-1 flex flex-col">
            <div className="float-icon w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 self-start">
              <Lightbulb className="w-5 h-5" />
            </div>
            
            <h2 className="font-bold text-slate-900 mt-4 text-base flex items-center gap-1.5">
              Smart Insight
              {showSavedToast && (
                <span className="text-[10px] bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full animate-bounce">
                  Saved!
                </span>
              )}
            </h2>
            
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              {status?.message || 'Silakan atur uang saku terlebih dahulu di halaman Settings.'}
            </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
            className="ripple-container ripple-dark press-scale mt-4 sm:mt-5 w-full bg-white border border-brand-200 text-brand-700 font-bold text-xs py-2.5 sm:py-3 rounded-xl hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-sm"
          >
            Adjust Budget
          </button>
        </div>

        {/* CARD BACK (INTERACTIVE CONFIG FORM) */}
        <div className="absolute inset-0 w-full h-full flip-card-back bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-200 flex flex-col justify-between [backface-visibility:hidden]">
          <div className="flex-1 flex flex-col">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold self-start -ml-1 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Kembali
            </button>

            <h3 className="font-bold text-slate-900 mt-3 text-sm">Sesuaikan Uang Saku (Simulasi)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tentukan batas maksimal pengeluaran simulasi.</p>

            {/* Range Slider */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-semibold">Batas Anggaran:</span>
                <span className="text-sm font-extrabold text-brand-700">{formatRupiah(budgetValue)}</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="3000000" 
                step="100000"
                value={budgetValue}
                onChange={(e) => setBudgetValue(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full accent-brand-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Rp 500rb</span>
                <span>Rp 3jt</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="ripple-container press-scale mt-4 sm:mt-5 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-brand-600/15 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
}

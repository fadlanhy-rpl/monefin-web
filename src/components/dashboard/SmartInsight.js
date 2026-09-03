"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Lightbulb, 
  Check, 
  ChevronLeft, 
  HelpCircle, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  Activity,
  Sliders
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function SmartInsight({ status = null, savings = 0 }) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [budgetValue, setBudgetValue] = useState(1500000);
  const [savedBudget, setSavedBudget] = useState(1500000);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const ref = useRef(null);

  const isConfigured = Boolean(status && status.status !== "income_setting_not_found" && status.income_amount > 0);

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
    <>
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
              
              {/* Header Icon + Info Trigger */}
              <div className="flex items-center justify-between">
                <div className="float-icon w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700">
                  <Lightbulb className="w-5 h-5" />
                </div>
                
                {/* Info Guide Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoModal(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-brand-700 bg-white/80 hover:bg-brand-50 px-2.5 py-1 rounded-full border border-slate-200/70 transition-all cursor-pointer shadow-2xs group"
                  title={t("dashboard.smart_insight_info_btn", "Cara kerja fitur")}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-600 transition-colors" />
                  <span className="hidden xs:inline">{language === "en" ? "How it works" : "Cara Kerja"}</span>
                </button>

              </div>
              
              {/* Title & Saved indicator */}
              <h2 className="font-bold text-slate-900 mt-3.5 text-base flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  {t("dashboard.smart_insight") || "Smart Insight"}
                  {showSavedToast && (
                    <span className="text-[10px] bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full animate-bounce">
                      {t("common.saved") || "Saved!"}
                    </span>
                  )}
                </span>
                {!isConfigured && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {t("dashboard.smart_insight_setup_badge", "Setup Diperlukan")}
                  </span>
                )}
              </h2>
              
              {/* Message / Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                {status?.message || t("dashboard.smart_insight_empty") || 'Silakan atur uang saku terlebih dahulu di halaman Transaksi Rutin atau simulasi.'}
              </p>

              {/* Learn More Link for Empty State */}
              {!isConfigured && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoModal(true);
                  }}
                  className="mt-2 text-left text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 hover:underline cursor-pointer select-none"
                >
                  <span>{t("dashboard.smart_insight_learn_more", "Pelajari cara kerja fitur ini")}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Bottom Action Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="ripple-container ripple-dark press-scale mt-3 sm:mt-4 w-full bg-white border border-brand-200 text-brand-700 font-bold text-xs py-2.5 sm:py-3 rounded-xl hover:bg-brand-50 hover:border-brand-400 transition-colors shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-600" />
              <span>{t("dashboard.adjust_budget") || "Adjust Budget"}</span>
            </button>
          </div>

          {/* CARD BACK (INTERACTIVE CONFIG FORM) */}
          <div className="absolute inset-0 w-full h-full flip-card-back bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-200 flex flex-col justify-between [backface-visibility:hidden]">
            <div className="flex-1 flex flex-col">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold self-start -ml-1 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {t("common.back") || "Kembali"}
              </button>

              <h3 className="font-bold text-slate-900 mt-3 text-sm">{t("dashboard.adjust_budget_sim") || "Sesuaikan Uang Saku (Simulasi)"}</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">{t("dashboard.adjust_budget_sim_desc") || "Tentukan batas maksimal pengeluaran simulasi."}</p>


              {/* Range Slider */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="allowance-limit-slider" className="text-xs text-slate-600 font-bold cursor-pointer">
                    {language === "en" ? "Allowance Limit:" : "Batas Uang Saku:"}
                  </label>
                  <span className="text-sm font-extrabold text-brand-700">{formatCurrency(budgetValue)}</span>
                </div>
                <input 
                  id="allowance-limit-slider"
                  type="range" 
                  aria-label={language === "en" ? "Set monthly allowance limit" : "Atur batas uang saku bulanan"}
                  min="500000" 
                  max="5000000" 
                  step="100000"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full accent-brand-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>{formatCurrency(500000)}</span>
                  <span>{formatCurrency(5000000)}</span>
                </div>

              </div>
            </div>

            <button 
              onClick={handleSave}
              className="ripple-container press-scale mt-3 sm:mt-4 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-brand-600/15 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === "en" ? "Save Simulation" : "Simpan Simulasi"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* DETAILED EXPLANATION GUIDE MODAL */}
      {showInfoModal && mounted && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setShowInfoModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {t("dashboard.smart_insight_guide_title", "Cara Kerja Smart Insight")}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === "en" ? "MoneFin Automated Spending Monitor" : "Monitor Pengeluaran Otomatis MoneFin"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="py-4 space-y-4 overflow-y-auto pr-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
              
              <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-100/80">
                <p className="text-slate-700 font-medium">
                  {t("dashboard.smart_insight_guide_desc", "Smart Insight MoneFin memonitor rasio pengeluaran harian Anda terhadap uang saku secara otomatis dan real-time.")}
                </p>
              </div>

              {/* 3 Status Indicators */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  {language === "en" ? "3 Spending Health Statuses" : "3 Status Kesehatan Pengeluaran"}
                </h4>

                {/* Hemat */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-emerald-900 text-xs sm:text-sm">
                      {t("dashboard.smart_insight_status_hemat_title", "Hemat (≤ 60%)")}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-emerald-800/80 mt-0.5">
                      {t("dashboard.smart_insight_status_hemat_desc", "Pengeluaran Anda sangat terkendali dan potensi tabungan meningkat pesat.")}
                    </p>
                  </div>
                </div>

                {/* Normal */}
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-teal-900 text-xs sm:text-sm">
                      {t("dashboard.smart_insight_status_normal_title", "Normal & Seimbang (60% - 85%)")}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-teal-800/80 mt-0.5">
                      {t("dashboard.smart_insight_status_normal_desc", "Pola belanja Anda stabil dan berada di batas aman yang sehat.")}
                    </p>
                  </div>
                </div>

                {/* Boros */}
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-rose-900 text-xs sm:text-sm">
                      {t("dashboard.smart_insight_status_boros_title", "Peringatan / Boros (> 85%)")}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-rose-800/80 mt-0.5">
                      {t("dashboard.smart_insight_status_boros_desc", "Pengeluaran mendekati atau melampaui uang saku. Saatnya berhemat.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Steps to Setup */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  {t("dashboard.smart_insight_steps_title", "3 Langkah Mudah Memulai")}
                </h4>

                
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-black flex items-center justify-center text-[10px] shrink-0">1</span>
                    <p className="text-slate-700">
                      {t("dashboard.smart_insight_step1", "Tentukan uang saku/gaji bulanan di menu Transaksi Rutin atau slider simulasi.")}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-black flex items-center justify-center text-[10px] shrink-0">2</span>
                    <p className="text-slate-700">
                      {t("dashboard.smart_insight_step2", "Catat pengeluaran harian Anda seperti biasa.")}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-black flex items-center justify-center text-[10px] shrink-0">3</span>
                    <p className="text-slate-700">
                      {t("dashboard.smart_insight_step3", "Dapatkan analisis otomatis, tips hemat, dan peringatan dini.")}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-brand-600/15 cursor-pointer"
              >
                {t("dashboard.smart_insight_got_it", "Mengerti, terima kasih!")}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </>
  );
}

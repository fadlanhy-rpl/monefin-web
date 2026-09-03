"use client";

import { useState } from "react";
import { aiBudgetRecommendations } from "../../services/ai.service";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { Sparkles, X, CheckCircle, Loader2, TrendingUp, BarChart3 } from "lucide-react";

export default function AiBudgetRecommendationsModal({ isOpen, onClose, onApply }) {
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    setRecommendations(null);
    try {
      const res = await aiBudgetRecommendations();
      const data = res?.data ?? res;
      if (data?.recommendations?.length) {
        setRecommendations(data);
      } else {
        setError(data?.message || (language === "id" ? "Belum ada cukup data untuk membuat rekomendasi." : "Not enough data to generate recommendations."));
      }
    } catch {
      setError(language === "id" ? "Gagal memuat rekomendasi AI. Coba lagi." : "Failed to load AI recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!recommendations && !loading) load();
  };

  const handleApply = (rec) => {
    if (!rec.category_id || !rec.recommended_limit) return;
    onApply({
      category_id: rec.category_id,
      amount: rec.recommended_limit,
      period: "monthly",
    });
    setApplied((prev) => ({ ...prev, [rec.category_id]: true }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onAnimationEnd={handleOpen}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#00685F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {language === "id" ? "Rekomendasi Budget AI" : "AI Budget Recommendations"}
              </h3>
              <p className="text-xs text-slate-400">
                {language === "id" ? "Dihitung dari pola pengeluaran historis Anda" : "Calculated from your historical spending patterns"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 max-h-[60vh] overflow-y-auto pr-1">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#00685F]" />
              <p className="text-xs font-semibold">
                {language === "id" ? "Menganalisis riwayat transaksi..." : "Analyzing transaction history..."}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={load}
                className="mt-4 text-xs font-bold text-[#00685F] hover:underline"
              >
                {language === "id" ? "Coba Lagi" : "Try Again"}
              </button>
            </div>
          )}

          {!recommendations && !loading && !error && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="font-bold text-slate-700 mb-2">
                {language === "id" ? "Analisis Pola Pengeluaran" : "Spending Pattern Analysis"}
              </h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {language === "id"
                  ? "AI akan menganalisis riwayat pengeluaran 3 bulan terakhir dan menyarankan batas budget yang optimal per kategori."
                  : "AI will analyze your last 3 months of spending history and suggest optimal budget limits per category."}
              </p>
              <button
                onClick={load}
                className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                {language === "id" ? "Buat Rekomendasi AI" : "Generate AI Recommendations"}
              </button>
            </div>
          )}

          {recommendations && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-semibold mb-4">
                {language === "id"
                  ? `${recommendations.recommendations.length} rekomendasi ditemukan. Klik "Terapkan" untuk langsung mengatur budget.`
                  : `${recommendations.recommendations.length} recommendations found. Click "Apply" to set the budget directly.`}
              </p>
              {recommendations.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-slate-50 rounded-2xl p-4 hover:bg-brand-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-teal-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-800">{rec.category_name}</p>
                      <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                        {rec.recommended_limit ? formatCurrency(rec.recommended_limit) : "—"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{rec.reason}</p>
                  </div>
                  {rec.category_id ? (
                    applied[rec.category_id] ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold shrink-0">
                        <CheckCircle className="w-4 h-4" />
                        {language === "id" ? "Diterapkan" : "Applied"}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(rec)}
                        className="shrink-0 bg-brand-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-brand-700 transition-colors"
                      >
                        {language === "id" ? "Terapkan" : "Apply"}
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {language === "id" ? "Kategori tidak ditemukan" : "Category not found"}
                    </span>
                  )}
                </div>
              ))}

              <button
                onClick={load}
                className="w-full mt-2 text-center text-xs text-slate-400 hover:text-brand-600 font-semibold transition-colors py-2"
              >
                {language === "id" ? "↻ Buat Ulang Rekomendasi" : "↻ Regenerate Recommendations"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

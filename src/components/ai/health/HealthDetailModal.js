"use client";

import { createPortal } from "react-dom";
import { Activity, X, CheckCircle2, MessageSquareText } from "lucide-react";

export default function HealthDetailModal({
  isOpen,
  onClose,
  score,
  summary,
  aiEnabled,
  onConsult,
  language,
  statusBadge,
}) {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Clickable Backdrop to close */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#00685F] to-[#00A896] px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {language === "id" ? "Rincian Diagnosa Finansial" : "Financial Health Breakdown"}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80">
                {language === "id" ? "Analisis AI Skor Kesehatan: " : "AI Health Score: "} {score}/100
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Summary Block */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                {language === "id" ? "Status Kesehatan" : "Health Status"}
              </span>
              {statusBadge}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Scoring Factors Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              {language === "id" ? "Faktor Penilaian AI" : "Scoring Factors"}
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {language === "id" ? "Kontrol Arus Kas (Cashflow)" : "Cash Flow Ratio (30%)"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === "id" ? "Perbandingan antara total pemasukan dan pengeluaran aktif." : "Ratio between active monthly income and expenses."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {language === "id" ? "Kepatuhan Anggaran (Budgeting)" : "Budget Compliance (25%)"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === "id" ? "Persentase pengeluaran terhadap batas limit anggaran tiap kategori." : "Expense utilization compared against category budget limits."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {language === "id" ? "Akurasi & Rutinitas Pencatatan" : "Recording Consistency (10%)"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === "id" ? "Konsistensi pencatatan transaksi mingguan dan bulanan." : "Consistency of recorded transactions over the last 30 days."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation CTA */}
          <button
            onClick={onConsult}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00685F] hover:bg-[#004D46] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#00685F]/20 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>
              {aiEnabled
                ? (language === "id" ? "Konsultasi Rinci dengan MoneFin AI" : "Chat with MoneFin AI")
                : (language === "id" ? "Aktifkan AI Chatbot untuk Konsultasi" : "Enable AI Chatbot to Consult")}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { aiInsights } from "../../services/ai.service";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  Receipt,
  PieChart,
  Target,
  Coins,
  AlertTriangle,
  ArrowUpRight,
  MessageSquareText,
  ShieldCheck,
  Activity,
  CheckCircle2,
  X,
  ChevronRight
} from "lucide-react";

// Helper: Match tip type to appropriate Lucide Vector Icon & Theme
function getTipTheme(tip) {
  const type = (tip.type || "").toLowerCase();
  const title = (tip.title || "").toLowerCase();
  const body = (tip.body || "").toLowerCase();

  if (type === "budget" || title.includes("budget") || title.includes("anggaran") || body.includes("anggaran")) {
    return {
      icon: <PieChart className="w-4 h-4 text-white" />,
      bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/20",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      hoverBorder: "hover:border-blue-300 hover:bg-blue-50/30",
      defaultAction: "/budgets",
      defaultLabel: "Atur Budget"
    };
  }

  if (type === "goal" || title.includes("goal") || title.includes("target") || title.includes("tujuan") || body.includes("target")) {
    return {
      icon: <Target className="w-4 h-4 text-white" />,
      bg: "bg-gradient-to-br from-purple-500 to-violet-600",
      glow: "shadow-purple-500/20",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      hoverBorder: "hover:border-purple-300 hover:bg-purple-50/30",
      defaultAction: "/goals",
      defaultLabel: "Buat Goals"
    };
  }

  if (type === "saving" || title.includes("tabung") || title.includes("hemat") || title.includes("invest") || body.includes("menabung")) {
    return {
      icon: <Coins className="w-4 h-4 text-white" />,
      bg: "bg-gradient-to-br from-amber-500 to-orange-600",
      glow: "shadow-amber-500/20",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
      hoverBorder: "hover:border-amber-300 hover:bg-amber-50/30",
      defaultAction: "/reports",
      defaultLabel: "Analisis Arus Kas"
    };
  }

  if (type === "alert" || title.includes("awas") || title.includes("bahaya") || title.includes("peringatan") || title.includes("kritis")) {
    return {
      icon: <AlertTriangle className="w-4 h-4 text-white" />,
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
      glow: "shadow-rose-500/20",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      hoverBorder: "hover:border-rose-300 hover:bg-rose-50/30",
      defaultAction: "/transactions",
      defaultLabel: "Periksa Transaksi"
    };
  }

  // Default: Expense / Cashflow tracking
  return {
    icon: <Receipt className="w-4 h-4 text-white" />,
    bg: "bg-gradient-to-br from-[#00685F] to-[#00A896]",
    glow: "shadow-emerald-600/20",
    badgeBg: "bg-teal-50 text-[#00685F] border-teal-100",
    hoverBorder: "hover:border-teal-300 hover:bg-teal-50/30",
    defaultAction: "/transactions",
    defaultLabel: "Catat Transaksi"
  };
}

function ScoreGauge({ score, onShowDetail }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: "#10b981", glow: "rgba(16,185,129,0.3)", label: "text-emerald-600", dot: "bg-emerald-500" };
    if (score >= 60) return { stroke: "#00685F", glow: "rgba(0,104,95,0.3)", label: "text-[#00685F]", dot: "bg-teal-600" };
    if (score >= 40) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "text-amber-600", dot: "bg-amber-500" };
    return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "text-rose-600", dot: "bg-rose-500" };
  };

  const colors = getColor();

  return (
    <div
      onClick={onShowDetail}
      className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 shrink-0 cursor-pointer group select-none"
      title="Klik untuk melihat rincian diagnosa skor"
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        {/* Dynamic Progress Arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${colors.glow})`
          }}

        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${colors.label}`}>{score}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 -mt-0.5 sm:-mt-1 tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

export default function AiInsightsCard() {
  const { user } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aiEnabled = user?.preferences?.ai_enabled ?? false;


  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await aiInsights();
      const insights = res?.data ?? res;
      setData(insights);

      const target = typeof insights?.health_score === "number" ? insights.health_score : 50;
      let current = 0;
      const step = Math.max(target / 30, 1);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        setDisplayScore(Math.round(current));
        if (current >= target) clearInterval(timer);
      }, 30);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [language]);

  const triggerAiChat = (prompt) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-ai-chat", {
          detail: { prompt: prompt || (language === "id" ? "Bagaimana cara meningkatkan skor kesehatan finansial saya?" : "How can I improve my financial health score?") }
        })
      );
    }
  };

  const getStatusBadge = (score, label) => {
    const isEn = language === "en";
    let colorClass = "bg-rose-50 text-rose-700 border-rose-200/80";
    let dotClass = "bg-rose-500";
    let text = label || (isEn ? "Needs Attention" : "Perlu Perhatian");

    if (score >= 80) {
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      dotClass = "bg-emerald-500 animate-pulse";
      text = label || (isEn ? "Excellent" : "Sangat Sehat");
    } else if (score >= 60) {
      colorClass = "bg-teal-50 text-[#00685F] border-teal-200/80";
      dotClass = "bg-teal-600";
      text = label || (isEn ? "Healthy" : "Sehat");
    } else if (score >= 40) {
      colorClass = "bg-amber-50 text-amber-700 border-amber-200/80";
      dotClass = "bg-amber-500";
      text = label || (isEn ? "Fair" : "Cukup");
    }

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold border shadow-xs ${colorClass} shrink-0`}>
        <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${dotClass}`} />
        <span className="whitespace-nowrap">{text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-white rounded-[1.5rem] sm:rounded-[1.75rem] shadow-card border border-slate-100 p-4 sm:p-6 min-h-[310px] animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 sm:w-44 bg-slate-100 rounded-md" />
              <div className="h-3 w-48 sm:w-64 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="h-8 w-28 bg-slate-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200/70 shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 w-28 bg-slate-200/70 rounded" />
                <div className="h-3 w-full bg-slate-200/70 rounded" />
                <div className="h-3 w-3/4 bg-slate-200/70 rounded" />
              </div>
            </div>
            <div className="h-8 w-full bg-slate-200/50 rounded-xl mt-3" />
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 sm:h-44 bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/70" />
                  <div className="h-3.5 w-20 bg-slate-200/70 rounded" />
                  <div className="h-2.5 w-full bg-slate-200/70 rounded" />
                </div>
                <div className="h-3 w-16 bg-slate-200/60 rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (error || !data) {
    return (
      <div className="bg-white rounded-[1.5rem] sm:rounded-[1.75rem] shadow-card border border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-slate-900">
              {language === "id" ? "AI Financial Advisor Belum Aktif" : "AI Financial Advisor Not Active"}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {language === "id"
                ? "Jika ingin menggunakan fitur AI Financial Advisor, silakan nyalakan dan masukkan API key Anda di Pengaturan."
                : "If you want to use the AI Financial Advisor, please enable it and add your API key in Settings."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => router.push("/settings?tab=ai")}
            className="press-scale flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#00685F] hover:bg-[#004D46] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === "id" ? "Nyalakan di Setting" : "Enable in Settings"}</span>
          </button>
          <button
            onClick={fetchInsights}
            title={language === "id" ? "Muat ulang diagnosa" : "Retry loading"}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const score = data.health_score ?? 50;
  const label = data.score_label ?? (score >= 60 ? "Sehat" : "Cukup");
  const summary = data.weekly_summary ?? (language === "id" ? "Kondisi keuangan Anda dalam keadaan stabil. Pertahankan pencatatan rutin!" : "Your financial status is stable. Keep up regular tracking!");
  const tips = data.tips && Array.isArray(data.tips) && data.tips.length > 0 ? data.tips.slice(0, 3) : [
    { type: "expense", title: "Catat Pengeluaran", body: "Mulai catat setiap transaksi harian untuk visibilitas pengeluaran yang maksimal.", action_label: "Catat Transaksi", action_url: "/transactions" },
    { type: "budget", title: "Atur Anggaran", body: "Tetapkan batas pengeluaran kategori bulanan agar arus kas tetap aman.", action_label: "Atur Budget", action_url: "/budgets" },
    { type: "goal", title: "Target Tabungan", body: "Tentukan tujuan finansial untuk memacu motivasi menabung konsisten.", action_label: "Buat Goals", action_url: "/goals" },
  ];
  const positive = data.positive_note;

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/60 rounded-[1.5rem] sm:rounded-[1.75rem] shadow-card border border-slate-100/90 p-4 sm:p-6 min-h-[310px] transition-all duration-300 hover:shadow-lg group">
        {/* Ambient Subtle Background Accents */}

        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 bg-gradient-to-br from-teal-400/10 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-56 h-56 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 sm:pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tight truncate">
                  {language === "id" ? "AI Financial Health & Insights" : "AI Financial Health & Insights"}
                </h2>
                <span className="inline-flex items-center gap-1 bg-slate-100/90 border border-slate-200/60 text-slate-600 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0">
                  <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00685F]" />
                  <span>MoneFin Engine</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug truncate sm:whitespace-normal">
                {language === "id" ? "Diagnosa cerdas & rekomendasi aksi personal berdasarkan arus kas Anda" : "Intelligent diagnosis & actionable recommendations based on your cash flow"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start sm:self-auto shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            {getStatusBadge(score, label)}

            <div className="flex items-center gap-1.5 sm:gap-2">
              {aiEnabled ? (
                <button
                  onClick={() => triggerAiChat()}
                  className="press-scale inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00685F] hover:bg-[#004D46] text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-sm shadow-[#00685F]/20 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>{language === "id" ? "Tanya AI" : "Ask AI"}</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/settings?tab=ai")}
                  className="press-scale inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200/80 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                  title={language === "id" ? "Aktifkan AI Chatbot di Settings" : "Enable AI Chatbot in Settings"}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00685F]" />
                  <span>{language === "id" ? "Aktifkan AI" : "Enable AI"}</span>
                </button>
              )}

              <button
                onClick={fetchInsights}
                title={language === "id" ? "Perbarui analisis AI" : "Refresh AI insights"}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#00685F]" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Left Diagnostic Section + Right Recommendation Cards */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 pt-4 sm:pt-5 items-stretch">
          
          {/* LEFT: Score Gauge & Diagnostic Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-50/90 via-slate-50/50 to-emerald-50/30 rounded-2xl p-3.5 sm:p-5 border border-slate-200/60 shadow-xs">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              <ScoreGauge score={displayScore} onShowDetail={() => setShowDetailModal(true)} />
              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-extrabold text-slate-800">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00685F] shrink-0" />
                    <span className="truncate">{language === "id" ? "Diagnosa Kesehatan" : "Health Diagnosis"}</span>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(true)}
                    className="text-[10px] font-bold text-[#00685F] hover:text-[#004D46] hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {summary}
                </p>
              </div>
            </div>

            {/* Positive Note Badge */}
            {positive && (
              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-200/70 flex items-start gap-2 text-[10px] sm:text-[11px] font-bold text-[#00685F] bg-white/70 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 border border-emerald-100/60">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="line-clamp-2">{positive}</span>
              </div>
            )}
          </div>

          {/* RIGHT: 3 Actionable Recommendations (Zero Emojis, Pure Modern Vector Tiles) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00685F]" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
                  {language === "id" ? "Rekomendasi Cerdas AI" : "AI Actionable Recommendations"}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                {language === "id" ? "3 Langkah Praktis" : "3 Quick Actions"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-1">
              {tips.map((tip, i) => {
                const theme = getTipTheme(tip);
                const actionUrl = tip.action_url || theme.defaultAction;
                const actionLabel = tip.action_label || theme.defaultLabel;

                return (
                  <div
                    key={i}
                    className={`group relative flex flex-col justify-between bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md ${theme.hoverBorder} hover:-translate-y-0.5 transition-all duration-200`}
                  >
                    <div>
                      {/* Icon Tile & Action Arrow */}
                      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${theme.bg} flex items-center justify-center shadow-md ${theme.glow} group-hover:scale-105 transition-transform duration-200`}>
                          {theme.icon}
                        </div>
                        <Link
                          href={actionUrl}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-[#00685F] flex items-center justify-center transition-colors"
                          title={actionLabel}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-extrabold text-slate-800 mb-1 group-hover:text-[#00685F] transition-colors leading-snug">
                        {tip.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mt-1">
                        {tip.body}
                      </p>
                    </div>

                    {/* Bottom Interactive Direct Action Link */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <Link
                        href={actionUrl}
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#00685F] hover:text-[#004D46] hover:underline"
                      >
                        <span>{actionLabel}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Detail Modal: Diagnosa & Breakdown Skor */}
      {showDetailModal && mounted && createPortal(
        <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Clickable Backdrop to close */}
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => setShowDetailModal(false)}
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
                onClick={() => setShowDetailModal(false)}
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
                  {getStatusBadge(score, label)}
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
                onClick={() => {
                  setShowDetailModal(false);
                  if (aiEnabled) {
                    triggerAiChat();
                  } else {
                    router.push("/settings?tab=ai");
                  }
                }}
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
      )}

    </>
  );
}

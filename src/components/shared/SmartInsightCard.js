"use client";

import { useState, useEffect } from "react";
import { Sparkles, Settings2, Lightbulb, TrendingUp, Target, AlertTriangle, PiggyBank, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSmartInsight } from "../../services/smart-insight.service";
import { useLanguage } from "../../context/LanguageContext";

const TYPE_CONFIG = {
  saving:  { icon: PiggyBank,    color: "text-emerald-600", bg: "bg-emerald-50" },
  budget:  { icon: Target,       color: "text-blue-600",    bg: "bg-blue-50" },
  expense: { icon: TrendingUp,   color: "text-orange-600",  bg: "bg-orange-50" },
  goal:    { icon: Target,       color: "text-purple-600",  bg: "bg-purple-50" },
  alert:   { icon: AlertTriangle, color: "text-rose-600",   bg: "bg-rose-50" },
  default: { icon: Lightbulb,    color: "text-[#00685F]",   bg: "bg-teal-50" },
};

/**
 * Reusable Smart Insight Card.
 * Fetches insight for the given page and displays it with dual-mode badge.
 *
 * @param {'dashboard'|'categories'|'budgets'|'accounts'|'goals'} page
 * @param {string} [className] - additional class names for the wrapper
 */
export default function SmartInsightCard({ page, className = "", onActionClick }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [insight, setInsight]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getSmartInsight(page)
      .then((res) => {
        if (!cancelled) {
          setInsight(res?.data ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, language]);

  const cfg = TYPE_CONFIG[insight?.type] ?? TYPE_CONFIG.default;
  const Icon = cfg.icon;
  const isAi = insight?.source === "ai";

  const handleAction = () => {
    if (!insight) return;

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const targetPath = insight.action_url;

    // If target URL points to a different route, navigate there
    if (targetPath && targetPath !== currentPath) {
      router.push(targetPath);
      return;
    }

    // If target URL is the current route (e.g. /budgets while already on /budgets),
    // trigger the local action callback if provided
    if (onActionClick) {
      onActionClick(insight);
      return;
    }

    if (targetPath) {
      router.push(targetPath);
    }
  };

  if (loading) {
    return (
      <div className={`bg-[#00685F] p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-[#00685F]/20 relative overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 opacity-70">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{language === "en" ? "Loading insights..." : "Memuat insight..."}</span>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className={`bg-[#00685F] p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-[#00685F]/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 ${className}`}>
      <div className="relative z-10 flex-1">
        {/* Source Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
            {isAi
              ? <Sparkles className="w-6 h-6 text-white" />
              : <Icon className="w-6 h-6 text-white" />}
          </div>
          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
            isAi
              ? "bg-white/25 border-white/30 text-white"
              : "bg-white/15 border-white/20 text-white/80"
          }`}>
            {isAi ? <Sparkles className="w-2.5 h-2.5" /> : <Settings2 className="w-2.5 h-2.5" />}
            {insight.source_label ?? (isAi ? "AI Insight" : "MoneFin Engine")}
          </span>
        </div>

        <h4 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
          {insight.title}
        </h4>
        <p className="text-white/75 mt-3 text-xs sm:text-sm leading-relaxed font-medium">
          {insight.body}
        </p>
      </div>

      {insight.action_label && (insight.action_url || onActionClick) && (
        <button
          onClick={handleAction}
          className="relative z-10 w-full mt-6 bg-white text-[#00685F] py-3.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-50 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          {insight.action_label}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Decorative */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
    </div>
  );
}

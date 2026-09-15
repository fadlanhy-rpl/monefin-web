"use client";

import Link from "next/link";
import { 
  ArrowUpRight, 
  ChevronRight, 
  PieChart, 
  Target, 
  Coins, 
  AlertTriangle, 
  Receipt 
} from "lucide-react";

export function getTipTheme(tip) {
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

export default function InsightTipItem({ tip }) {
  const theme = getTipTheme(tip);
  const actionUrl = tip.action_url || theme.defaultAction;
  const actionLabel = tip.action_label || theme.defaultLabel;

  return (
    <div
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
}

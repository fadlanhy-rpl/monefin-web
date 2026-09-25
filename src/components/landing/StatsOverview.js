"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Wallet, Sparkles, ScanLine, ShieldCheck } from "lucide-react";

export const StatsOverview = () => {
  const { t } = useLanguage();

  const stats = [
    {
      value: t("stats.efficiency_val") || "Bebas",
      label: t("stats.efficiency"),
      icon: Wallet,
      color: "text-slate-900",
      accent: "bg-slate-100 text-slate-700",
    },
    {
      value: t("stats.managed_val") || "100% Free",
      label: t("stats.managed"),
      icon: Sparkles,
      color: "text-brand-600",
      accent: "bg-brand-50 text-brand-600",
    },
    {
      value: t("stats.accuracy_val") || "< 3 Detik",
      label: t("stats.accuracy"),
      icon: ScanLine,
      color: "text-emerald-600",
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      value: t("stats.free_val") || "2FA & AES",
      label: t("stats.free"),
      icon: ShieldCheck,
      color: "text-teal-600",
      accent: "bg-teal-50 text-teal-700",
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Floating Glassmorphism Island Dock */}
      <div className="bg-white/95 backdrop-blur-2xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100/90 hover:border-slate-200 transition-all duration-200 space-y-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight tabular-nums text-slate-900 truncate">
                    {item.value}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-600 leading-snug line-clamp-2">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

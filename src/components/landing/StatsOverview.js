"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Building2, TrendingUp, Sliders, ShieldCheck } from "lucide-react";

export const StatsOverview = () => {
  const { t } = useLanguage();

  const stats = [
    {
      value: t("stats.efficiency_val") || "Bebas",
      label: t("stats.efficiency"),
      icon: Building2,
      color: "text-slate-900",
      accent: "bg-slate-100 text-slate-700",
    },
    {
      value: "Rp 120M+",
      label: t("stats.managed"),
      icon: TrendingUp,
      color: "text-brand-600",
      accent: "bg-brand-50 text-brand-600",
    },
    {
      value: "50 / 30 / 20",
      label: t("stats.accuracy"),
      icon: Sliders,
      color: "text-emerald-600",
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      value: "100%",
      label: t("stats.free"),
      icon: ShieldCheck,
      color: "text-teal-600",
      accent: "bg-teal-50 text-teal-700",
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Floating Glassmorphism Island Dock */}
      <div className="bg-white/95 backdrop-blur-2xl border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                  idx !== 0 ? "pt-3 sm:pt-0 sm:pl-6" : ""
                } space-y-1.5`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight tabular-nums text-slate-900">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-snug">
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

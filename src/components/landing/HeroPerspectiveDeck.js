"use client";

import { useState } from "react";
import { Sliders, Wallet, Sparkles, Target, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const HeroPerspectiveDeck = () => {
  const { t, language } = useLanguage();
  const [activeCard, setActiveCard] = useState(0);

  const isEn = language === "en";

  const cards = [
    {
      id: "budgeting",
      tag: t("deck.card1_tag"),
      title: t("deck.card1_title"),
      desc: t("deck.card1_desc"),
      icon: Sliders,
      highlight: t("deck.card1_highlight"),
      metric: t("deck.card1_metric"),
      accent: "from-brand-600/20 to-emerald-500/10",
      badgeColor: "bg-brand-50 text-brand-700 border-brand-200",
      preview: (
        <div className="space-y-2 pt-1 text-[11px]">
          <div className="flex justify-between items-center text-slate-700 font-bold">
            <span>{t("deck.card1_needs")}</span>
            <span className="text-brand-700 font-black">Rp 5.000.000 (50%)</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-600 h-full rounded-full" style={{ width: "50%" }} />
          </div>
          <div className="flex justify-between items-center text-slate-700 font-bold">
            <span>{t("deck.card1_savings")}</span>
            <span className="text-emerald-700 font-black">Rp 2.000.000 (20%)</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "20%" }} />
          </div>
        </div>
      ),
    },
    {
      id: "aggregation",
      tag: t("deck.card2_tag"),
      title: t("deck.card2_title"),
      desc: t("deck.card2_desc"),
      icon: Wallet,
      highlight: t("deck.card2_highlight"),
      metric: t("deck.card2_metric"),
      accent: "from-emerald-500/20 to-teal-500/10",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      preview: (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <img src="/images/providers/bca.svg" alt="BCA" className="h-3 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 truncate">{t("deck.card2_bca")}</p>
              <p className="text-[11px] font-black text-slate-900">28.5 Jt</p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <img src="/images/providers/mandiri.svg" alt="Mandiri" className="h-3 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 truncate">{t("deck.card2_mandiri")}</p>
              <p className="text-[11px] font-black text-slate-900">16.0 Jt</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ai",
      tag: t("deck.card3_tag"),
      title: t("deck.card3_title"),
      desc: t("deck.card3_desc"),
      icon: Sparkles,
      highlight: t("deck.card3_highlight"),
      metric: t("deck.card3_metric"),
      accent: "from-amber-500/20 to-emerald-500/10",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      preview: (
        <div className="p-2 rounded-xl bg-[#091A17] text-white space-y-1 text-[11px] border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {t("deck.card3_coffee_insight")}
            </span>
            <span className="text-[9px] text-slate-400">{t("deck.card3_today")}</span>
          </div>
          <p className="text-slate-300 text-[10px] leading-tight">
            {t("deck.card3_coffee_desc")}
          </p>
        </div>
      ),
    },
    {
      id: "goals",
      tag: t("deck.card4_tag"),
      title: t("deck.card4_title"),
      desc: t("deck.card4_desc"),
      icon: Target,
      highlight: t("deck.card4_highlight"),
      metric: t("deck.card4_metric"),
      accent: "from-teal-500/20 to-brand-600/10",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      preview: (
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex justify-between items-center font-bold">
            <span className="text-slate-800">{t("deck.card4_goal_title")}</span>
            <span className="text-brand-600">{isEn ? "Rp 48M / 120M" : "Rp 48 Jt / 120 Jt"}</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full" style={{ width: "40%" }} />
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t("deck.card4_goal_progress")}
          </p>
        </div>
      ),
    },
  ];

  // Desktop 3D rotation angles for Aeline-style curved fan
  const getCardTransform = (idx) => {
    const isSelected = activeCard === idx;
    if (isSelected) {
      return "lg:scale-105 lg:-translate-y-4 lg:z-30 lg:shadow-2xl lg:shadow-brand-900/15 lg:border-brand-500";
    }
    switch (idx) {
      case 0:
        return "lg:-rotate-6 lg:translate-y-2 lg:hover:rotate-0 lg:hover:-translate-y-2 lg:z-10";
      case 1:
        return "lg:-rotate-2 lg:-translate-y-1 lg:hover:rotate-0 lg:hover:-translate-y-3 lg:z-20";
      case 2:
        return "lg:rotate-2 lg:-translate-y-1 lg:hover:rotate-0 lg:hover:-translate-y-3 lg:z-20";
      case 3:
        return "lg:rotate-6 lg:translate-y-2 lg:hover:rotate-0 lg:hover:-translate-y-2 lg:z-10";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-20">
      {/* Mini Section Label */}
      <div className="text-center mb-6 sm:mb-8 space-y-1">
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
          {t("deck.section_title")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {t("deck.section_subtitle")}
        </p>
      </div>

      {/* 3D Perspective Curved Cards Fan Array */}
      <div className="perspective-1200 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch transform-style-3d">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isSelected = activeCard === idx;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(idx)}
                className={`group relative bg-white/95 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg shadow-slate-900/5 ${getCardTransform(
                  idx
                )} ${
                  isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/20"
                    : "border-slate-200/90 hover:border-brand-300 hover:shadow-xl"
                }`}
              >
                {/* Subtle Gradient Glow inside Card */}
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${card.accent} blur-2xl pointer-events-none transition-opacity duration-300 ${
                    isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-80"
                  }`}
                />

                <div className="space-y-3 relative z-10">
                  {/* Top Row: Tag Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${card.badgeColor}`}
                    >
                      {card.tag}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : "bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-brand-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                      {card.desc}
                    </p>
                  </div>

                  {/* Interactive Micro Preview Box */}
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                    {card.preview}
                  </div>
                </div>

                {/* Bottom Row: Key Metric */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {card.highlight}
                    </p>
                    <p className="font-black text-slate-900 text-xs sm:text-sm tabular-nums">
                      {card.metric}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-brand-600 text-white translate-x-0.5"
                        : "bg-slate-100 text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50"
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

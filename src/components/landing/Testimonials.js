"use client";

import { Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: "Rian Prasetya", role: "Software Engineer", avatar: "RP", quote: t("testimonials.t1_quote"), metric: t("testimonials.t1_metric") },
    { name: "Siti Rahmawati", role: "Freelance Designer", avatar: "SR", quote: t("testimonials.t2_quote"), metric: t("testimonials.t2_metric") },
    { name: "Budi Santoso", role: "Coffee Shop Owner", avatar: "BS", quote: t("testimonials.t3_quote"), metric: t("testimonials.t3_metric") },
    { name: "Amanda Lestari", role: "Final Year Student", avatar: "AL", quote: t("testimonials.t4_quote"), metric: t("testimonials.t4_metric") },
    { name: "Fajar Nugraha", role: "Product Manager", avatar: "FN", quote: t("testimonials.t5_quote"), metric: t("testimonials.t5_metric") },
  ];

  return (
    <section id="testimonials" className="relative z-10 py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#e8f4f2]/60 to-[#f4faf9] border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 text-[11px] font-bold uppercase tracking-wider">
          <span>{t("testimonials.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          {t("testimonials.title")}
        </h2>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="marquee-mask relative w-full overflow-hidden py-3">
        <div className="animate-marquee flex gap-4 sm:gap-6">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="w-[280px] sm:w-96 shrink-0 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  {item.metric && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-bold shrink-0 whitespace-nowrap">
                      {item.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-400 pt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


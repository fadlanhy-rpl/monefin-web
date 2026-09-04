"use client";

import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Faq = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section id="faq" className="relative z-10 py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f4faf9] via-[#e6f3f0]/30 to-white border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 text-[11px] font-bold uppercase tracking-wider">
            <span>{t("faq.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("faq.title")}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-brand-300 shadow-md shadow-brand-900/5"
                    : "border-slate-200/90 hover:border-slate-300 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full min-h-[52px] p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm md:text-base flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-brand-50 text-brand-600 border border-brand-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


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
    <section id="faq" className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-[#f4faf9] via-[#e6f3f0]/30 to-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{t("faq.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            {t("faq.title")}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="catalis-card bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-xl sm:rounded-3xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-6 text-left font-extrabold text-slate-900 text-xs sm:text-base flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180 bg-brand-50 text-brand-600" : "text-slate-500"}`}>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 text-[11px] sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

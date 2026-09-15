"use client";

import React from "react";

export default function WizardProgressBar({ step, setStep, t }) {
  const steps = [
    { num: 1, label: t("split_bill.step_info", "Info Tagihan") },
    { num: 2, label: t("split_bill.step_participants", "Partisipan") },
    { num: 3, label: t("split_bill.step_calculation", "Kalkulasi") },
    { num: 4, label: t("split_bill.step_confirmation", "Konfirmasi") },
  ];

  return (
    <div className="grid grid-cols-4 border-b border-slate-100 text-center text-xs font-black">
      {steps.map((s) => (
        <button
          key={s.num}
          type="button"
          onClick={() => setStep(s.num)}
          className={`py-2.5 transition-all border-b-2 cursor-pointer ${
            step === s.num
              ? "border-[#00685F] text-[#00685F] bg-emerald-50/50"
              : step > s.num
              ? "border-emerald-400 text-emerald-700 bg-white"
              : "border-transparent text-slate-400"
          }`}
        >
          {s.num}. {s.label}
        </button>
      ))}
    </div>
  );
}

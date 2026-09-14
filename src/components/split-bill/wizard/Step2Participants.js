"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Step2Participants({
  participants,
  setParticipants,
  addParticipant,
  removeParticipant,
  t,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            {t("split_bill.step_participants", "Daftar Teman / Partisipan")}
          </h4>
          <p className="text-xs text-slate-400">
            {t("split_bill.participants_subtitle", "Siapa saja yang ikut patungan pada tagihan ini?")}
          </p>
        </div>
        <button
          type="button"
          onClick={addParticipant}
          className="px-3.5 py-1.5 bg-[#00685F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00554E] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("split_bill.add_friend", "Tambah Teman")}</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {participants.map((p, idx) => (
          <div 
            key={p.temp_id || idx}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              p.is_creator ? "bg-emerald-50/70 border-emerald-200" : "bg-slate-50/70 border-slate-200"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-[#00685F] shrink-0">
              {idx + 1}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={p.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setParticipants(participants.map((item, i) => i === idx ? { ...item, name: val } : item));
                }}
                placeholder={
                  p.is_creator 
                    ? t("split_bill.placeholder_creator_name", "Nama Anda (Penanggung / Talangi)")
                    : t("split_bill.placeholder_friend_name", "Nama Teman {idx}").replace("{idx}", idx + 1)
                }
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
              />

              <input
                type="text"
                value={p.phone_number}
                onChange={(e) => {
                  const val = e.target.value;
                  setParticipants(participants.map((item, i) => i === idx ? { ...item, phone_number: val } : item));
                }}
                placeholder={t("split_bill.placeholder_wa", "No WhatsApp (0812...)")}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none"
              />
            </div>

            {!p.is_creator && (
              <button
                type="button"
                onClick={() => removeParticipant(idx)}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                title={t("split_bill.delete_confirm", "Hapus")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

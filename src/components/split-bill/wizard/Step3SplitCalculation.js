"use client";

import React from "react";
import { 
  Users, 
  Utensils, 
  Percent, 
  DollarSign, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle 
} from "lucide-react";

export default function Step3SplitCalculation({
  splitMode,
  setSplitMode,
  participants,
  setParticipants,
  items,
  setItems,
  calcPreview,
  computedTotal,
  exactAllocated,
  exactRemaining,
  totalPercentageSum,
  handleSplitEqualExact,
  handleAssignRestToMe,
  handleSplitEqualPercentage,
  addItem,
  removeItem,
  toggleItemParticipant,
  formatCurrency,
  language,
  t,
}) {
  return (
    <div className="space-y-5">
      {/* Split Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
          {t("split_bill.choose_split_mode", "Pilih Metode Pembagian")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: "equal", label: t("split_bill.equal_split", "Bagi Rata"), icon: Users, desc: t("split_bill.equal_desc", "Rata semua orang") },
            { key: "itemized", label: t("split_bill.itemized_split", "Per Menu"), icon: Utensils, desc: t("split_bill.itemized_desc", "Pajak proporsional") },
            { key: "percentage", label: t("split_bill.percentage_split", "Persentase"), icon: Percent, desc: t("split_bill.percentage_desc", "Beban % per orang") },
            { key: "exact", label: t("split_bill.exact_split", "Nominal Pasti"), icon: DollarSign, desc: t("split_bill.exact_desc", "Input manual pas") },
          ].map((m) => {
            const IconComp = m.icon;
            const isSel = splitMode === m.key;

            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setSplitMode(m.key)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSel
                    ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <IconComp className={`w-4 h-4 mb-1.5 ${isSel ? "text-[#00685F]" : "text-slate-500"}`} />
                <h4 className="text-xs font-black text-slate-800">{m.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. EXACT AMOUNT INPUT MODE */}
      {splitMode === "exact" && (
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {t("split_bill.exact_input_title", "Tentukan Nominal Pasti Tiap Orang")}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t("split_bill.exact_helper_allocated", "Teralokasi: {allocated} / {total}")
                  .replace("{allocated}", formatCurrency(exactAllocated))
                  .replace("{total}", formatCurrency(computedTotal))}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSplitEqualExact}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                {t("split_bill.btn_split_equal_amount", "Bagi Rata")}
              </button>
              <button
                type="button"
                onClick={handleAssignRestToMe}
                className="px-2.5 py-1 bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 cursor-pointer shadow-2xs"
              >
                {t("split_bill.btn_assign_rest_to_me", "Alokasikan sisa ke saya")}
              </button>
            </div>
          </div>

          {/* Allocation Status Alert */}
          <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
            Math.abs(exactRemaining) < 1 
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-100 text-amber-900 border border-amber-200"
          }`}>
            <div className="flex items-center gap-1.5">
              {Math.abs(exactRemaining) < 1 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>
                {Math.abs(exactRemaining) < 1 
                  ? (language === "en" ? "100% Fully Allocated" : "Alokasi Pas 100%") 
                  : t("split_bill.exact_helper_remaining", "Sisa: {remaining}").replace("{remaining}", formatCurrency(exactRemaining))}
              </span>
            </div>
            <span className="font-mono">
              {formatCurrency(exactAllocated)} / {formatCurrency(computedTotal)}
            </span>
          </div>

          {/* Participant Inputs */}
          <div className="space-y-2 pt-1">
            {participants.map((p, idx) => (
              <div 
                key={p.temp_id || idx}
                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate">
                    {p.name || `${language === "en" ? "Friend" : "Teman"} ${idx + 1}`}
                    {p.is_creator && <span className="text-[10px] text-[#00685F] ml-1">({t("split_bill.my_share_tag", "Saya")})</span>}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 w-40 sm:w-48">
                  <span className="text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={p.amount_owed || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setParticipants(participants.map((item, i) => i === idx ? { ...item, amount_owed: val } : item));
                    }}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-right text-slate-900 focus:bg-white focus:border-[#00685F] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PERCENTAGE INPUT MODE */}
      {splitMode === "percentage" && (
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {t("split_bill.percentage_input_title", "Tentukan Persentase Beban Tiap Orang")}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t("split_bill.total_percentage", "Total Persentase: {pct}%").replace("{pct}", totalPercentageSum)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSplitEqualPercentage}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              {t("split_bill.btn_split_equal_pct", "Bagi Rata %")}
            </button>
          </div>

          {/* Percentage Status Alert */}
          <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
            Math.abs(totalPercentageSum - 100) < 0.1 
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-amber-100 text-amber-900 border border-amber-200"
          }`}>
            <div className="flex items-center gap-1.5">
              {Math.abs(totalPercentageSum - 100) < 0.1 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>
                {Math.abs(totalPercentageSum - 100) < 0.1 
                  ? (language === "en" ? "100% Exactly" : "100% Pas") 
                  : t("split_bill.percentage_warning", "Total persentase harus 100%")}
              </span>
            </div>
            <span className="font-mono">{totalPercentageSum}% / 100%</span>
          </div>

          {/* Participant Percentage Inputs */}
          <div className="space-y-2 pt-1">
            {participants.map((p, idx) => {
              const shareRp = Math.round(computedTotal * ((parseFloat(p.percentage) || 0) / 100));

              return (
                <div 
                  key={p.temp_id || idx}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">
                      {p.name || `${language === "en" ? "Friend" : "Teman"} ${idx + 1}`}
                      {p.is_creator && <span className="text-[10px] text-[#00685F] ml-1">({t("split_bill.my_share_tag", "Saya")})</span>}
                    </p>
                    <p className="text-[11px] font-extrabold text-[#00685F]">
                      ≈ {formatCurrency(shareRp)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 w-24 sm:w-28">
                    <input
                      type="number"
                      value={p.percentage || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setParticipants(participants.map((item, i) => i === idx ? { ...item, percentage: val } : item));
                      }}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black text-right text-slate-900 focus:bg-white focus:border-[#00685F] outline-none"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ITEMIZED MENU INPUT MODE */}
      {splitMode === "itemized" && (
        <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {t("split_bill.menu_items_title", "Daftar Menu / Pesanan")}
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#00685F] hover:bg-emerald-50 flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("split_bill.add_menu_item", "Tambah Menu")}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => setItems(items.map(it => it.id === item.id ? { ...it, name: e.target.value } : it))}
                    placeholder={t("split_bill.placeholder_menu_name", "Nama Menu (misal: Nasi Goreng)")}
                    className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => setItems(items.map(it => it.id === item.id ? { ...it, price: e.target.value } : it))}
                    placeholder="Price"
                    className="w-24 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => setItems(items.map(it => it.id === item.id ? { ...it, quantity: e.target.value } : it))}
                    placeholder="Qty"
                    className="w-12 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-center outline-none"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Assign Participants Checkbox Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">
                    {t("split_bill.ordered_by", "Dipesan oleh:")}
                  </span>
                  {participants.map((p) => {
                    const pId = p.temp_id || p.name;
                    const isChecked = item.participant_ids.includes(pId);

                    return (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => toggleItemParticipant(item.id, pId)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          isChecked
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs"
                            : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200"
                        }`}
                      >
                        {isChecked ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                        <span>{p.name || (language === "en" ? "Friend" : "Teman")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CALCULATION PREVIEW CARDS (For Equal / Itemized) */}
      {(splitMode === "equal" || splitMode === "itemized") && calcPreview && (
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            {t("split_bill.auto_split_result", "Hasil Pembagian Otomatis:")}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {calcPreview.participants.map((p, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  p.is_creator ? "bg-emerald-50/80 border-emerald-200" : "bg-white border-slate-200"
                }`}
              >
                <div>
                  <p className="text-xs font-black text-slate-800">
                    {p.name} {p.is_creator && <span className="text-[10px] text-[#00685F]">({language === "en" ? "Me" : "Saya"})</span>}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {p.phone_number || (language === "en" ? "No phone" : "Tanpa nomor")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#00685F]">
                    {formatCurrency(p.amount_owed)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

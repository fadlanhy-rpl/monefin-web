"use client";

import React from "react";
import { Percent } from "lucide-react";
import DatePicker from "../../ui/DatePicker";
import CustomSelect from "../../ui/CustomSelect";

export default function Step1BillDetails({
  title,
  setTitle,
  billDate,
  setBillDate,
  subtotal,
  setSubtotal,
  taxPercent,
  setTaxPercent,
  servicePercent,
  setServicePercent,
  discountAmount,
  setDiscountAmount,
  roundingMode,
  setRoundingMode,
  roundingOptions,
  computedTotal,
  participantsCount,
  formatCurrency,
  t,
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
          {t("split_bill.field_title", "Nama Acara / Tagihan *")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("split_bill.placeholder_title", "Misal: Makan Malam Seafood, Liburan Puncak, Kado Ultah")}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
            {t("split_bill.field_date", "Tanggal Tagihan")}
          </label>
          <DatePicker
            value={billDate}
            onChange={setBillDate}
            placeholder={t("split_bill.field_date", "Tanggal Tagihan")}
          />
        </div>

        {/* Subtotal */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
            {t("split_bill.field_subtotal", "Subtotal Tagihan (Rp)")}
          </label>
          <input
            type="number"
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Tax & Service & Discount Controls */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{t("split_bill.section_tax_service", "Pajak (PPN/PB1), Service & Diskon")}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">
              {t("split_bill.field_tax_pct", "Pajak / PB1 (%)")}
            </label>
            <input
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="10"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">
              {t("split_bill.field_service_pct", "Service Charge (%)")}
            </label>
            <input
              type="number"
              value={servicePercent}
              onChange={(e) => setServicePercent(e.target.value)}
              placeholder="5"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-500">
              {t("split_bill.field_discount", "Diskon Potongan (Rp)")}
            </label>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:border-[#00685F] outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Rounding Mode Custom Dropdown */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/60">
          <span className="text-xs font-bold text-slate-700">
            {t("split_bill.field_rounding", "Opsi Pembulatan:")}
          </span>
          <div className="w-full sm:w-60">
            <CustomSelect
              value={roundingMode}
              onChange={setRoundingMode}
              options={roundingOptions}
            />
          </div>
        </div>
      </div>

      {/* Total Summary Box */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-extrabold uppercase text-slate-500">
            {t("split_bill.final_total_bill", "Total Akhir Tagihan:")}
          </span>
          <h3 className="text-xl font-black text-[#00685F]">
            {formatCurrency(computedTotal)}
          </h3>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
          {t("split_bill.count_participants", "{count} Partisipan").replace("{count}", participantsCount)}
        </span>
      </div>
    </div>
  );
}

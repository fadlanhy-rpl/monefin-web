"use client";

import { Search, X, Filter } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SplitBillFilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  modeFilter,
  setModeFilter,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("split_bill.search_placeholder", "Cari nama acara, teman, atau catatan tagihan...")}
            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl shrink-0 overflow-x-auto">
          {[
            { key: "all", label: t("split_bill.filter_all", "Semua") },
            { key: "active", label: t("split_bill.filter_active", "Menunggu") },
            { key: "settled", label: t("split_bill.filter_settled", "Selesai") },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-white text-[#00685F] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Filter: Mode Chips */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3" />
          <span>{t("split_bill.filter_all_modes", "Mode:")}</span>
        </span>

        {[
          { key: "all", label: t("split_bill.filter_all_modes", "Semua Mode") },
          { key: "equal", label: t("split_bill.equal_split", "Bagi Rata") },
          { key: "itemized", label: t("split_bill.itemized_split", "Per Menu") },
          { key: "percentage", label: t("split_bill.percentage_split", "Persentase") },
          { key: "exact", label: t("split_bill.exact_split", "Nominal Pasti") },
        ].map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setModeFilter(m.key)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              modeFilter === m.key
                ? "bg-[#00685F] text-white border-[#00685F] shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

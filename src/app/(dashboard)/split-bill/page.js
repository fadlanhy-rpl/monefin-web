"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import SplitBillWizardModal from "../../../components/split-bill/SplitBillWizardModal";
import SplitBillDetailModal from "../../../components/split-bill/SplitBillDetailModal";
import SplitBillSummaryCards from "../../../components/split-bill/SplitBillSummaryCards";
import SplitBillFilterBar from "../../../components/split-bill/SplitBillFilterBar";
import SplitBillCardItem from "../../../components/split-bill/SplitBillCardItem";
import { useSplitBillPage } from "../../../components/split-bill/hooks/useSplitBillPage";
import { 
  Receipt, 
  Plus, 
  Sparkles,
  Zap 
} from "lucide-react";

export default function SplitBillPage() {
  const {
    t,
    language,
    filteredBills,
    summary,
    isLoading,
    statusFilter,
    setStatusFilter,
    modeFilter,
    setModeFilter,
    search,
    setSearch,
    resetFilters,
    isWizardOpen,
    setIsWizardOpen,
    selectedBillId,
    setSelectedBillId,
    isDetailOpen,
    setIsDetailOpen,
    loadData,
    handleDelete,
    handleShareWA,
  } = useSplitBillPage();

  return (
    <DashboardLayout>
      <div className="relative space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-12 left-10 w-96 h-96 bg-[#00685F]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-64 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO BANNER */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#004D46] via-[#00685F] to-[#008F80] text-white shadow-xl shadow-[#00685F]/20 overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-32 h-32 bg-teal-300/15 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-extrabold tracking-wide uppercase text-emerald-200 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{t("split_bill.quick_summary_badge", "MoneFin Smart Split")}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {t("split_bill.hero_card_title", "Sistem Patungan & Bagi Tagihan Cerdas")}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                {t("split_bill.hero_card_desc", "Kelola tagihan patungan dengan perhitungan pajak proporsional, status pelunasan instan, dan notifikasi WhatsApp.")}
              </p>

              {/* Status Tip Banner */}
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-200">
                <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {(summary?.total_active || 0) === 0
                    ? t("split_bill.status_all_settled_tip", "Semua teman sudah melunasi bagiannya!")
                    : t("split_bill.status_pending_tip", "Ada {count} tagihan menunggu pembayaran teman.").replace("{count}", summary?.total_active || 0)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-emerald-50 text-[#00685F] rounded-2xl shadow-lg shadow-black/15 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-5 h-5 text-[#00685F]" />
                <span>{t("split_bill.create_new", "Buat Split Bill Baru")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <SplitBillSummaryCards
          summary={summary}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* SEARCH & FILTER BAR */}
        <SplitBillFilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          modeFilter={modeFilter}
          setModeFilter={setModeFilter}
        />

        {/* LIST OF BILLS GRID */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <span className="w-10 h-10 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-bold">
              {language === "en" ? "Loading your shared bills..." : "Memuat data split bill..."}
            </p>
          </div>
        ) : filteredBills.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center mx-auto">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                {language === "en" ? "No Split Bills Found" : "Belum Ada Tagihan"}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {search || statusFilter !== "all" || modeFilter !== "all"
                  ? (language === "en" ? "No bills match your current search / filter criteria." : "Tidak ada tagihan yang cocok dengan filter pencarian.")
                  : (language === "en" ? "Create your first bill split to easily track dining, trips, or group expenses." : "Buat tagihan patungan pertama Anda untuk memudahkan hitung makan bareng atau liburan.")}
              </p>
            </div>
            {(search || statusFilter !== "all" || modeFilter !== "all") ? (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {language === "en" ? "Reset Filters" : "Reset Filter"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-black shadow-md shadow-[#00685F]/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t("split_bill.create_new", "Buat Split Bill Sekarang")}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBills.map((bill) => (
              <SplitBillCardItem
                key={bill.id}
                bill={bill}
                onSelect={() => {
                  setSelectedBillId(bill.id);
                  setIsDetailOpen(true);
                }}
                onDelete={handleDelete}
                onShareWA={handleShareWA}
              />
            ))}
          </div>
        )}

        {/* WIZARD MODAL */}
        <SplitBillWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSuccess={() => loadData()}
        />

        {/* DETAIL MODAL */}
        <SplitBillDetailModal
          billId={selectedBillId}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedBillId(null);
          }}
          onUpdated={() => loadData()}
        />
      </div>
    </DashboardLayout>
  );
}

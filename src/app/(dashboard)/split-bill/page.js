"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SplitBillWizardModal from "../../../components/split-bill/SplitBillWizardModal";
import SplitBillDetailModal from "../../../components/split-bill/SplitBillDetailModal";
import { getSplitBills, deleteSplitBill, getWhatsAppShareText } from "../../../services/split-bill.service";
import { 
  Receipt, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Users, 
  Send, 
  Trash2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";

export default function SplitBillPage() {
  const { t } = useLanguage();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, settled
  const [search, setSearch] = useState("");

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getSplitBills({
        status: statusFilter,
        search: search.trim() || undefined,
      });
      setBills(res.data || []);
      setSummary(res.summary || null);
    } catch (err) {
      console.error("Failed to load split bills:", err);
      toast.error("Gagal memuat daftar pembagian tagihan.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus pembagian tagihan "${title}"?`)) return;
    try {
      await deleteSplitBill(id);
      toast.success("Tagihan berhasil dihapus.");
      loadData();
    } catch (err) {
      toast.error("Gagal menghapus tagihan.");
    }
  };

  const handleShareWA = async (e, billId) => {
    e.stopPropagation();
    try {
      const res = await getWhatsAppShareText(billId);
      const { text, whatsapp_url } = res.data;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success("Teks tagihan disalin! Membuka WhatsApp...");
      }
      window.open(whatsapp_url, "_blank");
    } catch (err) {
      toast.error("Gagal memuat link WhatsApp.");
    }
  };

  return (
    <DashboardLayout>
      <div className="relative space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 overflow-hidden">
        
        {/* Ambient background glows */}
        <div className="absolute -top-10 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* TOP HEADER */}
        <div className="pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#00685F]">
                <Receipt className="w-4 h-4" />
                <span>{t("split_bill.page_subtitle", "PEMBAGIAN TAGIHAN & PELUNASAN")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {t("split_bill.page_title", "Smart Split Bill")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
                {t("split_bill.page_desc", "Bagi tagihan makan bersama, liburan, dan patungan dengan perhitungan proporsional pajak & service secara otomatis.")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="self-start sm:self-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-[#00A896] hover:from-emerald-700 hover:to-[#008f80] text-white rounded-2xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center gap-2 text-xs sm:text-sm font-black cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t("split_bill.create_new", "Buat Split Bill")}</span>
            </button>
          </div>
        </div>

        {/* HERO METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Active Bills */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {t("split_bill.total_active_bills", "Tagihan Aktif")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {summary?.total_active || 0}
              </h3>
            </div>
          </div>

          {/* Pending Collection */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {t("split_bill.total_owed_to_me", "Perlu Ditagih (Piutang)")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-orange-600 mt-0.5 truncate">
                Rp {(summary?.total_owed_to_me || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Settled Bills */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {t("split_bill.total_settled_bills", "Tagihan Selesai")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
                {summary?.total_settled || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER TABS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/50 self-start">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t("split_bill.all_bills", "Semua")} ({summary?.total_bills || 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                statusFilter === "active"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t("split_bill.active_bills", "Aktif / Menunggu")} ({summary?.total_active || 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("settled")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                statusFilter === "settled"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t("split_bill.settled_bills", "Selesai")} ({summary?.total_settled || 0})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("split_bill.search_placeholder", "Cari nama tagihan atau teman...")}
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-[#00685F] outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* BILLS LIST / GRID */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <span className="w-9 h-9 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-bold">Memuat data pembagian tagihan...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4 shadow-sm animate-badge-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00685F] flex items-center justify-center mx-auto shadow-xs">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                {t("split_bill.no_bills", "Belum ada pembagian tagihan.")}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {t("split_bill.no_bills_desc", "Mulai bagi pengeluaran bersama dengan menekan tombol di bawah!")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              + {t("split_bill.create_first", "Buat Tagihan Pertama")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => {
              const participants = bill.participants || [];
              const paidCount = participants.filter(p => p.status === "paid").length;
              const totalCount = participants.length;
              const percentPaid = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
              const isSettled = bill.status === "settled";
              const myParticipant = participants.find(p => p.is_creator);

              return (
                <div
                  key={bill.id}
                  onClick={() => {
                    setSelectedBillId(bill.id);
                    setIsDetailOpen(true);
                  }}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Title, Date, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {bill.split_mode === "equal" ? t("split_bill.equal_split", "Bagi Rata") :
                             bill.split_mode === "itemized" ? t("split_bill.itemized_split", "Per Menu") :
                             bill.split_mode === "percentage" ? t("split_bill.percentage_split", "Persentase") : t("split_bill.exact_split", "Nominal Pasti")}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {bill.bill_date}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate group-hover:text-[#00685F] transition-colors">
                          {bill.title}
                        </h3>
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shrink-0 ${
                        isSettled ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {isSettled ? t("split_bill.status_settled_badge", "✓ Selesai") : t("split_bill.status_pending_badge", "⏳ Menunggu")}
                      </span>
                    </div>

                    {/* Financial Amounts */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {t("split_bill.total_bill", "Total Tagihan")}
                        </span>
                        <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                          Rp {bill.total_amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {t("split_bill.my_share", "Bagian Saya")}
                        </span>
                        <p className="text-sm sm:text-base font-black text-[#00685F] mt-0.5">
                          Rp {(myParticipant?.amount_owed || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar of Settlements */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t("split_bill.progress", "Progres Pelunasan")} ({paidCount}/{totalCount})</span>
                        </span>
                        <span className="font-mono">{percentPaid}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSettled ? "bg-emerald-500" : "bg-[#00685F]"
                          }`}
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleShareWA(e, bill.id)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Salin & Buka WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share WA</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(bill.id, bill.title);
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                        title="Hapus Tagihan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="p-2 text-slate-400 group-hover:text-[#00685F] group-hover:translate-x-0.5 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODALS */}
      <SplitBillWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => loadData()}
      />

      <SplitBillDetailModal
        billId={selectedBillId}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBillId(null);
        }}
        onUpdated={() => loadData()}
      />
    </DashboardLayout>
  );
}

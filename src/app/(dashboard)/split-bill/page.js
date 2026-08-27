"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  DollarSign,
  Utensils,
  Percent,
  Layers,
  Share2,
  Check,
  TrendingUp,
  CreditCard,
  Flame,
  Zap,
  Info
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import toast from "react-hot-toast";

export default function SplitBillPage() {
  const { t, language } = useLanguage();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, settled
  const [modeFilter, setModeFilter] = useState("all"); // all, equal, itemized, percentage, exact
  const [search, setSearch] = useState("");

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getSplitBills({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setBills(res.data || []);
      setSummary(res.summary || null);
    } catch (err) {
      console.error("Failed to load split bills:", err);
      toast.error(language === "en" ? "Failed to load split bills." : "Gagal memuat daftar pembagian tagihan.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    if (!window.confirm(language === "en" ? `Delete split bill "${title}"?` : `Hapus pembagian tagihan "${title}"?`)) return;
    try {
      await deleteSplitBill(id);
      toast.success(language === "en" ? "Bill deleted successfully." : "Tagihan berhasil dihapus.");
      loadData();
    } catch (err) {
      toast.error(language === "en" ? "Failed to delete bill." : "Gagal menghapus tagihan.");
    }
  };

  const handleShareWA = async (e, billId) => {
    e.stopPropagation();
    try {
      const res = await getWhatsAppShareText(billId);
      const { text, whatsapp_url } = res.data;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success(language === "en" ? "Bill text copied! Opening WhatsApp..." : "Teks tagihan disalin! Membuka WhatsApp...");
      }
      window.open(whatsapp_url, "_blank");
    } catch (err) {
      toast.error(language === "en" ? "Failed to generate WhatsApp link." : "Gagal memuat link WhatsApp.");
    }
  };

  // Filter bills by split mode
  const filteredBills = useMemo(() => {
    if (modeFilter === "all") return bills;
    return bills.filter(b => b.split_mode === modeFilter);
  }, [bills, modeFilter]);

  // Split mode helper
  const getModeBadge = (mode) => {
    switch (mode) {
      case "itemized":
        return {
          label: t("split_bill.itemized_split", "Per Menu"),
          icon: Utensils,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "percentage":
        return {
          label: t("split_bill.percentage_split", "Persentase"),
          icon: Percent,
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "exact":
        return {
          label: t("split_bill.exact_split", "Nominal Pasti"),
          icon: DollarSign,
          color: "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "equal":
      default:
        return {
          label: t("split_bill.equal_split", "Bagi Rata"),
          icon: Users,
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="relative space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16 overflow-hidden">
        
        {/* Ambient background glows */}
        <div className="absolute -top-12 left-10 w-96 h-96 bg-[#00685F]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-64 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO BANNER */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#004D46] via-[#00685F] to-[#008F80] text-white shadow-xl shadow-[#00685F]/20 overflow-hidden">
          {/* Subtle Decorative Pattern Circles */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Active Bills Card */}
          <div 
            onClick={() => setStatusFilter("active")}
            className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === "active" 
                ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20" 
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                {t("split_bill.total_active_bills", "Tagihan Aktif")}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {summary?.total_active || 0}
              </h3>
              <span className="text-xs font-bold text-amber-600">
                {language === "en" ? "Pending Settlement" : "Menunggu Pelunasan"}
              </span>
            </div>
          </div>

          {/* Pending Collection Card */}
          <div 
            onClick={() => setStatusFilter("active")}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                {t("split_bill.total_owed_to_me", "Perlu Ditagih (Piutang)")}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-orange-600 truncate">
                Rp {(summary?.total_owed_to_me || 0).toLocaleString()}
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                {language === "en" ? "Owed by friends" : "Uang Anda ditalangi ke teman"}
              </span>
            </div>
          </div>

          {/* Settled Bills Card */}
          <div 
            onClick={() => setStatusFilter("settled")}
            className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === "settled" 
                ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20" 
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                {t("split_bill.total_settled_bills", "Tagihan Selesai")}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700">
                {summary?.total_settled || 0}
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                {language === "en" ? "100% Settled" : "Lunas Semua"}
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("split_bill.search_placeholder", "Cari nama acara, teman, atau catatan tagihan...")}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm font-bold focus:bg-white focus:border-[#00685F] outline-none transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl shrink-0 overflow-x-auto">
              {[
                { key: "all", label: t("split_bill.filter_all", "Semua") },
                { key: "active", label: t("split_bill.filter_active", "Menunggu") },
                { key: "settled", label: t("split_bill.filter_settled", "Selesai") },
              ].map(tab => (
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
            ].map(m => (
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

        {/* BILLS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-20 h-5 bg-slate-200 rounded-full" />
                  <div className="w-16 h-5 bg-slate-200 rounded-full" />
                </div>
                <div className="w-3/4 h-6 bg-slate-200 rounded-xl" />
                <div className="w-1/2 h-4 bg-slate-200 rounded-lg" />
                <div className="w-full h-2 bg-slate-100 rounded-full" />
                <div className="pt-2 flex justify-between">
                  <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                  <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBills.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-100 shadow-sm text-center space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-50 text-[#00685F] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Receipt className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {search || statusFilter !== "all" || modeFilter !== "all"
                  ? (language === "en" ? "No Matching Split Bills" : "Tidak Ada Tagihan yang Cocok")
                  : (language === "en" ? "No Split Bills Yet" : "Belum Ada Pembagian Tagihan")}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {search || statusFilter !== "all" || modeFilter !== "all"
                  ? (language === "en" ? "Try adjusting your search query or filters." : "Coba ubah kata kunci pencarian atau filter status.")
                  : (language === "en" ? "Start splitting bills for meals, trips, or gifts with friends easily." : "Mulai bagi tagihan makan bersama, liburan, atau kado patungan dengan teman secara rapi dan otomatis.")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-2xl font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("split_bill.create_new", "Buat Split Bill Sekarang")}</span>
            </button>
          </div>
        ) : (
          /* BILLS CARD LIST */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBills.map((bill, idx) => {
              const modeInfo = getModeBadge(bill.split_mode);
              const ModeIcon = modeInfo.icon;
              const isSettled = bill.status === "settled";

              // Calculations for visual progress bar
              const totalAmount = bill.total_amount || 1;
              const participants = bill.participants || [];
              const creator = participants.find(p => p.is_creator);
              const creatorShare = creator?.amount_owed || 0;
              
              const friendsPaid = participants
                .filter(p => !p.is_creator && p.status === "paid")
                .reduce((sum, p) => sum + (p.amount_owed || 0), 0);

              const friendsPending = participants
                .filter(p => !p.is_creator && p.status !== "paid")
                .reduce((sum, p) => sum + (p.amount_owed || 0), 0);

              const paidPct = Math.min(100, Math.round(((creatorShare + friendsPaid) / totalAmount) * 100));

              return (
                <div
                  key={bill.id}
                  onClick={() => {
                    setSelectedBillId(bill.id);
                    setIsDetailOpen(true);
                  }}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-[#00685F]/50 shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between cursor-pointer space-y-4"
                >
                  {/* Top Bar: Mode Badge & Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${modeInfo.color}`}>
                        <ModeIcon className="w-3 h-3" />
                        <span>{modeInfo.label}</span>
                      </span>

                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black inline-flex items-center gap-1 ${
                        isSettled 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {isSettled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{t("split_bill.status_settled_badge", "✓ Selesai")}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{t("split_bill.status_pending_badge", "⏳ Menunggu")}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Date */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-[#00685F] transition-colors truncate">
                        {bill.title}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {new Date(bill.bill_date).toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>

                    {/* Participants Avatar Stack */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center -space-x-2 overflow-hidden">
                        {participants.slice(0, 4).map((p, pIdx) => (
                          <div
                            key={p.id || pIdx}
                            className={`relative w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black ${
                              p.is_creator 
                                ? "bg-[#00685F] text-white" 
                                : p.status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-700"
                            }`}
                            title={`${p.name} (${p.status === "paid" ? "Lunas" : "Belum"})`}
                          >
                            {p.name.charAt(0).toUpperCase()}
                            {p.status === "paid" && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                            )}
                          </div>
                        ))}
                        {participants.length > 4 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 text-slate-600 flex items-center justify-center text-[9px] font-black">
                            +{participants.length - 4}
                          </div>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-slate-500">
                        {t("split_bill.friends_count", "{count} Teman").replace("{count}", participants.length)}
                      </span>
                    </div>

                    {/* Multi-segment Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>{language === "en" ? "Settlement Progress" : "Kemajuan Pelunasan"}</span>
                        <span className="font-mono text-slate-700">{paidPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div 
                          style={{ width: `${(creatorShare / totalAmount) * 100}%` }} 
                          className="h-full bg-teal-600" 
                          title="Bagian Saya"
                        />
                        <div 
                          style={{ width: `${(friendsPaid / totalAmount) * 100}%` }} 
                          className="h-full bg-emerald-500" 
                          title="Teman Lunas"
                        />
                        <div 
                          style={{ width: `${(friendsPending / totalAmount) * 100}%` }} 
                          className="h-full bg-amber-400" 
                          title="Menunggu Transfer"
                        />
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">{t("split_bill.final_total_bill", "Total Tagihan:")}</span>
                        <span className="font-black text-slate-900">
                          Rp {bill.total_amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/50">
                        <span className="font-bold text-slate-500">{language === "en" ? "Pending from Friends:" : "Belum Ditransfer Teman:"}</span>
                        <span className={`font-black ${friendsPending > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                          {friendsPending > 0 ? `Rp ${friendsPending.toLocaleString()}` : "✓ Lunas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleShareWA(e, bill.id)}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title={t("split_bill.send_group_recap", "Kirim Rekap WhatsApp")}
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">{t("split_bill.copy_recap", "WhatsApp")}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, bill.id, bill.title)}
                        className="p-2 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        title={t("split_bill.delete_confirm", "Hapus")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <span className="text-xs font-black text-[#00685F] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>{t("split_bill.view_details_btn", "Detail")}</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
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

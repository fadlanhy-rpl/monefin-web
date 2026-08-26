"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Copy, 
  Send, 
  CreditCard, 
  Wallet, 
  Check, 
  ExternalLink,
  Sparkles,
  Utensils
} from "lucide-react";
import { 
  getSplitBillDetail, 
  markParticipantPayment, 
  recordMyExpenseToAccount, 
  getWhatsAppShareText 
} from "../../services/split-bill.service";
import { getAccounts } from "../../services/account.service";
import { useLanguage } from "../../context/LanguageContext";
import toast from "react-hot-toast";

export default function SplitBillDetailModal({ billId, isOpen, onClose, onUpdated }) {
  const { t } = useLanguage();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isRecordingExpense, setIsRecordingExpense] = useState(false);
  const [payingParticipantId, setPayingParticipantId] = useState(null);

  const fetchDetail = async () => {
    if (!billId) return;
    try {
      setIsLoading(true);
      const res = await getSplitBillDetail(billId);
      setBill(res.data);
    } catch (err) {
      toast.error("Gagal memuat detail tagihan.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && billId) {
      fetchDetail();
      getAccounts().then(res => {
        const accs = res.data || res || [];
        setAccounts(accs);
        if (accs.length > 0) setSelectedAccountId(accs[0].id);
      }).catch(console.error);
    }
  }, [isOpen, billId]);

  const handleTogglePayment = async (participant) => {
    const isCurrentlyPaid = participant.status === "paid";
    const newAmountPaid = isCurrentlyPaid ? 0 : participant.amount_owed;

    setPayingParticipantId(participant.id);
    try {
      await markParticipantPayment(bill.id, participant.id, {
        amount_paid: newAmountPaid,
      });
      toast.success(
        isCurrentlyPaid 
          ? `Status ${participant.name} diubah menjadi Belum Bayar` 
          : `${participant.name} berhasil ditandai Lunas! 🎉`
      );
      fetchDetail();
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error("Gagal mengupdate status pembayaran.");
    } finally {
      setPayingParticipantId(null);
    }
  };

  const handleRecordExpense = async () => {
    if (!selectedAccountId) {
      toast.error("Pilih dompet pembayaran.");
      return;
    }

    setIsRecordingExpense(true);
    try {
      await recordMyExpenseToAccount(bill.id, {
        account_id: selectedAccountId,
      });
      toast.success("Bagian Anda berhasil dicatat ke dompet!");
      fetchDetail();
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err?.data?.message || "Gagal mencatat transaksi.");
    } finally {
      setIsRecordingExpense(false);
    }
  };

  const handleShareWhatsApp = async (participantId = null) => {
    try {
      const res = await getWhatsAppShareText(bill.id, participantId);
      const { text, whatsapp_url } = res.data;

      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success("Teks tagihan disalin ke clipboard! Membuka WhatsApp...");
      }

      // Open WhatsApp link
      window.open(whatsapp_url, "_blank");
    } catch (err) {
      toast.error("Gagal membuat teks WhatsApp.");
    }
  };

  if (!isOpen || !billId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-badge-in">
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] text-white flex items-center justify-center shadow-md shadow-emerald-800/20">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{bill?.title || "Detail Tagihan"}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {bill ? `${bill.bill_date} • Mode: ${bill.split_mode.toUpperCase()}` : "Memuat..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-bold">Memuat rincian tagihan...</p>
            </div>
          ) : !bill ? null : (
            <>
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Tagihan</span>
                  <p className="text-sm font-black text-[#00685F] mt-0.5">
                    Rp {bill.total_amount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Subtotal</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">
                    Rp {bill.subtotal.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pajak & Service</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">
                    Rp {(bill.tax_amount + bill.service_amount).toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <p className="text-sm font-black mt-0.5 capitalize">
                    {bill.status === "settled" ? (
                      <span className="text-emerald-600">✓ Lunas Semua</span>
                    ) : (
                      <span className="text-amber-600">⏳ Belum Lunas</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Share & Record Expense */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp()}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Rekap ke Grup WhatsApp</span>
                </button>

                {!bill.my_transaction_id && (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAccountId}
                      onChange={e => setSelectedAccountId(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleRecordExpense}
                      disabled={isRecordingExpense}
                      className="px-3.5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Catat ke Dompet</span>
                    </button>
                  </div>
                )}
              </div>

              {bill.my_transaction_id && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bagian Anda (Rp {bill.participants?.find(p => p.is_creator)?.amount_owed?.toLocaleString()}) sudah dicatat ke transaksi dompet.</span>
                  </div>
                </div>
              )}

              {/* PARTICIPANTS BREAKDOWN LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Daftar Partisipan ({bill.participants?.length || 0})
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {bill.participants?.map((p) => {
                    const isPaid = p.status === "paid";

                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isPaid ? "bg-emerald-50/60 border-emerald-200" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs sm:text-sm font-black text-slate-900">
                              {p.name}
                            </p>
                            {p.is_creator && (
                              <span className="bg-[#00685F] text-white text-[9px] font-black px-2 py-0.2 rounded-full">
                                Saya (Talangi)
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {isPaid ? "✓ Lunas" : "⏳ Belum Bayar"}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {p.phone_number || "Tanpa nomor HP"}
                          </p>

                          {/* Ordered items if any */}
                          {p.items && p.items.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {p.items.map(it => (
                                <span key={it.id} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {it.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Amount & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center shrink-0">
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-slate-900">
                              Rp {p.amount_owed.toLocaleString()}
                            </span>
                          </div>

                          {!p.is_creator && (
                            <div className="flex items-center gap-1.5">
                              {/* WhatsApp Direct button */}
                              <button
                                type="button"
                                onClick={() => handleShareWhatsApp(p.id)}
                                className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                                title="Kirim Tagihan ke WhatsApp Orang Ini"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Paid button */}
                              <button
                                type="button"
                                onClick={() => handleTogglePayment(p)}
                                disabled={payingParticipantId === p.id}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  isPaid
                                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                }`}
                              >
                                {payingParticipantId === p.id ? (
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : isPaid ? (
                                  <span>Batal</span>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Lunas</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details Box */}
              {bill.payment_info && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Info Rekening Pembayaran</span>
                  <p className="font-extrabold text-slate-800">
                    {bill.payment_info.bank_name}: <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{bill.payment_info.account_number}</code> {bill.payment_info.account_holder && `(a.n. ${bill.payment_info.account_holder})`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

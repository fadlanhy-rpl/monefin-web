"use client";

import { 
  Users, 
  Utensils, 
  Percent, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Send, 
  Trash2, 
  ChevronRight 
} from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";

export default function SplitBillCardItem({
  bill,
  onSelect,
  onDelete,
  onShareWA,
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();

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

  const modeInfo = getModeBadge(bill.split_mode);
  const ModeIcon = modeInfo.icon;
  const isSettled = bill.status === "settled";

  const totalAmount = bill.total_amount || 1;
  const participants = bill.participants || [];
  const creator = participants.find((p) => p.is_creator);
  const creatorShare = creator?.amount_owed || 0;

  const friendsPaid = participants
    .filter((p) => !p.is_creator && p.status === "paid")
    .reduce((sum, p) => sum + (p.amount_owed || 0), 0);

  const friendsPending = participants
    .filter((p) => !p.is_creator && p.status !== "paid")
    .reduce((sum, p) => sum + (p.amount_owed || 0), 0);

  const paidPct = Math.min(100, Math.round(((creatorShare + friendsPaid) / totalAmount) * 100));

  return (
    <div
      onClick={onSelect}
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
                <span>{language === "en" ? "Settled" : "Selesai"}</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{language === "en" ? "Pending" : "Menunggu"}</span>
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
                title={`${p.name} (${p.status === "paid" ? (language === "en" ? "Paid" : "Lunas") : (language === "en" ? "Pending" : "Belum")})`}
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
              title={language === "en" ? "My Share" : "Bagian Saya"}
            />
            <div 
              style={{ width: `${(friendsPaid / totalAmount) * 100}%` }} 
              className="h-full bg-emerald-500" 
              title={language === "en" ? "Friends Paid" : "Teman Lunas"}
            />
            <div 
              style={{ width: `${(friendsPending / totalAmount) * 100}%` }} 
              className="h-full bg-amber-400" 
              title={language === "en" ? "Pending Transfer" : "Menunggu Transfer"}
            />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500">{t("split_bill.final_total_bill", "Total Tagihan:")}</span>
            <span className="font-black text-slate-900">
              {formatCurrency(bill.total_amount)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/50">
            <span className="font-bold text-slate-500">{language === "en" ? "Pending from Friends:" : "Belum Ditransfer Teman:"}</span>
            <span className={`font-black ${friendsPending > 0 ? "text-orange-600" : "text-emerald-600"}`}>
              {friendsPending > 0 ? formatCurrency(friendsPending) : (language === "en" ? "✓ Settled" : "✓ Lunas")}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => onShareWA(e, bill.id)}
          className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          title={t("split_bill.send_group_recap", "Kirim Rekap WhatsApp")}
        >
          <Send className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">{t("split_bill.copy_recap", "WhatsApp")}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onDelete(e, bill.id, bill.title)}
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
}

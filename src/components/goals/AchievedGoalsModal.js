import { useState } from "react";
import { 
  Trophy, 
  X, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Laptop, 
  Plane, 
  GraduationCap, 
  Target, 
  Shield, 
  Heart, 
  Car, 
  Home 
} from "lucide-react";

const iconMap = {
  laptop: Laptop,
  plane: Plane,
  graduation: GraduationCap,
  target: Target,
  shield: Shield,
  heart: Heart,
  car: Car,
  home: Home
};

export default function AchievedGoalsModal({
  isOpen,
  onClose,
  achievedGoals = []
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const totalAchievedAmount = achievedGoals.reduce(
    (acc, g) => acc + (parseFloat(g.target_amount) || 0),
    0
  );

  const filteredGoals = achievedGoals.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      (g.name && g.name.toLowerCase().includes(q)) ||
      (g.description && g.description.toLowerCase().includes(q))
    );
  });

  const renderGoalIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Trophy;
    return <IconComponent className="w-6 h-6 text-[#00685F]" />;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-amber-50/40 via-white to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <Trophy className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight select-none">
                Target Tabungan Tercapai
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">
                Arsip impian & pencapaian finansial yang telah berhasil Anda wujudkan
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-2xl cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Summary Banner */}
          <div className="bg-gradient-to-br from-[#00685F] to-[#004D46] p-6 rounded-3xl text-white shadow-xl shadow-[#00685F]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Total Akumulasi Pencapaian
              </span>
              <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                Rp {totalAchievedAmount.toLocaleString("id-ID")}
              </h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs font-extrabold flex items-center gap-2 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{achievedGoals.length} Target Selesai</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari target tabungan yang telah selesai..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-xs sm:text-sm font-bold text-slate-800"
            />
          </div>

          {/* Goals List */}
          {filteredGoals.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-2 select-none">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-500">Tidak ada target tercapai yang ditemukan.</p>
              <p className="text-xs text-slate-400">Terus konsisten menabung untuk mencapai target impian Anda!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGoals.map((g) => {
                const completedDate = g.updated_at
                  ? new Date(g.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })
                  : "-";
                const targetAmt = parseFloat(g.target_amount) || 0;

                return (
                  <div
                    key={g.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-[#00685F]/30 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-[#00685F]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {renderGoalIcon(g.icon)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-extrabold text-slate-900 text-base truncate leading-tight">
                          {g.name}
                        </h5>
                        <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                          {g.description || "Target Tabungan"}
                        </p>
                        <p className="text-[10px] font-extrabold text-emerald-600 italic mt-1 select-none flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Finished on {completedDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Rp {targetAmt.toLocaleString("id-ID")}
                      </p>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-emerald-100/80 inline-block mt-1">
                        ACHIEVED
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#00685F] text-white rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#004D46] transition-all cursor-pointer shadow-md active:scale-95 select-none"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

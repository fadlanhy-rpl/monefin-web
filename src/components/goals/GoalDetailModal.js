import { X, Trophy, Sparkles, CheckCircle2, Calendar, Target, Laptop, Plane, GraduationCap, Shield, Heart, Car, Home } from "lucide-react";

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

export default function GoalDetailModal({ isOpen, onClose, goal }) {
  if (!isOpen || !goal) return null;

  const IconComp = iconMap[goal.icon] || Trophy;
  const targetAmount = parseFloat(goal.target_amount || goal.target || 0);
  const completedDate = goal.updated_at 
    ? new Date(goal.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : (goal.completedDate || "Baru saja");

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative select-none">
        
        {/* Banner Glow Header */}
        <div className="bg-gradient-to-br from-[#00685F] via-[#004D46] to-slate-900 p-7 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition p-2 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-xl shrink-0">
              <IconComp className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3" /> Target Tercapai
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">{goal.name || goal.title}</h2>
              <p className="text-xs text-teal-100 font-medium truncate mt-0.5">{goal.description || goal.subtitle || "Target tabungan impian"}</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-7 space-y-6">
          {/* Realisasi Dana Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dana Terkumpul</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">100% Selesai</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Rp {targetAmount.toLocaleString("id-ID")}</h3>
            </div>
            
            {/* Full Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-full shadow-sm"></div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Tercapai</p>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                <Calendar className="w-4 h-4 text-[#00685F] shrink-0" />
                <span className="truncate">{completedDate}</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Nominal</p>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                <Target className="w-4 h-4 text-[#00685F] shrink-0" />
                <span className="truncate">Rp {targetAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-[#E6F0EF]/60 border border-[#00685F]/15 rounded-2xl p-4 flex items-start gap-3 text-xs font-semibold text-[#004D46] leading-relaxed">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Selamat! Kerja keras Anda telah membuahkan hasil. Target <strong>"{goal.name || goal.title}"</strong> sudah terwujud penuh! 🎉
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#00685F] hover:bg-[#004D46] text-white rounded-2xl font-bold text-sm transition-all active:scale-98 shadow-md cursor-pointer"
          >
            Tutup Detail
          </button>
        </div>

      </div>
    </div>
  );
}

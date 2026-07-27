import { ChevronRight, Plane, GraduationCap, Trophy } from "lucide-react";

// Icon mapper for achieved goals
function getAchievedIcon(iconType) {
  switch (iconType) {
    case "plane": return <Plane className="w-8 h-8" />;
    case "graduation-cap": return <GraduationCap className="w-8 h-8" />;
    default: return <Trophy className="w-8 h-8" />;
  }
}

export default function AchievedGoals({
  achievedGoals
}) {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center select-none">
        <h3 className="text-lg font-bold text-gray-400 tracking-tight">Achieved Goals</h3>
        <a href="#" className="text-sm font-black text-[#00685F] hover:underline flex items-center gap-1">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {achievedGoals.map((ag) => (
          <div 
            key={ag.id} 
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group transition-all hover:border-[#00685F]/20 hover:shadow-sm"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all shrink-0">
                {getAchievedIcon(ag.iconType)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{ag.title}</p>
                <p className="text-[10px] font-bold text-gray-400 italic truncate mt-0.5">Completed on {ag.completedDate}</p>
              </div>
            </div>
            <div className="text-right space-y-1 shrink-0 ml-4">
              <p className="text-lg font-black text-slate-900 tracking-tight">Rp {ag.amount.toLocaleString("id-ID")}</p>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg select-none border border-emerald-100">
                {ag.badge || "VERIFIED"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

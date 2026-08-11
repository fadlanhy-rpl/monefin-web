import { ChevronRight, Plane, GraduationCap, Trophy } from "lucide-react";

// Icon mapper for achieved goals
function getAchievedIcon(iconType) {
  switch (iconType) {
    case "plane": return <Plane className="w-6.5 h-6.5 sm:w-8 sm:h-8" />;
    case "graduation-cap": return <GraduationCap className="w-6.5 h-6.5 sm:w-8 sm:h-8" />;
    default: return <Trophy className="w-6.5 h-6.5 sm:w-8 sm:h-8" />;
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
          Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      
      {/* Grid containing achieved goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {achievedGoals.map(ag => {
          const mappedGoal = {
            ...ag,
            title: ag.name,
            completedDate: ag.updated_at ? new Date(ag.updated_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : "-",
            amount: parseFloat(ag.target_amount) || 0,
            badge: "ACHIEVED",
            iconType: ag.icon || "target"
          };
          return (
          <div 
            key={mappedGoal.id} 
            className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-3 group transition-all hover:border-[#00685F]/20 hover:shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all shrink-0">
                {getAchievedIcon(mappedGoal.iconType)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-sm sm:text-base truncate leading-tight">{mappedGoal.title}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 italic truncate mt-0.5 select-none">Completed on {mappedGoal.completedDate}</p>
              </div>
            </div>
            <div className="text-right space-y-1 shrink-0 ml-1">
              <p className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">Rp {mappedGoal.amount.toLocaleString("id-ID")}</p>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg select-none border border-emerald-100 block w-fit ml-auto">
                {mappedGoal.badge || "VERIFIED"}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

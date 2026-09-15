"use client";

import Link from "next/link";
import { Flame, Zap } from "lucide-react";

export default function HeaderGamificationPill({ gamification }) {
  if (!gamification) return null;

  return (
    <Link
      href="/rewards"
      className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 rounded-xl transition-all shadow-xs group cursor-pointer shrink-0"
      title="Lihat Pencapaian & Hadiah"
    >
      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-orange-500">
        <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 text-orange-500 group-hover:scale-110 transition-transform" />
        <span>{gamification.current_streak || 0}</span>
      </div>
      <span className="text-slate-300 text-xs">|</span>
      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#00685F]">
        <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#00685F] group-hover:scale-110 transition-transform" />
        <span>Lv. {gamification.level || 1}</span>
      </div>
    </Link>
  );
}

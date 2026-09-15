"use client";

export default function ScoreGauge({ score, onShowDetail }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: "#10b981", glow: "rgba(16,185,129,0.3)", label: "text-emerald-600", dot: "bg-emerald-500" };
    if (score >= 60) return { stroke: "#00685F", glow: "rgba(0,104,95,0.3)", label: "text-[#00685F]", dot: "bg-teal-600" };
    if (score >= 40) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "text-amber-600", dot: "bg-amber-500" };
    return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "text-rose-600", dot: "bg-rose-500" };
  };

  const colors = getColor();

  return (
    <div
      onClick={onShowDetail}
      className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 shrink-0 cursor-pointer group select-none"
      title="Klik untuk melihat rincian diagnosa skor"
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        {/* Dynamic Progress Arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${colors.glow})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${colors.label}`}>{score}</span>
        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 -mt-0.5 sm:-mt-1 tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

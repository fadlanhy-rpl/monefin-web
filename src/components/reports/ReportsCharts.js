"use client";

import { useState } from "react";
import { LineChart, BarChart2 } from "lucide-react";

const PALETTE = [
  "#00685F", "#2dd4bf", "#34d399", "#6ee7b7", "#a7f3d0",
  "#0d9488", "#0891b2", "#7c3aed", "#db2777", "#f59e0b",
  "#ef4444", "#64748b", "#8b5cf6", "#ec4899", "#14b8a6",
];

function monthLabel(ym) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return (names[parseInt(m, 10) - 1] || m) + " " + y.slice(2);
}

export default function ReportsCharts({ monthlyData = [], categoryData = [], loading = false }) {
  const [chartType, setChartType] = useState("line");
  const [activeLegend, setActiveLegend] = useState(null);

  const months    = monthlyData.map((d) => monthLabel(d.month));
  const incomeArr = monthlyData.map((d) => (d.income  || 0) / 1_000_000);
  const expenseArr= monthlyData.map((d) => (d.expense || 0) / 1_000_000);

  const hasData = monthlyData.length > 0;
  const maxVal  = Math.max(...incomeArr, ...expenseArr, 1);
  const minVal  = 0;

  const svgWidth  = 500;
  const svgHeight = 200;
  const padX      = 35;
  const padY      = 25;

  const getX = (i) => padX + (i * (svgWidth - 2 * padX)) / Math.max(months.length - 1, 1);
  const getY = (v) => svgHeight - padY - ((v - minVal) * (svgHeight - 2 * padY)) / (maxVal - minVal);

  const createPath = (data) =>
    data.reduce((acc, v, i, arr) => {
      const x = getX(i), y = getY(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = getX(i - 1), py = getY(arr[i - 1]);
      const cx = px + (x - px) / 2;
      return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
    }, "");

  const incomePath  = createPath(incomeArr);
  const expensePath = createPath(expenseArr);
  const incomeArea  = `${incomePath} L ${getX(months.length - 1)} ${svgHeight - padY} L ${getX(0)} ${svgHeight - padY} Z`;
  const expenseArea = `${expensePath} L ${getX(months.length - 1)} ${svgHeight - padY} L ${getX(0)} ${svgHeight - padY} Z`;

  // Donut chart data
  const catData   = categoryData.filter((c) => c.total > 0);
  const grandTotal= catData.reduce((s, c) => s + c.total, 0);

  // SVG donut segments
  let offset = 0;
  const segments = catData.map((cat, i) => {
    const pct = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0;
    const dash = `${pct} ${100 - pct}`;
    const seg  = { ...cat, pct, dashArray: dash, dashOffset: -offset, color: PALETTE[i % PALETTE.length] };
    offset += pct;
    return seg;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Income vs Expense Trend Chart ── */}
      <div className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 select-none">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Tren Pemasukan vs Pengeluaran</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Arus kas bulanan periode yang dipilih</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-50 p-1 rounded-xl flex gap-1 border border-slate-100">
              <button
                onClick={() => setChartType("line")}
                title="Grafik Garis"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${chartType === "line" ? "bg-[#00685F] text-white shadow-xs" : "text-slate-500 hover:text-[#00685F]"}`}
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                title="Grafik Batang"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${chartType === "bar" ? "bg-[#00685F] text-white shadow-xs" : "text-slate-500 hover:text-[#00685F]"}`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 animate-pulse bg-slate-50 rounded-2xl min-h-[180px]"></div>
        ) : !hasData ? (
          <div className="flex-1 flex items-center justify-center text-slate-300 text-sm font-bold min-h-[180px]">
            Belum ada data transaksi pada periode ini
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[300px]" style={{ height: 200 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00685F" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00685F" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-axis grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                const y = padY + f * (svgHeight - 2 * padY);
                const v = (maxVal * (1 - f)).toFixed(1);
                return (
                  <g key={f}>
                    <line x1={padX} y1={y} x2={svgWidth - padX} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={padX - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}M</text>
                  </g>
                );
              })}

              {chartType === "line" ? (
                <>
                  <path d={incomeArea}  fill="url(#incomeGrad)" />
                  <path d={expenseArea} fill="url(#expenseGrad)" />
                  <path d={incomePath}  fill="none" stroke="#00685F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {incomeArr.map((v, i) => (
                    <circle key={`i${i}`} cx={getX(i)} cy={getY(v)} r="4" fill="#00685F" stroke="#fff" strokeWidth="2" />
                  ))}
                  {expenseArr.map((v, i) => (
                    <circle key={`e${i}`} cx={getX(i)} cy={getY(v)} r="4" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                  ))}
                </>
              ) : (
                months.map((_, i) => {
                  const bw = (svgWidth - 2 * padX) / months.length * 0.35;
                  const cx = getX(i);
                  const incH = ((incomeArr[i] - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padY);
                  const expH = ((expenseArr[i] - minVal) / (maxVal - minVal)) * (svgHeight - 2 * padY);
                  return (
                    <g key={i}>
                      <rect x={cx - bw - 2} y={svgHeight - padY - incH} width={bw} height={incH}
                        fill="#00685F" rx="3" fillOpacity="0.85" />
                      <rect x={cx + 2}      y={svgHeight - padY - expH} width={bw} height={expH}
                        fill="#ef4444" rx="3" fillOpacity="0.75" />
                    </g>
                  );
                })
              )}

              {/* X-axis labels */}
              {months.map((label, i) => (
                <text key={i} x={getX(i)} y={svgHeight - 5} textAnchor="middle" fontSize="9" fill="#94a3b8">
                  {label}
                </text>
              ))}
            </svg>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 select-none flex-wrap">
          {[{ color: "#00685F", label: "Pemasukan" }, { color: "#ef4444", label: "Pengeluaran" }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: l.color }}></span>
              <span className="text-xs font-bold text-slate-600">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Distribution Donut ── */}
      <div className="bg-white p-5 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
        <div className="mb-4 select-none">
          <h3 className="font-black text-slate-900 text-base tracking-tight">Distribusi Pengeluaran</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Breakdown per kategori</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3 flex-1">
            <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto"></div>
            <div className="space-y-2 mt-4">
              {[1,2,3].map(i => <div key={i} className="h-3 bg-slate-100 rounded w-full"></div>)}
            </div>
          </div>
        ) : catData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-300 text-xs font-bold">
            Belum ada data pengeluaran
          </div>
        ) : (
          <>
            {/* Donut SVG */}
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={activeLegend === null || activeLegend === i ? 13 : 9}
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    style={{ transition: "stroke-width 0.2s" }}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveLegend(i)}
                    onMouseLeave={() => setActiveLegend(null)}
                  />
                ))}
                {/* Center hole */}
                <circle cx="50" cy="50" r="28" fill="white" />
              </svg>
            </div>

            {/* Category Legend List */}
            <div className="space-y-1.5 overflow-y-auto max-h-48 flex-1 pr-1">
              {segments.map((seg, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-all ${activeLegend === i ? "bg-slate-50" : "hover:bg-slate-50/60"}`}
                  onMouseEnter={() => setActiveLegend(i)}
                  onMouseLeave={() => setActiveLegend(null)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }}></span>
                    <span className="text-xs font-bold text-slate-700 truncate">{seg.category_name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-slate-500">{seg.pct.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

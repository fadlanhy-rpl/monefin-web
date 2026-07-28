"use client";

import { useState } from "react";
import { LineChart, BarChart2 } from "lucide-react";

export default function ReportsCharts() {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [chartType, setChartType] = useState("line"); // "line" | "bar"
  const [activeLegend, setActiveLegend] = useState(null);

  // Income vs Expense trend data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const incomeData = [45, 52, 48, 60, 55, 65]; // in millions
  const expenseData = [30, 35, 40, 32, 28, 42];

  // Spending distribution data
  const distribution = [
    { label: "Food", percentage: 40, color: "bg-[#00685F]", strokeColor: "#00685F", dashArray: "40 60", dashOffset: "0", amount: "Rp 10.4M" },
    { label: "Bills", percentage: 25, color: "bg-teal-400", strokeColor: "#2dd4bf", dashArray: "25 75", dashOffset: "-40", amount: "Rp 6.5M" },
    { label: "Shopping", percentage: 20, color: "bg-teal-200", strokeColor: "#99f6e4", dashArray: "20 80", dashOffset: "-65", amount: "Rp 5.2M" },
    { label: "Transport", percentage: 15, color: "bg-slate-200", strokeColor: "#cbd5e1", dashArray: "15 85", dashOffset: "-85", amount: "Rp 3.9M" }
  ];

  // Calculate SVG coordinates with adequate padding to prevent label truncation
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingX = 35;
  const paddingY = 25;

  const minVal = 20;
  const maxVal = 70;

  const getX = (index) => paddingX + (index * (svgWidth - 2 * paddingX)) / (months.length - 1);
  const getY = (val) => svgHeight - paddingY - ((val - minVal) * (svgHeight - 2 * paddingY)) / (maxVal - minVal);

  const createPath = (data) => {
    return data.reduce((acc, val, i, arr) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, "");
  };

  const incomePath = createPath(incomeData);
  const expensePath = createPath(expenseData);

  const incomeArea = `${incomePath} L ${getX(months.length - 1)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`;
  const expenseArea = `${expensePath} L ${getX(months.length - 1)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Income vs Expense Trends Chart */}
      <div className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
        
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 select-none">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Income vs Expense Trends</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Tren arus kas bulanan semester ini</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Chart Type Switcher (Line vs Bar) */}
            <div className="bg-slate-50 p-1 rounded-xl flex gap-1 border border-slate-100 shrink-0">
              <button
                onClick={() => setChartType("line")}
                className={`p-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  chartType === "line" ? "bg-[#00685F] text-white shadow-xs" : "text-slate-500 hover:text-[#00685F]"
                }`}
                title="Tampilan Grafik Garis"
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  chartType === "bar" ? "bg-[#00685F] text-white shadow-xs" : "text-slate-500 hover:text-[#00685F]"
                }`}
                title="Tampilan Grafik Batang"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00685F] rounded-full shadow-xs"></span> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-xs"></span> Expense
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Canvas / SVG Chart Area */}
        <div className="relative w-full h-56 sm:h-64 flex flex-col justify-end">
          {chartType === "line" ? (
            /* LINE CHART VIEW */
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00685F" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#00685F" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fills */}
              <path d={incomeArea} fill="url(#incomeGradient)" />
              <path d={expenseArea} fill="url(#expenseGradient)" />

              {/* Line Paths */}
              <path d={incomePath} fill="none" stroke="#00685F" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />
              <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

              {/* Data Points */}
              {months.map((m, i) => {
                const x = getX(i);
                const yInc = getY(incomeData[i]);
                const yExp = getY(expenseData[i]);
                const isHovered = hoveredPoint === i;

                return (
                  <g key={m} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    {isHovered && (
                      <line x1={x} y1={paddingY} x2={x} y2={svgHeight - paddingY} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                    )}
                    <circle cx={x} cy={yInc} r={isHovered ? 6 : 4} fill="white" stroke="#00685F" strokeWidth="3" className="transition-all duration-200" />
                    <circle cx={x} cy={yExp} r={isHovered ? 6 : 4} fill="white" stroke="#ef4444" strokeWidth="3" className="transition-all duration-200" />
                  </g>
                );
              })}
            </svg>
          ) : (
            /* BAR CHART VIEW */
            <div className="flex justify-between items-end h-44 sm:h-48 px-4 sm:px-8 pt-4 pb-2 border-b border-slate-100">
              {months.map((m, i) => {
                const incHeight = (incomeData[i] / 70) * 100;
                const expHeight = (expenseData[i] / 70) * 100;
                const isHovered = hoveredPoint === i;

                return (
                  <div 
                    key={m} 
                    className="flex items-end gap-1 sm:gap-1.5 h-full group cursor-pointer relative"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div 
                      className={`w-3 sm:w-4 bg-[#00685F] rounded-t-lg transition-all duration-300 ${isHovered ? 'brightness-110 scale-105' : ''}`}
                      style={{ height: `${incHeight}%` }}
                    ></div>
                    <div 
                      className={`w-3 sm:w-4 bg-red-500 rounded-t-lg transition-all duration-300 ${isHovered ? 'brightness-110 scale-105' : ''}`}
                      style={{ height: `${expHeight}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Month Labels */}
          <div className="flex justify-between px-3 sm:px-7 pt-3 border-t border-slate-100 text-[10px] sm:text-xs font-bold text-slate-400 select-none">
            {months.map((m, i) => (
              <span key={m} className={`transition-colors ${hoveredPoint === i ? 'text-[#00685F] font-black' : ''}`}>
                {m}
              </span>
            ))}
          </div>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint !== null && (
            <div 
              className="absolute top-2 bg-slate-900/95 backdrop-blur-md text-white text-[11px] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-xl border border-slate-800 pointer-events-none z-30 transition-all transform -translate-x-1/2 animate-in fade-in duration-150"
              style={{ left: `${(hoveredPoint / (months.length - 1)) * 80 + 10}%` }}
            >
              <p className="font-black text-slate-300 text-center border-b border-slate-800 pb-0.5 mb-1">{months[hoveredPoint]} 2026</p>
              <div className="space-y-0.5 font-bold text-[10px] sm:text-xs">
                <p className="text-emerald-400 flex items-center justify-between gap-3">
                  <span>Pemasukan:</span>
                  <span>Rp {incomeData[hoveredPoint]}.000.000</span>
                </p>
                <p className="text-red-400 flex items-center justify-between gap-3">
                  <span>Pengeluaran:</span>
                  <span>Rp {expenseData[hoveredPoint]}.000.000</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spending Distribution Donut Chart */}
      <div className="bg-white p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Spending Distribution</h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Proporsi pengeluaran berdasarkan kategori</p>
        </div>

        {/* SVG Donut Chart */}
        <div 
          className="h-44 sm:h-52 relative my-2 flex items-center justify-center"
          onMouseLeave={() => setActiveLegend(null)}
        >
          <svg viewBox="0 0 42 42" className="w-36 h-36 sm:w-44 sm:h-44 transform -rotate-90">
            {distribution.map((item, idx) => {
              const isSelected = activeLegend === item.label;
              return (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={item.strokeColor}
                  strokeWidth={isSelected ? "6" : "4.5"}
                  strokeDasharray={item.dashArray}
                  strokeDashoffset={item.dashOffset}
                  style={{ pointerEvents: "stroke" }}
                  className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setActiveLegend(item.label);
                  }}
                />
              );
            })}
          </svg>

          {/* Donut Center Label (Compact & Clean Sizing) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-2">
            {activeLegend ? (
              <div className="text-center animate-in fade-in max-w-[100px] leading-tight">
                <p className="text-[9px] font-black text-[#00685F] uppercase tracking-wider truncate">{activeLegend}</p>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
                  {distribution.find(d => d.label === activeLegend)?.amount}
                </h4>
                <p className="text-[9px] font-bold text-slate-400">
                  ({distribution.find(d => d.label === activeLegend)?.percentage}%)
                </p>
              </div>
            ) : (
              <div className="text-center leading-tight">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                <h4 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">100%</h4>
              </div>
            )}
          </div>
        </div>

        {/* Categories Legend List with hover highlight */}
        <div className="space-y-1.5 pt-2 border-t border-slate-50 select-none">
          {distribution.map((item) => {
            const isHovered = activeLegend === item.label;
            return (
              <div 
                key={item.label} 
                onMouseEnter={() => setActiveLegend(item.label)}
                onMouseLeave={() => setActiveLegend(null)}
                className={`flex justify-between items-center text-xs p-1.5 rounded-xl transition-all cursor-pointer ${
                  isHovered ? "bg-[#E6F0EF]/60 font-bold" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 shadow-xs`}></span>
                  <span className={`font-semibold truncate ${isHovered ? 'text-[#00685F]' : 'text-slate-600'}`}>{item.label}</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

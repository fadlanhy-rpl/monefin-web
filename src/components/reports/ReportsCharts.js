"use client";

import { useState } from "react";

export default function ReportsCharts() {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Income vs Expense trend data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const incomeData = [45, 52, 48, 60, 55, 65]; // in millions or % scale
  const expenseData = [30, 35, 40, 32, 28, 42];

  // Spending distribution data
  const distribution = [
    { label: "Food", percentage: 40, color: "bg-[#00685F]", strokeColor: "#00685F", dashArray: "40 60", dashOffset: "0" },
    { label: "Bills", percentage: 25, color: "bg-teal-400", strokeColor: "#2dd4bf", dashArray: "25 75", dashOffset: "-40" },
    { label: "Shopping", percentage: 20, color: "bg-teal-200", strokeColor: "#99f6e4", dashArray: "20 80", dashOffset: "-65" },
    { label: "Transport", percentage: 15, color: "bg-slate-100", strokeColor: "#f1f5f9", dashArray: "15 85", dashOffset: "-85" }
  ];

  // Calculate coordinates for 300x180 SVG container
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 20;

  const minVal = 20;
  const maxVal = 70;

  const getX = (index) => paddingX + (index * (svgWidth - 2 * paddingX)) / (months.length - 1);
  const getY = (val) => svgHeight - paddingY - ((val - minVal) * (svgHeight - 2 * paddingY)) / (maxVal - minVal);

  // Create smooth bezier path string for SVG
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
      <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">Income vs Expense Trends</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#00685F] rounded-full shadow-xs"></span> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-xs"></span> Expense
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full h-64 flex flex-col justify-end">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00685F" stopOpacity="0.25" />
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
            <path d={incomePath} fill="none" stroke="#00685F" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500" />
            <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500" />

            {/* Data Points */}
            {months.map((m, i) => {
              const x = getX(i);
              const yInc = getY(incomeData[i]);
              const yExp = getY(expenseData[i]);
              const isHovered = hoveredPoint === i;

              return (
                <g key={m} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <line x1={x} y1={paddingY} x2={x} y2={svgHeight - paddingY} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                  )}

                  {/* Income Circle */}
                  <circle cx={x} cy={yInc} r={isHovered ? 6 : 4} fill="#white" stroke="#00685F" strokeWidth="3" className="transition-all" />
                  {/* Expense Circle */}
                  <circle cx={x} cy={yExp} r={isHovered ? 6 : 4} fill="#white" stroke="#ef4444" strokeWidth="3" className="transition-all" />
                </g>
              );
            })}
          </svg>

          {/* Month Labels */}
          <div className="flex justify-between px-6 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 select-none">
            {months.map((m, i) => (
              <span key={m} className={`transition-colors ${hoveredPoint === i ? 'text-[#00685F] font-black scale-110' : ''}`}>
                {m}
              </span>
            ))}
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredPoint !== null && (
            <div 
              className="absolute top-2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 pointer-events-none z-20 transition-all transform -translate-x-1/2 animate-in fade-in"
              style={{ left: `${(hoveredPoint / (months.length - 1)) * 80 + 10}%` }}
            >
              <p className="font-bold text-slate-300">{months[hoveredPoint]} 2026</p>
              <p className="text-emerald-400 font-semibold">Inc: Rp {incomeData[hoveredPoint]}.000.000</p>
              <p className="text-red-400 font-semibold">Exp: Rp {expenseData[hoveredPoint]}.000.000</p>
            </div>
          )}
        </div>
      </div>

      {/* Spending Distribution Donut Chart */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <h3 className="font-extrabold text-slate-800 text-base sm:text-lg mb-4">Spending Distribution</h3>

        {/* SVG Donut Chart */}
        <div className="h-52 relative my-2 flex items-center justify-center">
          <svg viewBox="0 0 42 42" className="w-44 h-44 transform -rotate-90">
            {distribution.map((item, idx) => (
              <circle
                key={idx}
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke={item.strokeColor}
                strokeWidth="5"
                strokeDasharray={item.dashArray}
                strokeDashoffset={item.dashOffset}
                className="transition-all duration-700 hover:opacity-80 cursor-pointer"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Total</p>
            <h4 className="text-2xl font-black text-slate-800 leading-tight mt-1">100%</h4>
          </div>
        </div>

        {/* Categories Legend List */}
        <div className="space-y-2.5 pt-2 border-t border-slate-50 select-none">
          {distribution.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-xs`}></span>
                <span className="font-semibold text-slate-600">{item.label}</span>
              </div>
              <span className="font-extrabold text-slate-900">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

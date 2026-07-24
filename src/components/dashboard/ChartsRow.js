"use client";

import { useEffect, useState, useRef } from "react";

function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return (n < 0 ? '- ' : '+ ') + 'Rp ' + abs;
}

export default function ChartsRow() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  // Weekly vs Monthly spending toggle
  const [period, setPeriod] = useState("weekly");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredDonut, setHoveredDonut] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Datasets
  const weeklyData = [
    { label: 'Sen', last: 45, thisWeek: 62, lastAmt: 450000, thisAmt: 620000 },
    { label: 'Sel', last: 68, thisWeek: 92, lastAmt: 680000, thisAmt: 920000 },
    { label: 'Rab', last: 78, thisWeek: 58, lastAmt: 780000, thisAmt: 580000 },
    { label: 'Kam', last: 54, thisWeek: 85, lastAmt: 540000, thisAmt: 850000 },
    { label: 'Jum', last: 62, thisWeek: 70, lastAmt: 620000, thisAmt: 700000 },
    { label: 'Sab', last: 88, thisWeek: 100, lastAmt: 880000, thisAmt: 1000000 },
  ];

  const monthlyData = [
    { label: 'Jul', last: 50, thisWeek: 75, lastAmt: 3500000, thisAmt: 5250000 },
    { label: 'Agt', last: 65, thisWeek: 80, lastAmt: 4550000, thisAmt: 5600000 },
    { label: 'Sep', last: 85, thisWeek: 70, lastAmt: 5950000, thisAmt: 4900000 },
    { label: 'Okt', last: 60, thisWeek: 95, lastAmt: 4200000, thisAmt: 6650000 },
    { label: 'Nov', last: 70, thisWeek: 85, lastAmt: 4900000, thisAmt: 5950000 },
    { label: 'Des', last: 90, thisWeek: 100, lastAmt: 6300000, thisAmt: 7000000 },
  ];

  const activeData = period === "weekly" ? weeklyData : monthlyData;

  const handleBarHover = (e, index, type, amount) => {
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    const y = e.clientY ?? (e.touches && e.touches[0].clientY);
    setHoveredBar({ index, type });
    setTooltip({ 
      show: true, 
      text: `${type === 'this' ? 'Minggu Ini' : 'Minggu Lalu'}: ${formatRupiah(amount).replace('+ ', '')}`, 
      x: x + 14, 
      y: y - 36 
    });
  };
  
  const handleBarLeave = () => {
    setHoveredBar(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Donut segment calculations
  // r = 88, circumference = 2 * pi * r = 552.92
  const donutData = [
    { label: 'Food', pct: 55, amount: 1760000, color: '#00685F', stroke: '304.11 248.81', offset: '0', rotate: '0deg' },
    { label: 'Transport', pct: 30, amount: 960000, color: '#465569', stroke: '165.88 387.04', offset: '387.04', rotate: '198deg' },
    { label: 'Shopping', pct: 15, amount: 480000, color: '#b3572b', stroke: '82.94 469.98', offset: '469.98', rotate: '306deg' },
  ];

  // Currently shown center content
  const activeDonutInfo = hoveredDonut || { label: 'Total Spend', amount: 3200000, pct: 100 };

  return (
    <>
      <div ref={ref} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Interactive Weekly Spending Trend */}
        <div className={`reveal card-hover xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100/50 ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "220ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Spending Analytics</h2>
              <p className="text-xs text-slate-400 mt-0.5">Analisis pengeluaran berkala Anda</p>
            </div>
            
            {/* Toggle tabs */}
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="bg-slate-100/80 p-0.5 rounded-xl flex">
                <button 
                  onClick={() => setPeriod("weekly")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${period === "weekly" ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Mingguan
                </button>
                <button 
                  onClick={() => setPeriod("monthly")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${period === "monthly" ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Bulanan
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span>{period === "weekly" ? "Minggu Lalu" : "Bulan Lalu"}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-600"></span>{period === "weekly" ? "Minggu Ini" : "Bulan Ini"}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Bars */}
          <div className="mt-8 grid grid-cols-6 gap-3 sm:gap-6 items-end h-56 sm:h-64 relative">
            {activeData.map((d, i) => {
              const isAnyBarHovered = hoveredBar !== null;
              const isThisHovered = isAnyBarHovered && hoveredBar.index === i && hoveredBar.type === 'this';
              const isLastHovered = isAnyBarHovered && hoveredBar.index === i && hoveredBar.type === 'last';
              
              return (
                <div key={d.label} className="flex flex-col items-center justify-end h-full gap-2 group">
                  <div className="flex items-end gap-1.5 h-full">
                    {/* This Period Bar */}
                    <div 
                      className={`chart-bar w-3 sm:w-5 bg-brand-600 rounded-t-lg transition-all ${isVisible ? 'bar-rise' : ''}`} 
                      style={{ 
                        height: `${d.thisWeek}%`, 
                        animationDelay: `${i * 60}ms`,
                        opacity: isAnyBarHovered && !isThisHovered ? 0.35 : 1,
                        filter: isThisHovered ? 'brightness(1.1)' : 'none'
                      }}
                      onMouseEnter={(e) => handleBarHover(e, i, 'this', d.thisAmt)}
                      onMouseMove={(e) => handleBarHover(e, i, 'this', d.thisAmt)}
                      onMouseLeave={handleBarLeave}
                    ></div>
                    {/* Last Period Bar */}
                    <div 
                      className={`chart-bar w-3 sm:w-5 bg-slate-200 rounded-t-lg transition-all ${isVisible ? 'bar-rise' : ''}`} 
                      style={{ 
                        height: `${d.last}%`, 
                        animationDelay: `${i * 60 + 60}ms`,
                        opacity: isAnyBarHovered && !isLastHovered ? 0.35 : 1,
                        filter: isLastHovered ? 'brightness(1.05)' : 'none'
                      }}
                      onMouseEnter={(e) => handleBarHover(e, i, 'last', d.lastAmt)}
                      onMouseMove={(e) => handleBarHover(e, i, 'last', d.lastAmt)}
                      onMouseLeave={handleBarLeave}
                    ></div>
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold transition-colors ${isAnyBarHovered && hoveredBar.index === i ? 'text-brand-600' : 'text-slate-400'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown (Donut Chart) */}
        <div className={`reveal card-hover bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100/50 flex flex-col ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "280ms" }}>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Category Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Proporsi pembagian pengeluaran Anda</p>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="88" fill="none" stroke="#f1f5f4" strokeWidth="18"/>
                {donutData.map((d, index) => {
                  const isHovered = hoveredDonut && hoveredDonut.label === d.label;
                  return (
                    <circle 
                      key={d.label}
                      cx="100" cy="100" r="88" fill="none" 
                      stroke={d.color} 
                      strokeWidth={isHovered ? "24" : "18"}
                      strokeDasharray={d.stroke} 
                      strokeDashoffset={d.offset}
                      style={{
                        transformBox: "view-box", 
                        transformOrigin: "100px 100px", 
                        transform: `rotate(${d.rotate})`, 
                        animationDelay: `.15s`,
                        transition: 'stroke-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
                        opacity: hoveredDonut && !isHovered ? 0.6 : 1
                      }}
                      className={`donut-seg ${isVisible ? 'donut-draw' : ''}`}
                      onMouseEnter={() => setHoveredDonut({ label: d.label, amount: d.amount, pct: d.pct })}
                      onMouseLeave={() => setHoveredDonut(null)}
                    />
                  );
                })}
              </svg>
              {/* Dynamic Information Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[10px] tracking-widest text-slate-400 font-extrabold uppercase transition-all duration-300">
                  {activeDonutInfo.label}
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-1 transition-all duration-300">
                  {formatRupiah(activeDonutInfo.amount).replace('+ ', '')}
                </span>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-1.5 transition-all">
                  {activeDonutInfo.pct}%
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="space-y-3 mt-2">
            {donutData.map(d => {
              const isHovered = hoveredDonut && hoveredDonut.label === d.label;
              return (
                <div 
                  key={d.label}
                  className={`legend-item flex flex-col gap-1.5 rounded-xl px-3 py-2 transition-all cursor-pointer ${isHovered ? 'bg-brand-50/60 shadow-sm' : 'hover:bg-slate-50'}`}
                  onMouseEnter={() => setHoveredDonut({ label: d.label, amount: d.amount, pct: d.pct })}
                  onMouseLeave={() => setHoveredDonut(null)}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>{d.label}
                    </span>
                    <span className="font-bold text-slate-800">{formatRupiah(d.amount).replace('+ ', '')}</span>
                  </div>
                  {/* Small visual bar indicator */}
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: isVisible ? `${d.pct}%` : '0%', 
                        background: d.color,
                        filter: isHovered ? 'brightness(1.1)' : 'none'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FLOATING TOOLTIP */}
      <div 
        className={`fixed bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl pointer-events-none z-60 transition-opacity duration-150 border border-slate-700/50 flex items-center gap-1.5 ${tooltip.show ? 'opacity-100' : 'opacity-0'}`}
        style={{ left: tooltip.x, top: tooltip.y }}
      >
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full"></span>
        {tooltip.text}
      </div>
    </>
  );
}

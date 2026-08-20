"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";

import { useCurrency } from "../../hooks/useCurrency";
export default function ChartsRow({ weeklyTrend = [], monthlyTrend = [], categoryData = [] }) {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  // Weekly vs Monthly spending toggle
  const [period, setPeriod] = useState("weekly");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredDonut, setHoveredDonut] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  const activeData = period === "weekly" ? weeklyTrend : monthlyTrend;

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

  const handleBarHover = (e, index, type, amount) => {
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    const y = e.clientY ?? (e.touches && e.touches[0].clientY);
    setHoveredBar({ index, type });
    setTooltip({ 
      show: true, 
      text: `${type === 'this' ? (period === 'weekly' ? t("dashboard.this_week") : t("dashboard.this_month")) : (period === 'weekly' ? t("dashboard.last_week") : t("dashboard.last_month"))}: ${formatCurrency(amount)}`, 
      x: x + 14, 
      y: y - 36 
    });
  };
  
  const handleBarLeave = () => {
    setHoveredBar(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const computedDonutData = useMemo(() => {
    if (!categoryData || categoryData.length === 0) return [];
    
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
    const colors = ['#00685F', '#465569', '#b3572b', '#D97706', '#2563EB', '#7C3AED'];
    
    let currentRotate = 0;
    const circumference = 2 * Math.PI * 88; // 552.92
    
    return categoryData.map((item, index) => {
      const pct = total > 0 ? (item.amount / total) * 100 : 0;
      const strokeVal = (pct / 100) * circumference;
      const emptyVal = circumference - strokeVal;
      const stroke = `${strokeVal.toFixed(2)} ${emptyVal.toFixed(2)}`;
      
      const rotate = currentRotate;
      currentRotate += (pct / 100) * 360;
      
      return {
        label: item.category,
        pct: pct.toFixed(1),
        amount: item.amount,
        color: colors[index % colors.length],
        stroke: stroke,
        offset: emptyVal.toFixed(2),
        rotate: `${rotate}deg`
      };
    });
  }, [categoryData]);

  const totalDonutAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const activeDonutInfo = hoveredDonut || { label: t("dashboard.total_spend") || 'Total Spend', amount: totalDonutAmount, pct: 100 };

  return (
    <>
      <div ref={ref} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Interactive Weekly Spending Trend */}
        <div className={`reveal card-hover xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100/50 ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "220ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">{t("dashboard.spending_analytics") || "Spending Analytics"}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.spending_analytics_desc") || "Analisis pengeluaran berkala Anda"}</p>
            </div>
            
            {/* Toggle tabs */}
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="bg-slate-100/80 p-0.5 rounded-xl flex">
                <button 
                  onClick={() => setPeriod("weekly")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${period === "weekly" ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t("dashboard.weekly") || "Mingguan"}
                </button>
                <button 
                  onClick={() => setPeriod("monthly")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${period === "monthly" ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t("dashboard.monthly") || "Bulanan"}
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span>{period === "weekly" ? t("dashboard.last_week") : t("dashboard.last_month")}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-600"></span>{period === "weekly" ? t("dashboard.this_week") : t("dashboard.this_month")}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container with Grid Lines */}
          <div className="mt-6 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-dashed border-slate-100 w-full"></div>
              <div className="border-b border-dashed border-slate-100 w-full"></div>
              <div className="border-b border-dashed border-slate-100 w-full"></div>
              <div className="border-b border-dashed border-slate-100 w-full"></div>
            </div>

            {/* Bars Grid */}
            <div className={`grid ${period === "weekly" ? "grid-cols-7" : "grid-cols-6"} gap-2 sm:gap-4 items-end h-56 sm:h-64 relative z-10 pt-4 pb-1 border-b border-slate-200/60`}>
              {activeData.map((d, i) => {
                const isAnyBarHovered = hoveredBar !== null;
                const isThisHovered = isAnyBarHovered && hoveredBar.index === i && hoveredBar.type === 'this';
                const isLastHovered = isAnyBarHovered && hoveredBar.index === i && hoveredBar.type === 'last';
                
                const thisHeight = d.thisAmt > 0 ? Math.max(d.thisWeek, 4) : (d.thisWeek > 0 ? d.thisWeek : 0);
                const lastHeight = d.lastAmt > 0 ? Math.max(d.last, 4) : (d.last > 0 ? d.last : 0);

                return (
                  <div key={d.label} className="flex flex-col items-center justify-end h-full gap-2 group">
                    <div className="flex items-end gap-1 sm:gap-2 h-full w-full justify-center">
                      {/* This Period Bar */}
                      <div 
                        className={`chart-bar w-3.5 sm:w-6 bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-md transition-all duration-300 relative ${isVisible ? 'bar-rise' : ''}`} 
                        style={{ 
                          height: `${thisHeight}%`, 
                          animationDelay: `${i * 50}ms`,
                          opacity: isAnyBarHovered && !isThisHovered ? 0.35 : 1,
                          boxShadow: isThisHovered ? '0 4px 12px rgba(0, 104, 95, 0.25)' : 'none'
                        }}
                        onMouseEnter={(e) => handleBarHover(e, i, 'this', d.thisAmt)}
                        onMouseMove={(e) => handleBarHover(e, i, 'this', d.thisAmt)}
                        onMouseLeave={handleBarLeave}
                      >
                        {isThisHovered && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-300 rounded-full animate-ping pointer-events-none"></div>
                        )}
                      </div>
                      {/* Last Period Bar */}
                      <div 
                        className={`chart-bar w-3.5 sm:w-6 bg-slate-200/80 hover:bg-slate-300 rounded-t-md transition-all duration-300 relative ${isVisible ? 'bar-rise' : ''}`} 
                        style={{ 
                          height: `${lastHeight}%`, 
                          animationDelay: `${i * 50 + 40}ms`,
                          opacity: isAnyBarHovered && !isLastHovered ? 0.35 : 1,
                        }}
                        onMouseEnter={(e) => handleBarHover(e, i, 'last', d.lastAmt)}
                        onMouseMove={(e) => handleBarHover(e, i, 'last', d.lastAmt)}
                        onMouseLeave={handleBarLeave}
                      ></div>
                    </div>
                    <span className={`text-[11px] sm:text-xs font-semibold transition-colors ${isAnyBarHovered && hoveredBar.index === i ? 'text-brand-700 font-bold' : 'text-slate-500'}`}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown (Donut Chart) */}
        <div className={`reveal card-hover bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100/50 flex flex-col ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "280ms" }}>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{t("dashboard.category_breakdown") || "Category Breakdown"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.category_breakdown_desc") || "Proporsi pembagian pengeluaran Anda"}</p>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="88" fill="none" stroke="#f1f5f4" strokeWidth="18"/>
                {computedDonutData.map((d, index) => {
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 overflow-hidden">
                <span 
                  className="text-[10px] tracking-wider text-slate-400 font-extrabold uppercase transition-all duration-300 truncate w-full px-2"
                  title={activeDonutInfo.label}
                >
                  {activeDonutInfo.label}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 transition-all duration-300 truncate w-full px-1">
                  {formatCurrency(activeDonutInfo.amount)}
                </span>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full mt-1 transition-all">
                  {activeDonutInfo.pct}%
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="space-y-3 mt-2">
            {computedDonutData.map(d => {
              const isHovered = hoveredDonut && hoveredDonut.label === d.label;
              return (
                <div 
                  key={d.label}
                  className={`legend-item flex flex-col gap-1.5 rounded-xl px-3 py-2 transition-all cursor-pointer ${isHovered ? 'bg-brand-50/60 shadow-sm' : 'hover:bg-slate-50'}`}
                  onMouseEnter={() => setHoveredDonut({ label: d.label, amount: d.amount, pct: d.pct })}
                  onMouseLeave={() => setHoveredDonut(null)}
                >
                  <div className="flex items-center justify-between text-sm gap-2">
                    <span className="flex items-center gap-2 text-slate-600 font-medium truncate min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
                      <span className="truncate" title={d.label}>{d.label}</span>
                    </span>
                    <span className="font-extrabold text-slate-900 tabular-nums">{formatCurrency(d.amount)}</span>
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

"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

const trendData = [
  { month: "Jan", income: 45, expense: 30, incomeFull: "Rp 8.000.000", expenseFull: "Rp 3.200.000" },
  { month: "Feb", income: 52, expense: 35, incomeFull: "Rp 8.500.000", expenseFull: "Rp 4.100.000" },
  { month: "Mar", income: 48, expense: 40, incomeFull: "Rp 7.800.000", expenseFull: "Rp 5.200.000" },
  { month: "Apr", income: 60, expense: 32, incomeFull: "Rp 9.200.000", expenseFull: "Rp 4.000.000" },
  { month: "May", income: 55, expense: 28, incomeFull: "Rp 8.900.000", expenseFull: "Rp 3.500.000" },
  { month: "Jun", income: 65, expense: 42, incomeFull: "Rp 10.500.000", expenseFull: "Rp 6.000.000" }
];

const distributionData = [
  { name: "Food", value: 40, color: "#00685F" },
  { name: "Bills", value: 25, color: "#2dd4bf" },
  { name: "Shopping", value: 20, color: "#99f6e4" },
  { name: "Transport", value: 15, color: "#e2e8f0" }
];

export default function ReportsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Income vs Expense Trends Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <h4 className="font-bold text-slate-800 text-base sm:text-lg">Income vs Expense Trends</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#00685F] rounded-full"></span> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Expense
            </span>
          </div>
        </div>

        {/* Trend Area Chart Container */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00685F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00685F" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} 
              />
              <YAxis hide domain={[0, 80]} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-extrabold text-slate-300 border-b border-slate-700/60 pb-1 mb-1">{label} 2026</p>
                        <p className="text-[#2dd4bf] font-bold">Income: {data.incomeFull}</p>
                        <p className="text-red-400 font-bold">Expense: {data.expenseFull}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#00685F" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Distribution Donut Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-4">Spending Distribution</h4>
        
        {/* Donut Container with Center Label */}
        <div className="h-52 relative my-2 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                        {data.name}: {data.value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total</p>
            <h5 className="text-xl font-black text-slate-800 leading-none mt-1">100%</h5>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 select-none pt-2 border-t border-slate-50">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00685F]"></span>
              <span className="font-medium text-slate-600">Food</span>
            </div>
            <span className="font-bold text-slate-900">40%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf]"></span>
              <span className="font-medium text-slate-600">Bills</span>
            </div>
            <span className="font-bold text-slate-900">25%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#99f6e4]"></span>
              <span className="font-medium text-slate-600">Shopping</span>
            </div>
            <span className="font-bold text-slate-900">20%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="font-medium text-slate-600">Transport</span>
            </div>
            <span className="font-bold text-slate-900">15%</span>
          </div>
        </div>
      </div>

    </div>
  );
}

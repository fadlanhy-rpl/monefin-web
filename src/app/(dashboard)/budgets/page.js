"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Zap, 
  Film, 
  PiggyBank, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Lightbulb 
} from "lucide-react";

export default function BudgetsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Monthly Budget</h2>
            <p className="text-gray-400 text-sm mt-1">Track your spending efficiency across categories</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold shadow-sm select-none">
              <ChevronLeft className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" />
              <span className="px-4 text-slate-700">July 2026</span>
              <ChevronRight className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" />
            </div>
            <button className="press-scale flex items-center gap-2 bg-[#00685F] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer">
              <Plus className="w-5 h-5" />
              Set New Budget
            </button>
          </div>
        </div>

        {/* BUDGET CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Food & Dining */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-100 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Food & Dining</h3>
                <p className="text-xs text-gray-400">Daily meals and groceries</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 1,200,000 / Rp 2,000,000</span>
                <span className="text-brand-600">Rp 800,000 left</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00685F] h-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600">
              <CheckCircle className="w-3.5 h-3.5" /> On track (60% spent)
            </div>
          </div>

          {/* Transport */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-200 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Transport</h3>
                <p className="text-xs text-gray-400">Fuel, tolls, and public transit</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 1,600,000 / Rp 2,000,000</span>
                <span className="text-orange-600">Rp 400,000 left</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-full" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600">
              <AlertCircle className="w-3.5 h-3.5" /> Approaching limit (80% spent)
            </div>
          </div>

          {/* Shopping */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-300 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Shopping</h3>
                <p className="text-xs text-gray-400">Clothing and personal items</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 1,050,000 / Rp 1,000,000</span>
                <span className="text-red-600 uppercase">Over by Rp 50,000</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" /> Budget exceeded (105% spent)
            </div>
          </div>

          {/* Utilities */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-400 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Utilities</h3>
                <p className="text-xs text-gray-400">Electricity, water, and internet</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 450,000 / Rp 1,500,000</span>
                <span className="text-blue-600">Rp 1,050,000 left</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: "30%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
              <Info className="w-3.5 h-3.5" /> Low utilization (30% spent)
            </div>
          </div>

          {/* Entertainment */}
          <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-500 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Entertainment</h3>
                <p className="text-xs text-gray-400">Streaming, cinema, and outings</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 720,000 / Rp 800,000</span>
                <span className="text-amber-600">Rp 80,000 left</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: "90%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" /> Almost reached (90% spent)
            </div>
          </div>

          {/* Savings Goal */}
          <div className={`bg-brand-50 p-6 rounded-[2rem] border border-[#c0ded9]/50 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-700 delay-600 ease-out transform hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#00685F] rounded-xl flex items-center justify-center text-white">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Savings Goal</h3>
                <p className="text-xs text-gray-400">Emergency fund & investment</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Rp 5,000,000 / Rp 5,000,000</span>
                <span className="text-brand-700 font-extrabold">Completed!</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#00685F] h-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-600">
              <Sparkles className="w-3.5 h-3.5" /> Goal reached for July
            </div>
          </div>
        </div>

        {/* BOTTOM OVERVIEW SECTION */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10 transition-all duration-700 delay-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Spending Overview Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center hover:shadow-lg transition-shadow">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Spending Overview</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                You've spent 72% of your total monthly budget across all categories. You have Rp 4,500,000 remaining.
              </p>
              <div className="flex gap-10 pt-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Budget</p>
                  <p className="text-xl font-black text-slate-900 mt-1">Rp 12,300,000</p>
                </div>
                <div className="border-l border-slate-100 pl-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Spent</p>
                  <p className="text-xl font-black text-brand-600 mt-1">Rp 8,800,000</p>
                </div>
              </div>
            </div>
            {/* Donut Chart */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke="#00685F" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="123" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-slate-900">72%</span>
              </div>
            </div>
          </div>

          {/* Smart Saving Tip Card */}
          <div className="bg-brand-50/40 p-8 rounded-[2.5rem] border border-brand-100/30 flex gap-6 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="space-y-4 relative z-10">
              <h3 className="text-xl font-bold text-slate-900">Smart Saving Tip</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Based on your current dining trends, switching to home cooking on weekends could save you Rp 450,000 next month.
              </p>
              <button className="flex items-center gap-2 text-brand-600 font-bold text-sm group cursor-pointer hover:underline">
                Enable Auto-Savings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20 text-[#00685F]">
              <Lightbulb style={{ width: "160px", height: "160px" }} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

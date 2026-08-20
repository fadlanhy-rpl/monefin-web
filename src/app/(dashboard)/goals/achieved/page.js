"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { 
  ArrowLeft, 
  Trophy, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Calendar,
  Laptop, 
  Plane, 
  GraduationCap, 
  Target, 
  Shield, 
  Heart, 
  Car, 
  Home
} from "lucide-react";
import { getGoals } from "../../../../services/goal.service";
import GoalDetailModal from "../../../../components/goals/GoalDetailModal";
import { useLanguage } from "../../../../context/LanguageContext";
import { useCurrency } from "../../../../hooks/useCurrency";

const iconMap = {
  laptop: Laptop,
  plane: Plane,
  graduation: GraduationCap,
  target: Target,
  shield: Shield,
  heart: Heart,
  car: Car,
  home: Home
};

export default function AchievedGoalsPage() {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchAchievedGoals();
  }, []);

  const fetchAchievedGoals = async () => {
    setLoading(true);
    try {
      const res = await getGoals();
      const all = res.data || [];
      setAchievedGoals(all.filter((g) => g.is_achieved || (parseFloat(g.current_amount) >= parseFloat(g.target_amount))));
    } catch (err) {
      console.error("Failed to fetch achieved goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = achievedGoals.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalSaved = achievedGoals.reduce((sum, g) => sum + (parseFloat(g.target_amount) || 0), 0);

  const renderIcon = (iconName) => {
    const IconComp = iconMap[iconName] || Trophy;
    return <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link 
                href="/goals" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00685F] hover:underline mb-2 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>{t("goals.back_to_goals") || "Kembali ke Target Tabungan"}</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t("goals.achieved_title") || "Achieved Goals"}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold">
                    {t("goals.achieved_subtitle") || "Daftar seluruh impian dan target keuangan yang berhasil Anda raih! 🎉"}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Saved Badge */}
            <div className="bg-gradient-to-br from-[#00685F] to-[#004D46] text-white p-4 rounded-2xl shadow-lg shadow-[#00685F]/20 flex items-center gap-4 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest">{t("goals.total_achieved_funds") || "Total Dana Terkumpul"}</p>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">{formatCurrency(totalSaved)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("goals.search_placeholder") || "Cari target yang telah tercapai..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition"
              />
            </div>
            <div className="text-xs font-bold text-slate-400 select-none self-end sm:self-center">
              {t("goals.showing_page") || "Menampilkan"} {filteredGoals.length} {t("goals.of") || "dari"} {achievedGoals.length} {t("goals.achieved_goals") || "Target Tercapai"}
            </div>
          </div>
        </div>

        {/* Achieved Goals Grid List */}
        <div className={`transition-all duration-700 delay-400 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{language === 'en' ? "No Achieved Goals Yet" : "Belum Ada Target yang Tercapai"}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed">
                  {searchQuery 
                    ? (language === 'en' ? `No achievements found matching "${searchQuery}"` : `Tidak ditemukan pencapaian dengan kata kunci "${searchQuery}"`)
                    : (language === 'en' ? "Complete deposits on your savings goals to view your accomplishments here!" : "Selesaikan setoran target tabungan Anda untuk melihat pencapaian luar biasa Anda di sini!")}
                </p>
              </div>
              <Link 
                href="/goals" 
                className="inline-block bg-[#00685F] text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-[#004D46] transition shadow-md"
              >
                {language === 'en' ? "View Active Goals" : "Lihat Target Aktif"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGoals.map((g) => {
                const completedDate = g.updated_at 
                  ? new Date(g.updated_at).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                  : (language === 'en' ? "Today" : "Hari ini");
                const targetAmt = parseFloat(g.target_amount) || 0;

                return (
                  <div 
                    key={g.id}
                    onClick={() => setSelectedGoal(g)}
                    className="bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden flex flex-col justify-between space-y-5 cursor-pointer select-none hover:border-[#00685F]/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {renderIcon(g.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight group-hover:text-[#00685F] transition-colors">{g.name}</h3>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">{g.description || (language === 'en' ? "Dream savings goal" : "Target tabungan impian")}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-xl border border-emerald-100 flex items-center gap-1.5 shrink-0 select-none">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'en' ? "ACHIEVED" : "TERCAPAI"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'en' ? "Total Realized Amount" : "Total Nominal Realisasi"}</p>
                        <h4 className="text-xl font-black text-[#00685F] tracking-tight mt-0.5">{formatCurrency(targetAmt)}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{language === 'en' ? `Achieved: ${completedDate}` : `Tercapai: ${completedDate}`}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goal Detail Modal */}
      <GoalDetailModal 
        isOpen={Boolean(selectedGoal)}
        onClose={() => setSelectedGoal(null)}
        goal={selectedGoal}
      />
    </DashboardLayout>
  );
}

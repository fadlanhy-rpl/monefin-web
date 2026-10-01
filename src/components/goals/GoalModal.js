import { 
  X, 
  Laptop, 
  Plane, 
  GraduationCap, 
  Target, 
  Shield, 
  Heart, 
  Car, 
  Home,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  BarChart2,
  PieChart
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function GoalModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formTitle,
  setFormTitle,
  formSubtitle,
  setFormSubtitle,
  formTarget,
  setFormTarget,
  formCurrent,
  setFormCurrent,
  formDeadlineDate,
  setFormDeadlineDate,
  formType,
  setFormType,
  formTag,
  setFormTag,
  formIcon,
  setFormIcon
}) {
  const { t, language } = useLanguage();
  const { currencySymbol } = useCurrency();
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const iconsList = [
    { id: "laptop", label: language === "en" ? "Laptop" : "Komputer", icon: Laptop },
    { id: "plane", label: language === "en" ? "Vacation" : "Liburan", icon: Plane },
    { id: "graduation", label: language === "en" ? "Education" : "Pendidikan", icon: GraduationCap },
    { id: "target", label: language === "en" ? "Target" : "Sasaran", icon: Target },
    { id: "shield", label: language === "en" ? "Protection" : "Proteksi", icon: Shield },
    { id: "heart", label: language === "en" ? "Social" : "Sosial", icon: Heart },
    { id: "car", label: language === "en" ? "Vehicle" : "Kendaraan", icon: Car },
    { id: "home", label: language === "en" ? "Property" : "Properti", icon: Home }
  ];

  const monthNames = language === "en" ? MONTH_NAMES_EN : MONTH_NAMES_ID;
  const dayHeaders = language === "en" ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const [viewDate, setViewDate] = useState(() => {
    if (formDeadlineDate) {
      const d = new Date(formDeadlineDate);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  });

  // Format thousand separator (guards against SQL decimal strings like "1000000.00")
  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const str = String(val).trim();
    const normalized =
      typeof val === "number" || /^-?\d+\.\d{1,2}$/.test(str)
        ? String(Math.round(Number(val) || 0))
        : str;
    const raw = normalized.replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleTargetChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormTarget(rawDigits);
  };

  const handleCurrentChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setFormCurrent(rawDigits);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const y = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(m) || isNaN(d)) return dateStr;
    return `${d} ${monthNames[m]} ${y}`;
  };

  if (!isOpen) return null;

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 select-none">
            {modalMode === "add" ? (t("goals.add_title") || "Buat Target Baru") : (t("goals.edit_title") || "Ubah Target Tabungan")}
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.goal_name") || "Nama Target"}</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-bold text-slate-800"
              placeholder={t("goals.goal_name_placeholder") || "Contoh: Beli Laptop Baru, Dana Darurat"}
            />
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.description") || "Deskripsi / Alasan"}</label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-semibold text-slate-800"
              placeholder={t("goals.description_placeholder") || "Contoh: Tabungan cadangan, reward karir"}
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.icon") || "Pilih Ikon Target"}</label>
            <div className="grid grid-cols-4 gap-2.5">
              {iconsList.map((item) => {
                const Icon = item.icon;
                const isActive = formIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormIcon(item.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#00685F]/10 border-[#00685F] text-[#00685F] scale-105 font-bold shadow-sm" 
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[9px] tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.target_amount") || "Nominal Target"}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formatThousand(formTarget)}
                onChange={handleTargetChange}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-black text-slate-800"
                placeholder={t("goals.target_amount_placeholder") || "0"}
              />
            </div>
          </div>

          {/* Current Saved Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.initial_amount") || "Tabungan Saat Ini"}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                value={formatThousand(formCurrent)}
                onChange={handleCurrentChange}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-base md:text-sm font-black text-slate-800"
                placeholder={t("goals.initial_amount_placeholder") || "0"}
              />
            </div>
          </div>

          {/* Custom Type Selector (Dropdown Menu) */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.card_style") || "Gaya Tampilan Visual"}</label>
            <div 
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className={`w-full px-4 py-3 bg-slate-50/80 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer group select-none ${
                isTypeDropdownOpen ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white shadow-xs" : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00685F] flex items-center justify-center shrink-0 border border-emerald-100">
                  {formType === "circular" ? <PieChart className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
                </div>
                <span className="font-bold text-slate-900">
                  {formType === "circular"
                    ? (t("goals.style_circular") || "Circular Card (Donut Chart Kanan)")
                    : (t("goals.style_linear") || "Linear Card (Bar Progres Lebar)")}
                </span>
              </div>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isTypeDropdownOpen ? "bg-[#00685F]/10 text-[#00685F]" : "text-slate-400 group-hover:text-slate-600"
              }`}>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTypeDropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {isTypeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTypeDropdownOpen(false)}></div>
                <div className="absolute z-30 w-full top-full mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button 
                    type="button"
                    onClick={() => { setFormType("linear"); setIsTypeDropdownOpen(false); }}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer ${
                      formType === "linear"
                        ? "bg-[#00685F]/10 text-[#00685F] font-bold ring-1 ring-[#00685F]/20"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${formType === "linear" ? "bg-emerald-100/50 border-emerald-200 text-[#00685F]" : "bg-slate-100 border-slate-200/60 text-slate-500"}`}>
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">{t("goals.style_linear") || "Linear Card (Bar Progres Lebar)"}</span>
                    </div>
                    {formType === "linear" && (
                      <div className="w-5 h-5 rounded-full bg-[#00685F] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setFormType("circular"); setIsTypeDropdownOpen(false); }}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer ${
                      formType === "circular"
                        ? "bg-[#00685F]/10 text-[#00685F] font-bold ring-1 ring-[#00685F]/20"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${formType === "circular" ? "bg-emerald-100/50 border-emerald-200 text-[#00685F]" : "bg-slate-100 border-slate-200/60 text-slate-500"}`}>
                        <PieChart className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">{t("goals.style_circular") || "Circular Card (Donut Chart Kanan)"}</span>
                    </div>
                    {formType === "circular" && (
                      <div className="w-5 h-5 rounded-full bg-[#00685F] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Type specific fields */}
          {formType === "linear" ? (
            /* Custom Modern Calendar Picker */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.target_date") || "Tanggal Batas (Opsional)"}</label>
              <div 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold hover:border-[#00685F] transition cursor-pointer flex justify-between items-center select-none"
              >
                <span className={formDeadlineDate ? "text-slate-900" : "text-slate-400 font-semibold"}>
                  {formDeadlineDate ? formatDisplayDate(formDeadlineDate) : (t("goals.select_date") || "Pilih Tanggal Batas")}
                </span>
                <CalendarIcon className="w-4.5 h-4.5 text-[#00685F]" />
              </div>

              {isCalendarOpen && (
                <div className="mt-2.5 bg-slate-50 border border-slate-200/80 rounded-3xl p-4.5 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header Month Year & Prev/Next */}
                  <div className="flex items-center justify-between mb-3.5 px-1 select-none">
                    <span className="font-extrabold text-sm text-slate-900">
                      {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        type="button" 
                        onClick={handlePrevMonth} 
                        className="p-1.5 hover:bg-white rounded-xl transition text-slate-600 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextMonth} 
                        className="p-1.5 hover:bg-white rounded-xl transition text-slate-600 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1.5 select-none">
                    {dayHeaders.map((d) => (
                      <span key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{d}</span>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isSelected = formDeadlineDate === dateIso;
                      const isToday = todayIso === dateIso;

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => { setFormDeadlineDate(dateIso); setIsCalendarOpen(false); }}
                          className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/30 scale-105" 
                              : isToday 
                              ? "bg-emerald-100/80 text-[#00685F] border border-[#00685F]/30" 
                              : "hover:bg-white text-slate-700 hover:shadow-xs"
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Quick Options */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 text-xs font-bold select-none">
                    <button 
                      type="button" 
                      onClick={() => { setFormDeadlineDate(""); setIsCalendarOpen(false); }}
                      className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {language === "en" ? "No Deadline" : "Tanpa Batas"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setFormDeadlineDate(todayIso); setIsCalendarOpen(false); }}
                      className="text-[#00685F] hover:underline cursor-pointer"
                    >
                      {language === "en" ? "Set Today" : "Set Hari Ini"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">{t("goals.color_tag") || "Lencana Tag"}</label>
              <input
                type="text"
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
                placeholder={language === 'en' ? "e.g., Safety, Travel" : "Contoh: Keamanan, Liburan"}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              {t("common.cancel") || (language === "en" ? "Cancel" : "Batal")}
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {t("common.save") || (language === "en" ? "Save" : "Simpan")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

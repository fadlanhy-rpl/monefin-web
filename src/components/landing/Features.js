"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Wallet,
  Sparkles,
  Target,
  Sliders,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Zap,
  ScanLine,
  Receipt,
  Split,
  Users,
  Copy,
  Check,
  Calendar,
  Download,
  Lock,
  FileSpreadsheet,
  Layers,
  Smartphone,
  Flame,
  Shield,
} from "lucide-react";

export const Features = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  // Tab State
  const [activeFeatureTab, setActiveFeatureTab] = useState("budgeting");

  // Tab Scroll State & Refs
  const tabScrollRef = useRef(null);
  const tabButtonRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScroll]);

  const handleTabClick = (tabId) => {
    setActiveFeatureTab(tabId);
    const container = tabScrollRef.current;
    const btn = tabButtonRefs.current[tabId];
    if (container && btn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const offsetLeft = btnRect.left - containerRect.left + container.scrollLeft;
      const targetScrollLeft = offsetLeft - (container.clientWidth / 2) + (btn.clientWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
    // Prevent browser from horizontally shifting the page
    if (typeof window !== "undefined" && window.scrollX !== 0) {
      window.scrollTo({ left: 0, behavior: "instant" });
    }
  };

  const scrollTabs = (direction) => {
    const el = tabScrollRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Tab 1: Budgeting state
  const [simulatedIncome, setSimulatedIncome] = useState(10000000);

  // Tab 2: Accounts state
  const [selectedAccount, setSelectedAccount] = useState("bca");

  // Tab 3: Receipt Scanner state
  const [selectedReceipt, setSelectedReceipt] = useState("kopi");
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [receiptSaved, setReceiptSaved] = useState(false);

  // Tab 4: Split Bill state
  const [splitBillAmount, setSplitBillAmount] = useState(360000);
  const [splitPeopleCount, setSplitPeopleCount] = useState(4);
  const [splitIncludeTax, setSplitIncludeTax] = useState(true);
  const [splitIncludeService, setSplitIncludeService] = useState(false);
  const [splitRoundUp, setSplitRoundUp] = useState(true);
  const [splitCopied, setSplitCopied] = useState(false);

  // Tab 5: AI Copilot state
  const [activePrompt, setActivePrompt] = useState("coffee");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Tab 6: Goals state
  const [selectedGoal, setSelectedGoal] = useState("emergency");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Receipt Scanner Presets
  const receiptsData = {
    kopi: {
      id: "kopi",
      merchant: "Kopi Kenangan Mall",
      date: "24 Sep 2026, 14:20",
      total: 48000,
      category: isEn ? "Food & Beverage" : "Makanan & Minuman",
      account: isEn ? "BCA Main" : "BCA Utama",
      items: [
        { name: "Kenangan Mantan Large", price: 28000 },
        { name: "Toast Coklat Klasik", price: 20000 },
      ],
      ocrConfidence: "99.4%",
    },
    superindo: {
      id: "superindo",
      merchant: "Superindo Swalayan",
      date: "23 Sep 2026, 19:15",
      total: 184500,
      category: isEn ? "Groceries & Supplies" : "Belanja Kebutuhan",
      account: isEn ? "Mandiri Payroll" : "Mandiri Gaji",
      items: [
        { name: "Apel Fuji 1kg", price: 42000 },
        { name: "Minyak Goreng 2L", price: 38500 },
        { name: "Daging Ayam Fillet", price: 64000 },
        { name: "Susu UHT Full Cream", price: 40000 },
      ],
      ocrConfidence: "98.9%",
    },
    spbu: {
      id: "spbu",
      merchant: "SPBU Pertamina 31.124",
      date: "22 Sep 2026, 08:45",
      total: 150000,
      category: isEn ? "Transportation & Fuel" : "Transportasi & Bensin",
      account: "GoPay E-Wallet",
      items: [{ name: "Pertamax Turbo 10.3L", price: 150000 }],
      ocrConfidence: "99.8%",
    },
  };

  const handleSelectReceipt = (receiptId) => {
    setIsScanningReceipt(true);
    setSelectedReceipt(receiptId);
    setReceiptSaved(false);
    setTimeout(() => {
      setIsScanningReceipt(false);
    }, 320);
  };

  const handleSaveReceipt = () => {
    setReceiptSaved(true);
    setTimeout(() => {
      setReceiptSaved(false);
    }, 3500);
  };

  const currentReceipt = receiptsData[selectedReceipt] || receiptsData.kopi;

  // Split Bill Calculations
  const splitTaxAmount = splitIncludeTax ? Math.round(splitBillAmount * 0.1) : 0;
  const splitServiceAmount = splitIncludeService ? Math.round(splitBillAmount * 0.05) : 0;
  const splitGrandTotal = splitBillAmount + splitTaxAmount + splitServiceAmount;
  const splitRawPerPerson = splitGrandTotal / splitPeopleCount;
  const splitPerPerson = splitRoundUp
    ? Math.ceil(splitRawPerPerson / 1000) * 1000
    : Math.round(splitRawPerPerson);

  const getSplitShareText = () => {
    if (isEn) {
      return `Hi everyone! Here's the split bill breakdown for Warung Pasta:\nTotal: ${formatRupiah(splitGrandTotal)} (${splitPeopleCount} people)\n=> ${formatRupiah(splitPerPerson)} / person\n\nPlease transfer to BCA 1234567890 a/n Fadlan. Thank you!`;
    }
    return `Halo teman-teman! Ini rincian patungan makan bareng di Warung Pasta:\nTotal: ${formatRupiah(splitGrandTotal)} (${splitPeopleCount} orang)\n=> ${formatRupiah(splitPerPerson)} / orang\n\nBisa transfer ke BCA 1234567890 an Fadlan. Terima kasih!`;
  };

  const handleCopySplitText = () => {
    const text = getSplitShareText();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setSplitCopied(true);
    setTimeout(() => setSplitCopied(false), 3000);
  };

  const handlePromptClick = (key) => {
    setIsGeneratingAi(true);
    setActivePrompt(key);
    setTimeout(() => setIsGeneratingAi(false), 280);
  };

  const goalsData = {
    emergency: {
      title: t("features.t4_goal1"),
      target: 48000000,
      current: 36000000,
      monthly: 2000000,
      color: "text-emerald-600",
      bg: "bg-emerald-500",
    },
    house: {
      title: t("features.t4_goal2"),
      target: 120000000,
      current: 48000000,
      monthly: 3500000,
      color: "text-brand-600",
      bg: "bg-brand-600",
    },
    vacation: {
      title: t("features.t4_goal3"),
      target: 25000000,
      current: 20000000,
      monthly: 1500000,
      color: "text-amber-600",
      bg: "bg-amber-500",
    },
  };

  const activeGoal = goalsData[selectedGoal] || goalsData.emergency;
  const goalPercent = Math.min(
    100,
    Math.round((activeGoal.current / activeGoal.target) * 100)
  );
  const remainingMonths = Math.max(
    1,
    Math.ceil((activeGoal.target - activeGoal.current) / activeGoal.monthly)
  );

  const featureTabs = [
    { id: "budgeting", label: t("features.tab1"), icon: Sliders },
    { id: "accounts", label: t("features.tab2"), icon: Wallet },
    { id: "receipt", label: t("features.tab3"), icon: ScanLine },
    { id: "splitbill", label: t("features.tab4"), icon: Split },
    { id: "ai", label: t("features.tab5"), icon: Sparkles },
    { id: "goals", label: t("features.tab6"), icon: Target },
  ];

  return (
    <section
      id="features"
      className="relative z-10 py-16 sm:py-24 bg-gradient-to-b from-white via-[#f0f7f5] to-white border-b border-slate-200/80 overflow-hidden"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute w-full h-full opacity-[0.07] stroke-brand-700"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0,200 C 300,100 600,300 1200,150" strokeWidth="2" />
          <path d="M 0,400 C 400,250 800,500 1200,350" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M 0,600 C 350,450 750,700 1200,550" strokeWidth="1.5" />
        </svg>
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight">
            {t("features.title")}
          </h2>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Modern Interactive Feature Navigation Tabs (Always flex single-row with smooth scroll) */}
        <div className="relative max-w-5xl mx-auto w-full group/tabs">
          {/* Left Arrow Button & Subtle Gradient Mask */}
          {canScrollLeft && (
            <div className="hidden sm:flex absolute left-0 top-0 bottom-0 z-20 items-center pl-1 pointer-events-none">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none rounded-l-full" />
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                aria-label="Scroll tabs left"
                className="relative z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:text-brand-700 hover:scale-105 active:scale-95 transition flex items-center justify-center pointer-events-auto cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Scrollable Flex Track */}
          <div
            ref={tabScrollRef}
            onScroll={checkScroll}
            className="flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar scroll-smooth py-2 px-3 sm:px-4 w-full touch-pan-x"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-100/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-slate-200/90 shadow-sm shrink-0">
              {featureTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFeatureTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => (tabButtonRefs.current[tab.id] = el)}
                    onClick={() => handleTabClick(tab.id)}
                    className={`shrink-0 flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 select-none cursor-pointer ${
                      isActive
                        ? "bg-white text-brand-700 shadow-md border border-slate-200/90 font-black ring-1 ring-brand-500/20 scale-[1.02]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/70 active:scale-98"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Arrow Button & Subtle Gradient Mask */}
          {canScrollRight && (
            <div className="hidden sm:flex absolute right-0 top-0 bottom-0 z-20 items-center pr-1 pointer-events-none justify-end">
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none rounded-r-full" />
              <button
                type="button"
                onClick={() => scrollTabs("right")}
                aria-label="Scroll tabs right"
                className="relative z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md text-slate-700 hover:text-brand-700 hover:scale-105 active:scale-95 transition flex items-center justify-center pointer-events-auto cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: AUTO BUDGETING 50/30/20 */}
        {activeFeatureTab === "budgeting" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? "Proven 50/30/20 Wealth Formula" : "Formula Finansial Teruji Dunia"}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t1_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t1_desc")}
              </p>

              {/* Interactive Income Slider & Quick Presets */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t("features.t1_slider_label")}</span>
                  <span className="text-brand-600 text-sm sm:text-base font-black tabular-nums">
                    {formatRupiah(simulatedIncome)}
                  </span>
                </div>

                <input
                  type="range"
                  min="3000000"
                  max="35000000"
                  step="500000"
                  value={simulatedIncome}
                  onChange={(e) => setSimulatedIncome(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] overflow-x-auto no-scrollbar scroll-smooth touch-pan-x py-0.5">
                  {[
                    { label: t("features.t1_preset_fresh"), value: 5000000 },
                    { label: t("features.t1_preset_mid"), value: 10000000 },
                    { label: t("features.t1_preset_senior"), value: 20000000 },
                    { label: "Rp 35 Jt", value: 35000000 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setSimulatedIncome(preset.value)}
                      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                        simulatedIncome === preset.value
                          ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-time 50/30/20 Breakdown Cards */}
            <div className="lg:col-span-6 space-y-3.5">
              {/* Category 1: Needs (50%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-brand-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-600 shrink-0" />
                    {t("features.t1_cat1")}
                  </span>
                  <span className="text-brand-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.5)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-300"
                    style={{ width: "50%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat1_desc")}
                </p>
              </div>

              {/* Category 2: Wants (30%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    {t("features.t1_cat2")}
                  </span>
                  <span className="text-emerald-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.3)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: "30%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat2_desc")}
                </p>
              </div>

              {/* Category 3: Savings (20%) */}
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-amber-300 transition-colors">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    {t("features.t1_cat3")}
                  </span>
                  <span className="text-amber-700 font-black text-sm sm:text-base tabular-nums">
                    {formatRupiah(simulatedIncome * 0.2)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: "20%" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t("features.t1_cat3_desc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-REKENING & WALLETS */}
        {activeFeatureTab === "accounts" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("features.t2_sync_status")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t2_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t2_desc")}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-800">{t("features.t2_why_title")}</p>
                <p className="text-slate-600 leading-relaxed">
                  {t("features.t2_why_desc")}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {[
                {
                  id: "bca",
                  name: isEn ? "BCA Main Savings" : "BCA Tabungan Utama",
                  category: isEn ? "Bank Account" : "Rekening Bank",
                  balance: 28500000,
                  logo: "/images/providers/bca.svg",
                },
                {
                  id: "mandiri",
                  name: isEn ? "Mandiri Salary Payroll" : "Mandiri Payroll Gaji",
                  category: isEn ? "Bank Account" : "Rekening Bank",
                  balance: 16000000,
                  logo: "/images/providers/mandiri.svg",
                },
                {
                  id: "gopay",
                  name: "GoPay E-Wallet",
                  category: "E-Wallet",
                  balance: 4250000,
                  logo: "/images/providers/gopay.svg",
                },
                {
                  id: "bibit",
                  name: isEn ? "Bibit Liquid Mutual Fund" : "Bibit Reksadana Likuid",
                  category: isEn ? "Money Market Fund" : "Investasi Pasar Uang",
                  balance: 12000000,
                  logo: "/images/providers/bibit.svg",
                },
              ].map((acc) => {
                const isSelected = selectedAccount === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center text-xs ${
                      isSelected
                        ? "bg-slate-50 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-2 shrink-0">
                        <img
                          src={acc.logo}
                          alt={acc.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xs sm:text-sm">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {acc.category}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-sm sm:text-base tabular-nums">
                      {formatRupiah(acc.balance)}
                    </span>
                  </div>
                );
              })}

              {/* Total Aggregate Net Worth Card */}
              <div className="p-4 sm:p-5 bg-[#071613] text-white rounded-2xl shadow-xl flex justify-between items-center text-xs border border-emerald-900">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">
                    {t("features.t2_total_label")}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {t("features.t2_total_sub")}
                  </p>
                </div>
                <span className="font-black text-lg sm:text-2xl text-emerald-400 tabular-nums">
                  Rp 60.750.000
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PINDAI STRUK AI (VISION RECEIPT SCANNER) */}
        {activeFeatureTab === "receipt" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <ScanLine className="w-3.5 h-3.5 text-teal-600" />
                <span>{t("features.t3_ocr_badge")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t3_ocr_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t3_ocr_desc")}
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("features.t3_ocr_free_notice")}</span>
              </div>

              {/* Sample Receipts Selector */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("features.t3_ocr_sample_receipt")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "kopi", label: t("features.t3_ocr_receipt1") },
                    { id: "superindo", label: t("features.t3_ocr_receipt2") },
                    { id: "spbu", label: t("features.t3_ocr_receipt3") },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectReceipt(r.id)}
                      className={`px-3 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer text-center ${
                        selectedReceipt === r.id
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm font-black"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Simulated Receipt OCR Parsing Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#091a17] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl space-y-5 relative overflow-hidden">
                {/* Simulated Laser Scanning Bar Animation */}
                {isScanningReceipt && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse top-1/2 z-30" />
                )}

                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                      <ScanLine className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-xs sm:text-sm text-white">
                        MoneFin AI Vision Engine
                      </p>
                      <p className="text-[10px] text-emerald-400">
                        {isEn ? "Gemini 1.5 Flash Vision BYOK" : "Google Gemini 1.5 Flash Vision"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Confidence: {currentReceipt.ocrConfidence}
                  </span>
                </div>

                {/* Extracted Details Box */}
                <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{t("features.t3_ocr_result_merchant")}</span>
                    <span className="font-black text-white">{currentReceipt.merchant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{t("features.t3_ocr_result_date")}</span>
                    <span className="text-slate-300 font-mono">{currentReceipt.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{t("features.t3_ocr_result_category")}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {currentReceipt.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{t("features.t3_ocr_result_account")}</span>
                    <span className="text-slate-300 font-bold">{currentReceipt.account}</span>
                  </div>

                  <div className="h-px bg-white/10 w-full my-1" />

                  {/* Items List */}
                  <div className="space-y-1.5 pt-1">
                    {currentReceipt.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                        <span>• {item.name}</span>
                        <span className="font-semibold">{formatRupiah(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-white/10 w-full my-1" />

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-black text-slate-300">{t("features.t3_ocr_result_total")}</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400 tabular-nums">
                      {formatRupiah(currentReceipt.total)}
                    </span>
                  </div>
                </div>

                {/* Save Button & Feedback */}
                <div className="pt-1">
                  {receiptSaved ? (
                    <div className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 animate-popIn">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t("features.t3_ocr_saved_success")}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveReceipt}
                      className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-900/30 transition-all cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>{t("features.t3_ocr_save_btn")}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SMART SPLIT BILL */}
        {activeFeatureTab === "splitbill" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <Split className="w-3.5 h-3.5 text-teal-600" />
                <span>{t("features.t4_split_badge")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t4_split_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t4_split_desc")}
              </p>

              {/* Interactive Split Controls */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-inner text-xs">
                {/* Bill Amount */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>{t("features.t4_split_total_label")}</span>
                    <span className="text-brand-600 text-sm font-black tabular-nums">
                      {formatRupiah(splitBillAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="20000"
                    value={splitBillAmount}
                    onChange={(e) => setSplitBillAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                    {[150000, 280000, 360000, 600000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setSplitBillAmount(preset)}
                        className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                          splitBillAmount === preset
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {formatRupiah(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* People Count Selector */}
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-700">{t("features.t4_split_people_label")}</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[2, 3, 4, 5, 6].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSplitPeopleCount(count)}
                        className={`py-2 rounded-xl border font-black text-center transition-all cursor-pointer ${
                          splitPeopleCount === count
                            ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {count} {isEn ? "Ppl" : "Orang"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 space-y-2 border-t border-slate-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-700">{t("features.t4_split_tax_label")}</span>
                    <input
                      type="checkbox"
                      checked={splitIncludeTax}
                      onChange={(e) => setSplitIncludeTax(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 accent-brand-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-700">{t("features.t4_split_service_label")}</span>
                    <input
                      type="checkbox"
                      checked={splitIncludeService}
                      onChange={(e) => setSplitIncludeService(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 accent-brand-600 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-slate-700">{t("features.t4_split_round_label")}</span>
                    <input
                      type="checkbox"
                      checked={splitRoundUp}
                      onChange={(e) => setSplitRoundUp(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 accent-brand-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Calculated Split Share & WhatsApp Preview */}
            <div className="lg:col-span-6 space-y-4">
              {/* Highlight Per Person Result */}
              <div className="bg-[#091a17] text-white rounded-3xl p-6 sm:p-7 border border-emerald-800 shadow-xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs">
                  <span className="text-slate-400 font-medium">
                    {splitPeopleCount} {isEn ? "Participants" : "Orang Patungan"}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Total: {formatRupiah(splitGrandTotal)}
                  </span>
                </div>

                <div className="text-center py-2 space-y-1">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {t("features.t4_split_per_person")}
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                    {formatRupiah(splitPerPerson)}
                  </p>
                  {splitRoundUp && (
                    <p className="text-[10px] text-slate-400">
                      {isEn ? "(Rounded to nearest Rp 1,000)" : "(Sudah dibulatkan ke kelipatan Rp 1.000 terdekat)"}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCopySplitText}
                    className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      splitCopied
                        ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                        : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/30"
                    }`}
                  >
                    {splitCopied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                    <span>{splitCopied ? t("features.t4_split_copied") : t("features.t4_split_copy_share")}</span>
                  </button>
                </div>
              </div>

              {/* Ready-to-send Message Preview Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-xs space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("features.t4_split_share_preview")}</span>
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 font-sans text-xs whitespace-pre-line leading-relaxed shadow-2xs">
                  {getSplitShareText()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SMART AI COPILOT & BYOK */}
        {activeFeatureTab === "ai" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-50 text-brand-800 text-xs font-bold border border-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>{t("features.t3_badge_title")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t3_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t3_desc")}
              </p>

              {/* Clickable AI Dilemma Triggers */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("features.t3_prompt_title")}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "coffee", label: t("features.t3_btn1") },
                    { id: "emergency", label: t("features.t3_btn2") },
                    { id: "invest", label: t("features.t3_btn3") },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePromptClick(p.id)}
                      className={`text-left px-4 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                        activePrompt === p.id
                          ? "bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-1 ring-brand-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <span>{p.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          activePrompt === p.id ? "text-brand-600" : "text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Reactive AI Advisor Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#071613] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                      AI
                    </span>
                    <div>
                      <p className="font-black text-xs sm:text-sm text-white">
                        MoneFin Intelligence Copilot
                      </p>
                      <p className="text-[10px] text-emerald-400">{t("features.t3_realtime")}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t("features.t3_accuracy")}
                  </span>
                </div>

                {isGeneratingAi ? (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2 animate-pulse">
                    <Sparkles className="w-6 h-6 text-emerald-400 mx-auto animate-spin" />
                    <p>{t("features.t3_loading")}</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activePrompt === "coffee" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a1_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a1_desc")}
                        </p>
                      </>
                    )}

                    {activePrompt === "emergency" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a2_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a2_desc")}
                        </p>
                      </>
                    )}

                    {activePrompt === "invest" && (
                      <>
                        <h4 className="font-black text-base sm:text-lg text-emerald-300 leading-snug">
                          {t("features.t3_a3_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {t("features.t3_a3_desc")}
                        </p>
                      </>
                    )}

                    {/* Financial Health diagnosis score preview */}
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                          85
                        </div>
                        <div>
                          <p className="font-bold text-white text-[11px]">{isEn ? "Financial Health Score" : "Skor Kesehatan Finansial"}</p>
                          <p className="text-[10px] text-emerald-400">{isEn ? "Grade A • Optimal Cashflow" : "Kategori Sehat • Cashflow Optimal"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {isEn ? "Google Gemini BYOK" : "Google Gemini BYOK"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{t("features.t3_footer_left")}</span>
                      <span className="text-emerald-400 font-black">
                        {t("features.t3_footer_right")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GOALS & GAMIFICATION */}
        {activeFeatureTab === "goals" && (
          <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center animate-fadeIn max-w-full overflow-hidden">
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <Target className="w-3.5 h-3.5 text-teal-600" />
                <span>{t("features.t4_badge_title")}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {t("features.t4_title")}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t("features.t4_desc")}
              </p>

              {/* Goals Selector Chips */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("features.t4_select_title")}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "emergency", label: t("features.t4_goal1") },
                    { id: "house", label: t("features.t4_goal2") },
                    { id: "vacation", label: t("features.t4_goal3") },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`text-left px-4 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                        selectedGoal === g.id
                          ? "bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-1 ring-brand-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate pr-2">{g.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          selectedGoal === g.id ? "text-brand-600" : "text-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Dynamic Goal Progress Circle + Gamification Preview */}
            <div className="lg:col-span-6 space-y-4 min-w-0">
              <div className="bg-slate-50/90 rounded-3xl p-4 sm:p-6 lg:p-7 border-2 border-slate-200/90 space-y-4 sm:space-y-5 text-center shadow-lg min-w-0">
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {activeGoal.title}
                </h4>

                {/* Circular Progress & Percentage */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-brand-600 transition-all duration-500"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - goalPercent / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
                      {goalPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t("features.t4_reached")}
                    </span>
                  </div>
                </div>

                {/* Metric Details */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs min-w-0 text-left">
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">{t("features.t4_saved")}</p>
                    <p className="font-black text-slate-900 text-xs sm:text-base tabular-nums truncate">
                      {formatRupiah(activeGoal.current)}
                    </p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs min-w-0 text-left">
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">{t("features.t4_target_total")}</p>
                    <p className="font-black text-slate-900 text-xs sm:text-base tabular-nums truncate">
                      {formatRupiah(activeGoal.target)}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-[11px] sm:text-xs font-bold leading-relaxed break-words">
                  {t("features.t4_est_completion")}{" "}
                  <span className="underline font-black">
                    {remainingMonths} {t("features.t4_months_left")}
                  </span>{" "}
                  ({isEn ? "Allocation" : "Alokasi"} {formatRupiah(activeGoal.monthly)}{isEn ? "/mo" : "/bln"})
                </div>
              </div>

              {/* Integrated Gamification Preview Pill */}
              <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs shadow-sm min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <Flame className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-black text-slate-900 text-xs truncate">{isEn ? "14 Days Active Streak" : "14 Hari Beruntun Aktif"}</p>
                    <p className="text-[10px] text-slate-500 truncate">{isEn ? "Streak Freeze Shield Protected" : "Dilindungi Perisai Streak Freeze"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs shrink-0 self-start sm:self-auto">
                  <Shield className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Level 2 Financier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BENTO GRID: COMPREHENSIVE PLATFORM CAPABILITIES */}
        <div className="pt-6 sm:pt-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t("features.bento_title")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {t("features.bento_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Bento Card 1: Recurring Automation */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900 leading-snug">
                  {t("features.bento_recurring_title")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t("features.bento_recurring_desc")}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-bold text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">WiFi Indihome</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Netflix</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Kosan</span>
              </div>
            </div>

            {/* Bento Card 2: PDF & Excel Exports */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900 leading-snug">
                  {t("features.bento_export_title")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t("features.bento_export_desc")}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-bold text-emerald-800">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">PDF Document</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">Excel (.XLSX)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">CSV Sheet</span>
              </div>
            </div>

            {/* Bento Card 3: 2FA & Active Sessions */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900 leading-snug">
                  {t("features.bento_security_title")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t("features.bento_security_desc")}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-bold text-brand-800">
                <span className="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200">2FA OTP Email</span>
                <span className="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200">Remote Session Revoke</span>
              </div>
            </div>

            {/* Bento Card 4: 100% Privacy & Zero Bank Passwords */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900 leading-snug">
                  {t("features.bento_privacy_title")}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t("features.bento_privacy_desc")}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-bold text-amber-800">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">AES-256 Client Vault</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">No Ads / Tracking</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

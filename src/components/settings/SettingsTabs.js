"use client";

import { useRef, useEffect, useState } from "react";
import { User, ShieldCheck, Sliders, AlertTriangle, Bot, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SettingsTabs({ activeTab, setActiveTab }) {
  const { t } = useLanguage();
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const tabs = [
    { id: "profile",     label: t("settings.tab_profile"),      icon: User },
    { id: "security",    label: t("settings.tab_security"),     icon: ShieldCheck },
    { id: "preferences", label: t("settings.tab_preferences"),  icon: Sliders },
    { id: "ai",          label: "AI Chatbot",                   icon: Bot },
    { id: "danger",      label: t("settings.tab_delete"),       icon: AlertTriangle, danger: true },
  ];

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Auto-scroll active tab into view on mobile without shifting viewport
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const offsetLeft = tabRect.left - containerRect.left + container.scrollLeft;
      const targetScrollLeft = offsetLeft - (container.clientWidth / 2) + (tab.clientWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div className="relative w-full select-none">
      {/* Left scroll fade indicator for mobile */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f4f7f6] to-transparent z-10 pointer-events-none sm:hidden" />
      )}

      {/* Right scroll fade indicator for mobile */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f4f7f6] to-transparent z-10 pointer-events-none sm:hidden" />
      )}

      {/* Touch-optimized horizontal scroll container */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none [&::-webkit-scrollbar]:hidden py-1 px-0.5 -my-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <nav 
          aria-label="Settings Tabs"
          className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-slate-100/90 border border-slate-200/80 rounded-2xl w-max sm:w-auto min-w-full sm:min-w-0 shadow-2xs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 min-h-[42px] sm:min-h-[44px] px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
                  isActive
                    ? tab.danger
                      ? "bg-red-500 text-white shadow-sm shadow-red-500/25 border border-red-400/40"
                      : "bg-white text-[#00685F] shadow-sm shadow-slate-200/60 border border-slate-200/80"
                    : tab.danger
                    ? "text-red-600/90 hover:text-red-700 hover:bg-red-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isActive ? "scale-105" : "text-slate-400 group-hover:text-slate-600"
                } ${isActive && !tab.danger ? "text-[#00685F]" : ""}`} />
                <span>{tab.label}</span>
                {isActive && !tab.danger && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685F] hidden md:inline-block ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


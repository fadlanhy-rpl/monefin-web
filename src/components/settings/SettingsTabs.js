"use client";

import { User, ShieldCheck, Sliders, AlertTriangle, Bot } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SettingsTabs({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const tabs = [
    { id: "profile",     label: t("settings.tab_profile"),      icon: User },
    { id: "security",    label: t("settings.tab_security"),     icon: ShieldCheck },
    { id: "preferences", label: t("settings.tab_preferences"),  icon: Sliders },
    { id: "ai",          label: "AI Chatbot",                   icon: Bot },
    { id: "danger",      label: t("settings.tab_delete"),       icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="w-full select-none">
      {/* Scrollable container with hidden scrollbar and touch-scroll ergonomics */}
      <div className="overflow-x-auto no-scrollbar py-1 -my-1">
        <nav 
          aria-label="Settings Tabs"
          className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 bg-slate-100/80 border border-slate-200/70 rounded-2xl w-full sm:w-auto min-w-full sm:min-w-0 shadow-xs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 sm:flex-initial min-h-[44px] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
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


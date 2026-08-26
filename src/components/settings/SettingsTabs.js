"use client";

import { User, ShieldCheck, Sliders, AlertTriangle } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function SettingsTabs({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const tabs = [
    { id: "profile", label: t("settings.tab_profile"), icon: User },
    { id: "security", label: t("settings.tab_security"), icon: ShieldCheck },
    { id: "preferences", label: t("settings.tab_preferences"), icon: Sliders },
    { id: "danger", label: t("settings.tab_delete"), icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar select-none py-1">
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 w-full sm:w-max min-w-full sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
                isActive
                  ? tab.danger
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20"
                  : tab.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-slate-600 hover:text-[#00685F] hover:bg-white/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? "text-white" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

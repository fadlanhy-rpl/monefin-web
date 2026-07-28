export default function SettingsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex bg-slate-100/70 p-1 rounded-2xl w-fit select-none border border-slate-200/50">
      <button 
        onClick={() => setActiveTab("profile")}
        className={`px-5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
          activeTab === "profile" 
            ? "bg-white text-[#00685F] shadow-sm" 
            : "text-slate-500 hover:text-[#00685F]"
        }`}
      >
        Profil Saya
      </button>
      <button 
        onClick={() => setActiveTab("security")}
        className={`px-5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
          activeTab === "security" 
            ? "bg-white text-[#00685F] shadow-sm" 
            : "text-slate-500 hover:text-[#00685F]"
        }`}
      >
        Keamanan
      </button>
      <button 
        onClick={() => setActiveTab("preferences")}
        className={`px-5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
          activeTab === "preferences" 
            ? "bg-white text-[#00685F] shadow-sm" 
            : "text-slate-500 hover:text-[#00685F]"
        }`}
      >
        Preferences
      </button>
    </div>
  );
}

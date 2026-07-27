export default function CategoriesTabs({
  activeTab,
  setActiveTab
}) {
  return (
    <div className="flex justify-end select-none">
      <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-slate-100">
        <button 
          onClick={() => setActiveTab("expense")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "expense" 
              ? "bg-white text-[#00685F] shadow-sm" 
              : "text-gray-500 hover:text-[#00685F]"
          }`}
        >
          Pengeluaran
        </button>
        <button 
          onClick={() => setActiveTab("income")}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "income" 
              ? "bg-white text-[#00685F] shadow-sm" 
              : "text-gray-500 hover:text-[#00685F]"
          }`}
        >
          Pemasukan
        </button>
      </div>
    </div>
  );
}

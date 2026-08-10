import { Lightbulb } from "lucide-react";

export default function AccountsStats({
  bankPercent,
  ewalletPercent,
  cashPercent
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* STATISTICS CARD */}
      <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-8 select-none">
          <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Statistik Akun Terpopuler</h4>
          <a href="#" className="text-[#00685F] text-xs font-bold hover:underline">Lihat Detail</a>
        </div>
        <div className="space-y-6">
          {/* Bank Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-[#00685F] transition-colors truncate">Akun Bank</span>
              <span className="text-slate-900 font-extrabold shrink-0">{bankPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-[#00685F] to-[#008A7E] h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${bankPercent}%` }}
              ></div>
            </div>
          </div>
          
          {/* E-Wallet Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-blue-600 transition-colors truncate">Dompet Digital (E-Wallet)</span>
              <span className="text-slate-900 font-extrabold shrink-0">{ewalletPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${ewalletPercent}%` }}
              ></div>
            </div>
          </div>
          
          {/* Cash Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-amber-500 transition-colors truncate">Uang Tunai (Cash)</span>
              <span className="text-slate-900 font-extrabold shrink-0">{cashPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${cashPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* SMART SAVING TIP BOX */}
      <div className="bg-[#00685F] p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-[#00685F]/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <div className="relative z-10">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
            <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h4 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">Tips Hemat Pekan Ini</h4>
          <p className="text-white/75 mt-4 text-xs sm:text-sm leading-relaxed font-medium">
            Pindahkan saldo menganggur Anda ke instrumen investasi syariah untuk imbal hasil lebih optimal.
          </p>
        </div>
        <button className="relative z-10 w-full bg-white text-[#00685F] py-3.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-50 hover:shadow-lg transition-all mt-8 active:scale-95 cursor-pointer">
          Pelajari Investasi
        </button>
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
      </div>
    </div>
  );
}

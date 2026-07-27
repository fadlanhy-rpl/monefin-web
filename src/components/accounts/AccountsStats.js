import { Lightbulb } from "lucide-react";

export default function AccountsStats({
  bcaPercent,
  mandiriPercent,
  otherPercent
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* STATISTICS */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-8 select-none">
          <h4 className="font-extrabold text-xl text-slate-900 tracking-tight">Statistik Akun Terpopuler</h4>
          <a href="#" className="text-[#00685F] text-xs font-bold hover:underline">Lihat Detail</a>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-700">
              <span>Bank BCA</span><span className="text-slate-900">{bcaPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#00685F] h-full transition-all duration-1000 ease-out" 
                style={{ width: `${bcaPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-700">
              <span>Bank Mandiri</span><span className="text-slate-900">{mandiriPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#2D2D2D] h-full transition-all duration-1000 ease-out" 
                style={{ width: `${mandiriPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-700">
              <span>E-Wallet & Cash</span><span className="text-slate-900">{otherPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-300 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${otherPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* TIPS BOX */}
      <div className="bg-[#00685F] p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-[#00685F]/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Lightbulb className="w-7 h-7" />
          </div>
          <h4 className="font-extrabold text-2xl tracking-tight leading-tight">Tips Hemat Pekan Ini</h4>
          <p className="text-white/70 mt-4 text-sm leading-relaxed font-medium">
            Pindahkan saldo menganggur Anda ke instrumen investasi syariah untuk imbal hasil lebih optimal.
          </p>
        </div>
        <button className="relative z-10 w-full bg-white text-[#00685F] py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors mt-8 active:scale-95 cursor-pointer">
          Pelajari Investasi
        </button>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
      </div>
    </div>
  );
}

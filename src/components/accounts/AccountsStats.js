import Link from "next/link";
import SmartInsightCard from "../shared/SmartInsightCard";
import { useLanguage } from "../../context/LanguageContext";

export default function AccountsStats({
  bankPercent,
  ewalletPercent,
  cashPercent,
  openAddModal
}) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* STATISTICS CARD */}
      <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-8 select-none">
          <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">{language === 'en' ? "Popular Account Stats" : "Statistik Akun Terpopuler"}</h4>
          <Link href="/reports" className="text-[#00685F] text-xs font-bold hover:underline">
            {language === 'en' ? "View Details" : "Lihat Detail"}
          </Link>
        </div>
        <div className="space-y-6">
          {/* Bank Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-[#00685F] transition-colors truncate">{language === 'en' ? "Bank Account" : "Akun Bank"}</span>
              <span className="text-slate-900 font-extrabold shrink-0">{bankPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-[#00685F] to-[#008A7E] h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left" 
                style={{ transform: `scaleX(${Math.min(Math.max(bankPercent || 0, 0), 100) / 100})` }}
              ></div>
            </div>
          </div>
          
          {/* E-Wallet Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-blue-600 transition-colors truncate">{language === 'en' ? "Digital Wallet (E-Wallet)" : "Dompet Digital (E-Wallet)"}</span>
              <span className="text-slate-900 font-extrabold shrink-0">{ewalletPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left" 
                style={{ transform: `scaleX(${Math.min(Math.max(ewalletPercent || 0, 0), 100) / 100})` }}
              ></div>
            </div>
          </div>
          
          {/* Cash Bar */}
          <div className="space-y-2 group">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span className="group-hover:text-amber-500 transition-colors truncate">{language === 'en' ? "Cash" : "Uang Tunai (Cash)"}</span>
              <span className="text-slate-900 font-extrabold shrink-0">{cashPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left" 
                style={{ transform: `scaleX(${Math.min(Math.max(cashPercent || 0, 0), 100) / 100})` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      {/* SMART SAVING TIP BOX — Dynamic (AI or Engine) */}
      <SmartInsightCard page="accounts" onActionClick={openAddModal} />
    </div>
  );
}

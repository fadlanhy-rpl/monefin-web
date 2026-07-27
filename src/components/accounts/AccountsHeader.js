import { PlusCircle } from "lucide-react";

export default function AccountsHeader({
  isVisible,
  totalBalance,
  openAddModal
}) {
  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8`}>
      {/* Text Overview */}
      <div className="flex-1">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Overview Akun</h2>
        <p className="text-slate-500 mt-2 font-medium max-w-lg leading-relaxed">
          Kelola semua sumber dana Anda dalam satu tempat yang aman.
        </p>
      </div>

      {/* Card Total Saldo */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center lg:items-end w-full lg:w-fit min-w-[320px] transition-all hover:shadow-md duration-300">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Saldo Seluruh Akun</p>
        <h3 className="text-4xl font-black text-[#00685F] mt-2">Rp {totalBalance.toLocaleString("id-ID")}</h3>
        
        <button 
          onClick={openAddModal}
          className="mt-6 flex items-center gap-2 bg-[#00685F] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#004D46] hover:shadow-lg transition shadow-lg shadow-[#00685F]/20 group active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Tambah Akun Baru
        </button>
      </div>
    </div>
  );
}

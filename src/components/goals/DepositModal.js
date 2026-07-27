import { X, Sparkles } from "lucide-react";

const quickAmounts = [50000, 100000, 500000, 1000000];

export default function DepositModal({
  isOpen,
  onClose,
  goal,
  depositAmount,
  setDepositAmount,
  handleDepositSubmit
}) {
  if (!isOpen || !goal) return null;

  const handleQuickAdd = (amt) => {
    const currentVal = parseInt(depositAmount, 10) || 0;
    setDepositAmount(String(currentVal + amt));
  };

  const getPercent = (g) => {
    if (!g) return 0;
    return g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
  };

  const isAchieved = getPercent(goal) >= 100;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 select-none">
            {isAchieved ? "Update Saldo" : "Deposit ke"} {goal.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleDepositSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">Masukkan Nominal Dana</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
                autoFocus
              />
            </div>
            <p className="text-[10px] text-gray-400 font-semibold pt-0.5 select-none">
              Target: Rp {goal.target.toLocaleString("id-ID")} (Tersimpan: Rp {goal.current.toLocaleString("id-ID")})
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-1.5 select-none">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Pintasan Jumlah Cepat</label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 font-bold rounded-xl text-xs active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>+ Rp {amt.toLocaleString("id-ID")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, Wallet, Percent, ChevronDown, Check } from "lucide-react";

const quickAmounts = [50000, 100000, 500000, 1000000];
const percentOptions = [10, 20, 30, 50];

export default function DepositModal({
  isOpen,
  onClose,
  goal,
  accounts = [],
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  actionType = "deposit",
  setActionType,
  handleDepositSubmit
}) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !goal) return null;

  const selectedAccount = accounts.find((acc) => String(acc.id) === String(selectedAccountId)) || accounts[0];

  // Format thousand separator
  const formatThousand = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const raw = String(val).replace(/\D/g, "");
    if (!raw) return "";
    return new Intl.NumberFormat("id-ID").format(raw);
  };

  const handleDepositChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    setDepositAmount(rawDigits);
  };

  const handleQuickAdd = (amt) => {
    const currentVal = parseInt(depositAmount, 10) || 0;
    setDepositAmount(String(currentVal + amt));
  };

  const handlePercentClick = (pct) => {
    const baseBalance = selectedAccount ? parseFloat(selectedAccount.balance) || 0 : 0;
    if (baseBalance <= 0) return;
    const calculated = Math.round((baseBalance * pct) / 100);
    setDepositAmount(String(calculated));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 select-none">
              {actionType === "deposit" ? "Setor Tabungan" : "Tarik Tabungan"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{goal.title}</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Switcher Tabs (Setor vs Tarik) */}
        <div className="p-6 pb-0 select-none">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActionType("deposit")}
              className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                actionType === "deposit"
                  ? "bg-white text-[#00685F] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-[#00685F]" />
              <span>Setor (Deposit)</span>
            </button>
            <button
              type="button"
              onClick={() => setActionType("withdraw")}
              className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                actionType === "withdraw"
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-amber-600" />
              <span>Tarik (Withdraw)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleDepositSubmit} className="p-6 space-y-4">
          {/* Account Selector */}
          <div className="space-y-1.5 relative" ref={accountRef}>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">
              {actionType === "deposit" ? "Pilih Akun Sumber (Dipotong)" : "Pilih Akun Tujuan (Ditambah)"}
            </label>
            <button
              type="button"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-left transition-all text-sm font-bold text-slate-800 cursor-pointer ${
                isAccountOpen 
                  ? "border-[#00685F] ring-4 ring-[#00685F]/10 bg-white" 
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <div className="w-7 h-7 rounded-xl bg-[#00685F]/10 flex items-center justify-center shrink-0 text-[#00685F]">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="truncate">
                  {selectedAccount 
                    ? `${selectedAccount.name} (Saldo: Rp ${parseFloat(selectedAccount.balance).toLocaleString("id-ID")})`
                    : "Pilih Akun Keuangan"}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isAccountOpen ? "rotate-180 text-[#00685F]" : ""}`} />
            </button>

            {isAccountOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {accounts.length === 0 ? (
                  <div className="px-4 py-3 text-xs font-semibold text-slate-400 text-center">Tidak ada akun keuangan</div>
                ) : (
                  accounts.map((acc) => {
                    const isSelected = String(acc.id) === String(selectedAccountId) || (!selectedAccountId && acc.id === accounts[0]?.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setSelectedAccountId(acc.id);
                          setIsAccountOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                          isSelected 
                            ? "bg-[#00685F]/10 text-[#00685F]" 
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <Wallet className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                          <span className="truncate">{acc.name}</span>
                          <span className={`text-[11px] font-medium ${isSelected ? "text-[#00685F]" : "text-slate-400"}`}>
                            (Saldo: Rp {parseFloat(acc.balance).toLocaleString("id-ID")})
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00685F] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {selectedAccount && (
              <p className="text-[10px] text-slate-500 font-bold px-1 select-none flex justify-between pt-0.5">
                <span>Saldo Akun Tersedia:</span>
                <span className="text-[#00685F] font-black">Rp {parseFloat(selectedAccount.balance).toLocaleString("id-ID")}</span>
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block select-none">
              {actionType === "deposit" ? "Nominal Dana Disetor" : "Nominal Dana Ditarik"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400 text-sm">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formatThousand(depositAmount)}
                onChange={handleDepositChange}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
                autoFocus
              />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold pt-0.5 select-none flex justify-between">
              <span>Goal: Rp {goal.target.toLocaleString("id-ID")}</span>
              <span>Tersimpan: Rp {goal.current.toLocaleString("id-ID")}</span>
            </p>
          </div>

          {/* Percentage Allocation Shortcuts (From Salary / Account Balance) */}
          {actionType === "deposit" && selectedAccount && (
            <div className="space-y-1.5 select-none pt-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>Alokasi Persentase dari Saldo Akun</span>
                <Percent className="w-3 h-3 text-[#00685F]" />
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {percentOptions.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentClick(pct)}
                    className="py-2 bg-[#00685F]/5 hover:bg-[#00685F]/10 border border-[#00685F]/15 text-[#00685F] font-extrabold rounded-xl text-xs active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span>{pct}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Nominal Add Shortcuts */}
          <div className="space-y-1.5 select-none pt-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Pintasan Cepat</label>
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
              className={`flex-1 py-3.5 text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
                actionType === "deposit" ? "bg-[#00685F] hover:bg-[#004D46]" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {actionType === "deposit" ? "Simpan Setoran" : "Konfirmasi Penarikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


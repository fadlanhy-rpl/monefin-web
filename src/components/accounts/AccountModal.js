import { X, Sparkles } from "lucide-react";

export default function AccountModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formName,
  setFormName,
  formBalance,
  setFormBalance,
  formNumber,
  setFormNumber,
  formHolder,
  setFormHolder,
  formType,
  setFormType
}) {
  if (!isOpen) return null;

  // Preset Template Quick Fill
  const applyPreset = (preset) => {
    switch (preset) {
      case "BCA":
        setFormName("Bank BCA");
        setFormType("bank-primary");
        setFormNumber("xxxx " + Math.floor(1000 + Math.random() * 9000));
        setFormHolder("AKHMAD MAARIZ");
        break;
      case "Mandiri":
        setFormName("Bank Mandiri");
        setFormType("bank-dark");
        setFormNumber("xxxx " + Math.floor(1000 + Math.random() * 9000));
        setFormHolder("");
        break;
      case "GoPay":
        setFormName("GoPay");
        setFormType("wallet");
        setFormNumber("");
        setFormHolder("");
        break;
      case "OVO":
        setFormName("OVO");
        setFormType("wallet");
        setFormNumber("");
        setFormHolder("");
        break;
      case "Tunai":
        setFormName("Dompet Tunai");
        setFormType("cash");
        setFormNumber("");
        setFormHolder("");
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00685F]" />
            {modalMode === "add" ? "Tambah Akun Baru" : "Edit Akun"}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          
          {/* Quick presets (Only on Add mode) */}
          {modalMode === "add" && (
            <div className="space-y-1.5 select-none">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Template Akun Cepat</label>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {["BCA", "Mandiri", "GoPay", "OVO", "Tunai"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-[#00685F] text-slate-600 hover:text-[#00685F] rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    + {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Account Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Akun / Bank</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
              placeholder="Contoh: BANK BCA, E-Wallet, Cash"
            />
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo (Balance)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={formBalance}
                onChange={(e) => setFormBalance(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Account Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipe Akun</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800 cursor-pointer"
            >
              <option value="bank-primary">Bank Utama (BCA / Green)</option>
              <option value="bank-dark">Bank Cadangan (Mandiri / Dark)</option>
              <option value="wallet">Dompet Digital (White / Smartphone Icon)</option>
              <option value="cash">Tunai (White / Banknote Icon)</option>
            </select>
          </div>

          {/* Optional fields for Banks */}
          {(formType === "bank-primary" || formType === "bank-dark") && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nomor Rekening (Optional)</label>
                <input
                  type="text"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                  placeholder="xxxx 1234"
                />
              </div>

              {formType === "bank-primary" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemilik Rekening (Optional)</label>
                  <input
                    type="text"
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                    placeholder="AKHMAD MAARIZ"
                  />
                </div>
              )}
            </>
          )}

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

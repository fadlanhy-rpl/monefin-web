import { ShieldCheck } from "lucide-react";

export default function SecuritySection({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSavePassword,
  onForgotPassword
}) {
  return (
    <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00685F] shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-none">Keamanan Akun</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Update password dan kelola akses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800" 
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800" 
            placeholder="Minimal 8 karakter"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#00685F]/20 outline-none text-slate-800" 
            placeholder="Ulangi password baru"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-50">
        <button 
          onClick={onForgotPassword}
          className="text-xs font-bold text-[#00685F] hover:underline cursor-pointer"
        >
          Lupa Password? &rarr;
        </button>

        <button 
          onClick={onSavePassword}
          className="bg-[#00685F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#004D46] transition shadow-md text-xs cursor-pointer active:scale-95"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
